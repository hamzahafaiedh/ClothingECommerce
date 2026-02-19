'use client';

import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white mt-auto border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-amber-400">
              {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Curated fashion for the modern wardrobe. Quality pieces that tell your story.
            </p>
            <div className="w-12 h-1 bg-amber-500 mt-4 sm:mt-6" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Shop</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm text-neutral-400">
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=new" className="hover:text-amber-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sale" className="hover:text-amber-400 transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-amber-400 transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li>
                <a href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                  <span className="w-8 h-8 bg-neutral-800 rounded-full inline-flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-amber-400" />
                  </span>
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@boutique.com" className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                  <span className="w-8 h-8 bg-neutral-800 rounded-full inline-flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-amber-400" />
                  </span>
                  <span className="truncate">hello@boutique.com</span>
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-4 sm:mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-amber-500 hover:text-black transition-all duration-300"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-amber-500 hover:text-black transition-all duration-300"
              >
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-neutral-500">
          <p>&copy; {currentYear} {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
