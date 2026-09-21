import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import background from "@/assets/bg2.jpg";

// Update with Oong Boys Google Maps location when available.
const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.123456789!2d121.887543!3d17.8770515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3385ebce12aeeab3%3A0xa06ff1bff34636aa!2sOong%20Boys!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph";
export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-[#faf8f4] font-sans antialiased flex flex-col">
      {/* 1. FULL WIDTH HERO BANNER IMAGE AREA */}
      <div className="relative w-full h-80 sm:h-100 bg-gray-900 overflow-hidden flex items-center justify-center">
        {/* Placeholder background nature image asset */}
        <img
          src={background}
          alt="Oong Boys background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none brightness-95"
        />
        {/* Gradient Overlay mirroring the homepage's sage green aesthetic filter depth */}
        <div className="absolute inset-0 bg-linear-to-b from-[#2d4029]/85 to-[#3d5538]/90 mix-blend-multiply" />

        {/* Centered Text Elements */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center select-none">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#faf8f4]/80 uppercase block mb-3 animate-fade-in">
            Get In Touch
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-6xl text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-[#4c6a46] mx-auto mb-4 rounded-full" />
          <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto font-medium leading-relaxed">
            Have questions about our mushroom products? We'd love to hear from
            you. Reach out to learn more about what Oong Boys has to offer.
          </p>
        </div>
      </div>

      {/* CORE WORKSPACE CONTENT FRAME CONTAINER */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">
        {/* 2. THREE INFO CARDS ROW MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-20">
          {/* CARD 1: PHONE */}
          <div className="bg-white border border-gray-200/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-[#2d4029]/4 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#4c6a46] text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2d4029] mb-2">
              (+63) 9XX XXX XXXX
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed mb-4">
              Call us for inquiries about product orders, bulk purchases, or
              partnership opportunities.
            </p>
            <span className="text-xs font-bold text-[#4c6a46] group-hover:underline cursor-pointer mt-auto">
              Learn More
            </span>
          </div>

          {/* CARD 2: EMAIL - Accent Highlighted Card matching inspiration design rules */}
          <div className="bg-[#2d4029] border border-[#2d4029] p-6 sm:p-8 rounded-3xl shadow-xl shadow-[#2d4029]/20 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-white">
            <div className="w-12 h-12 rounded-full bg-[#faf8f4] text-[#2d4029] flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#faf8f4] mb-2">
              oongboys@gmail.com
            </h3>
            <p className="text-xs sm:text-sm text-gray-300/80 font-medium leading-relaxed mb-4">
              Email us anytime with your questions or inquiries. We'll respond
              within 24 hours.
            </p>
            <span className="text-xs font-bold text-[#faf8f4] group-hover:underline cursor-pointer mt-auto">
              Learn More
            </span>
          </div>

          {/* CARD 3: MAP LOCATION */}
          <div className="bg-white border border-gray-200/60 p-6 sm:p-8 rounded-3xl shadow-xl shadow-[#2d4029]/4 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#4c6a46] text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2d4029] mb-2">
              Cagayan Valley, Philippines
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed mb-4">
              Visit our mushroom farm and learn more about our growing process
              and product lineup.
            </p>
            <span className="text-xs font-bold text-[#4c6a46] group-hover:underline cursor-pointer mt-auto">
              Learn More
            </span>
          </div>
        </div>

        {/* 3. MAP + FORM SPLIT SECTION PORTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT SUB-COLUMN: TIME METRICS & MAP VISUALS (5 Cols wide) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            {/* Working Hours Text Segment */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider bg-[#4c6a46]/10 text-[#4c6a46] px-3 py-1 rounded-full uppercase inline-block mb-2">
                  TIMINGS
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2d4029]">
                  Our Working Hours
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                We're open year-round to serve your mushroom product needs.
                Stop by or reach out during business hours to learn more about
                Oong Boys products and ordering.
              </p>

              {/* Timing Node Lists */}
              <div className="space-y-3 pt-2 text-sm text-gray-600 font-semibold">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#4c6a46] shrink-0" />
                  <span>Monday – Friday : 8AM – 6PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#4c6a46] shrink-0" />
                  <span>Saturday : 9AM – 3PM</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 font-normal">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sunday (Closed)</span>
                </div>
              </div>
            </div>

            {/* Map Frame Embed Card Block */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2d4029] uppercase tracking-wider">
                Location :
              </h4>
              <div className="w-full h-70 sm:h-80 rounded-3xl overflow-hidden border border-gray-200/60 shadow-xl shadow-[#2d4029]/4 bg-white p-1.5 group">
                <iframe
                  title="Oong Boys Location Map"
                  src={GOOGLE_MAPS_EMBED_SRC}
                  className="w-full h-full rounded-2xl border-0 transition-all duration-300 group-hover:contrast-105"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SUB-COLUMN: DATA PROCESSING REGISTRATION FORM CONTAINER (7 Cols wide) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-left lg:pl-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#4c6a46] uppercase block mb-1">
                ONLINE DESK
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2d4029]">
                Send us a Message
              </h2>
            </div>

            {/* Integrated Self-Contained Contact Form Sub-Layer */}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
