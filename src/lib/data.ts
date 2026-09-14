/**
 * Mock content for the FashiOnia landing page.
 * No backend — every value here is static copy or a public Unsplash photo.
 */

/**
 * Build an Unsplash delivery URL at a known crop, so nothing shifts on load.
 *
 * The static export has no image optimizer, so each source is requested at
 * roughly 2x its largest rendered size to stay sharp on high-DPI screens.
 * `auto=format` still gets us WebP/AVIF from Unsplash's CDN.
 */
function photo(id: string, width: number, height: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/#top" },
  { label: "Shop", href: "/#categories" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Collections", href: "/#lookbook" },
  { label: "About", href: "/#story" },
];

export type HeroFeature = {
  title: string;
  detail: string;
  icon: "truck" | "shield" | "sparkles" | "headset";
};

export const heroFeatures: HeroFeature[] = [
  {
    title: "Free Shipping",
    detail: "On every order over $120",
    icon: "truck",
  },
  {
    title: "Secure Payment",
    detail: "Encrypted at every step",
    icon: "shield",
  },
  {
    title: "Trendy Collections",
    detail: "New edits every fortnight",
    icon: "sparkles",
  },
  {
    title: "24/7 Support",
    detail: "Real people, always on",
    icon: "headset",
  },
];

export const heroImage = {
  src: photo("1539533018447-63fcce2678e3", 1100, 1650),
  alt: "Model wearing a belted camel wrap coat over black trousers on a stone staircase",
};

/** The four shoppable collections. Products belong to one or more of these. */
export type Collection = "Women" | "Men" | "Accessories" | "Footwear";

export const collections: Collection[] = ["Women", "Men", "Accessories", "Footwear"];

/** What the New Arrivals grid can be narrowed to. */
export type ShopFilter = "All" | Collection | "Sale";

export const shopFilters: ShopFilter[] = ["All", ...collections, "Sale"];

export type Category = {
  name: Collection;
  count: string;
  href: string;
  image: string;
  alt: string;
};

export const categories: Category[] = [
  {
    name: "Women",
    count: "148 pieces",
    href: "/#new-arrivals",
    image: photo("1614251055880-ee96e4803393", 900, 1200),
    alt: "Woman in a rust brown blouse and wide cream trousers standing in open scrubland",
  },
  {
    name: "Men",
    count: "96 pieces",
    href: "/#new-arrivals",
    image: photo("1519415387722-a1c3bbef716c", 900, 1200),
    alt: "Man in a black overshirt and slim trousers crossing a city street",
  },
  {
    name: "Accessories",
    count: "72 pieces",
    href: "/#new-arrivals",
    image: photo("1483118714900-540cf339fd46", 900, 1200),
    alt: "Close view of tan leather gloves and a silver wristwatch against a tailored jacket",
  },
  {
    name: "Footwear",
    count: "54 pieces",
    href: "/#new-arrivals",
    image: photo("1520639888713-7851133b1ed0", 900, 1200),
    alt: "Hands lacing a pair of tan leather ankle boots",
  },
];

export const storyImage = {
  src: photo("1445205170230-053b83016050", 2000, 1250),
  alt: "Rail of neutral linen garments lit by warm golden light inside a boutique",
};

export type Product = {
  /** Stable identifier — the cart and wishlist persist this, never the object. */
  id: string;
  name: string;
  /** Displayed under the product name. */
  category: string;
  /** Which shop-by-category cards this product answers to. */
  collections: Collection[];
  price: number;
  compareAt?: number;
  isNew: boolean;
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    id: "terracotta-bomber",
    name: "Terracotta Bomber",
    category: "Outerwear",
    collections: ["Women", "Men"],
    price: 289,
    isNew: true,
    image: photo("1591047139829-d91aecb6caea", 800, 1000),
    alt: "Terracotta bomber jacket hanging against a pale wall",
  },
  {
    id: "fringed-knit-poncho",
    name: "Fringed Knit Poncho",
    category: "Knitwear",
    collections: ["Women"],
    price: 164,
    compareAt: 210,
    isNew: true,
    image: photo("1434389677669-e08b4cac3105", 800, 1000),
    alt: "Cream hand-knit poncho with tasselled hem on a wooden hanger",
  },
  {
    id: "structured-satchel",
    name: "Structured Satchel",
    category: "Bags",
    collections: ["Women", "Accessories"],
    price: 342,
    isNew: true,
    image: photo("1584917865442-de89df76afd3", 800, 1000),
    alt: "Burnt orange leather top-handle satchel with a silver clasp",
  },
  {
    id: "cognac-derby",
    name: "Cognac Derby",
    category: "Footwear",
    collections: ["Men", "Footwear"],
    price: 228,
    isNew: true,
    image: photo("1449505278894-297fdb3edbc1", 800, 1000),
    alt: "Pair of polished cognac leather derby shoes on a wooden floor",
  },
  {
    id: "quilted-chain-bag",
    name: "Quilted Chain Bag",
    category: "Bags",
    collections: ["Women", "Accessories"],
    price: 396,
    isNew: true,
    image: photo("1548036328-c9fa89d128fa", 800, 1000),
    alt: "Black quilted leather shoulder bag with a gold chain strap",
  },
  {
    id: "everyday-cotton-tee",
    name: "Everyday Cotton Tee",
    category: "Essentials",
    collections: ["Men", "Women"],
    price: 58,
    isNew: true,
    image: photo("1521572163474-6864f9cf17ab", 800, 1000),
    alt: "Model wearing a plain white heavyweight cotton t-shirt",
  },
  {
    id: "heritage-chronograph",
    name: "Heritage Chronograph",
    category: "Accessories",
    collections: ["Men", "Accessories"],
    price: 470,
    compareAt: 560,
    isNew: true,
    image: photo("1524805444758-089113d48a6d", 800, 1000),
    alt: "Chronograph watch with a brown alligator strap on a dark reflective surface",
  },
  {
    id: "vintage-wash-short",
    name: "Vintage Wash Short",
    category: "Denim",
    collections: ["Women", "Men"],
    price: 96,
    isNew: true,
    image: photo("1591195853828-11db59a44f6b", 800, 1000),
    alt: "Pale blue distressed denim shorts photographed flat on white",
  },

  /* ---- Outerwear & clothing ------------------------------------------ */
  {
    id: "belted-camel-coat",
    name: "Belted Camel Coat",
    category: "Outerwear",
    collections: ["Women"],
    price: 420,
    isNew: true,
    image: photo("1539533018447-63fcce2678e3", 800, 1000),
    alt: "Model wearing a belted camel wrap coat over black trousers on a stone staircase",
  },
  {
    id: "blush-wool-coat",
    name: "Blush Wool Coat",
    category: "Outerwear",
    collections: ["Women"],
    price: 385,
    compareAt: 460,
    isNew: true,
    image: photo("1567401893414-76b7b1e5a7a5", 800, 1000),
    alt: "Woman in a blush wool coat walking beneath a stone colonnade",
  },
  {
    id: "olive-field-jacket",
    name: "Olive Field Jacket",
    category: "Outerwear",
    collections: ["Women", "Men"],
    price: 246,
    isNew: true,
    image: photo("1544022613-e87ca75a784a", 800, 1000),
    alt: "Model in an oversized olive field jacket against a concrete wall",
  },
  {
    id: "wool-overshirt",
    name: "Wool Overshirt",
    category: "Shirts",
    collections: ["Men"],
    price: 178,
    isNew: true,
    image: photo("1519415387722-a1c3bbef716c", 800, 1000),
    alt: "Man in a black wool overshirt and slim trousers crossing a city street",
  },
  {
    id: "wide-leg-linen-trouser",
    name: "Wide-Leg Linen Trouser",
    category: "Trousers",
    collections: ["Women"],
    price: 132,
    isNew: true,
    image: photo("1614251055880-ee96e4803393", 800, 1000),
    alt: "Woman in a rust brown blouse and wide cream linen trousers in open scrubland",
  },
  {
    id: "ruffled-cotton-dress",
    name: "Ruffled Cotton Dress",
    category: "Dresses",
    collections: ["Women"],
    price: 210,
    compareAt: 260,
    isNew: false,
    image: photo("1581044777550-4cfa60707c03", 800, 1000),
    alt: "Model in a blush ruffled cotton dress standing in a field of dry golden grass",
  },
  {
    id: "garment-dyed-tee",
    name: "Garment-Dyed Tee",
    category: "Essentials",
    collections: ["Men", "Women"],
    price: 64,
    isNew: false,
    image: photo("1523381210434-271e8be1f52b", 800, 1000),
    alt: "Row of sage green garment-dyed t-shirts on wooden hangers",
  },

  /* ---- Footwear ------------------------------------------------------- */
  {
    id: "heritage-lace-up-boot",
    name: "Heritage Lace-Up Boot",
    category: "Footwear",
    collections: ["Men", "Women", "Footwear"],
    price: 265,
    isNew: true,
    image: photo("1520639888713-7851133b1ed0", 800, 1000),
    alt: "Hands lacing a pair of tan leather ankle boots",
  },
  {
    id: "suede-court-heel",
    name: "Suede Court Heel",
    category: "Footwear",
    collections: ["Women", "Footwear"],
    price: 198,
    isNew: true,
    image: photo("1515347619252-60a4bf4fff4f", 800, 1000),
    alt: "Pair of navy suede court heels held up by hand outdoors",
  },
  {
    id: "suede-work-boot",
    name: "Suede Work Boot",
    category: "Footwear",
    collections: ["Men", "Footwear"],
    price: 240,
    compareAt: 290,
    isNew: true,
    image: photo("1605812860427-4024433a70fd", 800, 1000),
    alt: "Pair of tan suede work boots suspended against a dark background",
  },
  {
    id: "chunky-ankle-boot",
    name: "Chunky Ankle Boot",
    category: "Footwear",
    collections: ["Women", "Footwear"],
    price: 215,
    isNew: true,
    image: photo("1582897085656-c636d006a246", 800, 1000),
    alt: "Black chunky-sole ankle boots worn with black trousers against white",
  },
  {
    id: "leather-combat-boot",
    name: "Leather Combat Boot",
    category: "Footwear",
    collections: ["Men", "Footwear"],
    price: 298,
    isNew: false,
    image: photo("1608256246200-53e635b5b65f", 800, 1000),
    alt: "Pair of dark brown leather lace-up combat boots on a white surface",
  },
  {
    id: "suede-low-sneaker",
    name: "Suede Low Sneaker",
    category: "Footwear",
    collections: ["Women", "Men", "Footwear"],
    price: 148,
    isNew: true,
    image: photo("1603808033192-082d6919d3e1", 800, 1000),
    alt: "Pair of beige suede and white leather low sneakers on a tan surface",
  },

  /* ---- Accessories ---------------------------------------------------- */
  {
    id: "woven-leather-belt",
    name: "Woven Leather Belt",
    category: "Accessories",
    collections: ["Men", "Accessories"],
    price: 88,
    isNew: false,
    image: photo("1479064555552-3ef4979f8908", 800, 1000),
    alt: "Flat lay of a tan leather belt, brown boots, sunglasses and a white t-shirt",
  },
  {
    id: "tartan-wool-scarf",
    name: "Tartan Wool Scarf",
    category: "Accessories",
    collections: ["Women", "Men", "Accessories"],
    price: 76,
    isNew: true,
    image: photo("1490114538077-0a7f8cb49891", 800, 1000),
    alt: "Flat lay of a tartan wool scarf beside brown leather shoes in a box",
  },
  {
    id: "tan-leather-gloves",
    name: "Tan Leather Gloves",
    category: "Accessories",
    collections: ["Men", "Accessories"],
    price: 110,
    isNew: true,
    image: photo("1483118714900-540cf339fd46", 800, 1000),
    alt: "Close view of tan leather gloves and a silver wristwatch against a tailored jacket",
  },
  {
    id: "canvas-daypack",
    name: "Canvas Daypack",
    category: "Bags",
    collections: ["Men", "Accessories"],
    price: 156,
    isNew: false,
    image: photo("1553062407-98eeb64c6a62", 800, 1000),
    alt: "Navy canvas daypack standing on a pale floor in soft daylight",
  },
  {
    id: "ribbed-wool-beanie",
    name: "Ribbed Wool Beanie",
    category: "Accessories",
    collections: ["Women", "Accessories"],
    price: 42,
    isNew: true,
    image: photo("1487412720507-e7ab37603c6f", 800, 1000),
    alt: "Woman smiling in a black ribbed wool beanie and grey scarf in the snow",
  },
];

