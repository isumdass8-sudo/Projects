/**
 * Seeds the database with the five real CGLP partnership models (content
 * paraphrased from ceylongreenlifeplantation.com), plus sample testimonials
 * and news posts so the demo has something to show immediately.
 *
 * Run with: npm run seed
 */
const pool = require('../config/db');

const plans = [
  {
    code: 'direct-sourcing',
    name: 'Direct Sourcing',
    tagline: 'Partnering directly with local farmers',
    description:
      'CGLP buys fresh produce directly from over 500 partner farmers across six growing regions, at fair market prices, to support quality and sustainable agriculture.',
    min_contribution: 25000,
    monthly_rate: 0.0125,
    duration_months: 12,
    icon: 'agriculture',
    sort_order: 1
  },
  {
    code: 'estate-cultivation',
    name: 'Estate Cultivation',
    tagline: 'Ada Govithana profit-sharing model',
    description:
      'CGLP manages agricultural estates growing Apple Guava and other crops, handling cultivation, harvesting, and land management, while sharing profits with contributing landowners.',
    min_contribution: 50000,
    monthly_rate: 0.015,
    duration_months: 24,
    icon: 'yard',
    sort_order: 2
  },
  {
    code: 'managed-cultivation',
    name: 'Managed Cultivation & Harvest',
    tagline: '10-perch managed plots, 1-5 year agreements',
    description:
      'Contributors take on a managed cultivation plot without handling day-to-day farming. CGLP\'s agricultural team manages cultivation, maintenance, and harvest, and contributors earn harvest-based returns.',
    min_contribution: 100000,
    monthly_rate: 0.02,
    duration_months: 36,
    icon: 'grid_view',
    sort_order: 3
  },
  {
    code: 'agri-trading',
    name: 'Agri Trading & Supply Network',
    tagline: 'Buy and resell agricultural products',
    description:
      'Individuals and businesses can buy and resell CGLP-supplied goods, including guava, vegetables, fertilizers, and farming equipment, through the company\'s supply network.',
    min_contribution: 15000,
    monthly_rate: 0.01,
    duration_months: 6,
    icon: 'local_shipping',
    sort_order: 4
  },
  {
    code: 'brand-partnership',
    name: 'Brand Partnership & DSR Network',
    tagline: 'Represent CGLP brands as a distributor',
    description:
      'Join as a Direct Sales Representative promoting CGLP-operated brands (including Deelectaa and KNS Enterprise products) and build independent income through regional distribution.',
    min_contribution: 10000,
    monthly_rate: 0.01,
    duration_months: 12,
    icon: 'storefront',
    sort_order: 5
  }
];

const testimonials = [
  {
    name: 'Sithmi K.',
    rating: 5,
    comment:
      'An outstanding organization dedicated to empowering local agriculture through modern technology and sustainable practices.',
    source: 'Google'
  },
  {
    name: 'Mohamed H.',
    rating: 5,
    comment:
      'One of the most reliable plantation companies, offering comprehensive solutions to meet everyone\'s needs. Clear explanations that build trust.',
    source: 'Google'
  },
  {
    name: 'Supun C.',
    rating: 5,
    comment: 'One of the most trusted plantation corporations that provide solutions for everyone\'s needs.',
    source: 'Google'
  }
];

const posts = [
  {
    title: 'New Branch Opens in Matara',
    slug: 'matara-branch-opening',
    excerpt: 'CGLP expands its regional presence with a new branch opening in Matara.',
    content:
      'Ceylon Green Life Plantation celebrated the opening of its Matara branch, extending its network of contributors and partner farmers further along the southern coast.',
    cover_color: '#2F4F3E',
    published_at: '2026-03-10'
  },
  {
    title: 'Mahabulankulama Guava Project Update',
    slug: 'mahabulankulama-guava-update',
    excerpt: 'An update on the Apple Guava cultivation project in Mahabulankulama.',
    content:
      'The Mahabulankulama estate continues its Apple Guava cultivation programme under the Ada Govithana model, with harvests supporting both local and export demand.',
    cover_color: '#8B5E3C',
    published_at: '2026-01-22'
  },
  {
    title: 'Green Education for the Next Generation',
    slug: 'green-education-initiative',
    excerpt: 'CGLP\'s CSR programme brings sustainable agriculture lessons to local schools.',
    content:
      'As part of its community outreach, CGLP has been running educational sessions to teach children about sustainable farming and the importance of green initiatives.',
    cover_color: '#4A6B52',
    published_at: '2025-11-05'
  }
];

