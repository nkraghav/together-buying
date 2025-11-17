import { hasPermission } from '@/lib/rbac';
import { UserRole } from '@prisma/client';

describe('Role-Based Access Control', () => {
  describe('BUYER role', () => {
    it('should have read access to projects', () => {
      expect(hasPermission(UserRole.BUYER, 'project:read')).toBe(true);
    });

    it('should be able to join groups', () => {
      expect(hasPermission(UserRole.BUYER, 'group:join')).toBe(true);
    });

    it('should NOT be able to create projects', () => {
      expect(hasPermission(UserRole.BUYER, 'project:create')).toBe(false);
    });

    it('should NOT be able to create groups', () => {
      expect(hasPermission(UserRole.BUYER, 'group:create')).toBe(false);
    });
  });

  describe('ORGANIZER role', () => {
    it('should have all BUYER permissions', () => {
      expect(hasPermission(UserRole.ORGANIZER, 'project:read')).toBe(true);
      expect(hasPermission(UserRole.ORGANIZER, 'group:join')).toBe(true);
    });

    it('should be able to create projects', () => {
      expect(hasPermission(UserRole.ORGANIZER, 'project:create')).toBe(true);
    });

    it('should be able to create and manage groups', () => {
      expect(hasPermission(UserRole.ORGANIZER, 'group:create')).toBe(true);
      expect(hasPermission(UserRole.ORGANIZER, 'group:update')).toBe(true);
    });

    it('should have access to analytics', () => {
      expect(hasPermission(UserRole.ORGANIZER, 'analytics:read')).toBe(true);
    });

    it('should NOT be able to delete users', () => {
      expect(hasPermission(UserRole.ORGANIZER, 'user:delete')).toBe(false);
    });
  });

  describe('PARTNER_ADMIN role', () => {
    it('should have full project management', () => {
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'project:create')).toBe(true);
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'project:update')).toBe(true);
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'project:delete')).toBe(true);
    });

    it('should be able to manage users', () => {
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'user:read')).toBe(true);
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'user:update')).toBe(true);
    });

    it('should be able to manage tenant', () => {
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'tenant:read')).toBe(true);
      expect(hasPermission(UserRole.PARTNER_ADMIN, 'tenant:update')).toBe(true);
    });
  });

  describe('SUPER_ADMIN role', () => {
    it('should have all permissions', () => {
      const allPermissions = [
        'project:read', 'project:create', 'project:update', 'project:delete',
        'group:read', 'group:create', 'group:update', 'group:delete',
        'user:read', 'user:update', 'user:delete',
        'tenant:read', 'tenant:update', 'tenant:delete',
        'analytics:read', 'content:manage'
      ] as const;

      allPermissions.forEach(permission => {
        expect(hasPermission(UserRole.SUPER_ADMIN, permission)).toBe(true);
      });
    });
  });
});

