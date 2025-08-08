import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - The Best Nexus Letters',
  description: 'Terms of service for The Best Nexus Letters medical documentation services.',
};

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-12 space-y-8 text-base leading-7 text-card-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using our services, you accept and agree to be bound by the terms 
                and provision of this agreement. These terms apply to all users of our nexus letter services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Services Provided</h2>
              <p className="mb-4">
                The Best Nexus Letters provides medical nexus letter services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Medical consultation and case review</li>
                <li>Professional nexus letter creation by licensed healthcare providers</li>
                <li>Document review and revision services</li>
                <li>Medical expert opinions for VA disability claims</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Medical Disclaimer</h2>
              <p className="mb-4 text-muted-foreground">
                Our services are for informational and documentation purposes only. We do not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide medical treatment or diagnosis</li>
                <li>Guarantee approval of VA disability claims</li>
                <li>Offer legal advice regarding VA claims</li>
                <li>Replace the need for ongoing medical care</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Payment Terms</h2>
              <p className="mb-4">
                Payment terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Payment is required before service delivery</li>
                <li>All prices are subject to change with notice</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Additional charges may apply for expedited services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Confidentiality</h2>
              <p className="text-muted-foreground">
                We maintain strict confidentiality of all personal and medical information in accordance 
                with HIPAA regulations and professional medical standards. Your information will only be 
                shared with healthcare professionals involved in your case and as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Our liability is limited to the amount paid for services. We are not responsible for 
                VA claim outcomes, delays in the VA process, or consequential damages arising from 
                use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Professional Standards</h2>
              <p className="mb-4">
                All medical professionals involved in our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Are licensed healthcare providers</li>
                <li>Follow applicable medical ethics and standards</li>
                <li>Provide opinions based on medical evidence</li>
                <li>Maintain professional liability insurance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. User Responsibilities</h2>
              <p className="mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Submit all relevant medical records</li>
                <li>Respond promptly to requests for additional information</li>
                <li>Use our services legally and ethically</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifications</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting on our website. Continued use of our services constitutes 
                acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-card-foreground">
                  <strong>The Best Nexus Letters</strong><br />
                  Email: legal@thebestnexusletters.com<br />
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
