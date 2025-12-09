'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function HomePage() {
  const features = [
    {
      icon: <TrendingUp size={24} />,
      title: 'Latest Trends',
      description: 'Stay ahead with our curated collection',
    },
    {
      icon: <Truck size={24} />,
      title: 'Fast Delivery',
      description: 'Quick shipping across Tunisia',
    },
    {
      icon: <Shield size={24} />,
      title: 'Quality Guaranteed',
      description: 'Premium materials, perfect fit',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-store.jpg"
            alt="Curated clothing store interior"
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
          {/* Gradient Overlay - Creates depth and text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 md:from-black/70 md:via-black/50 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-0">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Accent Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '3rem' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-amber-500 mb-6 sm:mb-8 sm:w-16"
              />
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-4 sm:mb-6 leading-[0.95]">
                Elevate Your{' '}
                <span className="text-amber-400">Style</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-neutral-200 mb-8 sm:mb-10 leading-relaxed max-w-lg"
              >
                Discover timeless pieces that define your unique aesthetic. 
                Curated collections for those who appreciate quality craftsmanship.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto group bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 sm:px-8"
                  >
                    Shop Collection
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/shop?sort=newest" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    New Arrivals
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-10"
        >
          <div className="w-px h-20 bg-white/30" />
          <span className="text-white/60 text-sm tracking-widest [writing-mode:vertical-lr] rotate-180">
            SCROLL TO EXPLORE
          </span>
          <div className="w-px h-20 bg-white/30" />
        </motion.div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [2, 14, 2], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-1.5 h-2 bg-amber-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-neutral-900 to-transparent z-[5]" />
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Why Choose Us
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="text-center p-6 sm:p-8 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-amber-500/30 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-amber-500 text-black rounded-xl mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-neutral-400 text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-neutral-800 to-neutral-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
              Follow Our Journey
            </h2>
            <p className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Join our community on Instagram for daily style inspiration, exclusive drops, and behind-the-scenes content
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="secondary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-100 font-semibold px-6 sm:px-8"
              >
                Follow on Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
