import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Header } from '@/components/Header';

async function getPlatformStats() {
  const [
    totalTenants,
    totalUsers,
    totalProjects,
    totalGroups,
    platformRevenue,
    recentTenants,
  ] = await Promise.all([
    prisma.tenants.count({ where: { isActive: true } }),
    prisma.users.count({ where: { isActive: true } }),
    prisma.projects.count({ where: { isActive: true } }),
    prisma.groups.count(),
    prisma.transactions.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.tenants.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
            groups: true,
          },
        },
      },
    }),
  ]);

  return {
    totalTenants,
    totalUsers,
    totalProjects,
    totalGroups,
    platformRevenue: platformRevenue._sum.amount || 0,
    recentTenants,
  };
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Only super admins can access
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const stats = await getPlatformStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform-wide statistics and management</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Tenants</div>
            <div className="text-3xl font-bold text-blue-600">
              {formatNumber(stats.totalTenants)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Users</div>
            <div className="text-3xl font-bold text-green-600">
              {formatNumber(stats.totalUsers)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Projects</div>
            <div className="text-3xl font-bold text-purple-600">
              {formatNumber(stats.totalProjects)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Total Groups</div>
            <div className="text-3xl font-bold text-orange-600">
              {formatNumber(stats.totalGroups)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-2">Platform Revenue</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.platformRevenue / 100)}
            </div>
          </div>
        </div>

        {/* Recent Tenants */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tenants</h2>
          
          {stats.recentTenants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Users
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Projects
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Groups
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {tenant.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm capitalize">
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tenant._count.users}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tenant._count.projects}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tenant._count.groups}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          tenant.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tenant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/admin/tenants/${tenant.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Manage
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tenants yet.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <a
            href="/admin/tenants/new"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition text-center"
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="font-semibold">Add Tenant</div>
          </a>

          <a
            href="/admin/users"
            className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold">Manage Users</div>
          </a>

          <a
            href="/admin/analytics"
            className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">Analytics</div>
          </a>

          <a
            href="/admin/settings"
            className="bg-gray-600 text-white rounded-lg p-6 hover:bg-gray-700 transition text-center"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold">Settings</div>
          </a>
        </div>
      </div>
    </div>
  );
}

