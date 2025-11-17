import Image from 'next/image';
import { formatRelativeTime } from '@/lib/utils';
import type { GroupMember, User } from '@prisma/client';

interface GroupMembersProps {
  members: (GroupMember & {
    user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  })[];
}

export function GroupMembers({ members }: GroupMembersProps) {
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {member.user.image ? (
              <Image
                src={member.user.image}
                alt={member.user.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                {member.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="font-medium text-gray-900">{member.user.name}</div>
            <div className="text-sm text-gray-500">
              Joined {formatRelativeTime(member.joinedAt)}
            </div>
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              member.commitmentStatus === 'PAID' 
                ? 'bg-green-100 text-green-700'
                : member.commitmentStatus === 'COMMITTED'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {member.commitmentStatus.toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

