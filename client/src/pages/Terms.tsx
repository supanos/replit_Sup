import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-gray py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl text-brand-navy mb-4">TERMS OF SERVICE</h1>
          <p className="text-xl text-gray-600">Terms and conditions for using our services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-brand-navy">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> January 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing and using the Supono's Sports Bar website and services, you accept and agree to be bound 
                  by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Reservation Policy</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">Making Reservations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reservations are subject to availability and confirmation</li>
                  <li>We reserve the right to refuse service to anyone</li>
                  <li>Large party reservations (10+ people) require special arrangements</li>
                  <li>Reservations may be held for 15 minutes past the scheduled time</li>
                </ul>

                <h3 className="font-semibold text-lg mt-6">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cancellations must be made at least 2 hours in advance</li>
                  <li>No-shows may result in restrictions on future reservations</li>
                  <li>Group events may have different cancellation requirements</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Establishment Rules</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">General Conduct</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Guests must be 21+ after 9 PM on weekends</li>
                  <li>Proper attire required - no tank tops or flip-flops</li>
                  <li>Disruptive behavior will result in removal from premises</li>
                  <li>Management reserves the right to refuse service</li>
                </ul>

                <h3 className="font-semibold text-lg mt-6">Alcohol Service</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Valid ID required for all alcoholic beverage purchases</li>
                  <li>We reserve the right to refuse alcohol service</li>
                  <li>Last call is 30 minutes before closing</li>
                  <li>No outside alcohol permitted</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Website Use</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">Permitted Use</h3>
                <p>
                  You may use our website for legitimate business purposes related to making reservations, 
                  viewing our menu, and learning about our services.
                </p>

                <h3 className="font-semibold text-lg mt-6">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Attempting to disrupt or harm our website or servers</li>
                  <li>Using automated systems to make multiple reservations</li>
                  <li>Impersonating others or providing false information</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Liability and Disclaimers</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">Limitation of Liability</h3>
                <p>
                  Supono's Sports Bar shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of our services or website.
                </p>

                <h3 className="font-semibold text-lg mt-6">Food Allergies</h3>
                <p>
                  While we make every effort to accommodate dietary restrictions, we cannot guarantee that our food 
                  is free from allergens. Please inform your server of any allergies or dietary concerns.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, 
                  to understand our practices.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  All content on this website, including text, graphics, logos, and images, is the property of Supono's Sports Bar 
                  and protected by copyright and trademark laws.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                  Your continued use of our services constitutes acceptance of any changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-brand-gray p-4 rounded-lg">
                  <p><strong>Supono's Sports Bar</strong></p>
                  <p>123 Stadium Drive</p>
                  <p>Downtown, State 12345</p>
                  <p>Phone: (555) SPORT-BAR</p>
                  <p>Email: legal@suponos.com</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link href="/">
              <button className="bg-brand-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors" data-testid="back-home-button">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
