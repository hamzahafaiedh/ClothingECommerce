'use client';

import Link from 'next/link';
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
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-900 mb-6">
              Elevate Your Style
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Discover timeless pieces that define your unique aesthetic
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="group">
                  Shop Collection
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button size="lg" variant="outline">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-neutral-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 text-white rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Follow Our Journey
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join our community on Instagram for daily style inspiration, exclusive drops, and behind-the-scenes content
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="secondary">
              Follow on Instagram
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
