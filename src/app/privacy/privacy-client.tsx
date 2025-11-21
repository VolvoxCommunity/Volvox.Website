"use client";

import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";

/**
 * Privacy Policy Client Component
 *
 * Client-side component that displays the privacy policy with navigation and animated background.
 *
 * @returns The privacy policy client component
 */
export function PrivacyClient() {
  const handleNavigate = (section: string) => {
    if (section === "home") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation onNavigate={handleNavigate} currentSection="privacy" />

        <main className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

              <p className="text-muted-foreground mb-8">
                Last updated: 11/21/2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p>
                  At Volvox, we are committed to protecting your privacy and
                  ensuring the security of your personal information. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website and use
                  our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Information We Collect
                </h2>
                <h3 className="text-xl font-semibold mb-2">
                  Personal Information
                </h3>
                <p>
                  We may collect personal information that you voluntarily
                  provide to us when you:
                </p>
                <ul>
                  <li>Register for an account</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our website</li>
                  <li>Participate in our mentorship programs</li>
                  <li>Use our products or services</li>
                </ul>
                <p>This information may include:</p>
                <ul>
                  <li>
                    Name and contact information (email address, phone number)
                  </li>
                  <li>Username and password</li>
                  <li>Professional information and skills</li>
                  <li>
                    Payment information (processed securely through third-party
                    payment processors)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Automatically Collected Information
                </h3>
                <p>
                  When you visit our website, we automatically collect certain
                  information about your device and browsing actions, including:
                </p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Clickstream data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>
                    Send administrative information, updates, and security
                    alerts
                  </li>
                  <li>
                    Respond to your comments, questions, and customer service
                    requests
                  </li>
                  <li>Match mentors with mentees in our mentorship programs</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>
                    Detect, prevent, and address technical issues and security
                    threats
                  </li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Information Sharing and Disclosure
                </h2>
                <p>
                  We do not sell your personal information. We may share your
                  information in the following circumstances:
                </p>
                <ul>
                  <li>
                    <strong>Service Providers:</strong> We may share information
                    with third-party service providers who perform services on
                    our behalf (e.g., hosting, analytics, payment processing)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose
                    information if required by law or in response to valid legal
                    processes
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any
                    merger, sale of company assets, or acquisition
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share information
                    with your explicit consent
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                  However, no method of transmission over the internet or
                  electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                <ul>
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the
                  information provided below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Cookies and Tracking
                </h2>
                <p>
                  We use cookies and similar tracking technologies to track
                  activity on our website and store certain information. You can
                  instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent. However, if you do not accept
                  cookies, you may not be able to use some portions of our
                  website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Third-Party Links
                </h2>
                <p>
                  Our website may contain links to third-party websites. We are
                  not responsible for the privacy practices or content of these
                  external sites. We encourage you to review the privacy
                  policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Children&apos;s Privacy
                </h2>
                <p>
                  Our services are not intended for individuals under the age of
                  13. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  personal information from a child under 13, we will take steps
                  to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &ldquo;Last updated&rdquo; date.
                  You are advised to review this Privacy Policy periodically for
                  any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us at:
                </p>
                <p className="mt-4">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@volvox.dev"
                    className="text-primary hover:underline"
                  >
                    privacy@volvox.dev
                  </a>
                </p>
              </section>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
