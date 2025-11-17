import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Header } from '@/components/Header';

async function getPartnerStats(tenantId: string) {
  const [
    totalProjects,
    totalGroups,
    activeGroups,
    totalMembers,
    totalRevenue,
    recentGroups,
  ] = await Promise.all([
    prisma.project.count({ where: { tenantId, isActive: true } }),
    prisma.group.count({ where: { tenantId } }),
    prisma.group.count({ where: { tenantId, status: { in: ['OPEN', 'NEGOTIATING'] } } }),
    prisma.groupMember.count({
      where: {
        group: { tenantId },
      },
    }),
    prisma.transaction.aggregate({
      where: { tenantId, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.group.findMany({
      where: { tenantId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { name: true },
        },
        _count: {
          select: { members: true },
        },
      },
    }),
  ]);

  return {
    totalProjects,
    totalGroups,
    activeGroups,
    totalMembers,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentGroups,
  };
}

export default async function PartnerDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Check if user has organizer or higher privileges
  if (!['ORGANIZER', 'PARTNER_ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  const stats = await getPartnerStats(session.user.tenantId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your projects and groups</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Projects</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatNumber(stats.totalProjects)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Active Groups</div>
            <div className="text-3xl font-bold text-blue-600">
              {formatNumber(stats.activeGroups)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Members</div>
            <div className="text-3xl font-bold text-green-600">
              {formatNumber(stats.totalMembers)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(stats.totalRevenue / 100)}
            </div>
          </div>
        </div>

        {/* Recent Groups */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Groups</h2>
          
          {stats.recentGroups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Group Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Members
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{group.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {group.project.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {group.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {group._count.members}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/groups/${group.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No groups yet. Create your first group to get started.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/partner/projects/new"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition text-center"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-semibold">Add New Project</div>
          </a>

          <a
            href="/partner/groups/new"
            className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold">Create Group</div>
          </a>

          <a
            href="/partner/analytics"
            className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">View Analytics</div>
          </a>
        </div>
      </div>
    </div>
  );
}

