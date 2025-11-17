import { PrismaClient, UserRole, ProjectStatus, GroupStatus, KYCStatus } from '@prisma/client';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Tenants
  const tenant1 = await prisma.tenants.upsert({
    where: { slug: 'realestate-marketplace' },
    update: {},
    create: {
      id: randomUUID(),
      name: 'RealEstate Marketplace',
      slug: 'realestate-marketplace',
      plan: 'professional',
      billingEmail: 'billing@realestate-marketplace.com',
      settings: {
        theme: 'light',
        features: ['groups', 'analytics', 'api_access'],
      },
      updatedAt: new Date(),
    },
  });

  const tenant2 = await prisma.tenants.upsert({
    where: { slug: 'property-partners' },
    update: {},
    create: {
      id: randomUUID(),
      name: 'Property Partners',
      slug: 'property-partners',
      plan: 'starter',
      billingEmail: 'billing@property-partners.com',
      settings: {
        theme: 'light',
        features: ['groups'],
      },
      updatedAt: new Date(),
    },
  });

  console.log('✅ Tenants created');

  // Create Users
  const hashedPassword = await hash('password123', 10);

  const admin1 = await prisma.users.upsert({
    where: { email: 'admin@realestate-marketplace.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'admin@realestate-marketplace.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.PARTNER_ADMIN,
      tenantId: tenant1.id,
      kycStatus: KYCStatus.APPROVED,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  const organizer1 = await prisma.users.upsert({
    where: { email: 'organizer@realestate-marketplace.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'organizer@realestate-marketplace.com',
      name: 'Group Organizer',
      password: hashedPassword,
      role: UserRole.ORGANIZER,
      tenantId: tenant1.id,
      kycStatus: KYCStatus.APPROVED,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  const buyer1 = await prisma.users.upsert({
    where: { email: 'buyer1@example.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'buyer1@example.com',
      name: 'Amit Kumar',
      password: hashedPassword,
      role: UserRole.BUYER,
      tenantId: tenant1.id,
      kycStatus: KYCStatus.APPROVED,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  const buyer2 = await prisma.users.upsert({
    where: { email: 'buyer2@example.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'buyer2@example.com',
      name: 'Priya Sharma',
      password: hashedPassword,
      role: UserRole.BUYER,
      tenantId: tenant1.id,
      kycStatus: KYCStatus.IN_PROGRESS,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  const admin2 = await prisma.users.upsert({
    where: { email: 'admin@property-partners.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'admin@property-partners.com',
      name: 'Partner Admin',
      password: hashedPassword,
      role: UserRole.PARTNER_ADMIN,
      tenantId: tenant2.id,
      kycStatus: KYCStatus.APPROVED,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Users created');

  // Create Projects for Tenant 1
  const project1 = await prisma.projects.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      name: 'Skyline Towers',
      slug: 'skyline-towers-mumbai',
      description: 'Luxury high-rise apartments in the heart of Mumbai with stunning city views. Premium amenities include infinity pool, gym, spa, and concierge services.',
      developer: 'Skyline Constructions Ltd',
      city: 'Mumbai',
      location: 'Bandra West',
      latitude: 19.0596,
      longitude: 72.8295,
      address: 'Plot No. 42, Bandra West, Mumbai 400050',
      priceRangeMin: 12000000,
      priceRangeMax: 35000000,
      totalUnits: 150,
      availableUnits: 45,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      ],
      amenities: ['Swimming Pool', 'Gym', 'Spa', 'Parking', 'Security', 'Garden'],
      specifications: {
        possession: '2026',
        rera: 'P51900012345',
        floors: 40,
      },
      status: ProjectStatus.ACTIVE,
      featured: true,
      launchDate: new Date('2024-01-15'),
      updatedAt: new Date(),
    },
  });

  const project2 = await prisma.projects.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      name: 'Green Valley Villas',
      slug: 'green-valley-villas-bangalore',
      description: 'Eco-friendly villas in a gated community with lush greenery. Perfect for families looking for spacious homes.',
      developer: 'Green Valley Developers',
      city: 'Bangalore',
      location: 'Whitefield',
      latitude: 12.9698,
      longitude: 77.7499,
      address: 'ITPL Main Road, Whitefield, Bangalore 560066',
      priceRangeMin: 8500000,
      priceRangeMax: 15000000,
      totalUnits: 80,
      availableUnits: 25,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      ],
      amenities: ['Clubhouse', 'Park', 'Jogging Track', 'Kids Play Area', 'Security'],
      specifications: {
        possession: '2025',
        rera: 'PRM/KA/RERA/1251/309/PR/171123/003526',
        plotSizes: '2400-4000 sq ft',
      },
      status: ProjectStatus.FAST_SELLING,
      featured: true,
      launchDate: new Date('2023-08-01'),
      updatedAt: new Date(),
    },
  });

  const project3 = await prisma.projects.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      name: 'Urban Edge Apartments',
      slug: 'urban-edge-apartments-pune',
      description: 'Modern apartments designed for urban professionals. Close to IT parks and excellent connectivity.',
      developer: 'Urban Developers Pvt Ltd',
      city: 'Pune',
      location: 'Hinjewadi',
      latitude: 18.5912,
      longitude: 73.7389,
      address: 'Phase 2, Hinjewadi, Pune 411057',
      priceRangeMin: 5500000,
      priceRangeMax: 9500000,
      totalUnits: 200,
      availableUnits: 80,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      ],
      amenities: ['Gym', 'Library', 'Coworking Space', 'Parking', 'Security'],
      specifications: {
        possession: '2025',
        rera: 'P52100012345',
        floors: 15,
      },
      status: ProjectStatus.ACTIVE,
      featured: false,
      launchDate: new Date('2024-03-01'),
      updatedAt: new Date(),
    },
  });

  const project4 = await prisma.projects.create({
    data: {
      id: randomUUID(),
      tenantId: tenant2.id,
      name: 'Seaside Residency',
      slug: 'seaside-residency-goa',
      description: 'Beachfront apartments with panoramic ocean views. Perfect vacation home or retirement property.',
      developer: 'Coastal Properties Ltd',
      city: 'Goa',
      location: 'Candolim',
      latitude: 15.5170,
      longitude: 73.7610,
      address: 'Fort Aguada Road, Candolim, Goa 403515',
      priceRangeMin: 15000000,
      priceRangeMax: 40000000,
      totalUnits: 60,
      availableUnits: 20,
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
      ],
      amenities: ['Beach Access', 'Pool', 'Restaurant', 'Spa', 'Concierge'],
      specifications: {
        possession: '2026',
        rera: 'PRGO05240073',
        floors: 8,
      },
      status: ProjectStatus.PRE_LAUNCH,
      featured: true,
      launchDate: new Date('2024-12-01'),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Projects created');

  // Create Inventory Units
  await prisma.inventoryUnit.createMany({
    data: [
      // Skyline Towers units
      { projectId: project1.id, unitType: '2BHK', floor: 15, carpetArea: 1200, builtUpArea: 1600, price: 15000000, availability: 'AVAILABLE' },
      { projectId: project1.id, unitType: '3BHK', floor: 20, carpetArea: 1800, builtUpArea: 2400, price: 25000000, availability: 'AVAILABLE' },
      { projectId: project1.id, unitType: '4BHK', floor: 35, carpetArea: 2800, builtUpArea: 3500, price: 35000000, availability: 'AVAILABLE' },
      // Green Valley units
      { projectId: project2.id, unitType: '3BHK Villa', carpetArea: 2200, builtUpArea: 2800, price: 10000000, availability: 'AVAILABLE' },
      { projectId: project2.id, unitType: '4BHK Villa', carpetArea: 3200, builtUpArea: 4000, price: 15000000, availability: 'AVAILABLE' },
      // Urban Edge units
      { projectId: project3.id, unitType: '1BHK', floor: 5, carpetArea: 650, builtUpArea: 850, price: 5500000, availability: 'AVAILABLE' },
      { projectId: project3.id, unitType: '2BHK', floor: 10, carpetArea: 1050, builtUpArea: 1350, price: 7500000, availability: 'AVAILABLE' },
    ],
  });

  console.log('✅ Inventory units created');

  // Create Groups
  const group1 = await prisma.groups.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      projectId: project1.id,
      name: 'Skyline Early Birds',
      description: 'Group of early investors looking to secure best prices on Skyline Towers premium apartments',
      targetBuyersCount: 20,
      currentBuyersCount: 8,
      status: GroupStatus.OPEN,
      negotiatedDiscount: null,
      commitmentAmount: 100000,
      deadline: new Date('2025-02-28'),
      createdById: organizer1.id,
      updatedAt: new Date(),
    },
  });

  const group2 = await prisma.groups.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      projectId: project2.id,
      name: 'Green Valley Families',
      description: 'Families coming together to buy eco-friendly villas at discounted rates',
      targetBuyersCount: 15,
      currentBuyersCount: 12,
      status: GroupStatus.NEGOTIATING,
      negotiatedDiscount: 5.5,
      commitmentAmount: 50000,
      deadline: new Date('2025-01-31'),
      negotiationStart: new Date('2024-11-01'),
      createdById: organizer1.id,
      updatedAt: new Date(),
    },
  });

  const group3 = await prisma.groups.create({
    data: {
      id: randomUUID(),
      tenantId: tenant1.id,
      projectId: project3.id,
      name: 'Urban Professionals',
      description: 'IT professionals looking for convenient housing near Hinjewadi',
      targetBuyersCount: 25,
      currentBuyersCount: 15,
      status: GroupStatus.OPEN,
      commitmentAmount: 25000,
      deadline: new Date('2025-03-15'),
      createdById: organizer1.id,
      updatedAt: new Date(),
    },
  });

  const group4 = await prisma.groups.create({
    data: {
      id: randomUUID(),
      tenantId: tenant2.id,
      projectId: project4.id,
      name: 'Seaside Dreamers',
      description: 'Investors interested in premium beachfront properties',
      targetBuyersCount: 10,
      currentBuyersCount: 6,
      status: GroupStatus.OPEN,
      commitmentAmount: 200000,
      deadline: new Date('2025-04-30'),
      createdById: admin2.id,
      updatedAt: new Date(),
    },
  });

  console.log('✅ Groups created');

  // Create Group Members
  await prisma.groupMember.createMany({
    data: [
      { groupId: group1.id, userId: buyer1.id, commitmentStatus: 'COMMITTED' },
      { groupId: group1.id, userId: buyer2.id, commitmentStatus: 'INTERESTED' },
      { groupId: group2.id, userId: buyer1.id, commitmentStatus: 'PAID' },
      { groupId: group3.id, userId: buyer2.id, commitmentStatus: 'INTERESTED' },
    ],
  });

  console.log('✅ Group members added');

  // Create Offers
  await prisma.offer.createMany({
    data: [
      {
        groupId: group2.id,
        offerType: 'INITIAL',
        discountPercent: 3.0,
        minBuyers: 10,
        notes: 'Initial developer offer',
      },
      {
        groupId: group2.id,
        offerType: 'COUNTER',
        discountPercent: 5.5,
        minBuyers: 12,
        notes: 'Improved offer after negotiation',
        isAccepted: true,
      },
    ],
  });

  console.log('✅ Offers created');

  // Create Group Milestones
  await prisma.groupMilestone.createMany({
    data: [
      {
        groupId: group1.id,
        title: 'Group Created',
        description: 'Skyline Early Birds group has been created',
        type: 'GROUP_CREATED',
      },
      {
        groupId: group2.id,
        title: 'Target Reached',
        description: 'Group reached minimum buyer requirement',
        type: 'TARGET_REACHED',
      },
      {
        groupId: group2.id,
        title: 'Negotiation Started',
        description: 'Started negotiation with developer',
        type: 'NEGOTIATION_STARTED',
      },
      {
        groupId: group2.id,
        title: 'Offer Received',
        description: 'Developer offered 5.5% discount',
        type: 'OFFER_RECEIVED',
      },
    ],
  });

  console.log('✅ Group milestones created');

  // Create FAQs (optional content)
  try {
    await prisma.faqs.createMany({
      data: [
        {
          question: 'How does group buying work?',
          answer: 'Group buying allows multiple buyers to come together and negotiate better prices with developers. When a group reaches the target number of buyers, we negotiate on behalf of the group to secure bulk discounts.',
          category: 'General',
          order: 1,
        },
        {
          question: 'Is my payment secure?',
          answer: 'Yes, all payments are processed through Stripe and held in escrow until the deal is finalized. If the deal falls through, you receive a full refund.',
          category: 'Payments',
          order: 2,
        },
        {
          question: 'Can I leave a group after joining?',
          answer: 'Yes, you can leave a group before making any payment commitment. Once you make a payment, withdrawal is subject to the group terms and refund policy.',
          category: 'Groups',
          order: 3,
        },
        {
          question: 'What documents do I need for KYC?',
          answer: 'You need a valid government ID (Aadhaar, PAN card), proof of address, and bank statements for KYC verification.',
          category: 'Verification',
          order: 4,
        },
      ],
    });
    console.log('✅ FAQs created');
  } catch (e) {
    console.log('⚠️  FAQ creation skipped');
  }

  // Create Case Study
  try {
    await prisma.caseStudy.create({
      data: {
        tenantId: tenant1.id,
        title: 'Mumbai Buyers Save ₹50 Lakhs Through Collective Bargaining',
        slug: 'mumbai-buyers-save-50-lakhs',
        summary: 'A group of 25 buyers came together to purchase apartments in a premium Mumbai project, saving an average of ₹2 lakhs per unit.',
        content: 'Full case study content here...',
        projectName: 'Skyline Towers',
        savingsAmount: 5000000,
        participantCount: 25,
        discountPercent: 7.5,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    console.log('✅ Case study created');
  } catch (e) {
    console.log('⚠️  Case study creation skipped');
  }

  // Create Article
  try {
    await prisma.articles.create({
      data: {
        tenantId: tenant1.id,
        title: '10 Tips for First-Time Home Buyers in India',
        slug: '10-tips-first-time-home-buyers-india',
        excerpt: 'Essential tips every first-time home buyer should know before making this important decision.',
        content: 'Full article content here...',
        category: 'Guides',
        tags: ['home-buying', 'tips', 'first-time-buyers'],
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    console.log('✅ Article created');
  } catch (e) {
    console.log('⚠️  Article creation skipped');
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\nTest Accounts:');
  console.log('Admin: admin@realestate-marketplace.com / password123');
  console.log('Organizer: organizer@realestate-marketplace.com / password123');
  console.log('Buyer: buyer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

