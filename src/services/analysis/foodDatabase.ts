/**
 * Demo nutrition estimates for the mock analyser.
 * Values are reasonable rounded estimates for typical Malaysian
 * kopitiam/home portions — not medical-grade data.
 * Later replaced by a real AI provider behind /api/analyze-meal.
 */

export interface FoodEntry {
  name: string;
  aliases: string[];
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Sugar/milk-based drink modifiers (kurang manis / kosong) apply. */
  drink?: boolean;
  sweet?: boolean;
}

export const FOOD_DATABASE: FoodEntry[] = [
  // ---- rice & one-plate meals ----
  { name: "Nasi lemak", aliases: ["nasi lemak"], portion: "1 packet with sambal & egg", calories: 400, proteinG: 11, carbsG: 58, fatG: 13 },
  { name: "Nasi kandar", aliases: ["nasi kandar"], portion: "1 plate with mixed curry", calories: 410, proteinG: 9, carbsG: 60, fatG: 13 },
  { name: "Nasi ayam (chicken rice)", aliases: ["nasi ayam", "chicken rice"], portion: "1 plate", calories: 480, proteinG: 18, carbsG: 62, fatG: 15 },
  { name: "Nasi briyani", aliases: ["nasi briyani", "nasi beriani", "briyani", "biryani"], portion: "1 plate", calories: 520, proteinG: 17, carbsG: 70, fatG: 18 },
  { name: "Nasi goreng", aliases: ["nasi goreng kampung", "nasi goreng", "fried rice"], portion: "1 plate", calories: 450, proteinG: 12, carbsG: 62, fatG: 16 },
  { name: "Nasi putih", aliases: ["nasi putih", "white rice", "steamed rice"], portion: "1 plate (~180 g)", calories: 260, proteinG: 5, carbsG: 56, fatG: 1 },
  { name: "Kuah campur (curry gravy)", aliases: ["kuah campur", "curry gravy", "kuah"], portion: "2 ladles", calories: 90, proteinG: 2, carbsG: 5, fatG: 7 },
  { name: "Brown rice", aliases: ["brown rice"], portion: "1 cup cooked", calories: 215, proteinG: 5, carbsG: 45, fatG: 2 },
  { name: "Ketupat / nasi impit", aliases: ["nasi impit", "ketupat"], portion: "2 pieces", calories: 180, proteinG: 4, carbsG: 38, fatG: 1 },

  // ---- proteins: chicken, meat, fish, eggs ----
  { name: "Ayam kari (chicken curry)", aliases: ["ayam kari", "kari ayam", "chicken curry"], portion: "1 piece + gravy", calories: 320, proteinG: 25, carbsG: 8, fatG: 21 },
  { name: "Ayam goreng (fried chicken)", aliases: ["ayam goreng berempah", "ayam goreng", "fried chicken"], portion: "1 piece", calories: 260, proteinG: 22, carbsG: 6, fatG: 16 },
  { name: "Ayam bakar (grilled chicken)", aliases: ["ayam bakar", "ayam panggang"], portion: "1 piece", calories: 240, proteinG: 27, carbsG: 2, fatG: 13 },
  { name: "Ayam masak merah", aliases: ["ayam masak merah", "masak merah"], portion: "1 piece + sauce", calories: 330, proteinG: 24, carbsG: 10, fatG: 21 },
  { name: "Grilled chicken breast", aliases: ["grilled chicken breast", "chicken breast"], portion: "1 breast (~150 g)", calories: 248, proteinG: 46, carbsG: 0, fatG: 5 },
  { name: "Rendang ayam", aliases: ["rendang ayam", "ayam rendang", "chicken rendang"], portion: "1 piece + sauce", calories: 340, proteinG: 24, carbsG: 6, fatG: 24 },
  { name: "Rendang daging (beef)", aliases: ["rendang daging", "daging rendang", "beef rendang"], portion: "2 pieces + sauce", calories: 380, proteinG: 28, carbsG: 5, fatG: 27 },
  { name: "Ikan goreng (fried fish)", aliases: ["ikan goreng", "fried fish"], portion: "1 piece", calories: 210, proteinG: 24, carbsG: 3, fatG: 12 },
  { name: "Ikan bakar (grilled fish)", aliases: ["ikan bakar", "grilled fish"], portion: "1 portion", calories: 230, proteinG: 28, carbsG: 4, fatG: 11 },
  { name: "Sambal sotong (squid)", aliases: ["sambal sotong", "sotong"], portion: "1 serving", calories: 190, proteinG: 18, carbsG: 9, fatG: 9 },
  { name: "Udang (prawns)", aliases: ["udang goreng", "udang", "prawns", "prawn"], portion: "6 pieces", calories: 120, proteinG: 23, carbsG: 1, fatG: 3 },
  { name: "Satay", aliases: ["satay", "sate"], portion: "5 sticks + peanut sauce", calories: 320, proteinG: 25, carbsG: 10, fatG: 20 },
  { name: "Telur masin (salted egg)", aliases: ["telur masin", "salted egg"], portion: "1 egg", calories: 90, proteinG: 7, carbsG: 1, fatG: 6 },
  { name: "Telur dadar (omelette)", aliases: ["telur dadar", "omelette", "omelet"], portion: "2-egg omelette", calories: 180, proteinG: 12, carbsG: 1, fatG: 14 },
  { name: "Telur rebus (boiled egg)", aliases: ["telur rebus", "boiled egg", "hard boiled egg"], portion: "1 egg", calories: 70, proteinG: 6, carbsG: 0, fatG: 5 },
  { name: "Telur mata (fried egg)", aliases: ["telur mata", "fried egg", "telur goreng", "bullseye egg"], portion: "1 egg", calories: 100, proteinG: 6, carbsG: 1, fatG: 8 },
  { name: "Egg", aliases: ["telur", "egg"], portion: "1 egg", calories: 80, proteinG: 6, carbsG: 0, fatG: 6 },
  { name: "Tauhu goreng (fried tofu)", aliases: ["tauhu goreng", "fried tofu", "tauhu", "tofu"], portion: "3 pieces", calories: 130, proteinG: 10, carbsG: 5, fatG: 8 },
  { name: "Tempeh", aliases: ["tempeh", "tempe"], portion: "3 slices", calories: 160, proteinG: 11, carbsG: 8, fatG: 9 },
  { name: "Daging (beef)", aliases: ["daging", "beef"], portion: "1 serving", calories: 280, proteinG: 26, carbsG: 0, fatG: 19 },

  // ---- vegetables ----
  { name: "Kangkung belacan", aliases: ["kangkung belacan", "kangkung goreng", "kangkung"], portion: "1 plate", calories: 90, proteinG: 4, carbsG: 8, fatG: 5 },
  { name: "Sayur campur (mixed veg)", aliases: ["sayur campur", "mixed vegetables", "mixed veggies", "stir fried vegetables", "sayur goreng"], portion: "1 serving", calories: 80, proteinG: 3, carbsG: 9, fatG: 4 },
  { name: "Broccoli", aliases: ["broccoli", "brokoli"], portion: "1 cup", calories: 55, proteinG: 4, carbsG: 11, fatG: 1 },
  { name: "Bayam (spinach)", aliases: ["bayam", "spinach"], portion: "1 serving", calories: 60, proteinG: 4, carbsG: 6, fatG: 3 },
  { name: "Taugeh (bean sprouts)", aliases: ["taugeh", "bean sprouts"], portion: "1 serving", calories: 50, proteinG: 4, carbsG: 7, fatG: 1 },
  { name: "Ulam (fresh herb salad)", aliases: ["ulam"], portion: "1 serving", calories: 40, proteinG: 2, carbsG: 6, fatG: 1 },
  { name: "Salad", aliases: ["salad"], portion: "1 bowl", calories: 90, proteinG: 3, carbsG: 10, fatG: 5 },
  { name: "Sambal", aliases: ["sambal"], portion: "1 tbsp", calories: 40, proteinG: 1, carbsG: 5, fatG: 2 },

  // ---- noodles & breads ----
  { name: "Mee goreng mamak", aliases: ["mee goreng mamak", "mamak mee goreng", "mee goreng"], portion: "1 plate", calories: 450, proteinG: 13, carbsG: 60, fatG: 17 },
  { name: "Curry mee", aliases: ["curry mee", "mee kari", "kari mee"], portion: "1 bowl", calories: 480, proteinG: 16, carbsG: 55, fatG: 21 },
  { name: "Char kway teow", aliases: ["char kway teow", "char kuey teow", "kuey teow goreng", "kway teow"], portion: "1 plate", calories: 520, proteinG: 14, carbsG: 62, fatG: 24 },
  { name: "Laksa", aliases: ["laksa"], portion: "1 bowl", calories: 450, proteinG: 20, carbsG: 48, fatG: 19 },
  { name: "Mee rebus", aliases: ["mee rebus"], portion: "1 plate", calories: 430, proteinG: 15, carbsG: 66, fatG: 12 },
  { name: "Mee kari / mee sup style", aliases: ["mee sup", "mee soto", "soto"], portion: "1 bowl", calories: 380, proteinG: 18, carbsG: 48, fatG: 12 },
  { name: "Maggi (instant noodles)", aliases: ["maggi goreng", "maggi", "instant noodles", "mee segera", "indomie"], portion: "1 packet cooked", calories: 380, proteinG: 8, carbsG: 54, fatG: 15 },
  { name: "Roti canai", aliases: ["roti canai", "roti prata", "prata"], portion: "1 piece", calories: 300, proteinG: 6, carbsG: 45, fatG: 11 },
  { name: "Roti telur", aliases: ["roti telur"], portion: "1 piece", calories: 360, proteinG: 11, carbsG: 46, fatG: 14 },
  { name: "Roti bakar (kaya toast)", aliases: ["roti bakar", "kaya toast"], portion: "2 slices with kaya", calories: 240, proteinG: 5, carbsG: 34, fatG: 9 },
  { name: "Dhal curry", aliases: ["dhal curry", "dhal", "dal"], portion: "1 ladle", calories: 120, proteinG: 6, carbsG: 15, fatG: 4 },
  { name: "Capati", aliases: ["capati", "chapati"], portion: "1 piece", calories: 150, proteinG: 5, carbsG: 27, fatG: 3 },
  { name: "Thosai (dosa)", aliases: ["thosai", "tosai", "dosa"], portion: "1 piece", calories: 170, proteinG: 5, carbsG: 28, fatG: 5 },
  { name: "Murtabak", aliases: ["murtabak"], portion: "1 portion", calories: 420, proteinG: 18, carbsG: 38, fatG: 22 },
  { name: "Bread (white)", aliases: ["roti putih", "bread", "roti"], portion: "2 slices", calories: 160, proteinG: 6, carbsG: 28, fatG: 2 },
  { name: "Oats", aliases: ["oatmeal", "oats", "oat"], portion: "1 bowl with milk", calories: 180, proteinG: 6, carbsG: 30, fatG: 4 },

  // ---- snacks, fruit, dessert ----
  { name: "Pisang goreng", aliases: ["pisang goreng"], portion: "2 pieces", calories: 190, proteinG: 2, carbsG: 29, fatG: 8 },
  { name: "Karipap (curry puff)", aliases: ["curry puff", "karipap"], portion: "1 piece", calories: 170, proteinG: 3, carbsG: 20, fatG: 9 },
  { name: "Kuih (assorted)", aliases: ["kuih muih", "kuih", "kueh"], portion: "2 pieces", calories: 220, proteinG: 3, carbsG: 32, fatG: 9 },
  { name: "Apam balik", aliases: ["apam balik"], portion: "1 piece", calories: 240, proteinG: 5, carbsG: 40, fatG: 7 },
  { name: "Cendol", aliases: ["cendol"], portion: "1 bowl", calories: 320, proteinG: 5, carbsG: 55, fatG: 9, sweet: true },
  { name: "Ais kacang (ABC)", aliases: ["ais kacang", "abc"], portion: "1 bowl", calories: 300, proteinG: 5, carbsG: 60, fatG: 5, sweet: true },
  { name: "Pisang (banana)", aliases: ["pisang", "banana"], portion: "1 medium", calories: 105, proteinG: 1, carbsG: 27, fatG: 0 },
  { name: "Apple", aliases: ["epal", "apple"], portion: "1 medium", calories: 95, proteinG: 0, carbsG: 25, fatG: 0 },
  { name: "Sup (soup)", aliases: ["sup tulang", "sup", "soup"], portion: "1 bowl", calories: 120, proteinG: 8, carbsG: 10, fatG: 5 },

  // ---- drinks ----
  { name: "Teh tarik", aliases: ["teh tarik"], portion: "1 glass", calories: 130, proteinG: 2, carbsG: 20, fatG: 4, drink: true, sweet: true },
  { name: "Teh O", aliases: ["teh o limau", "teh o", "teh-o"], portion: "1 glass", calories: 60, proteinG: 0, carbsG: 14, fatG: 0, drink: true, sweet: true },
  { name: "Kopi", aliases: ["kopi susu", "kopi"], portion: "1 cup with condensed milk", calories: 120, proteinG: 2, carbsG: 18, fatG: 4, drink: true, sweet: true },
  { name: "Kopi O", aliases: ["kopi o", "kopi-o", "black coffee"], portion: "1 cup", calories: 55, proteinG: 0, carbsG: 13, fatG: 0, drink: true, sweet: true },
  { name: "Kopi O kosong", aliases: ["kopi o kosong", "kopi kosong"], portion: "1 cup, no sugar", calories: 8, proteinG: 0, carbsG: 1, fatG: 0, drink: true },
  { name: "Milo", aliases: ["milo ais", "milo"], portion: "1 glass", calories: 150, proteinG: 4, carbsG: 24, fatG: 4, drink: true, sweet: true },
  { name: "Nescafe", aliases: ["nescafe"], portion: "1 cup", calories: 130, proteinG: 2, carbsG: 20, fatG: 4, drink: true, sweet: true },
  { name: "Teh halia (ginger tea)", aliases: ["teh halia", "ginger tea"], portion: "1 glass", calories: 90, proteinG: 1, carbsG: 18, fatG: 1, drink: true, sweet: true },
  { name: "Sirap (rose syrup)", aliases: ["air sirap", "sirap", "syrup"], portion: "1 glass", calories: 160, proteinG: 0, carbsG: 40, fatG: 0, drink: true, sweet: true },
  { name: "Air bandung", aliases: ["air bandung", "bandung"], portion: "1 glass", calories: 170, proteinG: 3, carbsG: 34, fatG: 2, drink: true, sweet: true },
  { name: "Air kelapa (coconut water)", aliases: ["air kelapa", "coconut water", "kelapa"], portion: "1 glass", calories: 60, proteinG: 0, carbsG: 14, fatG: 0, drink: true, sweet: true },
  { name: "Fresh juice", aliases: ["jus oren", "orange juice", "jus", "juice"], portion: "1 glass", calories: 110, proteinG: 2, carbsG: 26, fatG: 0, drink: true, sweet: true },
  { name: "Cafe latte", aliases: ["latte"], portion: "1 cup", calories: 120, proteinG: 6, carbsG: 10, fatG: 5, drink: true },
  { name: "White coffee", aliases: ["white coffee", "kopi putih"], portion: "1 cup", calories: 140, proteinG: 2, carbsG: 22, fatG: 4, drink: true, sweet: true },

  // ---- western / common ----
  { name: "Burger", aliases: ["ramly burger", "burger"], portion: "1 burger", calories: 550, proteinG: 25, carbsG: 42, fatG: 30 },
  { name: "French fries", aliases: ["kentang goreng", "fries", "french fries"], portion: "medium", calories: 320, proteinG: 4, carbsG: 42, fatG: 16 },
  { name: "Pizza", aliases: ["pizza"], portion: "2 slices", calories: 450, proteinG: 18, carbsG: 52, fatG: 18 },
  { name: "Pasta", aliases: ["spaghetti", "pasta"], portion: "1 plate", calories: 430, proteinG: 15, carbsG: 62, fatG: 12 },
  { name: "Sandwich", aliases: ["sandwich", "sandwic"], portion: "1 sandwich", calories: 320, proteinG: 12, carbsG: 34, fatG: 14 },
  { name: "Grilled salmon", aliases: ["salmon"], portion: "1 fillet (~120 g)", calories: 250, proteinG: 27, carbsG: 0, fatG: 15 },
  { name: "Nuggets", aliases: ["nugget", "nuggets"], portion: "6 pieces", calories: 280, proteinG: 14, carbsG: 16, fatG: 18 },

  // ---- generic fallbacks (short aliases, matched last) ----
  { name: "Chicken", aliases: ["ayam", "chicken"], portion: "1 serving", calories: 250, proteinG: 25, carbsG: 5, fatG: 14 },
  { name: "Fish", aliases: ["ikan", "fish"], portion: "1 serving", calories: 200, proteinG: 24, carbsG: 2, fatG: 10 },
  { name: "Rice", aliases: ["nasi", "rice"], portion: "1 plate", calories: 260, proteinG: 5, carbsG: 56, fatG: 1 },
  { name: "Vegetables", aliases: ["sayur", "vegetables", "veggies", "veg"], portion: "1 serving", calories: 70, proteinG: 3, carbsG: 9, fatG: 3 },
];

/** Alias → entry lookup, longest alias first so specific dishes win
 *  over generic words ("nasi lemak" before "nasi"). */
export const ALIAS_INDEX: { alias: string; entry: FoodEntry }[] = FOOD_DATABASE.flatMap((entry) =>
  entry.aliases.map((alias) => ({ alias, entry }))
).sort((a, b) => b.alias.length - a.alias.length);
