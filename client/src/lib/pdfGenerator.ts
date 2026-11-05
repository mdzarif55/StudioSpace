import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking } from '@/types';

export const generateBookingInvoicePDF = (booking: Booking): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Primary brand palette
  const primaryColor = [234, 88, 12]; // Orange-600
  const darkColor = [21, 25, 34];    // Studio-surface
  const mutedColor = [115, 115, 115];

  // 1. Header Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 40, 210, 2, 'F');

  // Logo & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('StudioSpace', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(253, 186, 116);
  doc.text('PEER-TO-PEER CREATIVE WORKSPACE MARKETPLACE', 14, 26);

  // Invoice / Receipt Badge on right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OFFICIAL BOOKING RECEIPT', 196, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`Invoice Ref: #${booking._id.slice(-8).toUpperCase()}`, 196, 26, { align: 'right' });
  doc.text(`Issued Date: ${new Date().toLocaleDateString()}`, 196, 32, { align: 'right' });

  // 2. Booking Metadata Columns
  let yPos = 55;

  // Left Column: Renter & Production Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('RESERVED BY (CREATOR):', 14, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(`Name: ${booking.renterName}`, 14, yPos + 6);
  doc.text(`Email: ${booking.renterEmail}`, 14, yPos + 12);
  if (booking.renterPhone) {
    doc.text(`Contact Phone: ${booking.renterPhone}`, 14, yPos + 18);
  }
  doc.text(`Production Crew Size: ${booking.guestCount || 1} creators`, 14, yPos + (booking.renterPhone ? 24 : 18));

  // Right Column: Studio Space Location
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('STUDIO SPECIFICATIONS:', 115, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(`Workspace: ${booking.studioTitle}`, 115, yPos + 6);
  doc.text(`Location: ${booking.studioLocation}`, 115, yPos + 12);
  doc.text(`Shoot Date: ${booking.bookingDate}`, 115, yPos + 18);
  doc.text(`Reserved Time Slot: ${booking.startTime} - ${booking.endTime}`, 115, yPos + 24);
  doc.text(`Current Status: ${booking.status.toUpperCase()}`, 115, yPos + 30);

  // 3. Itemized Financial Table
  const tableY = yPos + 40;

  autoTable(doc, {
    startY: tableY,
    head: [['Item Description', 'Rate', 'Units / Hours', 'Amount (USD)']],
    body: [
      [
        `Studio Slot Rental (${booking.studioTitle})`,
        `$${booking.hourlyRate}/hr`,
        `${booking.totalHours} hrs`,
        `$${booking.totalPrice}`
      ],
      [
        'Refundable Security Deposit (Held in Escrow)',
        '-',
        '1 session',
        `$${booking.securityDeposit || 0}`
      ],
      [
        'Platform Protection & $1M Host Liability Insurance',
        'Complimentary',
        '1 session',
        '$0.00'
      ],
      [
        'Total Due & Paid Upon Confirmation',
        '',
        '',
        `$${booking.totalPrice + (booking.securityDeposit || 0)}`
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [234, 88, 12],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
  });

  // 4. Special Notes & Cancellation Policy
  // @ts-ignore
  const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : 180;

  if (booking.specialNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('PRODUCTION NOTES:', 14, finalY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`"${booking.specialNotes}"`, 14, finalY + 5);
  }

  const termsY = booking.specialNotes ? finalY + 16 : finalY;

  doc.setFillColor(245, 245, 245);
  doc.rect(14, termsY, 182, 34, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text('TERMS & CANCELLATION GUARANTEE', 18, termsY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('• Cancellations submitted 48 hours or more before reserved start time qualify for a 100% full refund.', 18, termsY + 13);
  doc.text('• Overtime shoots beyond scheduled slot will be billed at 1.5x standard hourly studio rate.', 18, termsY + 18);
  doc.text('• StudioSpace provides $1M third-party liability insurance for all confirmed bookings.', 18, termsY + 23);
  doc.text('• For 24/7 host emergency concierge, contact support@studiospace.com or call +1 (800) 555-STUDIO.', 18, termsY + 28);

  // 5. Footer
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for creating with StudioSpace. Empowering creators worldwide.', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`StudioSpace-Invoice-${booking._id.slice(-6).toUpperCase()}.pdf`);
};

