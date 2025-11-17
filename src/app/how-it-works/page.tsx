import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How It Works - GroupBuy SaaS',
  description: 'Learn how group buying works and start saving on your dream property',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Browse Projects',
      description: 'Explore verified real estate projects across India with detailed information, amenities, and pricing.',
      icon: '🔍',
    },
    {
      number: '02',
      title: 'Join a Group',
      description: 'Find or create a purchase group for your desired project. Connect with like-minded buyers.',
      icon: '👥',
    },
    {
      number: '03',
      title: 'Collective Negotiation',
      description: 'Once the group reaches target size, our team negotiates with developers on your behalf for bulk discounts.',
      icon: '💼',
    },
    {
      number: '04',
      title: 'Secure Payment',
      description: 'Make your commitment payment securely through Stripe. Funds are held in escrow until deal finalization.',
      icon: '🔒',
    },
    {
      number: '05',
      title: 'Get Best Price',
      description: 'Enjoy exclusive discounts and special terms that individual buyers cannot access.',
      icon: '💰',
    },
    {
      number: '06',
      title: 'Complete Purchase',
      description: 'Finalize your purchase individually with the developer at the negotiated group price.',
      icon: '✅',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How Group Buying Works
          </h1>
          <p className="text-xl text-gray-700">
            Join forces with other buyers to negotiate better prices. Here's how it works.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-700 mb-6">
            Browse available projects and join a group today
          </p>
          <Link 
            href="/projects" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Projects
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is my money safe?
              </h3>
              <p className="text-gray-600">
                Yes! All payments are processed through Stripe and held in escrow until the deal is finalized. 
                If the deal doesn't go through, you receive a full refund.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How much can I save?
              </h3>
              <p className="text-gray-600">
                Savings vary by project and group size, but typically range from 3% to 10% off the regular price. 
                Some groups have saved up to ₹2-5 lakhs per unit.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I leave a group after joining?
              </h3>
              <p className="text-gray-600">
                Yes, you can leave before making any payment commitment. Once payment is made, withdrawal is subject 
                to group terms and may include a processing fee.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Are the projects verified?
              </h3>
              <p className="text-gray-600">
                Absolutely! All projects are verified with proper RERA registration, legal clearances, and 
                due diligence. We only list projects from reputable developers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

