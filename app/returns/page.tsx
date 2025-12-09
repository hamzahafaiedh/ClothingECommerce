'use client';

import { Package, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReturnsPage() {
  const features = [
    {
      icon: <Clock size={20} />,
      title: '30-Day Returns',
      description: 'You have 30 days from the delivery date to return your items for a full refund.',
    },
    {
      icon: <RefreshCw size={20} />,
      title: 'Free Exchanges',
      description: 'Need a different size or color? We offer free exchanges on all items.',
    },
    {
      icon: <Package size={20} />,
      title: 'Easy Process',
      description: 'Simply contact us to initiate your return. We\'ll guide you through every step.',
    },
    {
      icon: <CheckCircle size={20} />,
      title: 'Quality Check',
      description: 'Items must be unworn, unwashed, and in original condition with tags attached.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative py-14 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-neutral-950 to-neutral-950" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-14 sm:w-16 h-1 bg-amber-500 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 px-4">
              We want you to love your purchase. If you're not completely satisfied, we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 lg:pb-20">
        {/* Key Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-neutral-800 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-amber-500 text-black rounded-xl p-2.5 sm:p-3 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Return Policy Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-neutral-800 mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-white flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-5 sm:h-6 bg-amber-500 rounded-full" />
            Return Policy
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-amber-400">Eligibility</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-neutral-300 text-sm sm:text-base">
                {[
                  'Items must be returned within 30 days of delivery',
                  'Products must be unworn, unwashed, and undamaged',
                  'Original tags must be attached',
                  'Items must be in original packaging',
                  'Sale items are eligible for return unless marked as final sale',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-amber-400">Non-Returnable Items</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-neutral-300 text-sm sm:text-base">
                {[
                  'Underwear and intimate apparel (for hygiene reasons)',
                  'Items marked as "Final Sale"',
                  'Gift cards',
                  'Personalized or customized items',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-amber-400">How to Return</h3>
              <ol className="space-y-2 sm:space-y-3 text-neutral-300 text-sm sm:text-base">
                {[
                  'Contact our customer service team via email or phone',
                  'Provide your order number and reason for return',
                  'We\'ll send you a prepaid return shipping label',
                  'Pack your items securely in the original packaging',
                  'Drop off the package at your nearest post office or courier location',
                  'You\'ll receive a confirmation email once we receive your return',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 sm:gap-4">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-amber-400">Refund Processing</h3>
              <p className="text-neutral-300 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
                Once your return is received and inspected, we will send you an email to notify you
                of the approval or rejection of your refund.
              </p>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                If approved, your refund will be processed within 5-7 business days and automatically
                applied to your original payment method. Please note that depending on your bank or
                credit card company, it may take an additional 2-3 business days for the refund to
                appear in your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-amber-400">Exchanges</h3>
              <p className="text-neutral-300 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
                We offer free exchanges for different sizes or colors of the same item. To exchange
                an item, follow the same return process and specify that you'd like an exchange.
              </p>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                We'll ship your replacement item as soon as we receive your original item back.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-amber-900/20 via-neutral-900 to-neutral-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-amber-500/20"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Need Help?</h2>
          <p className="text-neutral-300 mb-6 sm:mb-8 text-sm sm:text-base">
            Our customer service team is here to assist you with your return or exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors text-sm sm:text-base"
            >
              Call Us
            </a>
            <a
              href="mailto:hello@boutique.com"
              className="px-6 sm:px-8 py-2.5 sm:py-3 border border-neutral-600 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors text-sm sm:text-base"
            >
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
