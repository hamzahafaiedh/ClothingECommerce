'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Target, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const latitude = process.env.NEXT_PUBLIC_LOCATION_LATITUDE || '36.8065';
  const longitude = process.env.NEXT_PUBLIC_LOCATION_LONGITUDE || '10.1815';
  const locationName = process.env.NEXT_PUBLIC_LOCATION_NAME || 'Tunis, Tunisia';

  const values = [
    {
      icon: <Heart size={24} />,
      title: 'Passion for Fashion',
      description: 'We believe fashion is an art form that allows you to express your unique personality.',
    },
    {
      icon: <Users size={24} />,
      title: 'Community First',
      description: 'Building a community of style enthusiasts who inspire and support each other.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Quality & Craftsmanship',
      description: 'Every piece is carefully selected for its quality, design, and attention to detail.',
    },
    {
      icon: <Target size={24} />,
      title: 'Sustainable Choices',
      description: 'Committed to making fashion choices that are better for our planet.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/about-hero.jpg')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 sm:w-20 h-1 bg-amber-500 mx-auto mb-6 sm:mb-8" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 sm:mb-6">
              About Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto px-4">
              Curating timeless fashion pieces that empower you to express your authentic self
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4 sm:mb-6">
                Our Story
              </h2>
              <div className="w-14 sm:w-16 h-1 bg-amber-500 mb-6 sm:mb-8" />
              <div className="space-y-4 sm:space-y-5 text-neutral-300 text-base sm:text-lg leading-relaxed">
                <p>
                  Founded with a vision to make quality fashion accessible to everyone,
                  {process.env.NEXT_PUBLIC_SITE_NAME || ' BOUTIQUE'} has grown from a small
                  passion project into a beloved fashion destination.
                </p>
                <p>
                  We believe that everyone deserves to feel confident and stylish in what they wear.
                  That's why we carefully curate each piece in our collection, ensuring it meets our
                  high standards for quality, design, and wearability.
                </p>
                <p>
                  Based in Tunisia, we're proud to serve our local community while sharing our love
                  for fashion with the world. Every item we offer is selected with care, keeping in
                  mind the diverse tastes and lifestyles of our customers.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-2"
            >
              {/* IMAGE PLACEHOLDER: Story/Team Image */}
              <div className="relative aspect-[4/5] sm:aspect-[4/5] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800">
                <div className="absolute inset-0 bg-[url('/about-story.jpg')] bg-cover bg-center" />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-neutral-900/40" />
                {/* Text content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6 sm:p-8">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-amber-500 mb-2">
                      {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
                    </div>
                    <p className="text-neutral-200 text-sm sm:text-lg">Where Style Meets Substance</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/20 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-20 sm:w-24 h-20 sm:h-24 bg-amber-500/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">What We Believe</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-3 sm:mb-4">
              Our Values
            </h2>
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto mb-4 sm:mb-6" />
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto px-4">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 text-black rounded-xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                  {value.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">The People</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-3 sm:mb-4">
              Meet Our Team
            </h2>
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          {/* Team member photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: 'Founder', role: 'Founder & Creative Director', image: '/team-1.jpg' },
              { name: 'Team Member', role: 'Fashion Curator', image: '/team-2.jpg' },
              { name: 'Team Member', role: 'Customer Experience', image: '/team-3.jpg' },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="relative aspect-[4/5] bg-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 border border-neutral-700 group-hover:border-amber-500/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  {/* Fallback gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-neutral-900/80 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl text-amber-500/30 font-display font-bold">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white text-center">{member.name}</h3>
                <p className="text-neutral-400 text-center text-sm sm:text-base">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-amber-900/20 via-neutral-900/50 to-neutral-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mt-2 mb-4 sm:mb-6">
              Our Mission
            </h2>
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto mb-6 sm:mb-8" />
            <p className="text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed px-4">
              To empower individuals through fashion by providing carefully curated, high-quality
              pieces that inspire confidence and self-expression. We're committed to creating a
              shopping experience that's as enjoyable as the clothes themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Find Us</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-3 sm:mb-4">
              Visit Us
            </h2>
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto mb-4 sm:mb-6" />
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto px-4">
              Find our boutique and experience our collection in person
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start"
          >
            {/* Location Info */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-neutral-800 order-2 lg:order-1">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-amber-500 text-black p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">
                    {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
                  </h3>
                  <p className="text-neutral-400 text-base sm:text-lg">
                    {locationName}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-neutral-300 text-sm sm:text-base">
                <p>
                  We welcome you to visit our physical location and explore our curated collection.
                  Our knowledgeable staff is ready to help you find the perfect pieces for your style.
                </p>
                <div className="pt-2 sm:pt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-amber-400 transition-colors font-semibold text-sm sm:text-base"
                  >
                    <MapPin size={18} className="sm:w-5 sm:h-5" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800 h-[300px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2">
              <iframe
                src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(50%) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Boutique Location"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
