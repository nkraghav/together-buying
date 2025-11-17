import Link from 'next/link';
import Image from 'next/image';
import type { Group, Project } from '@prisma/client';

interface GroupHeaderProps {
  group: Group & {
    project: Pick<Project, 'name' | 'slug' | 'city' | 'location' | 'images' | 'developer'>;
  };
}

export function GroupHeader({ group }: GroupHeaderProps) {
  const images = group.project.images as string[] | null;
  const firstImage = images?.[0] || '/placeholder-property.jpg';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-64">
        <Image
          src={firstImage}
          alt={group.project.name}
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
          href={`/projects/${group.project.slug}`}
          className="text-sm text-blue-600 hover:underline mb-2 block"
        >
          ← Back to {group.project.name}
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{group.project.location}, {group.project.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏗️</span>
            <span>{group.project.developer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

