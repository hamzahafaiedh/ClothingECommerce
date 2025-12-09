'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Target, MapPin } from 'lucide-react';

export default function AboutPage() {
  // Get location from environment variables
  const latitude = process.env.NEXT_PUBLIC_LOCATION_LATITUDE || '36.8065';
  const longitude = process.env.NEXT_PUBLIC_LOCATION_LONGITUDE || '10.1815';
  const locationName = process.env.NEXT_PUBLIC_LOCATION_NAME || 'Tunis, Tunisia';

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Passion for Fashion',
      description: 'We believe fashion is an art form that allows you to express your unique personality.',
    },
    {
      icon: <Users size={32} />,
      title: 'Community First',
      description: 'Building a community of style enthusiasts who inspire and support each other.',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Quality & Craftsmanship',
      description: 'Every piece is carefully selected for its quality, design, and attention to detail.',
    },
    {
      icon: <Target size={32} />,
      title: 'Sustainable Choices',
      description: 'Committed to making fashion choices that are better for our planet.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6">
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
              Curating timeless fashion pieces that empower you to express your authentic self
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold text-neutral-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-neutral-600 text-lg">
                <p>
                  Founded with a vision to make quality fashion accessible to everyone,
                  {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'} has grown from a small
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl h-96 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-6xl font-display font-bold text-neutral-800 mb-2">
                  {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
                </div>
                <p className="text-neutral-600 text-lg">Where Style Meets Substance</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 text-white rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                  {value.title}
                </h3>
                <p className="text-neutral-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-8">
              To empower individuals through fashion by providing carefully curated, high-quality
              pieces that inspire confidence and self-expression. We're committed to creating a
              shopping experience that's as enjoyable as the clothes themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Visit Us
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Find our boutique and experience our collection in person
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Location Info */}
            <div className="bg-neutral-50 p-8 rounded-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-neutral-900 text-white p-3 rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    {process.env.NEXT_PUBLIC_SITE_NAME || 'BOUTIQUE'}
                  </h3>
                  <p className="text-neutral-600 text-lg">
                    {locationName}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-neutral-600">
                <p>
                  We welcome you to visit our physical location and explore our curated collection.
                  Our knowledgeable staff is ready to help you find the perfect pieces for your style.
                </p>
                <div className="pt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <MapPin size={20} />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden shadow-lg h-[400px] lg:h-[500px]">
              <iframe
                src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
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
