import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const RefundPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - Hostia | Webool Technology Limited</title>
        <meta name="description" content="Refund Policy for Hostia hosting services operated by Webool Technology Limited. Learn about our refund terms and conditions." />
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Refund Policy
            </h1>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
              <section>
                <p className="text-gray-300 leading-relaxed mb-6">
                  At Hostia, a brand of Webool Technology Limited, we are committed to providing our customers with high-quality services. To ensure transparency, we have outlined our refund policy below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Refund Policy Overview</h2>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300 leading-relaxed">
                  <li><strong className="text-white">Domains:</strong> Non-refundable.</li>
                  <li><strong className="text-white">Dedicated and VDS Services:</strong> Non-refundable.</li>
                  <li><strong className="text-white">VPS Services:</strong> Refundable within 24 hours of purchase, provided usage stays within minimal resource limits.</li>
                  <li><strong className="text-white">Shared Hosting Services:</strong> Refundable within 7 days of purchase, subject to revised conditions.</li>
                  <li><strong className="text-white">GST Charges:</strong> Non-refundable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Shared Hosting Refund Criteria</h2>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300 leading-relaxed">
                  <li><strong className="text-white">Within 2 Days:</strong> Eligible for a full refund with immediate service termination.</li>
                  <li><strong className="text-white">Within 7 Days (After 2 Days):</strong> Eligible for a 50% refund with immediate service termination.</li>
                  <li><strong className="text-white">After 7 Days:</strong> Refunds are not available; services will continue for the remainder of the billing period.</li>
                  <li><strong className="text-white">Renewals:</strong> Strictly non-refundable under any circumstances.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Refund Eligibility</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Refunds are applicable only when Hostia fails to provide the core service functionality as described at the time of purchase. Issues caused by client-side configuration, misuse, abuse, or violations of the Terms of Service do not qualify for refunds.
                  </p>
                  <p>
                    All refunds are issued to Hostia Wallet by default for instant credit. Wallet credits can be used for future purchases, excluding domain registrations.
                  </p>
                  <p>
                    Cash refunds require management approval and will only be processed to the same source account used for payment, subject to strict verification and compliance checks.
                  </p>
                  <p>
                    Transactions below Rs300 are eligible only for Hostia Wallet credits and not cash refunds.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Refund Methods and Associated Charges</h2>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-300 leading-relaxed">
                  <li><strong className="text-white">Hostia Wallet (Default):</strong> Instant credit for eligible refunds with no additional verification.</li>
                  <li><strong className="text-white">Cash Refund to Original Payment Method:</strong> Subject to strict source verification, identity checks, and a processing timeline of 5–7 working days or more depending on the bank.</li>
                  <li><strong className="text-white">Processing Fees:</strong> Cash refunds incur a fee of 4% or Rs50 (whichever is higher), along with a Rs20 administrative charge.</li>
                  <li><strong className="text-white">NEFT Bank Transfer:</strong> An additional Rs30 charge applies if NEFT transfer is required.</li>
                  <li>Refunds are strictly denied in cases of service abuse, malicious activity, or TOS violation.</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default RefundPolicyPage;