import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Thermometer, Sprout, Send } from "lucide-react";
import logo from "@/assets/Logo.png";

function FacebookIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#1877F2] fill-current shrink-0"
      viewBox="0 0 24 24"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#E4405F] fill-current shrink-0"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#000000] fill-current shrink-0"
      viewBox="0 0 24 24"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.445v13.672a2.896 2.896 0 0 1-5.015 1.97 2.894 2.894 0 0 1 .494-3.626 2.897 2.897 0 0 1 2.308-1.077v-3.488c-.911 0-1.802.261-2.553.753a6.354 6.354 0 0 0-2.614 3.737 6.351 6.351 0 0 0 2.19 6.208 6.335 6.335 0 0 0 4.161 1.34 6.362 6.362 0 0 0 6.103-4.498 7.915 7.915 0 0 0 .425-2.585v-4.577a8.217 8.217 0 0 0 4.298 1.259v-3.473a4.8 4.8 0 0 1-1.528-.49z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    console.log("Subscribed email:", email);
    setEmail("");
  };

  // 1. Premium Value Propositions Row (Mushroom Farm Focused)
  const valueProps = [
    {
      icon: Truck,
      title: "Same-Day Farm Delivery",
      desc: "Harvested fresh to order and shipped instantly.",
    },
    {
      icon: ShieldCheck,
      title: "100% Organic Certified",
      desc: "Grown naturally with zero chemical pesticides.",
    },
    {
      icon: Thermometer,
      title: "Chilled Transit Protection",
      desc: "Temperature-controlled distribution for peak freshness.",
    },
    {
      icon: Sprout,
      title: "Expert Mycology Support",
      desc: "24/7 care support for dynamic grow kits.",
    },
  ];

  return (
    <footer className="w-full bg-[#4c6a46] border-t border-[#faf8f4]/20 font-sans antialiased">
      {/* TOP SECTION: VALUE PROPOSITIONS MATRICES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 border-b border-gray-200/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-2">
                <div className="w-12 h-12 bg-[#faf8f4] rounded-2xl flex items-center justify-center text-[#4c6a46] shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#faf8f4] tracking-wide mb-1">
                    {prop.title}
                  </h4>
                  <p className="text-xs text-[#faf8f4]/80 font-medium leading-relaxed">
                    {prop.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MIDDLE SECTION: PRIMARY SITE NAVIGATION & NEWSLETTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* COLUMN 1: BRAND LOGO BLOCK */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-max">
              <div className="w-10 h-10 bg-[#faf8f4] rounded-xl flex items-center justify-center shadow-md shadow-[#4c6a46]/10 transition-transform group-hover:scale-105">
                <span className="text-white font-serif text-xl font-bold">
                  <img src={logo} alt="Oong Boys logo" />
                </span>
              </div>
              <span className="font-serif font-bold text-xl text-[#2d4029] tracking-wide transition-colors group-hover:text-[#4c6a46]">
                Oong Boys
              </span>
            </Link>
            <p className="text-sm text-[#faf8f4] hover:text-white font-medium leading-relaxed max-w-sm">
              Fresh, organically grown mushroom products delivered straight to
              your door. From culinary varieties to premium grow kits — grown
              with care, harvested with pride.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 bg-[#faf8f4] hover:bg-white text-[#4c6a46] border border-[#faf8f4] rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-[#faf8f4] hover:bg-white text-[#4c6a46] border border-[#faf8f4] rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-[#faf8f4] hover:bg-white text-[#4c6a46] border border-[#faf8f4] rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* COLUMN 2: SHOP PORTAL LINKS */}
          <div className="col-span-2 space-y-4">
            <h5 className="font-serif font-bold text-sm text-[#2d4029] uppercase tracking-wider">
              Shop
            </h5>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Fresh Harvests
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Fruiting Kits
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Agar & Cultures
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Digital Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT & INFORMATION */}
          <div className="col-span-2 space-y-4">
            <h5 className="font-serif font-bold text-sm text-[#2d4029] uppercase tracking-wider">
              Support
            </h5>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Help Center / FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Cultivation Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#faf8f4] hover:text-white transition-colors"
                >
                  Contact Farm
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER INTERACTIVE BOARD */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-serif font-bold text-sm text-[#2d4029] uppercase tracking-wider">
              Subscribe to our Newsletter
            </h5>
            <p className="text-sm text-[#faf8f4] font-medium leading-relaxed">
              Sign up for exclusive batch releases, special discounts, and
              seasonal mushroom tips from Oong Boys.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-[#faf8f4] border border-[#faf8f4]/40 text-[#2d4029] text-sm font-medium rounded-2xl placeholder-[#2d4029]/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white shadow-inner transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#faf8f4] hover:bg-white text-[#4c6a46] font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all focus:outline-none group"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
