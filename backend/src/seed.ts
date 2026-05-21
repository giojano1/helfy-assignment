import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from './config/database';
import { Category } from './models/Category';
import { Tag } from './models/Tag';
import { Product } from './models/Product';
import { ProductImage } from './models/ProductImage';
import { User } from './models/User';
import { hashPassword } from './utils/hash';
import { logger } from './utils/logger';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  logger.info('Database connected — running seed');

  const categoryRepo = AppDataSource.getRepository(Category);
  const tagRepo = AppDataSource.getRepository(Tag);
  const productRepo = AppDataSource.getRepository(Product);
  const imageRepo = AppDataSource.getRepository(ProductImage);
  const userRepo = AppDataSource.getRepository(User);

  // ─── Categories ──────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Apparel', slug: 'apparel' },
    { name: 'Home & Living', slug: 'home-living' },
  ];

  const categories: Record<string, Category> = {};
  for (const data of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: data.slug } });
    if (!cat) {
      cat = categoryRepo.create(data);
      cat = await categoryRepo.save(cat);
    }
    categories[data.slug] = cat;
  }
  logger.info('Categories seeded');

  // ─── Tags ─────────────────────────────────────────────────────────────────────
  const tagSlugs = ['new-arrival', 'bestseller', 'sale', 'trending', 'eco-friendly'];
  const tags: Record<string, Tag> = {};
  for (const slug of tagSlugs) {
    let tag = await tagRepo.findOne({ where: { slug } });
    if (!tag) {
      tag = tagRepo.create({ name: slug.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()), slug });
      tag = await tagRepo.save(tag);
    }
    tags[slug] = tag;
  }
  logger.info('Tags seeded');

  // ─── Products ────────────────────────────────────────────────────────────────
  const productsData = [
    // Electronics (8)
    {
      name: 'ProSound Wireless Headphones',
      slug: 'prosound-wireless-headphones',
      description: 'Over-ear noise-cancelling headphones with 30-hour battery life and Hi-Res Audio certification.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 45,
      category: 'electronics',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 312,
      tags: ['bestseller', 'trending'],
    },
    {
      name: 'UltraView 4K Monitor',
      slug: 'ultraview-4k-monitor',
      description: '27-inch IPS panel with 144Hz refresh rate, HDR400, and USB-C 65W charging.',
      price: 429.99,
      comparePrice: null,
      stock: 20,
      category: 'electronics',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 187,
      tags: ['new-arrival', 'trending'],
    },
    {
      name: 'SwiftKey Mechanical Keyboard',
      slug: 'swiftkey-mechanical-keyboard',
      description: 'TKL layout with Cherry MX Brown switches, RGB backlighting, and aluminum frame.',
      price: 89.99,
      comparePrice: 109.99,
      stock: 60,
      category: 'electronics',
      isFeatured: false,
      rating: 4.5,
      reviewCount: 224,
      tags: ['bestseller'],
    },
    {
      name: 'SmartWatch Pro X',
      slug: 'smartwatch-pro-x',
      description: 'Health-focused smartwatch with ECG, SpO2, GPS, and 7-day battery life.',
      price: 299.99,
      comparePrice: 349.99,
      stock: 35,
      category: 'electronics',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 408,
      tags: ['bestseller', 'sale'],
    },
    {
      name: 'PortaCharge 20000mAh Power Bank',
      slug: 'portacharge-20000mah-power-bank',
      description: 'Dual USB-C 65W PD fast charging power bank with LED indicator and airline-safe capacity.',
      price: 49.99,
      comparePrice: null,
      stock: 100,
      category: 'electronics',
      isFeatured: false,
      rating: 4.4,
      reviewCount: 563,
      tags: ['bestseller'],
    },
    {
      name: 'EchoMini Smart Speaker',
      slug: 'echomini-smart-speaker',
      description: 'Compact 360° smart speaker with voice assistant, multi-room audio, and mesh Wi-Fi node.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 55,
      category: 'electronics',
      isFeatured: false,
      rating: 4.3,
      reviewCount: 276,
      tags: ['sale', 'new-arrival'],
    },
    {
      name: 'PrecisionClick Pro Mouse',
      slug: 'precisionclick-pro-mouse',
      description: 'Ergonomic wireless mouse with 25,600 DPI sensor, 11 programmable buttons, and 70-hour battery.',
      price: 69.99,
      comparePrice: null,
      stock: 80,
      category: 'electronics',
      isFeatured: false,
      rating: 4.6,
      reviewCount: 341,
      tags: ['trending'],
    },
    {
      name: 'NoiseFree Earbuds TWS',
      slug: 'noisefree-earbuds-tws',
      description: 'True wireless earbuds with hybrid ANC, 8mm drivers, 36-hour total playtime, and IPX5 rating.',
      price: 119.99,
      comparePrice: 159.99,
      stock: 70,
      category: 'electronics',
      isFeatured: true,
      rating: 4.5,
      reviewCount: 489,
      tags: ['bestseller', 'sale'],
    },
    // Apparel (6)
    {
      name: 'Urban Flex Joggers',
      slug: 'urban-flex-joggers',
      description: 'Tapered-fit joggers crafted from brushed French terry. Side pockets, ribbed cuffs, and moisture-wicking finish.',
      price: 54.99,
      comparePrice: 69.99,
      stock: 120,
      category: 'apparel',
      isFeatured: true,
      rating: 4.4,
      reviewCount: 203,
      tags: ['new-arrival', 'trending'],
    },
    {
      name: 'Heritage Denim Jacket',
      slug: 'heritage-denim-jacket',
      description: 'Classic relaxed-fit denim jacket with brass button hardware, chest pockets, and stonewash finish.',
      price: 99.99,
      comparePrice: null,
      stock: 45,
      category: 'apparel',
      isFeatured: false,
      rating: 4.7,
      reviewCount: 158,
      tags: ['bestseller'],
    },
    {
      name: 'CloudSoft Merino Hoodie',
      slug: 'cloudsoft-merino-hoodie',
      description: 'Lightweight 100% merino wool hoodie with kangaroo pocket. Temperature-regulating and naturally odour-resistant.',
      price: 129.99,
      comparePrice: 159.99,
      stock: 30,
      category: 'apparel',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 97,
      tags: ['eco-friendly', 'new-arrival'],
    },
    {
      name: 'AllDay Linen Shirt',
      slug: 'allday-linen-shirt',
      description: 'Breathable stone-washed linen shirt with a relaxed fit, button-down collar, and chest patch pocket.',
      price: 64.99,
      comparePrice: null,
      stock: 90,
      category: 'apparel',
      isFeatured: false,
      rating: 4.3,
      reviewCount: 142,
      tags: ['eco-friendly', 'trending'],
    },
    {
      name: 'TrailPace Running Shorts',
      slug: 'trailpace-running-shorts',
      description: '5-inch inseam running shorts with built-in liner, reflective trim, and zippered back pocket.',
      price: 39.99,
      comparePrice: 49.99,
      stock: 150,
      category: 'apparel',
      isFeatured: false,
      rating: 4.5,
      reviewCount: 318,
      tags: ['bestseller', 'sale'],
    },
    {
      name: 'Reclaimed Cotton Tee',
      slug: 'reclaimed-cotton-tee',
      description: 'Heavyweight 240gsm unisex tee made from 100% reclaimed cotton. Pre-washed for softness, minimal shrinkage.',
      price: 29.99,
      comparePrice: null,
      stock: 200,
      category: 'apparel',
      isFeatured: false,
      rating: 4.6,
      reviewCount: 521,
      tags: ['eco-friendly', 'bestseller'],
    },
    // Home & Living (6)
    {
      name: 'AromaBlend Diffuser Set',
      slug: 'aromablend-diffuser-set',
      description: 'Ultrasonic essential oil diffuser with 400ml tank, 7-colour LED mood light, and 6 oils included.',
      price: 44.99,
      comparePrice: 59.99,
      stock: 75,
      category: 'home-living',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 437,
      tags: ['bestseller', 'sale'],
    },
    {
      name: 'Nordic Oak Desk Lamp',
      slug: 'nordic-oak-desk-lamp',
      description: 'Minimalist solid oak and brass desk lamp with stepless dimming, 2700K warm white LED, and USB charging port.',
      price: 89.99,
      comparePrice: null,
      stock: 40,
      category: 'home-living',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 186,
      tags: ['new-arrival', 'trending'],
    },
    {
      name: 'ChillMat Bamboo Bath Set',
      slug: 'chillmat-bamboo-bath-set',
      description: '4-piece bath set: bath mat, hand towel, face towel, and washcloth. 100% organic bamboo-cotton blend.',
      price: 59.99,
      comparePrice: 74.99,
      stock: 55,
      category: 'home-living',
      isFeatured: false,
      rating: 4.5,
      reviewCount: 264,
      tags: ['eco-friendly', 'sale'],
    },
    {
      name: 'BrewMaster Pour-Over Set',
      slug: 'brewmaster-pour-over-set',
      description: 'Borosilicate glass pour-over coffee maker with stainless steel filter, silicone sleeve, and serving carafe.',
      price: 49.99,
      comparePrice: null,
      stock: 65,
      category: 'home-living',
      isFeatured: false,
      rating: 4.8,
      reviewCount: 352,
      tags: ['bestseller', 'trending'],
    },
    {
      name: 'UrbanGarden Herb Kit',
      slug: 'urbangarden-herb-kit',
      description: 'Self-watering indoor herb growing kit with 5 seed varieties, biodegradable pots, and organic soil pods.',
      price: 34.99,
      comparePrice: 44.99,
      stock: 90,
      category: 'home-living',
      isFeatured: false,
      rating: 4.4,
      reviewCount: 198,
      tags: ['eco-friendly', 'new-arrival'],
    },
    {
      name: 'WarmWeave Throw Blanket',
      slug: 'warmweave-throw-blanket',
      description: 'Chunky-knit recycled polyester throw blanket. 150×200 cm, machine washable, available in 5 colours.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 60,
      category: 'home-living',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 291,
      tags: ['eco-friendly', 'sale'],
    },
  ];

  for (const p of productsData) {
    const exists = await productRepo.findOne({ where: { slug: p.slug } });
    if (exists) continue;

    const product = productRepo.create({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice ?? null,
      stock: p.stock,
      category: categories[p.category],
      categoryId: categories[p.category]!.id,
      isFeatured: p.isFeatured,
      rating: p.rating,
      reviewCount: p.reviewCount,
      tags: p.tags.map((t) => tags[t]).filter(Boolean) as Tag[],
    });
    const savedProduct = await productRepo.save(product);

    // Primary image + 2 additional
    const imagesToCreate = [
      imageRepo.create({ productId: savedProduct.id, url: `https://picsum.photos/seed/${p.slug}/800/600`, isPrimary: true }),
      imageRepo.create({ productId: savedProduct.id, url: `https://picsum.photos/seed/${p.slug}-2/800/600`, isPrimary: false }),
      imageRepo.create({ productId: savedProduct.id, url: `https://picsum.photos/seed/${p.slug}-3/800/600`, isPrimary: false }),
    ];
    await imageRepo.save(imagesToCreate);
  }
  logger.info('Products seeded (20)');

  // ─── Users ────────────────────────────────────────────────────────────────────
  const usersData = [
    { firstName: 'Admin', lastName: 'User', email: 'admin@shop.dev', password: 'Admin1234!', role: 'admin' as const },
    { firstName: 'Jane', lastName: 'Customer', email: 'customer@shop.dev', password: 'Customer1234!', role: 'customer' as const },
  ];

  for (const u of usersData) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (exists) continue;

    const user = userRepo.create({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      passwordHash: await hashPassword(u.password),
      role: u.role,
    });
    await userRepo.save(user);
  }
  logger.info('Users seeded');

  await AppDataSource.destroy();
  logger.info('Seed complete');
}

seed().catch((err) => {
  logger.error('Seed failed', { err });
  process.exit(1);
});
