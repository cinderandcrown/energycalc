// Comprehensive global metals & minerals database for cost-basis analysis
// density = g/cm³, defaultPrice = $/lb (approximate market), unit = pricing unit

const METAL_DATABASE = [
  // ═══ BASE METALS ═══
  { name: "Copper (Cu)", category: "Base Metals", density: 8.96, defaultPrice: 4.20, unit: "lb", symbol: "Cu" },
  { name: "Aluminum (Al)", category: "Base Metals", density: 2.70, defaultPrice: 1.15, unit: "lb", symbol: "Al" },
  { name: "Zinc (Zn)", category: "Base Metals", density: 7.13, defaultPrice: 1.30, unit: "lb", symbol: "Zn" },
  { name: "Nickel (Ni)", category: "Base Metals", density: 8.90, defaultPrice: 7.50, unit: "lb", symbol: "Ni" },
  { name: "Lead (Pb)", category: "Base Metals", density: 11.34, defaultPrice: 0.95, unit: "lb", symbol: "Pb" },
  { name: "Tin (Sn)", category: "Base Metals", density: 7.31, defaultPrice: 12.50, unit: "lb", symbol: "Sn" },
  { name: "Antimony (Sb)", category: "Base Metals", density: 6.70, defaultPrice: 8.00, unit: "lb", symbol: "Sb" },
  { name: "Bismuth (Bi)", category: "Base Metals", density: 9.78, defaultPrice: 5.50, unit: "lb", symbol: "Bi" },
  { name: "Cadmium (Cd)", category: "Base Metals", density: 8.65, defaultPrice: 1.80, unit: "lb", symbol: "Cd" },
  { name: "Mercury (Hg)", category: "Base Metals", density: 13.53, defaultPrice: 18.00, unit: "lb", symbol: "Hg" },

  // ═══ STEEL & IRON ═══
  { name: "Steel HRC (Hot-Rolled Coil)", category: "Steel & Iron", density: 7.85, defaultPrice: 0.40, unit: "lb", symbol: "HRC" },
  { name: "Steel CRC (Cold-Rolled Coil)", category: "Steel & Iron", density: 7.85, defaultPrice: 0.50, unit: "lb", symbol: "CRC" },
  { name: "Stainless Steel 304", category: "Steel & Iron", density: 8.00, defaultPrice: 1.30, unit: "lb", symbol: "SS304" },
  { name: "Stainless Steel 316", category: "Steel & Iron", density: 8.00, defaultPrice: 1.80, unit: "lb", symbol: "SS316" },
  { name: "Galvanized Steel", category: "Steel & Iron", density: 7.85, defaultPrice: 0.55, unit: "lb", symbol: "GS" },
  { name: "Tool Steel (D2)", category: "Steel & Iron", density: 7.70, defaultPrice: 2.50, unit: "lb", symbol: "D2" },
  { name: "Iron Ore (62% Fe)", category: "Steel & Iron", density: 5.15, defaultPrice: 0.06, unit: "lb", symbol: "Fe62" },
  { name: "Pig Iron", category: "Steel & Iron", density: 7.20, defaultPrice: 0.22, unit: "lb", symbol: "PIG" },
  { name: "Steel Rebar", category: "Steel & Iron", density: 7.85, defaultPrice: 0.35, unit: "lb", symbol: "REBAR" },
  { name: "Steel Plate (A36)", category: "Steel & Iron", density: 7.85, defaultPrice: 0.45, unit: "lb", symbol: "A36" },
  { name: "Spring Steel (1095)", category: "Steel & Iron", density: 7.85, defaultPrice: 1.20, unit: "lb", symbol: "1095" },
  { name: "Cast Iron", category: "Steel & Iron", density: 7.20, defaultPrice: 0.30, unit: "lb", symbol: "CI" },

  // ═══ PRECIOUS METALS ═══
  { name: "Gold (Au)", category: "Precious", density: 19.32, defaultPrice: 38500, unit: "lb", symbol: "Au" },
  { name: "Silver (Ag)", category: "Precious", density: 10.49, defaultPrice: 480, unit: "lb", symbol: "Ag" },
  { name: "Platinum (Pt)", category: "Precious", density: 21.45, defaultPrice: 15500, unit: "lb", symbol: "Pt" },
  { name: "Palladium (Pd)", category: "Precious", density: 12.02, defaultPrice: 14500, unit: "lb", symbol: "Pd" },
  { name: "Rhodium (Rh)", category: "Precious", density: 12.41, defaultPrice: 72000, unit: "lb", symbol: "Rh" },
  { name: "Iridium (Ir)", category: "Precious", density: 22.56, defaultPrice: 65000, unit: "lb", symbol: "Ir" },
  { name: "Ruthenium (Ru)", category: "Precious", density: 12.37, defaultPrice: 6800, unit: "lb", symbol: "Ru" },
  { name: "Osmium (Os)", category: "Precious", density: 22.59, defaultPrice: 18000, unit: "lb", symbol: "Os" },

  // ═══ ALLOYS & SUPERALLOYS ═══
  { name: "Brass (C360)", category: "Alloys", density: 8.50, defaultPrice: 3.20, unit: "lb", symbol: "C360" },
  { name: "Bronze (C932)", category: "Alloys", density: 8.90, defaultPrice: 4.80, unit: "lb", symbol: "C932" },
  { name: "Inconel 625", category: "Alloys", density: 8.44, defaultPrice: 22.00, unit: "lb", symbol: "IN625" },
  { name: "Inconel 718", category: "Alloys", density: 8.19, defaultPrice: 28.00, unit: "lb", symbol: "IN718" },
  { name: "Hastelloy C-276", category: "Alloys", density: 8.89, defaultPrice: 25.00, unit: "lb", symbol: "C276" },
  { name: "Monel 400", category: "Alloys", density: 8.80, defaultPrice: 12.00, unit: "lb", symbol: "M400" },
  { name: "Stellite 6", category: "Alloys", density: 8.44, defaultPrice: 35.00, unit: "lb", symbol: "ST6" },
  { name: "Pewter", category: "Alloys", density: 7.30, defaultPrice: 10.00, unit: "lb", symbol: "PEW" },
  { name: "Solder (60/40)", category: "Alloys", density: 8.50, defaultPrice: 8.50, unit: "lb", symbol: "SLDR" },
  { name: "Invar 36", category: "Alloys", density: 8.05, defaultPrice: 15.00, unit: "lb", symbol: "INV36" },
  { name: "Kovar", category: "Alloys", density: 8.36, defaultPrice: 18.00, unit: "lb", symbol: "KVR" },
  { name: "Mu-Metal", category: "Alloys", density: 8.75, defaultPrice: 20.00, unit: "lb", symbol: "MU" },

  // ═══ LIGHT METALS & AEROSPACE ═══
  { name: "Titanium (Ti Grade 2)", category: "Aerospace", density: 4.51, defaultPrice: 15.00, unit: "lb", symbol: "Ti2" },
  { name: "Titanium (Ti-6Al-4V)", category: "Aerospace", density: 4.43, defaultPrice: 25.00, unit: "lb", symbol: "Ti64" },
  { name: "Magnesium (Mg)", category: "Aerospace", density: 1.74, defaultPrice: 2.50, unit: "lb", symbol: "Mg" },
  { name: "Beryllium (Be)", category: "Aerospace", density: 1.85, defaultPrice: 350.00, unit: "lb", symbol: "Be" },
  { name: "Aluminum 6061-T6", category: "Aerospace", density: 2.70, defaultPrice: 1.80, unit: "lb", symbol: "6061" },
  { name: "Aluminum 7075-T6", category: "Aerospace", density: 2.81, defaultPrice: 3.50, unit: "lb", symbol: "7075" },
  { name: "Aluminum 2024-T3", category: "Aerospace", density: 2.78, defaultPrice: 3.00, unit: "lb", symbol: "2024" },
  { name: "Lithium (Li)", category: "Aerospace", density: 0.53, defaultPrice: 12.00, unit: "lb", symbol: "Li" },
  { name: "Scandium (Sc)", category: "Aerospace", density: 2.99, defaultPrice: 6000.00, unit: "lb", symbol: "Sc" },

  // ═══ CRITICAL / STRATEGIC MINERALS ═══
  { name: "Cobalt (Co)", category: "Critical Minerals", density: 8.90, defaultPrice: 15.00, unit: "lb", symbol: "Co" },
  { name: "Molybdenum (Mo)", category: "Critical Minerals", density: 10.22, defaultPrice: 20.00, unit: "lb", symbol: "Mo" },
  { name: "Tungsten (W)", category: "Critical Minerals", density: 19.25, defaultPrice: 18.00, unit: "lb", symbol: "W" },
  { name: "Vanadium (V)", category: "Critical Minerals", density: 6.11, defaultPrice: 12.00, unit: "lb", symbol: "V" },
  { name: "Manganese (Mn)", category: "Critical Minerals", density: 7.47, defaultPrice: 1.80, unit: "lb", symbol: "Mn" },
  { name: "Chromium (Cr)", category: "Critical Minerals", density: 7.19, defaultPrice: 5.50, unit: "lb", symbol: "Cr" },
  { name: "Niobium (Nb)", category: "Critical Minerals", density: 8.57, defaultPrice: 22.00, unit: "lb", symbol: "Nb" },
  { name: "Tantalum (Ta)", category: "Critical Minerals", density: 16.65, defaultPrice: 110.00, unit: "lb", symbol: "Ta" },
  { name: "Zirconium (Zr)", category: "Critical Minerals", density: 6.51, defaultPrice: 35.00, unit: "lb", symbol: "Zr" },
  { name: "Hafnium (Hf)", category: "Critical Minerals", density: 13.31, defaultPrice: 450.00, unit: "lb", symbol: "Hf" },
  { name: "Rhenium (Re)", category: "Critical Minerals", density: 21.02, defaultPrice: 750.00, unit: "lb", symbol: "Re" },
  { name: "Germanium (Ge)", category: "Critical Minerals", density: 5.32, defaultPrice: 600.00, unit: "lb", symbol: "Ge" },
  { name: "Gallium (Ga)", category: "Critical Minerals", density: 5.91, defaultPrice: 200.00, unit: "lb", symbol: "Ga" },
  { name: "Indium (In)", category: "Critical Minerals", density: 7.31, defaultPrice: 180.00, unit: "lb", symbol: "In" },
  { name: "Tellurium (Te)", category: "Critical Minerals", density: 6.24, defaultPrice: 35.00, unit: "lb", symbol: "Te" },
  { name: "Selenium (Se)", category: "Critical Minerals", density: 4.81, defaultPrice: 15.00, unit: "lb", symbol: "Se" },

  // ═══ RARE EARTH ELEMENTS ═══
  { name: "Neodymium (Nd)", category: "Rare Earth", density: 7.01, defaultPrice: 65.00, unit: "lb", symbol: "Nd" },
  { name: "Praseodymium (Pr)", category: "Rare Earth", density: 6.77, defaultPrice: 55.00, unit: "lb", symbol: "Pr" },
  { name: "Dysprosium (Dy)", category: "Rare Earth", density: 8.55, defaultPrice: 150.00, unit: "lb", symbol: "Dy" },
  { name: "Terbium (Tb)", category: "Rare Earth", density: 8.23, defaultPrice: 550.00, unit: "lb", symbol: "Tb" },
  { name: "Cerium (Ce)", category: "Rare Earth", density: 6.77, defaultPrice: 2.50, unit: "lb", symbol: "Ce" },
  { name: "Lanthanum (La)", category: "Rare Earth", density: 6.15, defaultPrice: 2.00, unit: "lb", symbol: "La" },
  { name: "Yttrium (Y)", category: "Rare Earth", density: 4.47, defaultPrice: 18.00, unit: "lb", symbol: "Y" },
  { name: "Samarium (Sm)", category: "Rare Earth", density: 7.52, defaultPrice: 8.00, unit: "lb", symbol: "Sm" },
  { name: "Europium (Eu)", category: "Rare Earth", density: 5.24, defaultPrice: 30.00, unit: "lb", symbol: "Eu" },
  { name: "Gadolinium (Gd)", category: "Rare Earth", density: 7.90, defaultPrice: 20.00, unit: "lb", symbol: "Gd" },
  { name: "Erbium (Er)", category: "Rare Earth", density: 9.07, defaultPrice: 25.00, unit: "lb", symbol: "Er" },
  { name: "Holmium (Ho)", category: "Rare Earth", density: 8.80, defaultPrice: 40.00, unit: "lb", symbol: "Ho" },

  // ═══ BATTERY & EV METALS ═══
  { name: "Lithium Carbonate", category: "Battery Metals", density: 2.11, defaultPrice: 6.00, unit: "lb", symbol: "Li2CO3" },
  { name: "Lithium Hydroxide", category: "Battery Metals", density: 1.46, defaultPrice: 7.50, unit: "lb", symbol: "LiOH" },
  { name: "Cobalt (Battery Grade)", category: "Battery Metals", density: 8.90, defaultPrice: 16.00, unit: "lb", symbol: "CoBG" },
  { name: "Nickel Sulfate", category: "Battery Metals", density: 3.68, defaultPrice: 4.50, unit: "lb", symbol: "NiSO4" },
  { name: "Manganese Sulfate", category: "Battery Metals", density: 3.25, defaultPrice: 0.80, unit: "lb", symbol: "MnSO4" },
  { name: "Graphite (Natural Flake)", category: "Battery Metals", density: 2.26, defaultPrice: 0.50, unit: "lb", symbol: "GrNF" },
  { name: "Graphite (Synthetic)", category: "Battery Metals", density: 2.26, defaultPrice: 5.00, unit: "lb", symbol: "GrSy" },
  { name: "Silicon Metal (99%)", category: "Battery Metals", density: 2.33, defaultPrice: 1.50, unit: "lb", symbol: "Si99" },

  // ═══ NUCLEAR & ENERGY METALS ═══
  { name: "Uranium (U₃O₈)", category: "Nuclear", density: 8.30, defaultPrice: 40.00, unit: "lb", symbol: "U3O8" },
  { name: "Enriched Uranium (SWU)", category: "Nuclear", density: 19.05, defaultPrice: 85.00, unit: "lb", symbol: "SWU" },
  { name: "Thorium (Th)", category: "Nuclear", density: 11.72, defaultPrice: 25.00, unit: "lb", symbol: "Th" },

  // ═══ INDUSTRIAL MINERALS & NON-METALLIC ═══
  { name: "Copper Wire (Bare Bright)", category: "Scrap & Recycled", density: 8.96, defaultPrice: 3.80, unit: "lb", symbol: "CuBB" },
  { name: "Aluminum Scrap (6063)", category: "Scrap & Recycled", density: 2.70, defaultPrice: 0.75, unit: "lb", symbol: "Al6063S" },
  { name: "Steel Scrap (HMS)", category: "Scrap & Recycled", density: 7.85, defaultPrice: 0.18, unit: "lb", symbol: "HMS" },
  { name: "Stainless Scrap (304)", category: "Scrap & Recycled", density: 8.00, defaultPrice: 0.60, unit: "lb", symbol: "SS304S" },
  { name: "Brass Scrap (Yellow)", category: "Scrap & Recycled", density: 8.50, defaultPrice: 2.00, unit: "lb", symbol: "BrYS" },
  { name: "Catalytic Converter (PGM)", category: "Scrap & Recycled", density: 4.00, defaultPrice: 45.00, unit: "lb", symbol: "CATPGM" },
  { name: "E-Waste (Circuit Boards)", category: "Scrap & Recycled", density: 3.50, defaultPrice: 3.50, unit: "lb", symbol: "EWCB" },
  { name: "Lead-Acid Battery Scrap", category: "Scrap & Recycled", density: 5.00, defaultPrice: 0.30, unit: "lb", symbol: "LABS" },
];

const METAL_CATEGORIES = [
  "All",
  "Base Metals",
  "Steel & Iron",
  "Precious",
  "Alloys",
  "Aerospace",
  "Critical Minerals",
  "Rare Earth",
  "Battery Metals",
  "Nuclear",
  "Scrap & Recycled",
];

const METAL_CATEGORY_ICONS = {
  "All": "🌐",
  "Base Metals": "🔶",
  "Steel & Iron": "🏗️",
  "Precious": "💎",
  "Alloys": "⚙️",
  "Aerospace": "🚀",
  "Critical Minerals": "🔬",
  "Rare Earth": "🧲",
  "Battery Metals": "🔋",
  "Nuclear": "☢️",
  "Scrap & Recycled": "♻️",
};

export { METAL_DATABASE, METAL_CATEGORIES, METAL_CATEGORY_ICONS };