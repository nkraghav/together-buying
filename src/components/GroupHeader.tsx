import Link from 'next/link';
import Image from 'next/image';
import type { Prisma } from '@prisma/client';

type GroupWithProject = Prisma.groupsGetPayload<{
  include: {
    projects: {
      select: {
        name: true;
        slug: true;
        city: true;
        location: true;
        images: true;
        developer: true;
      };
    };
  };
}>;

interface GroupHeaderProps {
  group: GroupWithProject;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  const images = group.projects.images as string[] | null;
  const firstImage = images?.[0] || '/placeholder-property.jpg';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-64">
        <Image
          src={firstImage}
          alt={group.projects.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
            {group.status.toLowerCase().replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="p-6">
        <Link 
          href={`/projects/${group.projects.slug}`}
          className="text-sm text-blue-600 hover:underline mb-2 block"
        >
          ← Back to {group.projects.name}
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{group.projects.location}, {group.projects.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏗️</span>
            <span>{group.projects.developer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

