import { Package, Clock, RefreshCw, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-neutral-600">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-neutral-100 rounded-full p-3">
                <Clock className="text-neutral-900" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
                <p className="text-neutral-600 text-sm">
                  You have 30 days from the delivery date to return your items for a full refund.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-neutral-100 rounded-full p-3">
                <RefreshCw className="text-neutral-900" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Free Exchanges</h3>
                <p className="text-neutral-600 text-sm">
                  Need a different size or color? We offer free exchanges on all items.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-neutral-100 rounded-full p-3">
                <Package className="text-neutral-900" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Easy Process</h3>
                <p className="text-neutral-600 text-sm">
                  Simply contact us to initiate your return. We'll guide you through every step.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-neutral-100 rounded-full p-3">
                <CheckCircle className="text-neutral-900" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Check</h3>
                <p className="text-neutral-600 text-sm">
                  Items must be unworn, unwashed, and in original condition with tags attached.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Return Policy Details */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-6">Return Policy</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Eligibility</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Items must be returned within 30 days of delivery</li>
                <li>Products must be unworn, unwashed, and undamaged</li>
                <li>Original tags must be attached</li>
                <li>Items must be in original packaging</li>
                <li>Sale items are eligible for return unless marked as final sale</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Non-Returnable Items</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Underwear and intimate apparel (for hygiene reasons)</li>
                <li>Items marked as "Final Sale"</li>
                <li>Gift cards</li>
                <li>Personalized or customized items</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How to Return</h3>
              <ol className="list-decimal list-inside space-y-2 text-neutral-600">
                <li>Contact our customer service team via email or phone</li>
                <li>Provide your order number and reason for return</li>
                <li>We'll send you a prepaid return shipping label</li>
                <li>Pack your items securely in the original packaging</li>
                <li>Drop off the package at your nearest post office or courier location</li>
                <li>You'll receive a confirmation email once we receive your return</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Refund Processing</h3>
              <p className="text-neutral-600 mb-2">
                Once your return is received and inspected, we will send you an email to notify you
                of the approval or rejection of your refund.
              </p>
              <p className="text-neutral-600">
                If approved, your refund will be processed within 5-7 business days and automatically
                applied to your original payment method. Please note that depending on your bank or
                credit card company, it may take an additional 2-3 business days for the refund to
                appear in your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Exchanges</h3>
              <p className="text-neutral-600 mb-2">
                We offer free exchanges for different sizes or colors of the same item. To exchange
                an item, follow the same return process and specify that you'd like an exchange.
              </p>
              <p className="text-neutral-600">
                We'll ship your replacement item as soon as we receive your original item back.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-neutral-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-neutral-300 mb-6">
            Our customer service team is here to assist you with your return or exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="px-6 py-3 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
            >
              Call Us
            </a>
            <a
              href="mailto:hello@boutique.com"
              className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-neutral-900 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
