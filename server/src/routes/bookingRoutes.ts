import { Router, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Studio } from '../models/Studio.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Helper to check time string overlap (e.g., "09:00" < "12:00")
const isTimeOverlapping = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean => {
  return startA < endB && endA > startB;
};

// POST /api/bookings - Create new booking with Challenge 2 Double-Booking Prevention (Protected)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      studioId,
      bookingDate,
      startTime,
      endTime,
      guestCount,
      renterPhone,
      specialNotes
    } = req.body;

    if (!studioId || !bookingDate || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        message: 'Studio ID, booking date, start time, and end time are required.'
      });
      return;
    }

    if (startTime >= endTime) {
      res.status(400).json({
        success: false,
        message: 'Invalid time selection: End time must be later than start time.'
      });
      return;
    }

    const studio = await Studio.findById(studioId);
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio workspace not found.' });
      return;
    }

    const renterEmail = req.user?.email?.toLowerCase();
    const renterName = req.user?.name || 'Creator';

    if (!renterEmail) {
      res.status(401).json({ success: false, message: 'Authentication required to make a reservation.' });
      return;
    }

    // CHALLENGE 2: Double-Booking Collision Prevention
    // Query existing Confirmed or Pending bookings on the same studio and date
    const existingBookings = await Booking.find({
      studioId,
      bookingDate,
      status: { $in: ['Confirmed', 'Pending'] }
    });

    for (const existing of existingBookings) {
      if (isTimeOverlapping(startTime, endTime, existing.startTime, existing.endTime)) {
        res.status(409).json({
          success: false,
          message: `Double-Booking Collision Detected: Studio "${studio.title}" is already reserved on ${bookingDate} between ${existing.startTime} and ${existing.endTime}. Please pick another time slot or date.`
        });
        return;
      }
    }

    // Calculate duration in hours
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalHours = Math.max(1, (endH * 60 + endM - (startH * 60 + startM)) / 60);

    const totalPrice = Math.round(totalHours * studio.hourlyRate);

    const newBooking = await Booking.create({
      studioId: studio._id.toString(),
      studioTitle: studio.title,
      studioImage: studio.imageUrl,
      studioLocation: studio.location,
      hourlyRate: studio.hourlyRate,
      renterName,
      renterEmail,
      renterPhone: renterPhone || '',
      bookingDate,
      startTime,
      endTime,
      totalHours,
      totalPrice,
      securityDeposit: studio.securityDeposit || 0,
      guestCount: Number(guestCount || 1),
      specialNotes: specialNotes || '',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Workspace reservation request submitted successfully!',
      booking: newBooking
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking reservation.', error: error.message });
  }
});

// GET /api/bookings/my-bookings - Get reservations for current logged-in creator (Protected)
router.get('/my-bookings', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const renterEmail = req.user?.email?.toLowerCase();
    if (!renterEmail) {
      res.status(401).json({ success: false, message: 'User identity missing.' });
      return;
    }

    const bookings = await Booking.find({ renterEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your bookings.', error: error.message });
  }
});

// GET /api/bookings/:id - Get single booking details (Protected, e.g. for PDF receipt invoice)
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking reservation not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve booking.', error: error.message });
  }
});

// PATCH /api/bookings/:id/cancel - Cancel pending booking (Protected)
router.patch('/:id/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email?.toLowerCase();

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking reservation not found.' });
      return;
    }

    // Verify ownership
    if (booking.renterEmail !== userEmail && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to cancel this reservation.' });
      return;
    }

    if (booking.status === 'Cancelled') {
      res.status(400).json({ success: false, message: 'This reservation is already cancelled.' });
      return;
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking slot cancelled successfully.',
      booking
    });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking.', error: error.message });
  }
});

// PATCH /api/bookings/:id/confirm - Confirm booking (Host/Admin or Quick Demo helper)
router.patch('/:id/confirm', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking confirmed!',
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update booking status.', error: error.message });
  }
});

export default router;

