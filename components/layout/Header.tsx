'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: 'Shop', href: '/shop' },
    { name: 'New Arrivals', href: '/shop?sort=newest' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-display font-bold text-white hover:text-amber-400 transition-colors">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-300 hover:text-amber-400 font-medium transition-colors relative group text-sm lg:text-base"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-neutral-300 hover:text-amber-400 transition-colors hidden sm:block"
            >
              <Instagram size={20} className="sm:w-[22px] sm:h-[22px]" />
            </Link>

            <Link href="/cart" className="relative text-neutral-300 hover:text-amber-400 transition-colors">
              <ShoppingBag size={20} className="sm:w-[22px] sm:h-[22px]" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-amber-500 text-black text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-300 hover:text-amber-400 transition-colors p-1"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md"
            >
              <div className="py-3 sm:py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 rounded-lg transition-colors text-base"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 rounded-lg transition-colors text-base sm:hidden"
                >
                  <Instagram size={18} />
                  Follow us on Instagram
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