export const productById = (id: string) => products.find((product) => product.id === id);

/** Narrow the catalogue to one shop filter. */
export function filterProducts(filter: ShopFilter): Product[] {
  if (filter === "All") return products;
  if (filter === "Sale") return products.filter((product) => product.compareAt !== undefined);
  return products.filter((product) => product.collections.includes(filter));
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const promoImage = {
  src: photo("1567401893414-76b7b1e5a7a5", 1600, 2000),
  alt: "Woman in a blush wool coat walking beneath a stone colonnade",
};

export type Look = {
  id: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
};

export const lookbook: Look[] = [
  {
    id: "golden-hour",
    title: "Golden Hour",
    caption: "Soft volume, sun-bleached tones and nowhere in particular to be.",
    image: photo("1581044777550-4cfa60707c03", 1000, 1400),
    alt: "Model in a blush ruffled dress standing in a field of dry golden grass",
  },
  {
    id: "city-neutrals",
    title: "City Neutrals",
    caption: "Utility shapes cut in olive, bone and washed indigo.",
    image: photo("1544022613-e87ca75a784a", 1000, 1400),
    alt: "Model in an oversized olive field jacket against a concrete wall",
  },
  {
    id: "the-archive",
    title: "The Archive",
    caption: "Pieces we keep remaking because you keep wearing them out.",
    image: photo("1525845859779-54d477ff291f", 1000, 1400),
    alt: "Densely hung rail of patterned dresses inside a warmly lit boutique",
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "amara",
    quote:
      "The coat arrived heavier than I expected, in the best way. Three winters on it still holds its shape — it has quietly become the only one I reach for.",
    name: "Amara Whitfield",
    role: "Architect, Copenhagen",
    avatar: photo("1494790108377-be9c29b29330", 200, 200),
    alt: "Portrait of Amara Whitfield",
  },
  {
    id: "diego",
    quote:
      "I stopped buying six things a season and started buying two. FashiOnia made that easy — the fit notes are honest and nothing has needed returning.",
    name: "Diego Ferrant",
    role: "Photographer, Lisbon",
    avatar: photo("1500648767791-00dcc994a43e", 200, 200),
    alt: "Portrait of Diego Ferrant",
  },
  {
    id: "sena",
    quote:
      "Everything reads expensive without shouting. I wore the satchel to a client pitch and to the market on the same day and it belonged in both rooms.",
    name: "Sena Kuroda",
    role: "Creative Director, Kyoto",
    avatar: photo("1544005313-94ddf0286df2", 200, 200),
    alt: "Portrait of Sena Kuroda",
  },
  {
    id: "malik",
    quote:
      "Delivery was two days, the packaging was paper, and the shirt fit exactly as the size chart promised. That combination is rarer than it should be.",
    name: "Malik Ansari",
    role: "Chef, Toronto",
    avatar: photo("1507003211169-0a1dd7228f2d", 200, 200),
    alt: "Portrait of Malik Ansari",
  },
];

/* ---------------------------------------------------------------------------
   Contact & payment
   --------------------------------------------------------------------------- */

export const contact = {
  whatsapp: {
    /** E.164, digits only — what wa.me expects. */
    number: "972569100079",
    display: "+972 56 910 0079",
  },
  /** Where payment receipts and enquiries land. */
  email: "abedaboayman@gmail.com",
  bank: {
    name: "Bank of Palestine",
    accountName: "عبدالرحمن حبوب",
    accountNumber: "0599958747",
  },
};

/** Deep link into WhatsApp with an optional pre-filled message. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${contact.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Social profiles. Left empty until the owner supplies real URLs — an empty
 * value falls back to the WhatsApp contact so the control is never dead.
 */
export const socialLinks: Record<"instagram" | "youtube" | "threads", string> = {
  instagram: "",
  youtube: "",
  threads: "",
};

/* ---------------------------------------------------------------------------
   Footer
   --------------------------------------------------------------------------- */

export type FooterLink =
  | { label: string; kind: "section"; href: string }
  | { label: string; kind: "filter"; filter: ShopFilter }
  | { label: string; kind: "whatsapp"; message: string };

export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

/**
 * Every footer link resolves to something that exists: an on-page section,
 * a product filter, or a WhatsApp conversation for topics the single page
 * has no dedicated section for (shipping, sizing, careers…).
 */
export const footerColumns: FooterColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", kind: "filter", filter: "All" },
      { label: "Women", kind: "filter", filter: "Women" },
      { label: "Men", kind: "filter", filter: "Men" },
      { label: "Accessories", kind: "filter", filter: "Accessories" },
      { label: "Footwear", kind: "filter", filter: "Footwear" },
      { label: "Gift Cards", kind: "whatsapp", message: "Hello FashiOnia, I'd like to buy a gift card." },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", kind: "section", href: "/#story" },
      { label: "Materials", kind: "section", href: "/#story" },
      { label: "Sustainability", kind: "section", href: "/#story" },
      { label: "Stockists", kind: "whatsapp", message: "Hello FashiOnia, where can I find your pieces in store?" },
      { label: "Careers", kind: "whatsapp", message: "Hello FashiOnia, I'm interested in working with you." },
      { label: "Press", kind: "whatsapp", message: "Hello FashiOnia, I have a press enquiry." },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", kind: "whatsapp", message: "Hello FashiOnia 👋" },
      { label: "Shipping", kind: "whatsapp", message: "Hello FashiOnia, I have a question about shipping." },
      { label: "Returns & Exchanges", kind: "whatsapp", message: "Hello FashiOnia, I'd like to return or exchange an item." },
      { label: "Size Guide", kind: "whatsapp", message: "Hello FashiOnia, could you help me with sizing?" },
      { label: "Care Guide", kind: "whatsapp", message: "Hello FashiOnia, how should I care for my piece?" },
      { label: "FAQ", kind: "whatsapp", message: "Hello FashiOnia, I have a question." },
    ],
  },
];

/** Sale ends at a fixed point so the countdown is deterministic on the server. */
export const saleEndsAt = "2026-12-31T23:59:59Z";
