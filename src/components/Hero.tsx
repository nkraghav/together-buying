import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface HeroProps {
  stats: {
    projects: number;
    activeGroups: number;
    totalSavings: number;
  };
}

export function Hero({ stats }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Buy Your Dream Home<br />
            <span className="text-blue-600">Together. Save More.</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join collective purchase groups and negotiate bulk discounts on premium real estate projects. 
            The power of many, the benefit for all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/projects" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Explore Projects
            </Link>
            <Link 
              href="/how-it-works" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border border-blue-200"
            >
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatNumber(stats.projects)}+
              </div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatNumber(stats.activeGroups)}+
              </div>
              <div className="text-gray-600">Active Groups</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatCurrency(stats.totalSavings / 100)}
              </div>
              <div className="text-gray-600">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

