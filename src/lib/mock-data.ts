// =============================================================================
// TechDeals AI — Comprehensive Mock Data
// Used during local development and as a UI scaffolding reference.
// =============================================================================

// ─── Categories ───────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: "cat-1", slug: "laptops",       name: "Laptops",       icon: "💻", description: "Top laptop deals from Apple, Dell, ASUS and more." },
  { id: "cat-2", slug: "smartphones",   name: "Smartphones",   icon: "📱", description: "Latest smartphone offers across all major brands." },
  { id: "cat-3", slug: "accessories",   name: "Accessories",   icon: "🎧", description: "Keyboards, mice, headphones, and more." },
  { id: "cat-4", slug: "monitors",      name: "Monitors",      icon: "🖥️", description: "4K, ultrawide, gaming monitors on sale." },
  { id: "cat-5", slug: "gaming",        name: "Gaming",        icon: "🎮", description: "Gaming laptops, consoles, and peripherals." },
  { id: "cat-6", slug: "cameras",       name: "Cameras",       icon: "📷", description: "DSLRs, mirrorless, and action cameras." },
  { id: "cat-7", slug: "audio",         name: "Audio",         icon: "🔊", description: "Speakers, earbuds, and studio-grade headphones." },
  { id: "cat-8", slug: "smart-home",    name: "Smart Home",    icon: "🏠", description: "Smart bulbs, thermostats, and home automation." },
];

// ─── Stores ───────────────────────────────────────────────────────────────────
export const MOCK_STORES = [
  { id: "store-1", slug: "amazon",      name: "Amazon",      logoUrl: "/stores/amazon.svg",      website: "https://amazon.com",      description: "World's largest online marketplace." },
  { id: "store-2", slug: "flipkart",    name: "Flipkart",    logoUrl: "/stores/flipkart.svg",    website: "https://flipkart.com",    description: "India's leading ecommerce platform." },
  { id: "store-3", slug: "best-buy",    name: "Best Buy",    logoUrl: "/stores/bestbuy.svg",     website: "https://bestbuy.com",     description: "US electronics and appliances giant." },
  { id: "store-4", slug: "newegg",      name: "Newegg",      logoUrl: "/stores/newegg.svg",      website: "https://newegg.com",      description: "PC components and electronics specialist." },
  { id: "store-5", slug: "b-h",         name: "B&H Photo",   logoUrl: "/stores/bh.svg",          website: "https://bhphotovideo.com", description: "Professional cameras, audio and video gear." },
];

// ─── Brands ───────────────────────────────────────────────────────────────────
export const MOCK_BRANDS = [
  { id: "brand-1", slug: "apple",    name: "Apple",    logoUrl: "/brands/apple.svg",    description: "Cupertino-based consumer electronics leader." },
  { id: "brand-2", slug: "samsung",  name: "Samsung",  logoUrl: "/brands/samsung.svg",  description: "South Korea's global electronics powerhouse." },
  { id: "brand-3", slug: "dell",     name: "Dell",     logoUrl: "/brands/dell.svg",     description: "Enterprise and consumer PC manufacturer." },
  { id: "brand-4", slug: "sony",     name: "Sony",     logoUrl: "/brands/sony.svg",     description: "Pioneer in audio, video, and gaming." },
  { id: "brand-5", slug: "asus",     name: "ASUS",     logoUrl: "/brands/asus.svg",     description: "Motherboards, laptops, and gaming peripherals." },
  { id: "brand-6", slug: "logitech", name: "Logitech", logoUrl: "/brands/logitech.svg", description: "Keyboards, mice, webcams and peripherals." },
  { id: "brand-7", slug: "google",   name: "Google",   logoUrl: "/brands/google.svg",   description: "Android phones, smart home and cloud services." },
  { id: "brand-8", slug: "keychron", name: "Keychron", logoUrl: "/brands/keychron.svg", description: "Premium mechanical keyboards for creators." },
];

