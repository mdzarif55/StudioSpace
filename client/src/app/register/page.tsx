'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Aperture, User, Mail, Image, Lock, ArrowRight, Check, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Live Password Criteria Verification
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password) {
      setFormError('Please complete all required fields.');
      toast.error('Name, email, and password are required.');
      return;
    }

    // Strict Password Validation check
    if (!isPasswordValid) {
      const errorMsg = 'Password does not meet the security requirements.';
      setFormError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setSubmitting(true);
    const success = await register(name, email, password, photoURL || undefined);
    setSubmitting(false);

    if (success) {
      // "If the user registers successfully, then navigate them to their Login page."
      router.push('/login');
    } else {
      setFormError('Registration could not be completed. The email may already be in use.');
    }
  };

  const handleGoogleRegister = async () => {
    setSubmitting(true);
    const success = await loginWithGoogle();
    setSubmitting(false);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#0c0e14]">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#151922] p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Aperture className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Create Your Creator Account
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Join thousands of filmmakers, photographers, audio engineers, and studio hosts on StudioSpace.
          </p>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sofia Coppola"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@production.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Profile Photo URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <Image className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Mandatory Password Validation Checklist */}
            <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <p className="font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Password Requirements:</p>
              
              {/* Uppercase check */}
              <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-zinc-400'}`}>
                {hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-zinc-400" />}
                <span>Must have an Uppercase letter</span>
              </div>

              {/* Lowercase check */}
              <div className={`flex items-center gap-2 ${hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-zinc-400'}`}>
                {hasLowercase ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-zinc-400" />}
                <span>Must have a Lowercase letter</span>
              </div>

              {/* Length check */}
              <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-zinc-400'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-zinc-400" />}
                <span>Length must be at least 6 characters</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || isLoading || !isPasswordValid}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#151922] px-3 text-zinc-400 font-semibold">
              Or Register With
            </span>
          </div>
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={submitting}
          className="w-full py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Link to Login */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-orange-500 hover:text-orange-400 transition-colors">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
}

