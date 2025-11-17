import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GroupHeader } from '@/components/GroupHeader';
import { GroupMembers } from '@/components/GroupMembers';
import { GroupTimeline } from '@/components/GroupTimeline';
import { JoinGroupButton } from '@/components/JoinGroupButton';
import { formatCurrency, formatDate } from '@/lib/utils';

async function getGroup(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          name: true,
          slug: true,
          city: true,
          location: true,
          images: true,
          developer: true,
        },
      },
      createdBy: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
      offers: {
        orderBy: { createdAt: 'desc' },
      },
      milestones: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!group) {
    notFound();
  }

  return group;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const group = await getGroup(params.id);
  
  return {
    title: `${group.name} - GroupBuy SaaS`,
    description: group.description || `Join the ${group.name} group and save on your dream property`,
  };
}

export default async function GroupPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const group = await getGroup(params.id);

  const isMember = session?.user?.id 
    ? group.members.some(m => m.userId === session.user.id)
    : false;

  const latestOffer = group.offers[0];
  const progressPercentage = (group.currentBuyersCount / group.targetBuyersCount) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <GroupHeader group={group} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Group</h2>
              <p className="text-gray-600">{group.description}</p>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{group.currentBuyersCount} joined</span>
                  <span>{group.targetBuyersCount} target</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              {group.negotiatedDiscount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="font-semibold text-green-900">
                        {group.negotiatedDiscount}% Discount Secured!
                      </div>
                      <div className="text-sm text-green-700">
                        The group has successfully negotiated a discount
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline</h2>
              <GroupTimeline milestones={group.milestones} />
            </div>

            {/* Members */}
            {isMember && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Members</h2>
                <GroupMembers members={group.members} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Group Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium capitalize">{group.status.toLowerCase().replace('_', ' ')}</div>
                </div>
                
                {group.deadline && (
                  <div>
                    <div className="text-sm text-gray-500">Deadline</div>
                    <div className="font-medium">{formatDate(group.deadline)}</div>
                  </div>
                )}
                
                {group.commitmentAmount && (
                  <div>
                    <div className="text-sm text-gray-500">Commitment Amount</div>
                    <div className="font-medium">{formatCurrency(group.commitmentAmount)}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-gray-500">Organizer</div>
                  <div className="font-medium">{group.createdBy.name}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            {!isMember && group.status === 'OPEN' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Join This Group</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Join {group.currentBuyersCount} other buyers to unlock exclusive discounts
                </p>
                <JoinGroupButton groupId={group.id} />
              </div>
            )}

            {isMember && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-semibold text-gray-900">You're a Member</h3>
                </div>
                <p className="text-sm text-gray-600">
                  You'll receive updates about this group's progress
                </p>
              </div>
            )}

            {/* Latest Offer */}
            {latestOffer && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Latest Offer</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Discount</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {latestOffer.discountPercent}%
                    </div>
                  </div>
                  {latestOffer.notes && (
                    <div>
                      <div className="text-sm text-gray-500">Notes</div>
                      <div className="text-sm text-gray-700">{latestOffer.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

