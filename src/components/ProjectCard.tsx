import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Prisma } from '@prisma/client';

type ProjectWithCount = Prisma.projectsGetPayload<{
  include: {
    _count: {
      select: {
        groups: true;
      };
    };
  };
}>;

interface ProjectCardProps {
  project: ProjectWithCount;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const images = project.images as string[] | null;
  const firstImage = images?.[0] || '/placeholder-property.jpg';

  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
        <div className="relative h-48">
          <Image
            src={firstImage}
            alt={project.name}
            fill
            className="object-cover"
          />
          {project.featured && (
            <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
          {project.status === 'FAST_SELLING' && (
            <span className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Fast Selling
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 mb-4">
            📍 {project.location}, {project.city}
          </p>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-500">Starting from</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(project.priceRangeMin || 0)}
              </div>
            </div>
            {project._count && project._count.groups > 0 && (
              <div className="text-sm text-gray-600">
                {project._count.groups} Active Group{project._count.groups !== 1 && 's'}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            By {project.developer}
          </div>
        </div>
      </div>
    </Link>
  );
}

