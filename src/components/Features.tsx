export function Features() {
  const features = [
    {
      title: 'Collective Bargaining Power',
      description: 'Join forces with other buyers to negotiate better prices and terms with developers.',
      icon: '👥',
    },
    {
      title: 'Verified Projects',
      description: 'All projects are verified with proper RERA registration and legal documentation.',
      icon: '✓',
    },
    {
      title: 'Secure Payments',
      description: 'Your payments are held securely in escrow until the deal is finalized.',
      icon: '🔒',
    },
    {
      title: 'Transparent Process',
      description: 'Track negotiation progress in real-time with full transparency at every step.',
      icon: '📊',
    },
    {
      title: 'Expert Support',
      description: 'Dedicated relationship managers guide you through the entire process.',
      icon: '🤝',
    },
    {
      title: 'Best Price Guarantee',
      description: 'Get the best possible price through collective negotiation power.',
      icon: '💰',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GroupBuy?</h2>
          <p className="text-xl text-gray-600">
            The smart way to buy real estate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

