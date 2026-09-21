import { ArrowRight, Star, Sprout, Truck } from "lucide-react";
// Direct asset import ensures your IDE's Intellisense picks up the file paths instantly
import heroMushroomBg from "../../assets/adjusted.jpg";
import FeaturedProducts from "@/components/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";

interface HeroProps {
  badgeText?: string;
  headline?: string;
  subtext?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function HomePage({
  badgeText = "FRESH • NATURAL • FARM-GROWN",
  headline = "Premium Mushroom Products by Oong Boys",
  subtext = "Fresh, organically grown mushrooms and premium cultivation kits — hand-harvested daily and delivered straight to your door with care.",
  primaryCtaText = "Shop Catalog",
  primaryCtaHref = "/catalog",
  secondaryCtaText = "How It Works",
  secondaryCtaHref = "#guides",
}: HeroProps) {
  return (
    <>
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-[#faf8f4] overflow-hidden font-sans antialiased">
        {/* LAYER 0: TRUE FULL-BLEED BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={heroMushroomBg}
            alt="Oong Boys mushroom products showcase"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-right sm:object-center lg:object-right"
          />
        </div>

        {/* LAYER 1: BRANDED BLENDED GRADIENT OVERLAY */}
        {/* Ensures the dark text stays highly readable on the left while seamlessly fading out before hitting the product array */}
        <div className="absolute inset-0 z-10 bg-[#faf8f4]/90 sm:bg-[#faf8f4]/85 lg:bg-transparent lg:bg-linear-to-r lg:from-[#faf8f4] lg:via-[#faf8f4]/85 lg:to-transparent lg:via-20% pointer-events-none" />

        {/* LAYER 2: FLOATING TRUST CARD ON THE IMAGE */}
        {/* Positioned on the left edge of the visible image block on desktop, and shifts cleanly to the bottom corner on mobile viewports */}
        <div className="absolute z-30 bottom-6 right-4 sm:bottom-12 sm:right-8 lg:left-[52%] lg:right-auto lg:bottom-16 bg-white/75 backdrop-blur-md border border-white/40 p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-[#2d4029]/5 flex items-center gap-3 max-w-65">
          <div className="w-10 h-10 rounded-xl bg-[#4c6a46] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#4c6a46]/20">
            <Star className="w-5 h-5 fill-current text-[#faf8f4]" />
          </div>
          <div>
            <div className="flex items-center gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-current text-amber-500 stroke-amber-500"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-[#2d4029] tracking-tight">
              500+ Happy Customers
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Top-rated farm & kits
            </p>
          </div>
        </div>

        {/* LAYER 3: TEXT FOREGROUND CONTAINER */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Organic Subtle Badge */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#4c6a46] uppercase bg-[#4c6a46]/10 px-3 py-1.5 rounded-full">
                {badgeText}
              </span>
            </div>

            {/* Typography Structured Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-[#2d4029] leading-[1.15] mb-6 tracking-tight">
              {headline}
            </h1>

            {/* Description Subtext */}
            <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-8 max-w-lg">
              {subtext}
            </p>

            {/* Action Callouts */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={primaryCtaHref}
                className="h-12 px-7 rounded-full bg-[#4c6a46] hover:bg-[#3d5538] text-white font-semibold text-sm shadow-lg shadow-[#4c6a46]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] focus:outline-none group"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={secondaryCtaHref}
                className="h-12 px-7 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm shadow-sm flex items-center justify-center transition-all hover:bg-gray-50 focus:outline-none"
              >
                {secondaryCtaText}
              </a>
            </div>

            {/* TRUST STRIP BELOW THE CTA BUTTONS */}
            {/* Sits cleanly within the text column's safe zone, distinct from the busy background photo */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 mt-8 pt-6 border-t border-gray-200/60 max-w-xl text-[13px] text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-current text-amber-500 stroke-amber-500" />
                <span>
                  <strong className="text-gray-800">4.9/5</strong> from 200+
                  orders
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#4c6a46]" />
                <span>100% Organic Certified</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden lg:block" />
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gray-500" />
                <span>Same-Day Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FeaturedProducts />
      <HowItWorks />
    </>
  );
}
