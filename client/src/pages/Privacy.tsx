import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-brand-gray py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl text-brand-navy mb-4">PRIVACY POLICY</h1>
          <p className="text-xl text-gray-600">How we protect and use your information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-brand-navy">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> January 15, 2025
            </p>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Information We Collect</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <p>
                  When you make a reservation or contact us, we may collect personal information such as:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Reservation details (party size, date, time, special requests)</li>
                  <li>Dining preferences and dietary restrictions</li>
                </ul>

                <h3 className="font-semibold text-lg mt-6">Website Usage Information</h3>
                <p>
                  We automatically collect certain information about your visit to our website:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and confirm your reservations</li>
                  <li>Communicate with you about your visit</li>
                  <li>Improve our services and website experience</li>
                  <li>Send you promotional offers (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Information Sharing</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To service providers who assist us in operating our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of promotional communications</li>
                  <li>Request a copy of the information we have about you</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our website uses cookies to enhance your browsing experience. You can choose to disable cookies 
                  through your browser settings, though this may affect website functionality.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Children's Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our website is not intended for children under 13. We do not knowingly collect personal information 
                  from children under 13. If we become aware that we have collected such information, we will delete it immediately.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Changes to This Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting 
                  the new policy on this page with an updated effective date.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-anton text-2xl mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-brand-gray p-4 rounded-lg">
                  <p><strong>Supono's Sports Bar</strong></p>
                  <p>123 Stadium Drive</p>
                  <p>Downtown, State 12345</p>
                  <p>Phone: (555) SPORT-BAR</p>
                  <p>Email: privacy@suponos.com</p>
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
