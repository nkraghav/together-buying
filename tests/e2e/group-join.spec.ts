import { test, expect } from '@playwright/test';

test.describe('Group Join Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/');
  });

  test('should display home page with projects', async ({ page }) => {
    await expect(page).toHaveTitle(/GroupBuy SaaS/);
    await expect(page.getByRole('heading', { name: /Buy Your Dream Home/i })).toBeVisible();
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.getByRole('link', { name: /Browse Projects/i }).first().click();
    await expect(page).toHaveURL('/projects');
    await expect(page.getByRole('heading', { name: /Browse Projects/i })).toBeVisible();
  });

  test('should filter projects by city', async ({ page }) => {
    await page.goto('/projects');
    
    // Select a city from dropdown
    await page.selectOption('select', { label: 'Mumbai' });
    
    // Wait for the page to update
    await page.waitForURL(/city=Mumbai/);
    
    // Verify filtered results
    await expect(page.getByText(/Mumbai/i)).toBeVisible();
  });

  test('should view project details', async ({ page }) => {
    await page.goto('/projects');
    
    // Click on the first project card
    await page.getByRole('link').first().click();
    
    // Verify we're on a project detail page
    await expect(page.url()).toContain('/projects/');
  });

  test('should require authentication to join group', async ({ page }) => {
    // Navigate to a project with an active group
    await page.goto('/projects');
    const firstProject = page.getByRole('link').first();
    await firstProject.click();
    
    // Try to join a group
    const joinButton = page.getByRole('button', { name: /Join Group/i });
    if (await joinButton.isVisible()) {
      await joinButton.click();
      
      // Should redirect to sign in
      await expect(page).toHaveURL(/auth\/signin/);
    }
  });

  test('authenticated user can join group', async ({ page }) => {
    // Sign in first
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'buyer1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Navigate to projects and join a group
    await page.goto('/projects');
    const firstProject = page.getByRole('link').first();
    await firstProject.click();
    
    // Join group if available
    const joinButton = page.getByRole('button', { name: /Join Group/i });
    if (await joinButton.isVisible()) {
      await joinButton.click();
      
      // Verify success message or redirect
      await expect(page.getByText(/Successfully joined/i)).toBeVisible({
        timeout: 10000
      });
    }
  });
});

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as a buyer
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'buyer1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
  });

  test('should display payment form for group commitment', async ({ page }) => {
    // Navigate to a group that requires payment
    await page.goto('/groups');
    
    const groupCard = page.getByRole('link').first();
    await groupCard.click();
    
    // Click on make payment button
    const payButton = page.getByRole('button', { name: /Make Payment|Commit/i });
    if (await payButton.isVisible()) {
      await payButton.click();
      
      // Verify payment form is displayed
      await expect(page.getByText(/Payment/i)).toBeVisible();
    }
  });

  test('should handle payment cancellation', async ({ page }) => {
    await page.goto('/groups');
    
    const groupCard = page.getByRole('link').first();
    await groupCard.click();
    
    const payButton = page.getByRole('button', { name: /Make Payment|Commit/i });
    if (await payButton.isVisible()) {
      await payButton.click();
      
      // Cancel payment
      const cancelButton = page.getByRole('button', { name: /Cancel/i });
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Should return to group page
        await expect(page.url()).toContain('/groups/');
      }
    }
  });
});

