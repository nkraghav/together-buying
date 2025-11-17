import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilters } from '@/components/ProjectFilters';

interface SearchParams {
  city?: string;
  status?: string;
  search?: string;
  page?: string;
}

async function getProjects(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;

  const where: any = {
    isActive: true,
  };

  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { developer: { contains: searchParams.search, mode: 'insensitive' } },
      { location: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.projects.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { groups: true },
        },
      },
    }),
    prisma.projects.count({ where }),
  ]);

  return { projects, total, page, limit };
}

async function getCities() {
  const projects = await prisma.projects.findMany({
    where: { isActive: true },
    select: { city: true },
    distinct: ['city'],
  });

  return projects.map(p => p.city).sort();
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ projects, total, page, limit }, cities] = await Promise.all([
    getProjects(searchParams),
    getCities(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Projects
          </h1>
          <p className="text-gray-600">
            Discover premium real estate projects across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="bg-white p-6 rounded-lg shadow-sm">Loading filters...</div>}>
              <ProjectFilters cities={cities} />
            </Suspense>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-4 text-gray-600">
              Found {total} project{total !== 1 && 's'}
            </div>

            {projects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <a
                        key={pageNum}
                        href={`/projects?${new URLSearchParams({
                          ...searchParams,
                          page: pageNum.toString(),
                        })}`}
                        className={`px-4 py-2 rounded ${
                          pageNum === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found</p>
                <a href="/projects" className="text-blue-600 hover:underline mt-2 inline-block">
                  Clear filters
                </a>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

