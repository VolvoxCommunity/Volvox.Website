"use client";

import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

/**
 * Renders the Terms of Service page with an animated background, top navigation, and footer.
 *
 * Navigation links navigate to the home page when the "home" section is selected or to the home page with a hash fragment for other sections.
 *
 * @returns The Terms of Service React element
 */
export function TermsClient() {
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
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation onNavigate={handleNavigate} currentSection="terms" />

        <main className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

              <p className="text-muted-foreground mb-8">
                Last updated: 12/03/2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Agreement to Terms
                </h2>
                <p>
                  By accessing or using Volvox&apos;s website and services, you
                  agree to be bound by these Terms of Service and all applicable
                  laws and regulations. If you do not agree with any of these
                  terms, you are prohibited from using or accessing our
                  services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                <p>
                  Permission is granted to temporarily access and use Volvox
                  services for personal, non-commercial transitory viewing only.
                  This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul>
                  <li>Modify or copy our materials</li>
                  <li>
                    Use the materials for any commercial purpose or public
                    display
                  </li>
                  <li>
                    Attempt to decompile or reverse engineer any software
                    contained on our website
                  </li>
                  <li>
                    Remove any copyright or other proprietary notations from the
                    materials
                  </li>
                  <li>
                    Transfer the materials to another person or
                    &ldquo;mirror&rdquo; the materials on any other server
                  </li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any
                  of these restrictions and may be terminated by Volvox at any
                  time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  User Responsibilities
                </h2>
                <p>When using our services, you agree to:</p>
                <ul>
                  <li>
                    Provide accurate and complete information when creating an
                    account
                  </li>
                  <li>
                    Maintain the security and confidentiality of your account
                    credentials
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                  <li>
                    Use our services only for lawful purposes and in accordance
                    with these Terms
                  </li>
                  <li>
                    Respect the intellectual property rights of Volvox and third
                    parties
                  </li>
                  <li>
                    Not engage in any activity that interferes with or disrupts
                    our services
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Mentorship Program Terms
                </h2>
                <p>
                  If you participate in our mentorship programs, you
                  additionally agree to:
                </p>
                <ul>
                  <li>
                    Treat all participants with respect and professionalism
                  </li>
                  <li>
                    Maintain confidentiality of information shared during
                    mentorship sessions
                  </li>
                  <li>
                    Attend scheduled sessions or provide reasonable notice for
                    cancellations
                  </li>
                  <li>Provide constructive feedback when requested</li>
                  <li>
                    Not use the program for solicitation or commercial purposes
                    without permission
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Intellectual Property
                </h2>
                <p>
                  The content, features, and functionality of our services,
                  including but not limited to text, graphics, logos, icons,
                  images, audio clips, video clips, data compilations, and
                  software, are the exclusive property of Volvox and are
                  protected by United States and international copyright,
                  trademark, patent, trade secret, and other intellectual
                  property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  User-Generated Content
                </h2>
                <p>
                  If you submit, post, or display content on or through our
                  services:
                </p>
                <ul>
                  <li>You retain ownership of your content</li>
                  <li>
                    You grant Volvox a non-exclusive, worldwide, royalty-free
                    license to use, reproduce, modify, and display your content
                    in connection with our services
                  </li>
                  <li>
                    You represent that you have the right to grant such license
                  </li>
                  <li>
                    You agree not to submit content that is unlawful, harmful,
                    threatening, abusive, defamatory, or otherwise objectionable
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                <p>
                  Our services are provided on an &ldquo;as is&rdquo; and
                  &ldquo;as available&rdquo; basis. Volvox makes no warranties,
                  expressed or implied, and hereby disclaims and negates all
                  other warranties including, without limitation, implied
                  warranties or conditions of merchantability, fitness for a
                  particular purpose, or non-infringement of intellectual
                  property or other violation of rights.
                </p>
                <p>
                  Volvox does not warrant that our services will be
                  uninterrupted, timely, secure, or error-free, or that any
                  defects will be corrected.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Limitation of Liability
                </h2>
                <p>
                  In no event shall Volvox, its directors, employees, partners,
                  agents, suppliers, or affiliates be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>
                    Your access to or use of or inability to access or use our
                    services
                  </li>
                  <li>
                    Any conduct or content of any third party on our services
                  </li>
                  <li>Any content obtained from our services</li>
                  <li>
                    Unauthorized access, use, or alteration of your
                    transmissions or content
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Volvox and
                  its licensors, employees, contractors, agents, officers, and
                  directors from and against any and all claims, damages,
                  obligations, losses, liabilities, costs, or debt arising from
                  your use of and access to our services, or your violation of
                  these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                <p>
                  We may terminate or suspend your access to our services
                  immediately, without prior notice or liability, for any reason
                  whatsoever, including without limitation if you breach these
                  Terms. Upon termination, your right to use our services will
                  immediately cease.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of the United States, without regard to its conflict
                  of law provisions. Our failure to enforce any right or
                  provision of these Terms will not be considered a waiver of
                  those rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify or replace these Terms at any
                  time at our sole discretion. If a revision is material, we
                  will provide at least 30 days notice prior to any new terms
                  taking effect. What constitutes a material change will be
                  determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our services after those
                  revisions become effective, you agree to be bound by the
                  revised terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <p className="mt-4">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@volvox.dev"
                    className="text-primary hover:underline"
                  >
                    legal@volvox.dev
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
