import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authenticateToken, AuthenticatedRequest, generateToken, setTokenCookie } from '../middleware/auth.js';

const router = Router();

// Password validation regex
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;

// Register Route
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, photoURL } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    // Password criteria validation
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (!hasUppercase.test(password)) {
      res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
      return;
    }
    if (!hasLowercase.test(password)) {
      res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photoURL: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      role: 'creator'
    });

    const tokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      photoURL: newUser.photoURL,
      role: newUser.role || 'creator'
    };

    const token = generateToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to StudioSpace.',
      user: tokenPayload,
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      return;
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
      role: user.role || 'creator'
    };

    const token = generateToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully! Welcome back to StudioSpace.',
      user: tokenPayload,
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
});

// Google Social Sign-in
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, photoURL, credential, id_token } = req.body;

    // If an ID token / credential from Google Sign-In is provided, verify it directly with Google
    const tokenToVerify = credential || id_token;
    if (tokenToVerify) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenToVerify}`);
        const googlePayload = await verifyRes.json();
        if (googlePayload.email) {
          email = googlePayload.email;
          name = googlePayload.name || email.split('@')[0];
          photoURL = googlePayload.picture;
        }
      } catch (verifyErr) {
        console.warn('Google tokeninfo verification failed, using provided payload:', verifyErr);
      }
    }

    if (!email) {
      res.status(400).json({ success: false, message: 'Google account email is required.' });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        photoURL: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        role: 'creator'
      });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
      role: user.role || 'creator'
    };

    const token = generateToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Authenticated with Google successfully.',
      user: tokenPayload,
      token
    });
  } catch (error: any) {
    console.error('Google Auth error:', error);
    res.status(500).json({ success: false, message: 'Failed to authenticate with Google.', error: error.message });
  }
});

// POST /api/auth/google/code - Exchange Google authorization code directly from frontend
router.post('/google/code', async (req: Request, res: Response): Promise<void> => {
  const { code, redirectUri } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code) {
    res.status(400).json({ success: false, message: 'Google authorization code is required.' });
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri || 'http://localhost:5000/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      res.status(400).json({
        success: false,
        message: tokenData.error_description || 'Failed to exchange Google authorization code.'
      });
      return;
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profile.email) {
      res.status(400).json({ success: false, message: 'Google account profile does not contain an email.' });
      return;
    }

    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email.toLowerCase(),
        photoURL: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        role: 'creator',
      });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
      role: user.role || 'creator',
    };

    const token = generateToken(tokenPayload);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Signed in with Google successfully.',
      user: tokenPayload,
      token,
    });
  } catch (err: any) {
    console.error('Google code exchange error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during Google auth.', error: err.message });
  }
});

// GET /api/auth/google/url - Get Google OAuth Consent URL
router.get('/google/url', (_req: Request, res: Response): void => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

  if (!clientId || clientId.trim() === '') {
    res.status(200).json({
      success: false,
      configured: false,
      message: 'GOOGLE_CLIENT_ID is not configured in .env yet.'
    });
    return;
  }

  const redirectUri = `${serverUrl}/api/auth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  res.status(200).json({
    success: true,
    configured: true,
    url: googleAuthUrl
  });
});

// GET /api/auth/google/callback - Handle Google OAuth redirect callback
router.get('/google/callback', async (req: Request, res: Response): Promise<void> => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const code = req.query.code as string;

  if (!code) {
    res.redirect(`${clientUrl}/login?error=no_code`);
    return;
  }

  try {
    const redirectUri = `${serverUrl}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      res.redirect(`${clientUrl}/login?error=token_exchange_failed`);
      return;
    }

    // 2. Fetch Google profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profile.email) {
      res.redirect(`${clientUrl}/login?error=profile_email_missing`);
      return;
    }

    // 3. Find or create user in MongoDB
    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email.toLowerCase(),
        photoURL: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        role: 'creator',
      });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
      role: user.role || 'creator',
    };

    const token = generateToken(tokenPayload);
    setTokenCookie(res, token);

    // Redirect to client with success token parameter
    res.redirect(`${clientUrl}/?auth_token=${token}&login=success`);
  } catch (err: any) {
    console.error('Google callback error:', err);
    res.redirect(`${clientUrl}/login?error=oauth_error`);
  }
});

// Check Current Session (Me)
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to verify session.', error: error.message });
  }
});

// Logout Route
router.post('/logout', (req: Request, res: Response): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

export default router;

