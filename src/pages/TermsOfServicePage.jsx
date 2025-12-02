import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Hostia | Webool Technology Limited</title>
        <meta name="description" content="Terms of Service for Hostia hosting services operated by Webool Technology Limited. Read our terms and conditions before using our services." />
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-gray-400 mb-8">Last Updated: November 27, 2025</p>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and Webool Technology Limited ("Hostia", "we", "us", or "our") governing your use of our hosting services. By accessing or using Hostia services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>Hostia provides premium hosting services including but not limited to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Bot Hosting services for Discord and other platforms</li>
                    <li>Virtual Private Server (VPS) hosting with various processor options</li>
                    <li>Related technical support and maintenance services</li>
                  </ul>
                  <p className="mt-4">We reserve the right to modify, suspend, or discontinue any aspect of our services at any time with or without notice.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration and Security</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">3.1 Account Creation</p>
                  <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

                  <p className="font-semibold text-white mt-4">3.2 Account Responsibility</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>One person or entity may not maintain more than one account without prior authorization</li>
                    <li>You must immediately notify us of any unauthorized access or security breach</li>
                    <li>You are solely responsible for all content and activity on your account</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>You agree not to use our services for any unlawful or prohibited activities, including but not limited to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Illegal activities or content that violates applicable laws</li>
                    <li>Distribution of malware, viruses, or harmful code</li>
                    <li>Unauthorized access to systems or networks (hacking)</li>
                    <li>Spam, phishing, or fraudulent activities</li>
                    <li>Content that infringes intellectual property rights</li>
                    <li>Harassment, hate speech, or abusive content</li>
                    <li>Mining cryptocurrencies without explicit written permission</li>
                    <li>Activities that may damage, disable, or impair our infrastructure</li>
                    <li>Reselling services without authorization</li>
                  </ul>
                  <p className="mt-4">Violation of this policy may result in immediate suspension or termination of services without refund.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Payment Terms</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">5.1 Billing</p>
                  <p>Services are billed in advance on a monthly basis or as otherwise specified in your service plan. All prices are in Indian Rupees (INR) unless otherwise stated.</p>

                  <p className="font-semibold text-white mt-4">5.2 Payment Methods</p>
                  <p>We accept various payment methods as displayed on our website. You authorize us to charge your selected payment method for all fees incurred.</p>

                  <p className="font-semibold text-white mt-4">5.3 Late Payments</p>
                  <p>Failure to pay fees when due may result in service suspension or termination. We reserve the right to charge late fees for overdue payments.</p>

                  <p className="font-semibold text-white mt-4">5.4 Taxes</p>
                  <p>You are responsible for all applicable taxes, duties, and government charges. Prices do not include applicable taxes unless explicitly stated.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Service Level and Uptime</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted service and are not liable for downtime caused by:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Scheduled maintenance (with prior notice when possible)</li>
                    <li>Emergency maintenance or security updates</li>
                    <li>Third-party service failures</li>
                    <li>Force majeure events beyond our reasonable control</li>
                    <li>User-caused issues or violations of this agreement</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Data and Backups</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">7.1 Your Responsibility</p>
                  <p>You are solely responsible for maintaining backups of your data. While we may provide backup services, we are not responsible for data loss.</p>

                  <p className="font-semibold text-white mt-4">7.2 Data Security</p>
                  <p>We implement reasonable security measures to protect your data, but cannot guarantee absolute security. You acknowledge the inherent risks of internet-based services.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>All content, features, and functionality of Hostia services, including but not limited to text, graphics, logos, and software, are the exclusive property of Webool Technology Limited and are protected by copyright, trademark, and other intellectual property laws.</p>
                  <p className="mt-4">You retain ownership of content you upload to our services, but grant us a license to use, store, and process such content as necessary to provide our services.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="font-semibold text-white">9.1 By You</p>
                  <p>You may terminate your account at any time by contacting our support team. Termination does not relieve you of payment obligations for services already rendered.</p>

                  <p className="font-semibold text-white mt-4">9.2 By Us</p>
                  <p>We reserve the right to suspend or terminate your account immediately for:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Violation of these Terms or Acceptable Use Policy</li>
                    <li>Non-payment of fees</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>At our discretion for any reason with prior notice</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WEBOOL TECHNOLOGY LIMITED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR SERVICES IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
                <p className="text-gray-300 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Webool Technology Limited, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of your use of our services, violation of these Terms, or infringement of any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>Any disputes arising from these Terms or our services shall be resolved through:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Good faith negotiations between the parties</li>
                    <li>Mediation if negotiations fail</li>
                    <li>Arbitration in Mumbai, India, in accordance with Indian arbitration laws</li>
                  </ul>
                  <p className="mt-4">These Terms shall be governed by the laws of India, and you consent to the exclusive jurisdiction of courts in Mumbai, India.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Modifications to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting updated Terms on our website and updating the "Last Updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">14. Severability</h2>
                <p className="text-gray-300 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
                <div className="text-gray-300 leading-relaxed space-y-2">
                  <p>For questions about these Terms of Service, please contact us:</p>
                  <p className="mt-4">
                    <strong className="text-white">WeebPoll Technologies India Private Limited</strong><br />
                    Email: legal@hostia.com<br />
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

export default TermsOfServicePage;