// ─── Deals ────────────────────────────────────────────────────────────────────
export const MOCK_DEALS = [
  {
    id: "deal-1",
    slug: "macbook-pro-m3-max",
    title: "MacBook Pro 16\" M3 Max — 96GB RAM",
    description: "The ultimate pro laptop with M3 Max chip.",
    aiSummary: "Apple's most powerful laptop ever built. The M3 Max chip delivers up to 40% better performance than M2 Pro. Perfect for video editors, 3D artists, and developers running heavy workloads.",
    pros: "Incredible CPU & GPU performance\nAmazing 22-hour battery life\nStunning Liquid Retina XDR display\nThunderbolt 4 ports",
    cons: "Very expensive starting price\nNot user-upgradeable\nHeavy at 2.15 kg",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 3199,
    originalPrice: 3999,
    discount: 20,
    dealType: "HOT",
    isFeatured: true,
    isTrending: true,
    rating: 4.9,
    views: 15200,
    clicks: 3400,
    tags: ["laptop", "apple", "m3", "pro"],
    categoryId: "cat-1",
    storeId: "store-1",
    brandId: "brand-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 9), // 9 min ago
  },
  {
    id: "deal-2",
    slug: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max 256GB — Titanium Natural",
    description: "First iPhone with aerospace-grade titanium design.",
    aiSummary: "The iPhone 15 Pro Max introduces USB-C with USB 3 speeds, a 48MP main camera system with 5× optical zoom, and the A17 Pro chip. Best iPhone ever made for content creators.",
    pros: "USB-C with high-speed transfer\n5× optical zoom periscope lens\nTitanium build — lighter and stronger\nA17 Pro chip",
    cons: "Battery life not best-in-class\nSlow 27W charging\nExpensive accessories ecosystem",
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 1099,
    originalPrice: 1299,
    discount: 15,
    dealType: "LIVE",
    isFeatured: true,
    isTrending: true,
    rating: 4.8,
    views: 12000,
    clicks: 2800,
    tags: ["iphone", "apple", "smartphone", "5g"],
    categoryId: "cat-2",
    storeId: "store-1",
    brandId: "brand-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "deal-3",
    slug: "samsung-galaxy-s24-ultra",
    title: "Samsung Galaxy S24 Ultra 512GB — Galaxy AI",
    description: "Epic cameras and Galaxy AI on Android's best.",
    aiSummary: "The Galaxy S24 Ultra features a built-in S-Pen, 200MP camera, and Galaxy AI capabilities including Circle to Search and Live Translate. The definitive Android powerhouse.",
    pros: "200MP main camera\nBuilt-in S-Pen\nGalaxy AI features\nFlat display — better for S-Pen use",
    cons: "Very large and heavy\nExpensive\nGalaxy AI requires internet",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 1199,
    originalPrice: 1599,
    discount: 25,
    dealType: "HOT",
    isFeatured: true,
    isTrending: false,
    rating: 4.8,
    views: 9800,
    clicks: 1900,
    tags: ["samsung", "android", "galaxy", "s-pen"],
    categoryId: "cat-2",
    storeId: "store-2",
    brandId: "brand-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hr ago
  },
  {
    id: "deal-4",
    slug: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    description: "Industry-leading ANC with 30-hour battery.",
    aiSummary: "Sony's flagship over-ear headphones use 8 microphones and two processors to deliver the best active noise cancellation on the market. Perfect for travelers and remote workers.",
    pros: "Best-in-class ANC\nComfortable for all-day wear\n30-hour battery life\nMultipoint Bluetooth",
    cons: "Doesn't fold flat\nSony app is cluttered\nNo USB-C audio input",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 278,
    originalPrice: 399,
    discount: 30,
    dealType: "LIVE",
    isFeatured: true,
    isTrending: true,
    rating: 4.7,
    views: 18000,
    clicks: 5200,
    tags: ["headphones", "anc", "sony", "wireless"],
    categoryId: "cat-7",
    storeId: "store-1",
    brandId: "brand-4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hr ago
  },
  {
    id: "deal-5",
    slug: "dell-xps-15-oled",
    title: "Dell XPS 15 — 4K OLED, RTX 4070",
    description: "Premium Windows ultrabook with stunning OLED.",
    aiSummary: "Dell's flagship 15-inch creative laptop with a 4K OLED display and NVIDIA RTX 4070. Ideal for video professionals who need Windows and a stunning screen.",
    pros: "Stunning 4K OLED display\nPowerful RTX 4070\nGood keyboard\nUSB-C charging",
    cons: "720p webcam\nGets warm under load\nAverage battery life",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 1499,
    originalPrice: 1999,
    discount: 25,
    dealType: "LIVE",
    isFeatured: false,
    isTrending: false,
    rating: 4.6,
    views: 6700,
    clicks: 1200,
    tags: ["laptop", "oled", "dell", "windows"],
    categoryId: "cat-1",
    storeId: "store-3",
    brandId: "brand-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "deal-6",
    slug: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S — Track-on-glass Mouse",
    description: "The ultimate productivity mouse with silent clicks.",
    aiSummary: "MX Master 3S improves on its predecessor with quieter 90% click noise reduction and an 8,000 DPI electromagnetic scroll wheel. Works on any surface including glass.",
    pros: "Very ergonomic design\nQuiet clicks — 90% noise reduction\nMagSpeed electromagnetic scroll\nTrack on glass surfaces",
    cons: "Large — not for small hands\n$99 is expensive for a mouse\nNo tilt-wheel on scroll",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 79,
    originalPrice: 99,
    discount: 20,
    dealType: "LIVE",
    isFeatured: false,
    isTrending: true,
    rating: 4.9,
    views: 7200,
    clicks: 2100,
    tags: ["mouse", "logitech", "productivity", "wireless"],
    categoryId: "cat-3",
    storeId: "store-1",
    brandId: "brand-6",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "deal-7",
    slug: "asus-rog-zephyrus-g14",
    title: "ASUS ROG Zephyrus G14 — Ryzen 9, RTX 4070",
    description: "Compact 14-inch gaming powerhouse.",
    aiSummary: "The ROG Zephyrus G14 packs a Ryzen 9 processor and RTX 4070 in a 14-inch chassis. The Anime Matrix LED lid display is a unique design element. Best compact gaming laptop.",
    pros: "Incredible performance for its size\nUnique Anime Matrix display\nGood battery for a gaming laptop\nAMD Ryzen efficiency",
    cons: "Fans can be loud under load\nNo webcam on some models\n14-inch screen may feel small",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 1299,
    originalPrice: 1599,
    discount: 19,
    dealType: "HOT",
    isFeatured: false,
    isTrending: true,
    rating: 4.5,
    views: 8900,
    clicks: 1800,
    tags: ["gaming", "laptop", "asus", "rog"],
    categoryId: "cat-5",
    storeId: "store-4",
    brandId: "brand-5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: "deal-8",
    slug: "google-pixel-9-pro",
    title: "Google Pixel 9 Pro — Pure Android, Best Camera",
    description: "Google's AI-first flagship with best-in-class camera.",
    aiSummary: "The Pixel 9 Pro runs stock Android 15 with exclusive Google AI features like Magic Eraser, Best Take, and the new Pixel Screenshots. The computational photography is unmatched.",
    pros: "Best computational photography\nClean stock Android experience\nSeven years of OS updates\nOn-device AI features",
    cons: "Google Tensor chip is warm\nAverage video compared to iPhone\nLimited accessories ecosystem",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 899,
    originalPrice: 1099,
    discount: 18,
    dealType: "LIVE",
    isFeatured: false,
    isTrending: false,
    rating: 4.6,
    views: 5300,
    clicks: 980,
    tags: ["pixel", "google", "android", "camera"],
    categoryId: "cat-2",
    storeId: "store-1",
    brandId: "brand-7",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: "deal-9",
    slug: "keychron-q1-pro-wireless",
    title: "Keychron Q1 Pro — Wireless Mechanical Keyboard",
    description: "Premium full-metal wireless custom mechanical keyboard.",
    aiSummary: "The Keychron Q1 Pro is a 75% layout full-metal keyboard with QMK/VIA support and wireless Bluetooth connectivity. The best mechanical keyboard for enthusiasts.",
    pros: "Full aluminum construction\nQMK/VIA programmable\nBluetooth 5.1 wireless\nKnob control",
    cons: "Very heavy at 1.5kg\nTall profile needs wrist rest\nPricey for a keyboard",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 169,
    originalPrice: 199,
    discount: 15,
    dealType: "LIVE",
    isFeatured: false,
    isTrending: false,
    rating: 4.8,
    views: 4100,
    clicks: 670,
    tags: ["keyboard", "mechanical", "keychron", "wireless"],
    categoryId: "cat-3",
    storeId: "store-1",
    brandId: "brand-8",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "deal-10",
    slug: "macbook-air-m3-15-inch",
    title: "MacBook Air 15\" M3 — The Lightest 15\" Laptop",
    description: "World's thinnest and lightest 15-inch laptop.",
    aiSummary: "The 15-inch MacBook Air M3 is the world's thinnest laptop in its class. With a fanless design, 18-hour battery, and Liquid Retina display, it's perfect for students and productivity workers.",
    pros: "Fanless — completely silent\nIncredible 18-hour battery\nLarge 15-inch Retina display\nThin and light at 1.51 kg",
    cons: "No fan — throttles under heavy load\nOnly 2 USB-C ports\nBase 8GB RAM shows limits",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    affiliateUrl: "#",
    currentPrice: 1099,
    originalPrice: 1299,
    discount: 15,
    dealType: "HOT",
    isFeatured: true,
    isTrending: true,
    rating: 4.9,
    views: 20000,
    clicks: 5600,
    tags: ["laptop", "apple", "m3", "air"],
    categoryId: "cat-1",
    storeId: "store-1",
    brandId: "brand-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const MOCK_COUPONS = [
  {
    id: "coupon-1",
    slug: "amazon-prime-10-off",
    title: "Amazon Prime — 10% Off All Electronics",
    code: "PRIME10TECH",
    discountText: "10% Off",
    description: "Prime members get extra 10% off on all electronics this week.",
    terms: "Valid for Prime members only. Max discount ₹2000.",
    affiliateUrl: "#",
    storeId: "store-1",
    categoryId: "cat-3",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    clicks: 1200,
  },
  {
    id: "coupon-2",
    slug: "flipkart-big-saving-days",
    title: "Flipkart Big Saving Days — 15% Off Smartphones",
    code: "BIGSAVE15",
    discountText: "15% Off",
    description: "Big Saving Days sale — flat 15% off on all smartphones over $300.",
    terms: "One coupon per account. Cannot be combined with bank offers.",
    affiliateUrl: "#",
    storeId: "store-2",
    categoryId: "cat-2",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    clicks: 3400,
  },
  {
    id: "coupon-3",
    slug: "best-buy-student-20",
    title: "Best Buy — 20% Off for Students",
    code: "STUDENT2024",
    discountText: "20% Off",
    description: "Verified students get 20% off on select laptops and tablets.",
    terms: "Requires .edu email verification. Limit one per student.",
    affiliateUrl: "#",
    storeId: "store-3",
    categoryId: "cat-1",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72),
    clicks: 890,
  },
  {
    id: "coupon-4",
    slug: "newegg-gaming-build-5",
    title: "Newegg — $50 Off Gaming Builds over $500",
    code: "GAMEBUILD50",
    discountText: "$50 Off",
    description: "Build your gaming PC and get $50 off on orders over $500.",
    terms: "Min order $500. GPU and CPU must be in cart.",
    affiliateUrl: "#",
    storeId: "store-4",
    categoryId: "cat-5",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 36),
    clicks: 560,
  },
  {
    id: "coupon-5",
    slug: "bh-photo-free-shipping",
    title: "B&H Photo — Free Priority Shipping on Cameras",
    code: "BHFREESHIP",
    discountText: "Free Shipping",
    description: "Get free priority shipping on all camera orders over $100.",
    terms: "Continental US only. Not valid on international orders.",
    affiliateUrl: "#",
    storeId: "store-5",
    categoryId: "cat-6",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 120),
    clicks: 340,
  },
];

