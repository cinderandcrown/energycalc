// Comprehensive global crop database for agricultural yield projections
// avgYield = national/global average per acre, costPerAcre = typical production cost

const CROP_DATABASE = [
  // ═══ GRAINS & CEREALS ═══
  { name: "Corn (Grain)", category: "Grains", avgYield: 175, unit: "bu/acre", costPerAcre: 850 },
  { name: "Corn (Silage)", category: "Grains", avgYield: 22, unit: "ton/acre", costPerAcre: 750 },
  { name: "Winter Wheat", category: "Grains", avgYield: 50, unit: "bu/acre", costPerAcre: 450 },
  { name: "Spring Wheat", category: "Grains", avgYield: 45, unit: "bu/acre", costPerAcre: 420 },
  { name: "Durum Wheat", category: "Grains", avgYield: 38, unit: "bu/acre", costPerAcre: 410 },
  { name: "Rice (Paddy)", category: "Grains", avgYield: 7600, unit: "lb/acre", costPerAcre: 1200 },
  { name: "Barley", category: "Grains", avgYield: 72, unit: "bu/acre", costPerAcre: 380 },
  { name: "Oats", category: "Grains", avgYield: 64, unit: "bu/acre", costPerAcre: 320 },
  { name: "Sorghum (Milo)", category: "Grains", avgYield: 70, unit: "bu/acre", costPerAcre: 420 },
  { name: "Rye", category: "Grains", avgYield: 30, unit: "bu/acre", costPerAcre: 300 },
  { name: "Millet", category: "Grains", avgYield: 25, unit: "bu/acre", costPerAcre: 280 },
  { name: "Triticale", category: "Grains", avgYield: 55, unit: "bu/acre", costPerAcre: 360 },

  // ═══ OILSEEDS & PULSES ═══
  { name: "Soybeans", category: "Oilseeds", avgYield: 50, unit: "bu/acre", costPerAcre: 550 },
  { name: "Canola / Rapeseed", category: "Oilseeds", avgYield: 40, unit: "bu/acre", costPerAcre: 480 },
  { name: "Sunflower (Oil)", category: "Oilseeds", avgYield: 1600, unit: "lb/acre", costPerAcre: 500 },
  { name: "Sunflower (Confection)", category: "Oilseeds", avgYield: 1400, unit: "lb/acre", costPerAcre: 520 },
  { name: "Flax / Linseed", category: "Oilseeds", avgYield: 20, unit: "bu/acre", costPerAcre: 350 },
  { name: "Peanuts", category: "Oilseeds", avgYield: 4200, unit: "lb/acre", costPerAcre: 1100 },
  { name: "Dry Beans (Pinto)", category: "Oilseeds", avgYield: 1800, unit: "lb/acre", costPerAcre: 550 },
  { name: "Lentils", category: "Oilseeds", avgYield: 1200, unit: "lb/acre", costPerAcre: 400 },
  { name: "Chickpeas", category: "Oilseeds", avgYield: 1500, unit: "lb/acre", costPerAcre: 450 },
  { name: "Safflower", category: "Oilseeds", avgYield: 1400, unit: "lb/acre", costPerAcre: 380 },
  { name: "Mustard Seed", category: "Oilseeds", avgYield: 1000, unit: "lb/acre", costPerAcre: 340 },
  { name: "Sesame", category: "Oilseeds", avgYield: 700, unit: "lb/acre", costPerAcre: 500 },
  { name: "Camelina", category: "Oilseeds", avgYield: 1200, unit: "lb/acre", costPerAcre: 320 },
  { name: "Hemp (Grain)", category: "Oilseeds", avgYield: 1000, unit: "lb/acre", costPerAcre: 600 },

  // ═══ FIBER & INDUSTRIAL ═══
  { name: "Upland Cotton", category: "Fiber", avgYield: 800, unit: "lb/acre", costPerAcre: 750 },
  { name: "Pima Cotton", category: "Fiber", avgYield: 600, unit: "lb/acre", costPerAcre: 900 },
  { name: "Hemp (Fiber)", category: "Fiber", avgYield: 3500, unit: "lb/acre", costPerAcre: 700 },
  { name: "Tobacco (Burley)", category: "Fiber", avgYield: 2200, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Tobacco (Flue-Cured)", category: "Fiber", avgYield: 2500, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Jute", category: "Fiber", avgYield: 2000, unit: "lb/acre", costPerAcre: 500 },

  // ═══ SUGAR & SWEETENERS ═══
  { name: "Sugarcane", category: "Sugar", avgYield: 35, unit: "ton/acre", costPerAcre: 2000 },
  { name: "Sugar Beets", category: "Sugar", avgYield: 30, unit: "ton/acre", costPerAcre: 1400 },
  { name: "Sweet Sorghum", category: "Sugar", avgYield: 25, unit: "ton/acre", costPerAcre: 600 },
  { name: "Stevia", category: "Sugar", avgYield: 2500, unit: "lb/acre", costPerAcre: 2000 },
  { name: "Maple Syrup", category: "Sugar", avgYield: 35, unit: "gal/acre", costPerAcre: 800 },

  // ═══ FRUITS ═══
  { name: "Apples", category: "Fruits", avgYield: 18000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Oranges", category: "Fruits", avgYield: 16000, unit: "lb/acre", costPerAcre: 4500 },
  { name: "Grapes (Wine)", category: "Fruits", avgYield: 6, unit: "ton/acre", costPerAcre: 5500 },
  { name: "Grapes (Table)", category: "Fruits", avgYield: 10, unit: "ton/acre", costPerAcre: 8000 },
  { name: "Strawberries", category: "Fruits", avgYield: 25000, unit: "lb/acre", costPerAcre: 25000 },
  { name: "Blueberries", category: "Fruits", avgYield: 8000, unit: "lb/acre", costPerAcre: 8000 },
  { name: "Raspberries", category: "Fruits", avgYield: 6000, unit: "lb/acre", costPerAcre: 10000 },
  { name: "Cherries (Sweet)", category: "Fruits", avgYield: 7000, unit: "lb/acre", costPerAcre: 7000 },
  { name: "Peaches", category: "Fruits", avgYield: 12000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Lemons", category: "Fruits", avgYield: 14000, unit: "lb/acre", costPerAcre: 4800 },
  { name: "Avocados", category: "Fruits", avgYield: 6000, unit: "lb/acre", costPerAcre: 7000 },
  { name: "Bananas", category: "Fruits", avgYield: 20000, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Cranberries", category: "Fruits", avgYield: 15000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Watermelon", category: "Fruits", avgYield: 30000, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Mangoes", category: "Fruits", avgYield: 8000, unit: "lb/acre", costPerAcre: 4500 },
  { name: "Pineapples", category: "Fruits", avgYield: 25000, unit: "lb/acre", costPerAcre: 5000 },

  // ═══ VEGETABLES ═══
  { name: "Potatoes", category: "Vegetables", avgYield: 40000, unit: "lb/acre", costPerAcre: 4500 },
  { name: "Sweet Potatoes", category: "Vegetables", avgYield: 20000, unit: "lb/acre", costPerAcre: 3000 },
  { name: "Tomatoes (Fresh)", category: "Vegetables", avgYield: 35000, unit: "lb/acre", costPerAcre: 12000 },
  { name: "Tomatoes (Processing)", category: "Vegetables", avgYield: 45000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Onions", category: "Vegetables", avgYield: 40000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Garlic", category: "Vegetables", avgYield: 12000, unit: "lb/acre", costPerAcre: 8000 },
  { name: "Carrots", category: "Vegetables", avgYield: 30000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Lettuce (Head)", category: "Vegetables", avgYield: 35000, unit: "lb/acre", costPerAcre: 7000 },
  { name: "Broccoli", category: "Vegetables", avgYield: 12000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Peppers (Bell)", category: "Vegetables", avgYield: 20000, unit: "lb/acre", costPerAcre: 9000 },
  { name: "Peppers (Hot/Chile)", category: "Vegetables", avgYield: 10000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Cabbage", category: "Vegetables", avgYield: 35000, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Asparagus", category: "Vegetables", avgYield: 3000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Sweet Corn", category: "Vegetables", avgYield: 14000, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Pumpkins", category: "Vegetables", avgYield: 25000, unit: "lb/acre", costPerAcre: 3000 },
  { name: "Squash (Summer)", category: "Vegetables", avgYield: 18000, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Cucumbers", category: "Vegetables", avgYield: 25000, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Celery", category: "Vegetables", avgYield: 60000, unit: "lb/acre", costPerAcre: 10000 },
  { name: "Spinach", category: "Vegetables", avgYield: 10000, unit: "lb/acre", costPerAcre: 5000 },

  // ═══ TREE NUTS ═══
  { name: "Almonds", category: "Tree Nuts", avgYield: 2200, unit: "lb/acre", costPerAcre: 5500 },
  { name: "Walnuts", category: "Tree Nuts", avgYield: 3200, unit: "lb/acre", costPerAcre: 4500 },
  { name: "Pecans", category: "Tree Nuts", avgYield: 1200, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Pistachios", category: "Tree Nuts", avgYield: 2800, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Macadamia", category: "Tree Nuts", avgYield: 3000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Hazelnuts", category: "Tree Nuts", avgYield: 2000, unit: "lb/acre", costPerAcre: 3000 },
  { name: "Cashews", category: "Tree Nuts", avgYield: 800, unit: "lb/acre", costPerAcre: 2500 },

  // ═══ TROPICAL & PLANTATION ═══
  { name: "Coffee (Arabica)", category: "Tropical", avgYield: 1500, unit: "lb/acre", costPerAcre: 3000 },
  { name: "Coffee (Robusta)", category: "Tropical", avgYield: 2000, unit: "lb/acre", costPerAcre: 2500 },
  { name: "Cocoa Beans", category: "Tropical", avgYield: 800, unit: "lb/acre", costPerAcre: 2000 },
  { name: "Tea", category: "Tropical", avgYield: 2500, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Vanilla", category: "Tropical", avgYield: 200, unit: "lb/acre", costPerAcre: 15000 },
  { name: "Rubber", category: "Tropical", avgYield: 1500, unit: "lb/acre", costPerAcre: 2000 },
  { name: "Palm Oil", category: "Tropical", avgYield: 4, unit: "ton/acre", costPerAcre: 2500 },
  { name: "Coconuts", category: "Tropical", avgYield: 6000, unit: "lb/acre", costPerAcre: 1800 },
  { name: "Cinnamon", category: "Tropical", avgYield: 400, unit: "lb/acre", costPerAcre: 3000 },
  { name: "Black Pepper", category: "Tropical", avgYield: 1200, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Turmeric", category: "Tropical", avgYield: 5000, unit: "lb/acre", costPerAcre: 3500 },
  { name: "Cardamom", category: "Tropical", avgYield: 300, unit: "lb/acre", costPerAcre: 5000 },

  // ═══ FORAGE & HAY ═══
  { name: "Alfalfa Hay", category: "Forage", avgYield: 6, unit: "ton/acre", costPerAcre: 600 },
  { name: "Timothy Hay", category: "Forage", avgYield: 3.5, unit: "ton/acre", costPerAcre: 400 },
  { name: "Bermuda Grass Hay", category: "Forage", avgYield: 5, unit: "ton/acre", costPerAcre: 450 },
  { name: "Corn Stover", category: "Forage", avgYield: 4, unit: "ton/acre", costPerAcre: 200 },
  { name: "Switchgrass", category: "Forage", avgYield: 5, unit: "ton/acre", costPerAcre: 350 },
  { name: "Miscanthus", category: "Forage", avgYield: 8, unit: "ton/acre", costPerAcre: 500 },

  // ═══ SPECIALTY & HERBS ═══
  { name: "Hops", category: "Specialty", avgYield: 1800, unit: "lb/acre", costPerAcre: 12000 },
  { name: "Lavender", category: "Specialty", avgYield: 1500, unit: "lb/acre", costPerAcre: 5000 },
  { name: "Saffron", category: "Specialty", avgYield: 5, unit: "lb/acre", costPerAcre: 20000 },
  { name: "Ginseng", category: "Specialty", avgYield: 2000, unit: "lb/acre", costPerAcre: 18000 },
  { name: "CBD Hemp", category: "Specialty", avgYield: 1500, unit: "lb/acre", costPerAcre: 8000 },
  { name: "Mint (Peppermint)", category: "Specialty", avgYield: 90, unit: "lb/acre", costPerAcre: 1800 },
  { name: "Basil", category: "Specialty", avgYield: 8000, unit: "lb/acre", costPerAcre: 6000 },
  { name: "Oregano", category: "Specialty", avgYield: 4000, unit: "lb/acre", costPerAcre: 4000 },
  { name: "Ginger", category: "Specialty", avgYield: 15000, unit: "lb/acre", costPerAcre: 8000 },
  { name: "Mushrooms (Shiitake)", category: "Specialty", avgYield: 6000, unit: "lb/acre", costPerAcre: 15000 },

  // ═══ BIOFUEL & ENERGY CROPS ═══
  { name: "Corn (Ethanol)", category: "Biofuel", avgYield: 175, unit: "bu/acre", costPerAcre: 850 },
  { name: "Sugarcane (Ethanol)", category: "Biofuel", avgYield: 35, unit: "ton/acre", costPerAcre: 2000 },
  { name: "Soybeans (Biodiesel)", category: "Biofuel", avgYield: 50, unit: "bu/acre", costPerAcre: 550 },
  { name: "Jatropha", category: "Biofuel", avgYield: 1500, unit: "lb/acre", costPerAcre: 800 },
  { name: "Algae (Biodiesel)", category: "Biofuel", avgYield: 5000, unit: "gal/acre", costPerAcre: 25000 },
  { name: "Carinata", category: "Biofuel", avgYield: 1200, unit: "lb/acre", costPerAcre: 350 },
];

const CROP_CATEGORIES = [
  "All",
  "Grains",
  "Oilseeds",
  "Fiber",
  "Sugar",
  "Fruits",
  "Vegetables",
  "Tree Nuts",
  "Tropical",
  "Forage",
  "Specialty",
  "Biofuel",
];

const CATEGORY_ICONS = {
  All: "🌎",
  Grains: "🌾",
  Oilseeds: "🫘",
  Fiber: "🧶",
  Sugar: "🍬",
  Fruits: "🍎",
  Vegetables: "🥕",
  "Tree Nuts": "🥜",
  Tropical: "☕",
  Forage: "🌿",
  Specialty: "🌸",
  Biofuel: "⚡",
};

export { CROP_DATABASE, CROP_CATEGORIES, CATEGORY_ICONS };