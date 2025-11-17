import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';

type Permission = 
  | 'project:read'
  | 'project:create'
  | 'project:update'
  | 'project:delete'
  | 'group:read'
  | 'group:create'
  | 'group:update'
  | 'group:delete'
  | 'group:join'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'tenant:read'
  | 'tenant:update'
  | 'tenant:delete'
  | 'analytics:read'
  | 'content:manage';

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.BUYER]: [
    'project:read',
    'group:read',
    'group:join',
  ],
  [UserRole.ORGANIZER]: [
    'project:read',
    'project:create',
    'project:update',
    'group:read',
    'group:create',
    'group:update',
    'group:join',
    'analytics:read',
    'content:manage',
  ],
  [UserRole.PARTNER_ADMIN]: [
    'project:read',
    'project:create',
    'project:update',
    'project:delete',
    'group:read',
    'group:create',
    'group:update',
    'group:delete',
    'user:read',
    'user:update',
    'tenant:read',
    'tenant:update',
    'analytics:read',
    'content:manage',
  ],
  [UserRole.SUPER_ADMIN]: [
    'project:read',
    'project:create',
    'project:update',
    'project:delete',
    'group:read',
    'group:create',
    'group:update',
    'group:delete',
    'user:read',
    'user:update',
    'user:delete',
    'tenant:read',
    'tenant:update',
    'tenant:delete',
    'analytics:read',
    'content:manage',
  ],
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const requirePermission = (session: Session | null, permission: Permission): boolean => {
  if (!session?.user?.role) {
    return false;
  }
  return hasPermission(session.user.role, permission);
};

export const canAccessTenant = (session: Session | null, tenantId: string): boolean => {
  if (!session?.user) return false;
  
  // Super admin can access all tenants
  if (session.user.role === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Others can only access their own tenant
  return session.user.tenantId === tenantId;
};

