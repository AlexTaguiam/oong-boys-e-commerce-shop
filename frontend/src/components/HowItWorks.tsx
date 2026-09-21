import React, { useLayoutEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  ThumbsUp,
  Wallet,
  MapPin,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { killAllScrollTriggers } from "@/utils/scrollTriggerCleanup";

// Register ScrollTrigger safely for environments utilizing SSR frameworks
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepItem {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const stepsData: StepItem[] = [
  {
    number: "1",
    icon: Search,
    title: "Browse Products",
    description:
      "Explore our selection of fresh mushroom products and grow kits from Oong Boys.",
  },
  {
    number: "2",
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Choose your favorite items and add them safely to your cart.",
  },
  {
    number: "3",
    icon: CreditCard,
    title: "Checkout",
    description:
      "Enter your delivery details, select your payment method, and confirm.",
  },
  {
    number: "4",
    icon: Package,
    title: "Order Processing",
    description:
      "We carefully sort, pack, and prepare your order for a fresh, clean delivery.",
  },
  {
    number: "5",
    icon: Truck,
    title: "Delivery",
    description:
      "Your package is dispatched securely and sent straight to your doorstep.",
  },
  {
    number: "6",
    icon: ThumbsUp,
    title: "Receive & Review",
    description:
      "Receive your items fresh and share your feedback with the Oong Boys team.",
  },
];

export default function HowItWorks() {
  const componentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !componentRef.current || !trackRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current!;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: componentRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
          },
          0,
        );

        tl.to(
          ".progress-line-fill",
          {
            scaleX: 1,
            ease: "none",
          },
          0,
        );
      });
    }, componentRef);

    return () => {
      ctx.revert();
      killAllScrollTriggers();
    };
  }, []);

  return (
    <section
      ref={componentRef}
      className="w-full min-h-screen lg:h-screen bg-[#faf8f4] overflow-hidden flex flex-col justify-between"
    >
      {/* FIXED TITLE CONTAINER: Sits comfortably outside the scroll track */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 text-center select-none">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#4c6a46] uppercase block mb-2">
          EASY 6-STEP PIPELINE
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2d4029] tracking-tight mb-2">
          How It Works
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
          Ordering from Oong Boys is simple. Follow these steps to get fresh
          mushroom products delivered to your door.
        </p>
      </div>

      {/* WORKSPACE MIDDLEGROUND Track Area */}
      <div className="relative flex-1 flex items-center py-12 lg:py-0">
        {/* FIXED: Changed 'w-full' to 'w-full lg:w-max' so the container expands to the true content width of all cards */}
        <div
          ref={trackRef}
          className="inline-flex flex-nowrap gap-8 lg:gap-16 px-6 sm:px-12 lg:px-[15vw] overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none will-change-transform lg:flex-row relative z-10 w-full lg:w-max"
        >
          {/* Line now perfectly calculates its length across the entire expanded container width */}
          <div className="absolute top-16 left-[calc(15vw+170px)] right-[calc(15vw+170px)] h-0.5 bg-gray-200 hidden lg:block z-0">
            <div className="progress-line-fill absolute top-0 left-0 w-full h-full bg-[#4c6a46] origin-left scale-x-0" />
          </div>

          {stepsData.map((step, idx) => {
            // ... your card rendering code remains exactly the same
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="w-70 sm:w-[320px] lg:w-85 shrink-0 snap-center flex flex-col items-center text-center relative z-10 group"
              >
                {/* Visual Circle Stack Anchor */}
                <div className="relative w-32 h-32 rounded-full bg-white border-2 border-gray-200/80 shadow-md flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-[#4c6a46] group-hover:shadow-lg bg-linear-to-b from-white to-[#f2eee4]/30">
                  {/* Absolute Target Floating Identifier Badge */}
                  <span className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#4c6a46] text-white font-bold text-xs flex items-center justify-center rounded-full border-2 border-[#faf8f4] shadow-sm">
                    {step.number}
                  </span>

                  {/* Icon Node Container */}
                  <div className="text-gray-600 transition-colors duration-300 group-hover:text-[#4c6a46]">
                    <Icon className="w-12 h-12 stroke-[1.5]" />
                  </div>
                </div>

                {/* Information Context Elements */}
                <h3 className="font-serif font-bold text-lg text-[#2d4029] mb-2 transition-colors duration-300 group-hover:text-[#4c6a46]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* METRIC BOTTOM BAR LAYOUT SUB-CARD SECTION */}
      {/* Replicates the payment framework references context visible on your layout inspiration panel */}
      <div className="w-full bg-[#f2eee4]/60 border-t border-gray-200/40 py-8 lg:py-12 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Payment Methods Metadata Sub-Block */}
          <div className="bg-white border border-gray-200/50 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4c6a46]/10 text-[#4c6a46] flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2d4029] uppercase tracking-wider mb-2">
                Accepted Payments
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-semibold">
                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                  GCash
                </span>
                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                  Cash on Delivery (COD)
                </span>
                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>

          {/* Logistics Handling Regions Indicator Block */}
          <div className="bg-white border border-gray-200/50 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4c6a46]/10 text-[#4c6a46] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2d4029] uppercase tracking-wider mb-2">
                Active Service Zones
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-semibold">
                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                  Within City Center
                </span>
                <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                  Nearby Municipalities
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
