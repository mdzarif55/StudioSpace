import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Studio } from './models/Studio.js';
import { Booking } from './models/Booking.js';
import { connectDB, closeDB } from './config/db.js';

export const seedDatabase = async (): Promise<void> => {
  console.log('🌱 Starting StudioSpace data seeding...');

  // Clear existing collections
  await User.deleteMany({});
  await Studio.deleteMany({});
  await Booking.deleteMany({});

  // 1. Seed Users
  const salt = await bcrypt.genSalt(10);
  const hostPassword = await bcrypt.hash('Host123!', salt);
  const examinerPassword = await bcrypt.hash('Examiner123!', salt);

  const hostUser = await User.create({
    name: 'Elena Rostova',
    email: 'host@studiospace.com',
    password: hostPassword,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    role: 'host'
  });

  const examinerUser = await User.create({
    name: 'Marcus Sterling (Examiner)',
    email: 'examiner@studiospace.com',
    password: examinerPassword,
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    role: 'creator'
  });

  console.log('✅ Seeded demo accounts:');
  console.log('   - Host: host@studiospace.com / Host123!');
  console.log('   - Examiner: examiner@studiospace.com / Examiner123!');

  // 2. Seed Studios
  const studioData = [
    {
      title: 'Aperture Daylight Infinity Cyc Stage',
      category: 'Photo Studio',
      hourlyRate: 125,
      securityDeposit: 250,
      maxCapacity: 25,
      location: 'SoHo Arts District, New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Two-Wall Seamless Cyclorama',
        'ProFoto B10X Strobes',
        'Hair & Makeup Station',
        'South-Facing Factory Windows',
        '1 Gbps Fiber WiFi',
        'Private Dressing Lounge',
        'Freight Elevator Access'
      ],
      overview: 'Sun-drenched 2,800 sq.ft loft featuring a custom 30x25ft two-wall infinity cyclorama. Equipped with motorized overhead pre-rigged scrims, motorized blackout shades, ProFoto lighting ecosystem, dedicated HMU vanity stations, and private client viewing deck.',
      ownerName: hostUser.name,
      ownerEmail: hostUser.email,
      ownerAvatar: hostUser.photoURL,
      rating: 4.98,
      reviewCount: 48,
      featured: true,
      rules: ['No shoes on the fresh white cyc curve without shoe booties', 'Strict 85dB noise limit after 9 PM', 'All gear must stay within rented bay'],
      dimensionsSqFt: 2800
    },
    {
      title: 'Monolith Cinema Soundstage & LED Volume',
      category: 'Film Stage',
      hourlyRate: 240,
      securityDeposit: 500,
      maxCapacity: 45,
      location: 'Silver Lake Industrial Corridor, Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Acoustically Treated Stage',
        '3-Phase 400A Camlock Power',
        'Overhead Steel Pipe Grid (18ft Height)',
        'Drive-in Roll-Up Bay Door',
        'ARRI Skypanel S60-C Package',
        'Green Screen Pre-hung Curtain',
        'Production Offices & Green Room'
      ],
      overview: 'Engineered for commercial shoots, music videos, and indie feature productions. Features double-insulated sound dampening walls (STC 65), heavy-duty drive-in load access for production grip trucks, and an integrated DMX lighting console.',
      ownerName: hostUser.name,
      ownerEmail: hostUser.email,
      ownerAvatar: hostUser.photoURL,
      rating: 4.95,
      reviewCount: 34,
      featured: true,
      rules: ['Fire marshal permit required for practical flame/smoke effects', 'Certified rigger required for overhead grid loads over 500 lbs'],
      dimensionsSqFt: 4200
    },
    {
      title: 'The Broadcast Suite — Multi-Camera Podcast Lounge',
      category: 'Podcast Lounge',
      hourlyRate: 85,
      securityDeposit: 100,
      maxCapacity: 8,
      location: 'West Loop Media District, Chicago, IL',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        '4x Shure SM7B Microphones with Cloudlifters',
        'RODECaster Pro II Console',
        '3x Sony FX3 4K PTZ Camera Setup',
        'Aputure Amaran Studio Lighting',
        'Acoustic Felt Hexagon Wall Paneling',
        'Custom Walnut Podcast Table',
        'ISO Audio Recording + Live Switching'
      ],
      overview: 'Turnkey high-end broadcast studio built for video podcasters, interviewers, and live streamers. Turn up, plug your SSD into the RODECaster and ATEM Mini Extreme ISO, and record broadcast-quality 4K multi-cam audio and video in minutes.',
      ownerName: hostUser.name,
      ownerEmail: hostUser.email,
      ownerAvatar: hostUser.photoURL,
      rating: 4.92,
      reviewCount: 62,
      featured: true,
      rules: ['Beverages must have secure spill-proof lids near audio consoles', 'Do not adjust hardwired microphone boom arm tension with tools'],
      dimensionsSqFt: 650
    },
    {
      title: 'Neve 88RS Analogue & Dolby Atmos Audio Suite',
      category: 'Music Suite',
      hourlyRate: 165,
      securityDeposit: 300,
      maxCapacity: 12,
      location: 'Music Row, Nashville, TN',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520523839898-50712704043b?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Genelec 7.1.4 Dolby Atmos Monitoring',
        'SSL Fusion & Tube-Tech CL1B Outboard',
        'Floating Live Room with Hardwood Oak Floor',
        'Yamaha C7 Grand Piano',
        'Vintage Neumann U87 & Telefunken ELA M 251',
        'Pro Tools Ultimate HDX System',
        'Private Vocal Isolation Booth'
      ],
      overview: 'World-class recording, tracking, and mixing sanctum designed with floating acoustic architecture. Pristine isolation with zero bleed, an expansive microphone locker with vintage classics, and full Dolby Atmos spatial audio mixing capabilities.',
      ownerName: 'Julian Vance',
      ownerEmail: 'julian@soundwave.org',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      rating: 4.99,
      reviewCount: 41,
      featured: true,
      rules: ['Experienced assistant engineer provided on-site', 'No magnetic items near analogue tape decks', 'Strictly no open liquids near console'],
      dimensionsSqFt: 1800
    },
    {
      title: 'Terra Ceramic & Sculpture Production Workshop',
      category: 'Art Workshop',
      hourlyRate: 70,
      securityDeposit: 150,
      maxCapacity: 18,
      location: 'Mission Creative District, San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        '6x Shimpo Whisper Pottery Wheels',
        'Cone 10 Skutt Electric Kiln Access',
        'Slab Roller & Clay Extruder',
        'Heavy Butcher-Block Craft Tables',
        'Industrial Clay Trap Sink System',
        'High Ceilings with Skylights',
        'Drying Shelves & Glaze Formulation Station'
      ],
      overview: 'Spacious ceramic and mixed-media sculpture studio bathed in natural northern light. Perfect for ceramicists, resin artists, sculptors, and creative craft workshops. Equipped with whisper-quiet pottery wheels and specialized ventilation.',
      ownerName: 'Maya Linnea',
      ownerEmail: 'maya@terracotta.studio',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      rating: 4.91,
      reviewCount: 29,
      featured: true,
      rules: ['Clay trap sink must be used for washing all tools', 'Kiln firings must be pre-scheduled with studio manager'],
      dimensionsSqFt: 1450
    },
    {
      title: 'Neon Noir Editorial & Music Video Stage',
      category: 'Film Stage',
      hourlyRate: 155,
      securityDeposit: 250,
      maxCapacity: 30,
      location: 'DUMBO Waterfront, Brooklyn, NY',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Custom Programmable RGB Astera Tubes',
        'Haze & Fog Machine Compatible Ventilation',
        'Exposed Industrial Brick & Polished Concrete',
        'High-Amperage Power Drops',
        'VIP Green Room with Arcade & Bar',
        'Dedicated Gaffer Cart Included',
        'Overhead Sound Trussing'
      ],
      overview: 'Atmospheric industrial soundstage optimized for music video directors, fashion brand lookbooks, and high-contrast moody cinematography. Features 40 customizable Nanlite & Astera wireless tube fixtures, haze fluid permits, and an edgy cyberpunk aesthetic.',
      ownerName: hostUser.name,
      ownerEmail: hostUser.email,
      ownerAvatar: hostUser.photoURL,
      rating: 4.96,
      reviewCount: 53,
      featured: true,
      rules: ['Water effects require prior written sign-off', 'No glitter or confetti without additional cleaning fee ($150)'],
      dimensionsSqFt: 3100
    },
    {
      title: 'Lumina Minimalist Scandinavian Photo Studio',
      category: 'Photo Studio',
      hourlyRate: 110,
      securityDeposit: 200,
      maxCapacity: 16,
      location: 'South Lake Union, Seattle, WA',
      imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Floor-to-Ceiling Nordic Wood Paneling',
        'Seamless Paper Backdrop Roll System (12 Colors)',
        'Elinchrom ELC 500 Studio Strobes',
        'Designer Mid-Century Modern Furniture Props',
        'Coffee & Espresso Bar',
        'Tethering Station with Color-Calibrated Display',
        'Curated Wardrobe Racks & Steamer'
      ],
      overview: 'Curated editorial photography space tailored for lifestyle, lookbook, and product shoots. Features light birch architectural elements, natural linen scrims, warm muted tones, and an expansive selection of designer furniture props.',
      ownerName: 'Astrid Lind',
      ownerEmail: 'astrid@lumina.no',
      ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      rating: 4.88,
      reviewCount: 22,
      featured: false,
      rules: ['All props must be returned to original staging positions', 'Pet-friendly with prior approval'],
      dimensionsSqFt: 1600
    },
    {
      title: 'Soundwave Live Band Rehearsal & Live Room',
      category: 'Music Suite',
      hourlyRate: 95,
      securityDeposit: 150,
      maxCapacity: 15,
      location: 'East Austin Arts District, Austin, TX',
      imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'DW Collectors Series Drum Kit with Zildjian K Cymbals',
        'Ampeg SVT Classic Bass Rig',
        'Marshall JCM800 & Fender Twin Reverb Amps',
        'Allen & Heath SQ-5 Digital Mixer',
        'QSC K12.2 In-Ear / Floor Wedge Monitoring',
        'Private Load-in Ramp',
        'Lounge with Vintage Pinball Machine'
      ],
      overview: 'Tour-ready rehearsal sanctuary and live tracking room equipped with premium backline instruments, pristine sound isolation, and high-impact stage monitoring. Used by touring bands and session musicians seeking studio perfection.',
      ownerName: 'Julian Vance',
      ownerEmail: 'julian@soundwave.org',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      rating: 4.94,
      reviewCount: 38,
      featured: false,
      rules: ['Drums must use nylon or wood tips provided', 'Load-in through rear ramp only'],
      dimensionsSqFt: 1500
    },
    {
      title: 'The Narrative Lab — Audio & Video Creator Lounge',
      category: 'Podcast Lounge',
      hourlyRate: 90,
      securityDeposit: 120,
      maxCapacity: 10,
      location: 'Midtown Arts Center, Atlanta, GA',
      imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Electro-Voice RE20 Microphones',
        'Apogee Symphony I/O Audio Interface',
        'Warm Velvet Club Chairs & LED Backdrops',
        '4K Teleprompter System',
        'Dedicated Sound Engineer Control Booth',
        'Noise Floor < 20 dBA Isolation',
        'Direct Cloud Livestream Uplink (10 Gbps)'
      ],
      overview: 'Intimate, warm storytelling lounge specifically crafted for narrative podcasters, investigative journalists, audio documentaries, and high-profile guest fireside chats. Acoustic isolation certified at broadcast level.',
      ownerName: hostUser.name,
      ownerEmail: hostUser.email,
      ownerAvatar: hostUser.photoURL,
      rating: 4.97,
      reviewCount: 45,
      featured: false,
      rules: ['Teleprompter files should be shared 1 hour before session', 'Silent mobile devices required inside live booth'],
      dimensionsSqFt: 800
    },
    {
      title: 'Canvas & Kiln Industrial Painting Loft',
      category: 'Art Workshop',
      hourlyRate: 65,
      securityDeposit: 100,
      maxCapacity: 20,
      location: 'Wynwood Art District, Miami, FL',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: [
        'Heavy-Duty Wooden H-Frame Studio Easels',
        'Solvent & Oil Painting Ventilation Hood',
        'Large Canvas Stretching Tables',
        'Compressed Air & Airbrush Stations',
        'Washout Booth for Screen Printing',
        'High CRI Color-Accurate 5000K Illumination',
        'Roll-up Glass Garage Door with Miami Breeze'
      ],
      overview: 'Open, expressive warehouse workspace for oil painters, printmakers, muralists, and large-format canvas artists. Industrial concrete floors, specialized ventilation hoods, and ample drying racks allow creators to experiment with maximum freedom.',
      ownerName: 'Maya Linnea',
      ownerEmail: 'maya@terracotta.studio',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      rating: 4.89,
      reviewCount: 31,
      featured: false,
      rules: ['Dispose of paint solvents only in marked hazard containers', 'Rags soaked in linseed oil must be sealed in airtight safety bins'],
      dimensionsSqFt: 2200
    }
  ];

  const createdStudios = await Studio.insertMany(studioData);
  console.log(`✅ Seeded ${createdStudios.length} realistic creative production studios!`);

  // 3. Seed sample bookings for the examiner account so "My Bookings" has immediate rich data
  const sampleBooking1 = await Booking.create({
    studioId: createdStudios[0]._id.toString(),
    studioTitle: createdStudios[0].title,
    studioImage: createdStudios[0].imageUrl,
    studioLocation: createdStudios[0].location,
    hourlyRate: createdStudios[0].hourlyRate,
    renterName: examinerUser.name,
    renterEmail: examinerUser.email,
    renterPhone: '+1 (555) 389-2041',
    bookingDate: '2026-11-20',
    startTime: '10:00',
    endTime: '14:00',
    totalHours: 4,
    totalPrice: 4 * createdStudios[0].hourlyRate,
    securityDeposit: createdStudios[0].securityDeposit,
    guestCount: 6,
    specialNotes: 'Fashion lookbook editorial shoot. Bringing 3 models and lighting crew.',
    status: 'Confirmed'
  });

  const sampleBooking2 = await Booking.create({
    studioId: createdStudios[2]._id.toString(),
    studioTitle: createdStudios[2].title,
    studioImage: createdStudios[2].imageUrl,
    studioLocation: createdStudios[2].location,
    hourlyRate: createdStudios[2].hourlyRate,
    renterName: examinerUser.name,
    renterEmail: examinerUser.email,
    renterPhone: '+1 (555) 389-2041',
    bookingDate: '2026-11-25',
    startTime: '14:00',
    endTime: '17:00',
    totalHours: 3,
    totalPrice: 3 * createdStudios[2].hourlyRate,
    securityDeposit: createdStudios[2].securityDeposit,
    guestCount: 4,
    specialNotes: 'Episode 48 recording with guest tech founder.',
    status: 'Pending'
  });

  console.log(`✅ Seeded 2 sample bookings for ${examinerUser.email}`);
  console.log('🎉 Seeding completed successfully!');
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}