// ─── Quiz Posts ───────────────────────────────────────────────────────────────
export const MOCK_QUIZ_POSTS = [
  {
    id: "quiz-1",
    slug: "amazon-quiz-answers-today-june-2026",
    title: "Amazon Quiz Answers Today — June 24, 2026",
    platform: "AMAZON",
    quizDate: new Date("2026-06-24"),
    prize: "Win ₹50,000 Amazon Pay Balance",
    qaPairs: [
      { question: "Who invented the telephone?", answer: "Alexander Graham Bell" },
      { question: "Which planet is known as the Red Planet?", answer: "Mars" },
      { question: "What is the capital of Australia?", answer: "Canberra" },
      { question: "Which gas do plants absorb from the atmosphere?", answer: "Carbon Dioxide" },
      { question: "In which year did World War II end?", answer: "1945" },
    ],
    seoTitle: "Amazon Quiz Answers Today June 24 2026 — Win ₹50,000",
    seoDesc: "All 5 correct answers for today's Amazon Daily Quiz. Win Amazon Pay Balance worth ₹50,000.",
  },
  {
    id: "quiz-2",
    slug: "amazon-quiz-answers-june-23-2026",
    title: "Amazon Quiz Answers — June 23, 2026",
    platform: "AMAZON",
    quizDate: new Date("2026-06-23"),
    prize: "Win ₹25,000 Amazon Pay Balance",
    qaPairs: [
      { question: "Which country has the largest population?", answer: "India" },
      { question: "What is the tallest building in the world?", answer: "Burj Khalifa" },
      { question: "Which is the smallest continent?", answer: "Australia" },
      { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
      { question: "How many continents are on Earth?", answer: "7" },
    ],
    seoTitle: "Amazon Quiz Answers June 23 2026",
    seoDesc: "Find all 5 Amazon Quiz answers for June 23, 2026 and win ₹25,000.",
  },
  {
    id: "quiz-3",
    slug: "flipkart-quiz-answers-today-june-2026",
    title: "Flipkart Daily Trivia Answers — June 24, 2026",
    platform: "FLIPKART",
    quizDate: new Date("2026-06-24"),
    prize: "Win SuperCoins Worth ₹5,000",
    qaPairs: [
      { question: "What is the longest river in the world?", answer: "Nile River" },
      { question: "Which animal is known as the King of the Jungle?", answer: "Lion" },
      { question: "What is the chemical symbol for Gold?", answer: "Au" },
    ],
    seoTitle: "Flipkart Quiz Answers Today June 24 2026",
    seoDesc: "Get all correct Flipkart Daily Trivia answers for June 24 2026 and win SuperCoins.",
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const MOCK_BLOG_POSTS = [
  {
    id: "blog-1",
    slug: "best-laptops-under-1000-2026",
    title: "Best Laptops Under $1,000 in 2026 — Ranked & Reviewed",
    excerpt: "We tested 15 laptops under $1,000. Here are the top 7 you should actually buy in 2026, from the MacBook Air M3 to the Dell XPS 13.",
    coverImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    tags: ["laptops", "buying-guide", "2026"],
    status: "PUBLISHED",
    views: 8400,
    createdAt: new Date("2026-06-20"),
    publishedAt: new Date("2026-06-20"),
    content: `
# Best Laptops Under $1,000 in 2026

Finding a great laptop under $1,000 has never been easier — but also never more confusing. Here's our curated shortlist after 200+ hours of testing.

## 1. MacBook Air M3 (Best Overall)
The MacBook Air M3 starts at $1,099, but frequently goes on sale under $999. It offers unmatched battery life, a silent fanless design, and macOS polish.

## 2. Dell XPS 13 Plus (Best Windows)
A stunning 13.4-inch OLED display, a 12th-gen Intel Core i7, and a premium aluminum chassis make this the best Windows ultrabook.

## 3. ASUS Zenbook 14 OLED (Best Value)
For under $800, you get an AMD Ryzen 7, a gorgeous OLED display, and 32GB of RAM. Exceptional value.
    `,
  },
  {
    id: "blog-2",
    slug: "amazon-prime-day-2026-best-deals",
    title: "Amazon Prime Day 2026 — Best Deals You Shouldn't Miss",
    excerpt: "Prime Day is here! We've tracked thousands of deals and picked only the ones with real discounts — not fake markups.",
    coverImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
    tags: ["prime-day", "amazon", "deals"],
    status: "PUBLISHED",
    views: 23400,
    createdAt: new Date("2026-06-18"),
    publishedAt: new Date("2026-06-18"),
    content: `
# Amazon Prime Day 2026 — Real Deals Guide

We analyzed every Prime Day deal using price tracking tools to filter out fake discounts.

## The Best Verified Deals

### MacBook Air M3 — 15% Off
This is a genuine discount. Apple rarely discounts this aggressively.

### Sony WH-1000XM5 — 30% Off
Genuine discount. Price verified against 6-month historical average.

### Logitech MX Master 3S — 20% Off
Another genuine markdown. Buy with confidence.
    `,
  },
  {
    id: "blog-3",
    slug: "iphone-16-vs-samsung-s24-ultra",
    title: "iPhone 16 Pro vs Samsung Galaxy S24 Ultra — The Ultimate Comparison",
    excerpt: "We've used both flagship phones for 30 days each. Here's the definitive verdict on which one you should buy.",
    coverImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
    tags: ["comparison", "iphone", "samsung", "flagship"],
    status: "PUBLISHED",
    views: 31200,
    createdAt: new Date("2026-06-15"),
    publishedAt: new Date("2026-06-15"),
    content: `
# iPhone 16 Pro vs Galaxy S24 Ultra

Two very different phones for two very different users.

## Camera
- iPhone 16 Pro: Superior video recording, better in low light
- S24 Ultra: Better still photography, 200MP main camera, 5× optical zoom

## Software
- iPhone: iOS 18, tighter ecosystem, better security
- Samsung: Galaxy AI, more customizable

## Verdict
If you shoot video — iPhone. If you shoot stills and use an S-Pen — Samsung.
    `,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export async function getDeals()      { return MOCK_DEALS; }
export async function getCategories() { return MOCK_CATEGORIES; }
export async function getStores()     { return MOCK_STORES; }
export async function getBrands()     { return MOCK_BRANDS; }
export async function getCoupons()    { return MOCK_COUPONS; }
export async function getQuizPosts()  { return MOCK_QUIZ_POSTS; }
export async function getBlogPosts()  { return MOCK_BLOG_POSTS; }

export async function getProducts()   { return MOCK_DEALS; } // alias for compat

// Lookup helpers
export async function getDealBySlug(slug: string)     { return MOCK_DEALS.find(d => d.slug === slug); }
export async function getBlogPostBySlug(slug: string)  { return MOCK_BLOG_POSTS.find(p => p.slug === slug); }
export async function getQuizBySlug(slug: string)      { return MOCK_QUIZ_POSTS.find(q => q.slug === slug); }
export async function getCategoryBySlug(slug: string)  { return MOCK_CATEGORIES.find(c => c.slug === slug); }
export async function getStoreBySlug(slug: string)     { return MOCK_STORES.find(s => s.slug === slug); }
export async function getBrandBySlug(slug: string)     { return MOCK_BRANDS.find(b => b.slug === slug); }

export async function getFeaturedDeals()  { return MOCK_DEALS.filter(d => d.isFeatured); }
export async function getTrendingDeals()  { return MOCK_DEALS.filter(d => d.isTrending); }
export async function getHotDeals()       { return MOCK_DEALS.filter(d => d.dealType === "HOT"); }
export async function getLiveDeals()      { return MOCK_DEALS.filter(d => d.dealType === "LIVE"); }

export async function getDealsByCategory(categoryId: string) {
  return MOCK_DEALS.filter(d => d.categoryId === categoryId);
}
export async function getDealsByStore(storeId: string) {
  return MOCK_DEALS.filter(d => d.storeId === storeId);
}
export async function getDealsByBrand(brandId: string) {
  return MOCK_DEALS.filter(d => d.brandId === brandId);
}
export async function getCouponsByStore(storeId: string) {
  return MOCK_COUPONS.filter(c => c.storeId === storeId);
}

// Legacy compat
export const MOCK_PRODUCTS = MOCK_DEALS;
export const MOCK_CATEGORIES_LIST = MOCK_CATEGORIES;
