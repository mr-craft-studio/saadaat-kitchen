import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Deal, Order, BusinessSettings, ContactMessage, AdminAuditLog } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'saadaat_store.json');

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface StoreData {
  products: Product[];
  deals: Deal[];
  orders: Order[];
  settings: BusinessSettings;
  adminUsers: AdminUser[];
  contactMessages: ContactMessage[];
  auditLogs: AdminAuditLog[];
}

// Initial products directly from the prompt
export const INITIAL_PRODUCTS: Product[] = [
  // Chicken Tikka & BBQ
  {
    id: 'prod-tikka-chest',
    name: 'Chicken Tikka Chest',
    category: 'tikka-bbq',
    price: 500,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Fresh succulent chicken chest piece marinated in traditional spices and charcoal grilled to perfection.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-tikka-leg',
    name: 'Chicken Tikka Leg',
    category: 'tikka-bbq',
    price: 500,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Juicy tender chicken leg piece barbecued on open charcoal with house special spice rub.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-malai-tikka',
    name: 'Chicken Malai Tikka',
    category: 'tikka-bbq',
    price: 600,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: false,
    description: 'Signature creamy boneless chicken tikka prepared with rich dairy cream, mild aromatic spices, and delicate charcoal smoke.',
    image: '/src/assets/images/chicken_malai_tikka_1792494253354.jpg'
  },
  {
    id: 'prod-bihari-tikka',
    name: 'Chicken Bihari Tikka',
    category: 'tikka-bbq',
    price: 630,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Melt-in-mouth chicken marinated in authentic Bihari raw papaya and roasted spice blend.',
    image: '/src/assets/images/chicken_malai_tikka_1792494253354.jpg'
  },
  {
    id: 'prod-balochi-tikka',
    name: 'Chicken Balochi Tikka',
    category: 'tikka-bbq',
    price: 650,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Crispy fried-then-spiced Balochi style chicken infused with garlic, green chilies, and crushed cumin.',
    image: '/src/assets/images/chicken_malai_tikka_1792494253354.jpg'
  },
  {
    id: 'prod-chicken-boti',
    name: 'Chicken Boti',
    category: 'tikka-bbq',
    price: 360,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Flavorful bite-sized chicken skewers grilled with tangy masala.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-malai-boti',
    name: 'Chicken Malai Boti',
    category: 'tikka-bbq',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: false,
    description: 'Ultra-creamy boneless chicken chunks with subtle white pepper and cardamom notes.',
    image: '/src/assets/images/chicken_malai_tikka_1792494253354.jpg'
  },
  {
    id: 'prod-reshmi-kabab',
    name: 'Chicken Reshmi Kabab',
    category: 'tikka-bbq',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: false,
    description: 'Silky smooth seasoned minced chicken skewers roasted on charcoal embers.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-beef-bihari-boti',
    name: 'Beef Bihari Boti',
    category: 'tikka-bbq',
    price: 380,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Tenderized strips of beef steeped in mustard oil, roasted gram flour, and pungent spices.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-beef-seekh-kabab',
    name: 'Beef Seekh Kabab',
    category: 'tikka-bbq',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Juicy spiced minced beef skewers charcoal-roasted and served hot with mint raita.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-beef-gola-kabab',
    name: 'Beef Gola Kabab',
    category: 'tikka-bbq',
    price: 500,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isSpicy: true,
    description: 'Traditional round-shaped tender beef kababs bursting with herbs and smoke infusion.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },

  // Chicken Rolls
  {
    id: 'prod-chicken-roll',
    name: 'Chicken Roll',
    category: 'rolls',
    price: 250,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'Charcoal grilled chicken boti rolled in a flaky golden paratha with onions and green chutney.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-mayo-roll',
    name: 'Chicken Mayo Roll',
    category: 'rolls',
    price: 300,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Succulent BBQ chicken wrapped with house garlic mayonnaise sauce in a crisp paratha.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-mayo-garlic-roll',
    name: 'Chicken Mayo Garlic Roll',
    category: 'rolls',
    price: 310,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'Our customer favorite roll with roasted garlic mayo dressing over smoky chicken chunks.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-cheese-roll',
    name: 'Chicken Cheese Roll',
    category: 'rolls',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Hot grilled chicken rolled with melted mozzarella and cheddar cheese slice.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-cheese-mayo-roll',
    name: 'Chicken Cheese Mayo Roll',
    category: 'rolls',
    price: 360,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Double indulgence: melted cheese layer combined with rich garlic mayo and BBQ chicken.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-malai-roll',
    name: 'Chicken Malai Roll',
    category: 'rolls',
    price: 300,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Melt-in-mouth chicken malai boti wrapped in soft paratha with cream drizzle.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-malai-mayo-roll',
    name: 'Chicken Malai Mayo Roll',
    category: 'rolls',
    price: 320,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Creamy malai boti layered with thick mayonnaise in a crisp golden roll.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-malai-mayo-garlic-roll',
    name: 'Chicken Malai Mayo Garlic Roll',
    category: 'rolls',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Creamy chicken malai boti with robust garlic mayo inside fresh handmade paratha.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-malai-cheese-roll',
    name: 'Chicken Malai Cheese Roll',
    category: 'rolls',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Rich malai boti infused with gooey melted cheese.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-malai-cheese-mayo-roll',
    name: 'Chicken Malai Cheese Mayo Roll',
    category: 'rolls',
    price: 370,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'The supreme roll: malai chicken, melted cheese, and garlic mayo in perfect harmony.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-reshmi-roll',
    name: 'Chicken Reshmi Roll',
    category: 'rolls',
    price: 300,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Delicate chicken reshmi kabab rolled with onions and tangy mint chutney.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-reshmi-mayo-roll',
    name: 'Chicken Reshmi Mayo Roll',
    category: 'rolls',
    price: 310,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Soft reshmi kabab accented with smooth garlic mayo.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-reshmi-cheese-roll',
    name: 'Chicken Reshmi Cheese Roll',
    category: 'rolls',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Spiced reshmi kabab draped in melted premium cheese.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-chicken-reshmi-cheese-mayo-roll',
    name: 'Chicken Reshmi Cheese Mayo Roll',
    category: 'rolls',
    price: 360,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Minced chicken reshmi kabab with cheese and mayo in a paratha wrap.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-zinger-crispy-roll',
    name: 'Zinger Crispy Roll',
    category: 'rolls',
    price: 350,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Deep-fried crunchy zinger chicken fillet with lettuce and spicy mayo in a paratha.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-zinger-crispy-cheese-roll',
    name: 'Zinger Crispy Cheese Roll',
    category: 'rolls',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Crunchy golden zinger fillet smothered in melted cheddar cheese slice and spicy dressing.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },

  // Fried Chicken (Broast)
  {
    id: 'prod-broast-chest',
    name: 'Broast Chest',
    category: 'fried-chicken',
    price: 550,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'Crispy golden fried chicken breast quarter, juicy on the inside, served with fries and dinner bun.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-broast-leg',
    name: 'Broast Leg',
    category: 'fried-chicken',
    price: 520,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Golden fried chicken leg quarter seasoned with secret batter, served with crunchy fries.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-mayo-broast-chest',
    name: 'Mayo Broast Chest',
    category: 'fried-chicken',
    price: 580,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Crispy fried chest quarter coated in special garlic mayo glaze with french fries.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-mayo-broast-leg',
    name: 'Mayo Broast Leg',
    category: 'fried-chicken',
    price: 550,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Fried chicken leg quarter drizzled with creamy garlic mayo and served with crisp fries.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },

  // Burgers
  {
    id: 'prod-zinger-burger',
    name: 'Zinger Burger',
    category: 'burgers',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Signature crispy golden fried chicken fillet, spicy mayo, and crisp iceberg lettuce in a toasted sesame bun.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-zinger-cheese-burger',
    name: 'Zinger Cheese Burger',
    category: 'burgers',
    price: 450,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Crispy zinger chicken fillet topped with a thick melted cheddar cheese slice and spicy sauce.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-double-decker-zinger',
    name: 'Double Decker Zinger',
    category: 'burgers',
    price: 680,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    isSpicy: true,
    description: 'Two massive crispy chicken zinger fillets stacked with double cheese, jalapeños, and secret sauce.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-chicken-burger',
    name: 'Chicken Burger',
    category: 'burgers',
    price: 380,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Juicy spiced minced chicken patty with fresh tomatoes, cucumbers, and creamy mayo in a toasted bun.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-chicken-cheese-burger',
    name: 'Chicken Cheese Burger',
    category: 'burgers',
    price: 430,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Flavorful chicken patty with melted cheese, lettuce, and homemade burger dressing.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-beef-burger',
    name: 'Beef Burger',
    category: 'burgers',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Charbroiled beef patty packed with Pakistani ground spices, onions, and savory sauce.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-beef-cheese-burger',
    name: 'Beef Cheese Burger',
    category: 'burgers',
    price: 450,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Spiced charbroiled beef patty covered in melted cheddar cheese in a soft sesame bun.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-sada-burger',
    name: 'Sada Burger',
    category: 'burgers',
    price: 200,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Classic Pakistani shami bun kabab style burger with tangy sauce and crunchy onions.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },
  {
    id: 'prod-egg-burger',
    name: 'Egg Burger',
    category: 'burgers',
    price: 230,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Classic bun kabab topped with a golden pan-fried egg omelette, spicy chutney, and onions.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg'
  },

  // Sandwiches
  {
    id: 'prod-club-sandwich',
    name: 'Club Sandwich',
    category: 'sandwiches',
    price: 400,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'Triple-decker toasted bread filled with shredded chicken, fried egg, cucumber, and coleslaw.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-club-cheese-sandwich',
    name: 'Club Cheese Sandwich',
    category: 'sandwiches',
    price: 450,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Three-layer club sandwich enriched with sliced cheese, egg, chicken, and french fries.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-bbq-club-sandwich',
    name: 'BBQ Club Sandwich',
    category: 'sandwiches',
    price: 500,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Toasted multi-layer sandwich loaded with smoky BBQ chicken boti, sauce, and egg.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-bbq-malai-club-sandwich',
    name: 'BBQ Malai Club Sandwich',
    category: 'sandwiches',
    price: 550,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Smoky chicken malai boti pieces layered inside toasted bread with garlic cream sauce.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-bbq-malai-club-cheese-sandwich',
    name: 'BBQ Malai Club Cheese Sandwich',
    category: 'sandwiches',
    price: 550,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Luxurious combination of creamy malai BBQ chicken, melted cheese, egg, and salad.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-crispy-club-sandwich',
    name: 'Crispy Club Sandwich',
    category: 'sandwiches',
    price: 450,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Crispy breaded chicken strips nestled between layers of toasted bread with spicy mayo.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },
  {
    id: 'prod-crispy-club-cheese-sandwich',
    name: 'Crispy Club Cheese Sandwich',
    category: 'sandwiches',
    price: 550,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Crispy fried chicken strips with melted cheddar cheese slice in a 3-layer toasted sandwich.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg'
  },

  // Fries and Sides
  {
    id: 'prod-fries',
    name: 'Fries',
    category: 'fries-sides',
    price: 200,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    description: 'Crispy golden potato french fries dusted with tangy chat masala.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },
  {
    id: 'prod-mayo-fries',
    name: 'Mayo Fries',
    category: 'fries-sides',
    price: 300,
    priceConfirmed: true,
    isPublished: true,
    isAvailable: true,
    isBestseller: true,
    description: 'Hot crisp french fries loaded with creamy garlic mayonnaise and seasoning.',
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg'
  },

  // DRAFT / UNCONFIRMED PRODUCTS (Must not be published with invented prices)
  {
    id: 'prod-draft-chicken-double-burger',
    name: 'Chicken Double Burger',
    category: 'burgers',
    price: null,
    priceConfirmed: false,
    isPublished: false,
    isAvailable: false,
    description: 'Double chicken patties burger. Price pending manager confirmation.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg',
    notes: 'Price to confirm in admin before publishing.'
  },
  {
    id: 'prod-draft-beef-burger-650',
    name: 'Beef Burger 650',
    category: 'burgers',
    price: null,
    priceConfirmed: false,
    isPublished: false,
    isAvailable: false,
    description: 'Pending clarification whether this is a separate size or product, or if Rs. 650 refers to Chicken Double Burger.',
    image: '/src/assets/images/crispy_zinger_burger_1792494254928.jpg',
    notes: 'Clarify whether this is a separate size/product or refers to Chicken Double Burger.'
  },
  {
    id: 'prod-draft-bbq-club-cheese-sandwich',
    name: 'BBQ Club Cheese Sandwich',
    category: 'sandwiches',
    price: null,
    priceConfirmed: false,
    isPublished: false,
    isAvailable: false,
    description: 'BBQ club sandwich with cheese. Price to confirm in admin.',
    image: '/src/assets/images/chicken_mayo_roll_1792494255012.jpg',
    notes: 'Confirm price in admin before publishing.'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-momos-macaroni',
    title: 'Chinese & Momos Mega Deal',
    subtitle: 'Inspired by Saadaat Kitchen Official Food Poster',
    items: ['1 Bowl Spicy Chicken Macaroni', '6 Pieces Steamed Momos with Chili Sauce', '1 Chilled Cold Drink'],
    price: 750,
    originalPrice: 950,
    image: '/src/assets/images/special_deal_momos_combo_1792494255549.jpg',
    isAvailable: true,
    isPublished: true,
    badge: 'Popular Deal'
  },
  {
    id: 'deal-bbq-feast',
    title: 'Family BBQ Platter Deal',
    subtitle: 'Perfect for 2-3 Persons',
    items: ['1 Chicken Tikka (Chest/Leg)', '4 Pcs Malai Boti', '2 Chicken Mayo Garlic Rolls', '2 Parathas + Mint Raita'],
    price: 1350,
    originalPrice: 1550,
    image: '/src/assets/images/saadaat_hero_feast_1792494252618.jpg',
    isAvailable: true,
    isPublished: true,
    badge: 'Chef Choice'
  }
];

export const INITIAL_SETTINGS: BusinessSettings = {
  name: 'Saadaat Kitchen',
  tagline: 'Good Food ❤️ Happy Mood',
  phone: '+92 371 0238821',
  whatsapp: '923710238821',
  address: 'Saadaat Kitchen, Main Food Street, Pakistan',
  openingHours: '4:00 PM – 2:00 AM (Mon - Sun)',
  deliveryFee: 100,
  minOrder: 400,
  currency: 'Rs.',
  timeZone: 'Asia/Karachi',
  easypaisaAccountName: 'Syeda Iqraa',
  easypaisaAccountNumber: '+92 371 0238821',
  easypaisaInstructions: 'Transfer the exact order total to Easypaisa account Syeda Iqraa (+92 371 0238821). Keep the TRX ID or receipt handy to enter during checkout or send via WhatsApp.',
  deliveryEnabled: true,
  pickupEnabled: true
};

class DataStore {
  private data: StoreData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          deals: parsed.deals || INITIAL_DEALS,
          orders: parsed.orders || [],
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          adminUsers: parsed.adminUsers || [],
          contactMessages: parsed.contactMessages || [],
          auditLogs: parsed.auditLogs || []
        };
      }
    } catch (err) {
      console.error('Error loading data store, using initial data:', err);
    }

    return {
      products: INITIAL_PRODUCTS,
      deals: INITIAL_DEALS,
      orders: [],
      settings: INITIAL_SETTINGS,
      adminUsers: [],
      contactMessages: [],
      auditLogs: []
    };
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save data store:', err);
    }
  }

  // Admin Setup & Password Security
  public getAdminUsers(): AdminUser[] {
    return this.data.adminUsers;
  }

  public addAdminUser(email: string, passwordHash: string, salt: string): AdminUser {
    const newUser: AdminUser = {
      id: 'admin-' + Date.now(),
      email: email.toLowerCase().trim(),
      passwordHash,
      salt,
      createdAt: new Date().toISOString()
    };
    this.data.adminUsers.push(newUser);
    this.logAudit('ADMIN_CREATED', `New admin account registered: ${newUser.email}`, newUser.email);
    this.save();
    return newUser;
  }

  public findAdminByEmail(email: string): AdminUser | undefined {
    return this.data.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  // Products
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getPublishedProducts(): Product[] {
    return this.data.products.filter(p => p.isPublished && p.priceConfirmed && p.price !== null);
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public saveProduct(product: Product, adminEmail: string = 'admin'): Product {
    const idx = this.data.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      this.data.products[idx] = product;
      this.logAudit('PRODUCT_UPDATED', `Updated product ${product.name} (Rs. ${product.price})`, adminEmail);
    } else {
      this.data.products.push(product);
      this.logAudit('PRODUCT_CREATED', `Created new product ${product.name}`, adminEmail);
    }
    this.save();
    return product;
  }

  public deleteProduct(id: string, adminEmail: string = 'admin'): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      const name = this.data.products[idx].name;
      this.data.products.splice(idx, 1);
      this.logAudit('PRODUCT_DELETED', `Deleted product ${name} (${id})`, adminEmail);
      this.save();
      return true;
    }
    return false;
  }

  // Deals
  public getDeals(): Deal[] {
    return this.data.deals;
  }

  public saveDeal(deal: Deal, adminEmail: string = 'admin'): Deal {
    const idx = this.data.deals.findIndex(d => d.id === deal.id);
    if (idx >= 0) {
      this.data.deals[idx] = deal;
      this.logAudit('DEAL_UPDATED', `Updated deal ${deal.title}`, adminEmail);
    } else {
      this.data.deals.push(deal);
      this.logAudit('DEAL_CREATED', `Created deal ${deal.title}`, adminEmail);
    }
    this.save();
    return deal;
  }

  // Orders
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.logAudit('ORDER_CREATED', `New order ${order.orderNumber} placed by ${order.customerName} (Rs. ${order.totalAmount})`, 'customer');
    this.save();
    return order;
  }

  public updateOrderStatus(
    orderNumber: string,
    status: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus'],
    note?: string,
    adminEmail: string = 'admin'
  ): Order | null {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;

    order.orderStatus = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status changed to ${status}`,
      by: adminEmail
    });

    this.logAudit('ORDER_STATUS_CHANGED', `Order ${orderNumber} changed to ${status} (${paymentStatus || order.paymentStatus})`, adminEmail);
    this.save();
    return order;
  }

  public updatePaymentVerification(
    orderNumber: string,
    verified: boolean,
    notes?: string,
    adminEmail: string = 'admin'
  ): Order | null {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;

    order.paymentStatus = verified ? 'verified' : 'rejected';
    order.updatedAt = new Date().toISOString();
    if (notes) {
      order.internalNotes = (order.internalNotes ? order.internalNotes + '\n' : '') + notes;
    }
    order.statusHistory.push({
      status: order.orderStatus,
      timestamp: new Date().toISOString(),
      note: verified ? 'Easypaisa payment verified' : 'Easypaisa payment rejected',
      by: adminEmail
    });

    this.logAudit('PAYMENT_VERIFICATION', `Order ${orderNumber} payment marked as ${order.paymentStatus}`, adminEmail);
    this.save();
    return order;
  }

  // Settings
  public getSettings(): BusinessSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<BusinessSettings>, adminEmail: string = 'admin'): BusinessSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.logAudit('SETTINGS_UPDATED', `Business settings updated`, adminEmail);
    this.save();
    return this.data.settings;
  }

  // Contact messages
  public getContactMessages(): ContactMessage[] {
    return this.data.contactMessages;
  }

  public addContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new',
      ...msg
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  // Audit logs
  public getAuditLogs(): AdminAuditLog[] {
    return this.data.auditLogs.slice(0, 100);
  }

  public logAudit(action: string, details: string, user: string): void {
    const entry: AdminAuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      action,
      details,
      user
    };
    this.data.auditLogs.unshift(entry);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
  }
}

export const store = new DataStore();
