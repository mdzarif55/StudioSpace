import React from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedStudios } from '@/components/home/FeaturedStudios';
import { CategoryBrowse } from '@/components/home/CategoryBrowse';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { HostGuaranteeSection } from '@/components/home/HostGuaranteeSection';
import { CommunityReviews } from '@/components/home/CommunityReviews';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Banner Slider (Interactive 3+ slides with primary CTAs) */}
      <HeroSlider />

      {/* 2. Featured Studios Section (Dynamic from MongoDB with .limit(6)) */}
      <FeaturedStudios />

      {/* 3. Browse by Studio Categories (Interactive category redirect cards) */}
      <CategoryBrowse />

      {/* 4. Extra Section 1: How Booking Works (4-step workflow) */}
      <HowItWorksSection />

      {/* 5. Extra Section 2: Host Guarantee & Creator Support (Assurances & coverage) */}
      <HostGuaranteeSection />

      {/* 6. Extra Section 3: Creator Community Voices & Live Platform Metrics */}
      <CommunityReviews />
    </div>
  );
}

