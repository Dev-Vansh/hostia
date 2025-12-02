import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Hostia | Webool Technology Limited</title>
        <meta name="description" content="Privacy Policy for Hostia hosting services operated by Webool Technology Limited. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-400 mb-8">Last Updated: November 27, 2025</p>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-300 leading-relaxed">
                  Webool Technology Limited ("Hostia", "we", "us", or "our") operates the Hostia hosting platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. By using Hostia, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">2.1 Personal Information</p>
                  <p>We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Billing and payment information</li>
                    <li>Account credentials and authentication data</li>
                    <li>Communication preferences and support inquiries</li>
                  </ul>

                  <p className="font-semibold text-white mt-4">2.2 Technical Information</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>IP addresses and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Usage data and server logs</li>
                    <li>Cookies and tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <div className="space-y-2 text-gray-300 leading-relaxed">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Provide, maintain, and improve our hosting services</li>
                    <li>Process payments and billing</li>
                    <li>Send service-related notifications and updates</li>
                    <li>Respond to customer support requests</li>
                    <li>Monitor and analyze usage patterns and trends</li>
                    <li>Detect, prevent, and address technical issues and security threats</li>
                    <li>Comply with legal obligations and enforce our terms</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>We may share your information in the following circumstances:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong className="text-white">Service Providers:</strong> With third-party vendors who assist in operating our services (payment processors, cloud infrastructure providers)</li>
                    <li><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                    <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                    <li><strong className="text-white">Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
                  </ul>
                  <p className="mt-4">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300 leading-relaxed">
                  We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security. We regularly review and update our security practices to maintain the highest level of protection.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                <p className="text-gray-300 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is retained for the duration of your active subscription and for a reasonable period thereafter as required by law or business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                <div className="space-y-2 text-gray-300 leading-relaxed">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Access and obtain a copy of your personal data</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal data (subject to legal obligations)</li>
                    <li>Object to or restrict certain processing activities</li>
                    <li>Data portability (receive your data in a structured format)</li>
                    <li>Withdraw consent where processing is based on consent</li>
                  </ul>
                  <p className="mt-4">To exercise these rights, please contact us at privacy@hostia.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance user experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our services may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. International Data Transfers</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
                <div className="text-gray-300 leading-relaxed space-y-2">
                  <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
                  <p className="mt-4">
                    <strong className="text-white">WeebPoll Technologies India Private Limited</strong><br />
                    Email: privacy@hostia.com<br />
                    Support: support@hostia.com<br />
                    Phone: +91 123 456 7890<br />
                    Address: Mumbai, India
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default PrivacyPolicyPage;