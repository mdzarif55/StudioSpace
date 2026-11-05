import { Router, Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Studio } from '../models/Studio.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/wishlist - Get current user's saved studio IDs and populated studios
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const items = await Wishlist.find({ userEmail });
    const studioIds = items.map((item) => item.studioId);
    const studios = await Studio.find({ _id: { $in: studioIds } });

    res.status(200).json({
      success: true,
      studioIds,
      studios
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve wishlist.', error: error.message });
  }
});

// POST /api/wishlist/toggle - Toggle wishlist status for a studio
router.post('/toggle', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const { studioId } = req.body;

    if (!userEmail || !studioId) {
      res.status(400).json({ success: false, message: 'Studio ID is required.' });
      return;
    }

    const existing = await Wishlist.findOne({ userEmail, studioId });

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      res.status(200).json({
        success: true,
        isSaved: false,
        message: 'Studio removed from your saved spaces.'
      });
    } else {
      await Wishlist.create({ userEmail, studioId });
      res.status(200).json({
        success: true,
        isSaved: true,
        message: 'Studio saved to your favorites!'
      });
    }
  } catch (error: any) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist.', error: error.message });
  }
});

export default router;

