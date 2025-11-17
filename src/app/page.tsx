import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/ProjectCard';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProjects() {
  return await prisma.projects.findMany({
    where: {
      isActive: true,
      featured: true,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { groups: true },
      },
    },
  });
}

async function getStats() {
  const [projectCount, activeGroupsCount, totalSavings] = await Promise.all([
    prisma.projects.count({ where: { isActive: true } }),
    prisma.groups.count({ where: { status: { in: ['OPEN', 'NEGOTIATING'] } } }),
    prisma.transactions.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ]);

  return {
    projects: projectCount,
    activeGroups: activeGroupsCount,
    totalSavings: totalSavings._sum.amount || 0,
  };
}

export default async function HomePage() {
  const [featuredProjects, stats] = await Promise.all([
    getFeaturedProjects(),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero stats={stats} />
      
      {/* Featured Projects */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
            <p className="text-gray-600 mt-2">Explore our top real estate opportunities</p>
          </div>
          <Link 
            href="/projects" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <Features />
      
      {/* CTA Section */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Save on Your Dream Property?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of buyers who have already saved crores through group buying
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/projects" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Projects
            </Link>
            <Link 
              href="/how-it-works" 
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition border border-blue-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
