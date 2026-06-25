import { PrismaClient, DealType, PublishStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    slug: "laptops",
    name: "Laptops",
    icon: "Laptop",
    description: "Performance laptops, ultrabooks, and creator machines.",
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    icon: "Smartphone",
    description: "Flagship phones, midrange picks, and mobile accessories.",
  },
  {
    slug: "audio",
    name: "Audio",
    icon: "Headphones",
    description: "Headphones, earbuds, speakers, and creator audio gear.",
  },
  {
    slug: "gaming",
    name: "Gaming",
    icon: "Gamepad2",
    description: "Gaming laptops, monitors, handhelds, and peripherals.",
  },
];

const stores = [
  {
    slug: "amazon",
    name: "Amazon",
    website: "https://www.amazon.in",
    affiliateBaseUrl: "https://www.amazon.in",
    description: "Broad tech marketplace with frequent lightning deals.",
  },
  {
    slug: "flipkart",
    name: "Flipkart",
    website: "https://www.flipkart.com",
    affiliateBaseUrl: "https://www.flipkart.com",
    description: "India-focused marketplace with strong electronics offers.",
  },
  {
    slug: "croma",
    name: "Croma",
    website: "https://www.croma.com",
    affiliateBaseUrl: "https://www.croma.com",
    description: "Retailer for curated electronics and appliance deals.",
  },
];

const brands = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "sony", name: "Sony" },
  { slug: "asus", name: "ASUS" },
  { slug: "logitech", name: "Logitech" },
  { slug: "nothing", name: "Nothing" },
];

