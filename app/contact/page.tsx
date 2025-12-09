'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Phone size={20} />,
      title: 'Phone',
      details: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+216 XX XXX XXX',
      action: 'Call us',
      href: `tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
    },
    {
      icon: <Mail size={20} />,
      title: 'Email',
      details: 'hello@boutique.com',
      action: 'Send email',
      href: 'mailto:hello@boutique.com',
    },
    {
      icon: <MapPin size={20} />,
      title: 'Location',
      details: process.env.NEXT_PUBLIC_LOCATION_NAME || 'Tunis, Tunisia',
      action: 'Get directions',
      href: `https://www.google.com/maps/search/?api=1&query=${process.env.NEXT_PUBLIC_LOCATION_LATITUDE || '36.8065'},${process.env.NEXT_PUBLIC_LOCATION_LONGITUDE || '10.1815'}`,
    },
    {
      icon: <Clock size={20} />,
      title: 'Hours',
      details: 'Mon - Sat: 10AM - 8PM',
      action: '',
      href: '',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section with Image */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/contact-hero.jpg')] bg-cover bg-center opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 sm:w-20 h-1 bg-amber-500 mx-auto mb-6 sm:mb-8" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 sm:mb-6">
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto px-4">
              We'd love to hear from you. Whether you have a question about our products,
              need styling advice, or just want to say hello.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 group"
              >
                <div className="bg-amber-500 text-black rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-white">
                  {info.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-3 break-words">
                  {info.details}
                </p>
                {info.action && info.href && (
                  <a
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                  >
                    {info.action}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Form + Image */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-neutral-800">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                    Send us a Message
                  </h2>
                  <div className="w-12 sm:w-14 h-1 bg-amber-500" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-black font-semibold px-6 py-3 sm:py-4 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <Send size={18} />
                    Send Message
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-[4/5] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 group">
                {/* IMAGE PLACEHOLDER: Contact/Customer Service Image */}
                <div className="absolute inset-0 bg-[url('/contact-image.jpg')] bg-cover bg-center" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500 text-black p-2.5 rounded-lg">
                        <MessageCircle size={20} />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                        We're Here to Help
                      </h3>
                    </div>
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                      Our dedicated team is ready to answer your questions, help with orders,
                      or provide styling advice. Reach out anytime!
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <span className="text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-3 sm:mb-4">
              Quick Answers
            </h2>
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: 'What are your shipping times?',
                answer: 'We typically ship within 1-2 business days. Delivery usually takes 2-5 business days depending on your location in Tunisia.',
              },
              {
                question: 'Do you offer international shipping?',
                answer: 'Currently, we ship within Tunisia only. We are working on expanding to international shipping soon.',
              },
              {
                question: 'How can I track my order?',
                answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package in real-time.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, and cash on delivery for local orders.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-neutral-800"
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-amber-900/20 via-neutral-900/50 to-neutral-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
              Prefer to Chat?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Connect with us on WhatsApp for instant support and quick responses to your questions
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-amber-400 transition-colors text-sm sm:text-base"
            >
              <MessageCircle size={20} />
              Message on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
