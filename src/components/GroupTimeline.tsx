import { formatDate } from '@/lib/utils';
import type { GroupMilestone } from '@prisma/client';

interface GroupTimelineProps {
  milestones: GroupMilestone[];
}

export function GroupTimeline({ milestones }: GroupTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No milestones yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {index + 1}
            </div>
            {index < milestones.length - 1 && (
              <div className="w-0.5 h-full bg-blue-200 mt-2" />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-1">
                {milestone.title}
              </div>
              {milestone.description && (
                <div className="text-gray-600 mb-2">
                  {milestone.description}
                </div>
              )}
              <div className="text-sm text-gray-500">
                {formatDate(milestone.createdAt)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