const deals = [
  {
    slug: "macbook-air-m3-16gb-student-creator-deal",
    title: "MacBook Air M3 16GB for students and creators",
    description:
      "A lightweight laptop pick for coding, study, and content workflows with excellent battery life and a quiet fanless build.",
    aiSummary:
      "Best for users who want a long-lasting laptop for everyday creation without carrying a heavy machine.",
    aiComparison:
      "Choose this over a gaming laptop if battery life, portability, and display quality matter more than GPU-heavy gaming.",
    aiKeywords: ["macbook air deal", "student laptop", "creator laptop"],
    pros: "Excellent battery life\nSilent fanless design\nStrong display and trackpad",
    cons: "Limited ports\nNot ideal for heavy gaming",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 109900,
    originalPrice: 124900,
    discount: 12,
    rating: 4.8,
    views: 980,
    clicks: 126,
    dealType: DealType.HOT,
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    isTrending: true,
    categorySlug: "laptops",
    storeSlug: "amazon",
    brandSlug: "apple",
    tags: ["laptop", "mac", "student", "creator"],
  },
  {
    slug: "samsung-galaxy-s24-ultra-camera-deal",
    title: "Samsung Galaxy S24 Ultra camera flagship offer",
    description:
      "A premium Android phone deal for users who want a large display, strong zoom camera, and stylus-friendly productivity.",
    aiSummary:
      "A strong pick for camera-first Android buyers who want a productivity phone with a premium build.",
    aiComparison:
      "Pick this over compact flagships if you value zoom range, pen input, and battery headroom.",
    aiKeywords: ["galaxy s24 ultra deal", "android flagship", "camera phone"],
    pros: "Excellent zoom cameras\nS Pen support\nBright large display",
    cons: "Large for one-handed use\nPremium price tier",
    imageUrl:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 119999,
    originalPrice: 134999,
    discount: 11,
    rating: 4.7,
    views: 870,
    clicks: 104,
    dealType: DealType.HOT,
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    isTrending: true,
    categorySlug: "smartphones",
    storeSlug: "flipkart",
    brandSlug: "samsung",
    tags: ["phone", "android", "camera", "flagship"],
  },
  {
    slug: "sony-wh-1000xm5-work-travel-audio-deal",
    title: "Sony WH-1000XM5 work and travel headphone deal",
    description:
      "Noise-cancelling headphones for commuters, focus sessions, and long calls with a comfortable lightweight fit.",
    aiSummary:
      "Best for frequent travelers and remote workers who need dependable ANC and call quality.",
    aiComparison:
      "Choose this over budget headphones if daily comfort and noise cancellation are worth the premium.",
    aiKeywords: ["sony headphone deal", "anc headphones", "travel audio"],
    pros: "Class-leading noise cancellation\nComfortable for long sessions\nStrong microphone performance",
    cons: "Does not fold compactly\nTouch controls need practice",
    imageUrl:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 24990,
    originalPrice: 34990,
    discount: 29,
    rating: 4.8,
    views: 1320,
    clicks: 214,
    dealType: DealType.LIVE,
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    isTrending: true,
    categorySlug: "audio",
    storeSlug: "croma",
    brandSlug: "sony",
    tags: ["headphones", "audio", "anc", "travel"],
  },
  {
    slug: "asus-rog-zephyrus-g14-creator-gaming-deal",
    title: "ASUS ROG Zephyrus G14 creator gaming deal",
    description:
      "Compact gaming laptop deal for players and creators who need strong graphics performance in a portable chassis.",
    aiSummary:
      "A balanced gaming laptop for users who want power without moving to a bulky desktop replacement.",
    aiComparison:
      "Choose it over larger gaming laptops if portability and display quality are high priorities.",
    aiKeywords: ["asus g14 deal", "gaming laptop", "creator laptop"],
    pros: "Portable gaming performance\nGood display options\nStrong creator workload value",
    cons: "Can run warm under load\nUpgrade options are limited",
    imageUrl:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 139990,
    originalPrice: 169990,
    discount: 18,
    rating: 4.5,
    views: 760,
    clicks: 83,
    dealType: DealType.LIVE,
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    isTrending: true,
    categorySlug: "gaming",
    storeSlug: "amazon",
    brandSlug: "asus",
    tags: ["gaming", "laptop", "creator", "portable"],
  },
  {
    slug: "logitech-mx-master-3s-productivity-mouse-deal",
    title: "Logitech MX Master 3S productivity mouse deal",
    description:
      "A premium wireless mouse for spreadsheet work, editing timelines, coding, and multi-device desk setups.",
    aiSummary:
      "Best for desk-heavy users who want comfort, quiet clicks, and fast horizontal scrolling.",
    aiComparison:
      "Pick this over a basic wireless mouse if workflow shortcuts and ergonomics save you time every day.",
    aiKeywords: ["mx master 3s deal", "productivity mouse", "logitech mouse"],
    pros: "Comfortable ergonomic shape\nQuiet switches\nExcellent scroll wheel",
    cons: "Large for small hands\nNot built for competitive gaming",
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 7995,
    originalPrice: 10995,
    discount: 27,
    rating: 4.7,
    views: 540,
    clicks: 71,
    dealType: DealType.LIVE,
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    isTrending: false,
    categorySlug: "gaming",
    storeSlug: "amazon",
    brandSlug: "logitech",
    tags: ["mouse", "desk", "productivity", "accessory"],
  },
  {
    slug: "nothing-phone-2a-clean-android-midrange-deal",
    title: "Nothing Phone 2a clean Android midrange deal",
    description:
      "A value-focused phone deal for buyers who want clean software, distinct styling, and reliable everyday performance.",
    aiSummary:
      "A good midrange pick for users who care about software feel and design without paying flagship prices.",
    aiComparison:
      "Choose this over older flagships if warranty, battery health, and fresh software matter more than top-end cameras.",
    aiKeywords: ["nothing phone deal", "midrange phone", "clean android"],
    pros: "Clean Android experience\nDistinct design\nGood battery life",
    cons: "Camera is not flagship grade\nLimited premium extras",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200",
    affiliateUrl: "#",
    currentPrice: 21999,
    originalPrice: 27999,
    discount: 21,
    rating: 4.4,
    views: 690,
    clicks: 92,
    dealType: DealType.LIVE,
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    isTrending: false,
    categorySlug: "smartphones",
    storeSlug: "flipkart",
    brandSlug: "nothing",
    tags: ["phone", "android", "midrange", "value"],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const store of stores) {
    await prisma.store.upsert({
      where: { slug: store.slug },
      update: store,
      create: store,
    });
  }

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  for (const deal of deals) {
    const { categorySlug, storeSlug, brandSlug, ...dealData } = deal;

    const savedDeal = await prisma.deal.upsert({
      where: { slug: deal.slug },
      update: {
        ...dealData,
        category: { connect: { slug: categorySlug } },
        store: { connect: { slug: storeSlug } },
        brand: { connect: { slug: brandSlug } },
      },
      create: {
        ...dealData,
        category: { connect: { slug: categorySlug } },
        store: { connect: { slug: storeSlug } },
        brand: { connect: { slug: brandSlug } },
      },
    });

    await prisma.priceHistory.create({
      data: {
        dealId: savedDeal.id,
        price: deal.currentPrice,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (adminEmail) {
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "TechDeals Admin",
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
