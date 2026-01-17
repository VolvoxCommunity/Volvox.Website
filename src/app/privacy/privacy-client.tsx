"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

/**
 * Renders the Privacy Policy page with an animated background, top navigation, and footer.
 *
 * Navigation links navigate to the home page when the "home" section is selected or to the home page with a hash fragment for other sections.
 *
 * @returns The Privacy Policy React element
 */
export function PrivacyClient() {
  const router = useRouter();

  const handleNavigate = (section: string) => {
    // Navigate to home page for all sections since they're on the home page
    if (section === "home") {
      router.push("/");
    } else {
      // For other sections (products, blog, mentorship, about), go to home page with section
      router.push(`/#${section}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-background">
      <div className="relative z-10">
        <Navigation onNavigate={handleNavigate} currentSection="privacy" />

        <main id="main-content" className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

              <p className="text-muted-foreground mb-8">
                Last updated: 12/07/2025
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
                  <li>Name and contact information (email address)</li>
                  <li>Username and password</li>
                  <li>Display name</li>
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
                <p className="mt-4">
                  <strong>To request deletion of your account and data:</strong>{" "}
                  Please email us at{" "}
                  <a
                    href="mailto:privacy@volvox.dev?subject=Data%20Deletion%20Request"
                    className="text-primary hover:underline"
                  >
                    privacy@volvox.dev
                  </a>{" "}
                  with the subject line &ldquo;Data Deletion Request&rdquo;. We
                  will process your request in accordance with applicable data
                  protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to collect
                  and track information about your browsing activity. A cookie
                  is a small data file stored on your device that helps us
                  improve your experience and our services.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Types of Cookies We Use
                </h3>
                <ul>
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic
                    website functionality, such as remembering your preferences
                    and maintaining your session. These cannot be disabled.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    visitors interact with our website by collecting information
                    about pages visited, time spent on pages, and navigation
                    patterns. We use Google Analytics and Vercel Analytics for
                    this purpose.
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong> Used to deliver
                    relevant advertisements and track the effectiveness of our
                    advertising campaigns. These cookies may track your browsing
                    activity across different websites.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us monitor and
                    improve website performance, including page load times and
                    error tracking through services like Sentry.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Cookie Consent
                </h3>
                <p>
                  When you first visit our website, you will be presented with a
                  cookie consent banner that allows you to accept or decline
                  non-essential cookies. You can change your cookie preferences
                  at any time by clicking the &ldquo;Cookie Settings&rdquo; link
                  in our website footer.
                </p>
                <p className="mt-2">
                  If you decline non-essential cookies, we will only use
                  essential cookies required for the website to function
                  properly. Analytics and advertising features will be disabled.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Advertising and Interest-Based Advertising
                </h2>
                <p>
                  We may partner with third-party advertising networks and
                  exchanges to display advertising on our website or to manage
                  our advertising on other sites. These partners may use cookies
                  and similar technologies to collect information about your
                  activities on our website and other sites to provide you with
                  targeted advertising based on your browsing activities and
                  interests.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Advertising Partners
                </h3>
                <p>
                  We may work with the following types of advertising partners:
                </p>
                <ul>
                  <li>
                    <strong>Google Ads:</strong> We may use Google Ads to
                    display advertisements. Google may use cookies to serve ads
                    based on your prior visits to our website or other websites.
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> We may use
                    advertising features from platforms like Facebook, Twitter,
                    and LinkedIn to reach potential users.
                  </li>
                  <li>
                    <strong>Retargeting Services:</strong> We may use
                    retargeting services to show you ads on other websites after
                    you have visited our site.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Information Used for Advertising
                </h3>
                <p>
                  Advertising partners may collect and use the following
                  information to deliver targeted advertisements:
                </p>
                <ul>
                  <li>Pages you visit on our website</li>
                  <li>Products or services you view</li>
                  <li>Your approximate geographic location</li>
                  <li>Your device type and browser information</li>
                  <li>Demographic information (age range, gender)</li>
                  <li>Interests inferred from your browsing behavior</li>
                </ul>
                <p className="mt-4">
                  <strong>Important:</strong> We do not sell your personal
                  information to advertisers. Advertising partners receive
                  anonymized or pseudonymized data and are contractually
                  prohibited from using your information for purposes other than
                  providing advertising services to us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Analytics Services
                </h2>
                <p>
                  We use analytics services to help us understand how users
                  interact with our website. These services collect information
                  sent by your browser, including the pages you visit and other
                  information that assists us in improving our website.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Analytics Providers
                </h3>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> We use Google Analytics
                    to collect information about website traffic and usage. This
                    service may collect your IP address, browser type, referring
                    pages, and time spent on pages. For more information, see{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google&apos;s Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Firebase Analytics:</strong> For our mobile
                    applications, we use Firebase Analytics to understand app
                    usage and improve user experience. This service collects
                    information such as app events, user engagement metrics,
                    device information, and approximate location. Firebase
                    Analytics is operated by Google. For more information, see
                    the{" "}
                    <a
                      href="https://firebase.google.com/support/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Firebase Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Vercel Analytics:</strong> We use Vercel Analytics
                    to monitor website performance and visitor metrics in a
                    privacy-focused manner.
                  </li>
                  <li>
                    <strong>Sentry:</strong> We use Sentry to track errors and
                    performance issues to improve website reliability. This may
                    include information about your browser and session when an
                    error occurs.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Authentication and Data Storage Services
                </h2>
                <p>
                  For Volvox products and applications, we use third-party
                  services to provide secure authentication and data storage:
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">Supabase</h3>
                <p>
                  Our applications use Supabase for user authentication and
                  database storage. When you create an account and use our
                  products, the following information is processed and stored
                  through Supabase:
                </p>
                <ul>
                  <li>
                    <strong>Authentication Data:</strong> Email address,
                    encrypted password, and authentication tokens. If you sign
                    in using a third-party provider (such as Google or Apple),
                    we receive basic profile information from that provider.
                  </li>
                  <li>
                    <strong>User Profile Data:</strong> Display name, profile
                    preferences, and account settings you provide.
                  </li>
                  <li>
                    <strong>Application Data:</strong> Content, progress data,
                    and any other information you create within the application.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Timestamps, session
                    information, and device identifiers necessary for app
                    functionality.
                  </li>
                </ul>
                <p className="mt-4">
                  Supabase stores data on secure cloud infrastructure. For more
                  information about how Supabase handles your data, see the{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Supabase Privacy Policy
                  </a>
                  .
                </p>
                <p className="mt-2">
                  You can request deletion of your account and associated data
                  at any time by contacting us or using the account deletion
                  feature within the application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Your Choices and Opt-Out Options
                </h2>
                <p>
                  You have several options for controlling how your information
                  is used for advertising and analytics:
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Cookie Preferences
                </h3>
                <p>
                  Use our cookie consent banner or the &ldquo;Cookie
                  Settings&rdquo; link in the footer to manage your cookie
                  preferences on our website.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Browser Settings
                </h3>
                <p>
                  Most web browsers allow you to control cookies through their
                  settings. You can set your browser to refuse all cookies or to
                  alert you when a cookie is being sent.
                </p>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Opt-Out Tools
                </h3>
                <ul>
                  <li>
                    <strong>Google Ads:</strong> Visit{" "}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Ads Settings
                    </a>{" "}
                    to opt out of personalized advertising.
                  </li>
                  <li>
                    <strong>Network Advertising Initiative:</strong> Visit{" "}
                    <a
                      href="https://optout.networkadvertising.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      NAI Opt-Out
                    </a>{" "}
                    to opt out of interest-based advertising from NAI member
                    companies.
                  </li>
                  <li>
                    <strong>Digital Advertising Alliance:</strong> Visit{" "}
                    <a
                      href="https://optout.aboutads.info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      DAA Opt-Out
                    </a>{" "}
                    to opt out of interest-based advertising from DAA
                    participating companies.
                  </li>
                  <li>
                    <strong>European Users:</strong> Visit{" "}
                    <a
                      href="https://www.youronlinechoices.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Your Online Choices
                    </a>{" "}
                    to manage advertising preferences in the European Union.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-6">
                  Do Not Track
                </h3>
                <p>
                  Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT)
                  feature. While there is no industry standard for DNT, we
                  respect your privacy choices and encourage you to use our
                  cookie consent tools for the most reliable control over
                  tracking on our website.
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
