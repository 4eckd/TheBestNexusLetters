import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - The Best Nexus Letters',
  description: 'Privacy policy for The Best Nexus Letters medical documentation services.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-12 space-y-8 text-base leading-7 text-card-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                request our services, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Medical records and health information</li>
                <li>Military service records</li>
                <li>Payment and billing information</li>
                <li>Communications with our team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide medical nexus letter services</li>
                <li>Process payments and manage your account</li>
                <li>Communicate with you about our services</li>
                <li>Comply with legal obligations</li>
                <li>Improve our services and customer experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. HIPAA Compliance</h2>
              <p className="mb-4">
                As a covered entity under HIPAA, we are committed to protecting your protected health information (PHI). 
                We maintain appropriate safeguards to protect the privacy and security of your health information and 
                only use or disclose it as permitted by HIPAA regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without 
                your consent, except as described in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>With healthcare professionals involved in creating your nexus letter</li>
                <li>As required by law or legal process</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes 
                encryption, secure servers, and access controls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Request corrections to your information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Object to processing of your information</li>
                <li>Request a copy of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-card-foreground">
                  <strong>The Best Nexus Letters</strong><br />
                  Email: privacy@thebestnexusletters.com<br />
                  Phone: (*************<br />
                  Address: 123 Veterans Way, Suite 100, Washington, DC 20001
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
