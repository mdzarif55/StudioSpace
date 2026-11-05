import { Router, Request, Response } from 'express';
import { Studio } from '../models/Studio.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/studios/featured - Top 6 featured / highest rated studios (.limit(6))
router.get('/featured', async (_req: Request, res: Response): Promise<void> => {
  try {
    const featuredStudios = await Studio.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: featuredStudios.length,
      studios: featuredStudios
    });
  } catch (error: any) {
    console.error('Error fetching featured studios:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured studios.', error: error.message });
  }
});

// GET /api/studios/user/listings - Get all listings owned by current user (Protected)
router.get('/user/listings', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail) {
      res.status(401).json({ success: false, message: 'User email not found in token.' });
      return;
    }

    const listings = await Studio.find({ ownerEmail: userEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      studios: listings
    });
  } catch (error: any) {
    console.error('Error fetching user studio listings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your studio listings.', error: error.message });
  }
});

// GET /api/studios - List all studios with search, category filter, price sorting
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, sort, limit } = req.query;

    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { overview: searchRegex },
        { amenities: { $in: [searchRegex] } }
      ];
    }

    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { hourlyRate: 1 };
    } else if (sort === 'price-high') {
      sortOption = { hourlyRate: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    let queryBuilder = Studio.find(query).sort(sortOption);

    if (limit) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }

    const studios = await queryBuilder.exec();

    res.status(200).json({
      success: true,
      count: studios.length,
      studios
    });
  } catch (error: any) {
    console.error('Error fetching studios:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch studios.', error: error.message });
  }
});

// GET /api/studios/:id - Get studio by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const studio = await Studio.findById(id);

    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      studio
    });
  } catch (error: any) {
    console.error('Error fetching studio by id:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve studio details.', error: error.message });
  }
});

// POST /api/studios - Add new studio (Protected)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location,
      imageUrl,
      additionalImages,
      amenities,
      overview,
      rules,
      dimensionsSqFt
    } = req.body;

    if (!title || !category || !hourlyRate || !maxCapacity || !location || !imageUrl || !overview) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, hourlyRate, maxCapacity, location, imageUrl, and overview.'
      });
      return;
    }

    // Owner info comes from authenticated session (Challenge 1 & Read-only user field requirement)
    const ownerName = req.user?.name || 'Studio Host';
    const ownerEmail = req.user?.email?.toLowerCase() || '';
    const ownerAvatar = req.user?.photoURL || '';

    const newStudio = await Studio.create({
      title: title.trim(),
      category,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit || 0),
      maxCapacity: Number(maxCapacity),
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      additionalImages: Array.isArray(additionalImages) ? additionalImages : [],
      amenities: Array.isArray(amenities) ? amenities : (typeof amenities === 'string' ? amenities.split(',').map((a: string) => a.trim()) : []),
      overview: overview.trim(),
      ownerName,
      ownerEmail,
      ownerAvatar,
      rating: 5.0,
      reviewCount: 1,
      featured: false,
      rules: Array.isArray(rules) ? rules : ['No smoking inside studios', 'Clean up after production wraps', 'Overtime billed at 1.5x hourly rate'],
      dimensionsSqFt: Number(dimensionsSqFt || 1200)
    });

    res.status(201).json({
      success: true,
      message: 'Studio workspace listed successfully!',
      studio: newStudio
    });
  } catch (error: any) {
    console.error('Error creating studio listing:', error);
    res.status(500).json({ success: false, message: 'Failed to create studio listing.', error: error.message });
  }
});

// PUT /api/studios/:id - Update studio listing (Protected)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email?.toLowerCase();

    const studio = await Studio.findById(id);
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio listing not found.' });
      return;
    }

    // Authorization check: Only the owner or admin can update
    if (studio.ownerEmail !== userEmail && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this studio listing.'
      });
      return;
    }

    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location,
      imageUrl,
      additionalImages,
      amenities,
      overview,
      rules,
      dimensionsSqFt
    } = req.body;

    const updatedStudio = await Studio.findByIdAndUpdate(
      id,
      {
        ...(title && { title: title.trim() }),
        ...(category && { category }),
        ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
        ...(securityDeposit !== undefined && { securityDeposit: Number(securityDeposit) }),
        ...(maxCapacity !== undefined && { maxCapacity: Number(maxCapacity) }),
        ...(location && { location: location.trim() }),
        ...(imageUrl && { imageUrl: imageUrl.trim() }),
        ...(additionalImages && { additionalImages }),
        ...(amenities && {
          amenities: Array.isArray(amenities) ? amenities : amenities.split(',').map((a: string) => a.trim())
        }),
        ...(overview && { overview: overview.trim() }),
        ...(rules && { rules }),
        ...(dimensionsSqFt && { dimensionsSqFt: Number(dimensionsSqFt) })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Studio listing updated successfully.',
      studio: updatedStudio
    });
  } catch (error: any) {
    console.error('Error updating studio listing:', error);
    res.status(500).json({ success: false, message: 'Failed to update studio listing.', error: error.message });
  }
});

// DELETE /api/studios/:id - Delete studio listing (Protected)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email?.toLowerCase();

    const studio = await Studio.findById(id);
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio listing not found.' });
      return;
    }

    // Authorization check
    if (studio.ownerEmail !== userEmail && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this studio listing.'
      });
      return;
    }

    await Studio.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Studio listing deleted successfully from MongoDB.'
    });
  } catch (error: any) {
    console.error('Error deleting studio listing:', error);
    res.status(500).json({ success: false, message: 'Failed to delete studio listing.', error: error.message });
  }
});

export default router;

