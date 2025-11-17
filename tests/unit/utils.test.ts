import { formatCurrency, formatNumber, calculateEMI, slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format INR currency correctly', () => {
      expect(formatCurrency(1000000)).toBe('₹10,00,000');
      expect(formatCurrency(5000)).toBe('₹5,000');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with Indian numbering system', () => {
      expect(formatNumber(100000)).toBe('1,00,000');
      expect(formatNumber(1000)).toBe('1,000');
    });
  });

  describe('calculateEMI', () => {
    it('should calculate EMI correctly', () => {
      const principal = 5000000;
      const rate = 8.5;
      const tenure = 240; // 20 years

      const emi = calculateEMI(principal, rate, tenure);
      expect(emi).toBeGreaterThan(0);
      expect(emi).toBeLessThan(principal);
    });

    it('should handle zero interest rate', () => {
      const emi = calculateEMI(1000000, 0, 12);
      expect(emi).toBe(Math.round(1000000 / 12));
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Skyline Towers Mumbai')).toBe('skyline-towers-mumbai');
    });

    it('should remove special characters', () => {
      expect(slugify('Project @ Location!')).toBe('project-location');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });
});