const lands = [
  {
    name: 'Mahabulankulama Estate',
    region: 'Anuradhapura',
    latitude: 8.3114,
    longitude: 80.4037,
    acreage: 45,
    crop: 'Apple Guava',
    description: 'Estate cultivation site under the Ada Govithana profit-sharing model.'
  },
  {
    name: 'Seeduwa Head Office & Nursery',
    region: 'Gampaha',
    latitude: 7.1167,
    longitude: 79.8833,
    acreage: 8,
    crop: 'Nursery / Mixed',
    description: 'Head office, seedling nursery, and primary distribution hub.'
  },
  {
    name: 'Matara Branch Cultivation Plot',
    region: 'Matara',
    latitude: 5.9485,
    longitude: 80.5353,
    acreage: 22,
    crop: 'Guava & Vegetables',
    description: 'Managed cultivation plots serving the southern coastal region.'
  },
  {
    name: 'Galle Regional Plot',
    region: 'Galle',
    latitude: 6.0535,
    longitude: 80.2210,
    acreage: 15,
    crop: 'Guava',
    description: 'Smaller-scale managed cultivation with local farmer partnerships.'
  },
  {
    name: 'Kurunegala Growers Network',
    region: 'Kurunegala',
    latitude: 7.4863,
    longitude: 80.3647,
    acreage: 30,
    crop: 'Mixed Produce',
    description: 'Direct sourcing hub working with over 100 partner farmers.'
  }
];

async function seed() {
  try {
    const [[landCount]] = await pool.query('SELECT COUNT(*) AS count FROM lands');
    if (landCount.count === 0) {
      for (const land of lands) {
        await pool.query(
          `INSERT INTO lands (name, region, latitude, longitude, acreage, crop, description)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [land.name, land.region, land.latitude, land.longitude, land.acreage, land.crop, land.description]
        );
      }
      console.log(`Seeded ${lands.length} land locations.`);
    } else {
      console.log('Lands already seeded, skipping.');
    }

    for (const plan of plans) {
      await pool.query(
        `INSERT INTO plans (code, name, tagline, description, min_contribution, monthly_rate, duration_months, icon, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name=VALUES(name), tagline=VALUES(tagline), description=VALUES(description),
           min_contribution=VALUES(min_contribution), monthly_rate=VALUES(monthly_rate),
           duration_months=VALUES(duration_months), icon=VALUES(icon), sort_order=VALUES(sort_order)`,
        [
          plan.code, plan.name, plan.tagline, plan.description,
          plan.min_contribution, plan.monthly_rate, plan.duration_months,
          plan.icon, plan.sort_order
        ]
      );
    }
    console.log(`Seeded ${plans.length} plans.`);

    const [[testimonialCount]] = await pool.query('SELECT COUNT(*) AS count FROM testimonials');
    if (testimonialCount.count === 0) {
      for (const t of testimonials) {
        await pool.query(
          'INSERT INTO testimonials (name, rating, comment, source) VALUES (?, ?, ?, ?)',
          [t.name, t.rating, t.comment, t.source]
        );
      }
      console.log(`Seeded ${testimonials.length} testimonials.`);
    } else {
      console.log('Testimonials already seeded, skipping.');
    }

    for (const p of posts) {
      await pool.query(
        `INSERT INTO posts (title, slug, excerpt, content, cover_color, published_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [p.title, p.slug, p.excerpt, p.content, p.cover_color, p.published_at]
      );
    }
    console.log(`Seeded ${posts.length} posts.`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
