const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertMenuItem(restaurantId, item) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      restaurantId,
      name: item.name,
    },
  });

  if (existing) return existing;

  return prisma.menuItem.create({
    data: {
      restaurantId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
      isAvailable: true,
    },
  });
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { clerkId: "seed-admin" },
    update: {},
    create: {
      clerkId: "seed-admin",
      name: "Admin User",
      email: "admin@noboru.local",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { clerkId: "seed-staff" },
    update: {},
    create: {
      clerkId: "seed-staff",
      name: "Staff User",
      email: "staff@noboru.local",
      role: "STAFF",
    },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { ownerId: admin.id },
    update: {},
    create: {
      name: "Noboru",
      ownerId: admin.id,
      description: "Modern Japanese dining experience",
      isActive: true,
    },
  });

  const tableCodes = Array.from({ length: 20 }, (_, i) =>
    `TABLE_${String(i + 1).padStart(2, "0")}`
  );
  const tables = [];

  for (const code of tableCodes) {
    const table = await prisma.table.upsert({
      where: { code },
      update: {},
      create: {
        code,
        label: code.replace("_", " "),
        seats: 4,
        restaurantId: restaurant.id,
      },
    });
    tables.push(table);
  }

  const menuItems = await Promise.all([
    // SOUP
    upsertMenuItem(restaurant.id, {
      name: "Miso Soup",
      description:
        "Classic Japanese soup with miso, tofu, and wakame. Jain available.",
      price: 259,
      imageUrl: null,
      category: "SOUP",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Veg Dumpling Soup",
      description: "A light broth with tender vegetable dumplings.",
      price: 319,
      imageUrl: null,
      category: "SOUP",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Dumpling Soup",
      description: "A light broth with tender chicken dumplings.",
      price: 349,
      imageUrl: null,
      category: "SOUP",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Seafood Miso Soup",
      description:
        "Classic Japanese soup with miso, tofu, mixed seafood, and wakame.",
      price: 329,
      imageUrl: null,
      category: "SOUP",
    }),

    // APPETIZER
    upsertMenuItem(restaurant.id, {
      name: "Agedashi Tofu",
      description:
        "Lightly fried tofu served with a flavourful dashi broth with Bonito (Fish) Flakes.",
      price: 389,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Agedashi Tofu (Veg)",
      description: "Lightly fried tofu served with a flavourful dashi broth.",
      price: 369,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Kakiage",
      description: "Crispy vegetable tempura fritters.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Seafood Kakiage",
      description: "Mixed seafood tempura fritters.",
      price: 399,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Edamame (Salted/Spicy)",
      description:
        "Japanese soybeans with your choice of seasoning. Spicy Edamame available in Jain.",
      price: 329,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Vegetable Gyoza",
      description:
        "Dumplings with minced vegetables, steamed or pan fried. Jain & Vegan available.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Gyoza",
      description: "Dumplings with minced vegetables, steamed or pan fried.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Sake Nanbanzuke",
      description: "Marinated salmon in a tangy vinegar sauce.",
      price: 329,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yakitori",
      description: "Grilled chicken skewers in a savoury glaze.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken In Piri Kara Sauce",
      description: "Spicy and flavourful chicken dish.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Tori Katsu",
      description: "Japanese-style fried chicken cutlet.",
      price: 349,
      imageUrl: null,
      category: "APPETIZER",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Shiromi Sakan Taru Taru",
      description:
        "Fish, finger chip cut, bread crumb fried, tartar sauce and tonkatsu sauce.",
      price: 329,
      imageUrl: null,
      category: "APPETIZER",
    }),

    // SALADS
    upsertMenuItem(restaurant.id, {
      name: "Chicken Green Beans Salad",
      description: "A mix of green beans, vegetables and chicken.",
      price: 349,
      imageUrl: null,
      category: "SALADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Tofu Green Beans Salad",
      description:
        "A mix of green beans, vegetables and tofu. Vegan on request.",
      price: 349,
      imageUrl: null,
      category: "SALADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Japanese Potato Salad",
      description: "Creamy potato salad with a Japanese twist.",
      price: 289,
      imageUrl: null,
      category: "SALADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Raw Papaya Salad",
      description:
        "A refreshing salad with shredded papaya and tangy dressing. Vegan on request.",
      price: 349,
      imageUrl: null,
      category: "SALADS",
    }),

    // RAMEN & NOODLES
    upsertMenuItem(restaurant.id, {
      name: "Kimchi Ramen Veg",
      description:
        "Ramen noodles, kimchi, Bok choy, mushrooms, spring onion.",
      price: 699,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Kimchi Ramen (NV)",
      description:
        "Ramen noodles, kimchi, Bok choy, mushrooms, spring onion. Option to add Chicken.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Creamy Miso Ramen (Veg)",
      description: "Vegetables, Coconut miso broth. Jain on request.",
      price: 699,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Creamy Miso Ramen (NV)",
      description: "Vegetables, miso broth. Option to add Chicken.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Tonkotsu Ramen",
      description: "Vegetables, pork slices, miso broth.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Classic Miso Ramen (Veg)",
      description: "Vegetables, miso broth. Ask for Jain.",
      price: 679,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Classic Miso Ramen (NV)",
      description: "Vegetables, miso broth. Add chicken.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Shoyu Ramen",
      description: "Sliced Chicken, Chicken stock.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Shio Ramen",
      description:
        "Sliced Chicken, broth flavored with salt (shio) and other seasoning.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Gyokai Ramen",
      description: "Vegetables, Salmon and Prawn with broth.",
      price: 729,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yaki Udon Noodles",
      description: "Sauteed vegetables with Udon Noodles. Jain on request.",
      price: 499,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yaki Udon Noodles (NV)",
      description:
        "Sauteed vegetables with Udon Noodles. Add Chicken.",
      price: 529,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yaki Soba Noodles (Veg)",
      description:
        "Sauteed vegetables with Soba Noodles. Jain on request.",
      price: 469,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yaki Soba Noodles (NV)",
      description: "Sauteed vegetables with Soba Noodles. Add Chicken.",
      price: 529,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Stir-Fried Rice Noodles (Veg)",
      description:
        "Sauteed vegetables served with thin flat rice noodles. Jain & Vegan available.",
      price: 499,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Stir-Fried Rice Noodles (NV)",
      description:
        "Sauteed vegetables served with thin flat rice noodles.",
      price: 569,
      imageUrl: null,
      category: "RAMEN_AND_NOODLES",
    }),

    // BURGERS & SANDWICHES
    upsertMenuItem(restaurant.id, {
      name: "Vegetable Sandwich",
      description: "Mayonnaise, Cucumber, Tomatoes, Iceberg lettuce.",
      price: 269,
      imageUrl: null,
      category: "BURGERS_AND_SANDWICHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Veg Katsu Burger",
      description: "Japanese style Vegetable cutlet with Chef's special sauce.",
      price: 329,
      imageUrl: null,
      category: "BURGERS_AND_SANDWICHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Sandwich",
      description: "Mayonnaise, Grilled Chicken, Iceberg lettuce.",
      price: 329,
      imageUrl: null,
      category: "BURGERS_AND_SANDWICHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Katsu Burger (NV)",
      description: "Japanese style Chicken cutlet with Chef's special sauce.",
      price: 359,
      imageUrl: null,
      category: "BURGERS_AND_SANDWICHES",
    }),

    // SUSHI
    upsertMenuItem(restaurant.id, {
      name: "Avocado Cream Cheese Roll",
      description: "Avocado & cream cheese rolled into a maki.",
      price: 679,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "California Roll",
      description: "Sushi with avocado, cucumber and sesame seeds.",
      price: 649,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Oshinko Roll",
      description: "Japanese pickles.",
      price: 649,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Green Beans Tempura Roll",
      description: "Green bean Tempura rolled into a maki.",
      price: 679,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Sushi Boat",
      description: "A platter of assorted vegetarian sushi.",
      price: 1099,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Ebi Tempura Roll",
      description: "Prawn tempura rolled into a maki.",
      price: 799,
      imageUrl: null,
      category: "SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Roll",
      description: "Crispy fried chicken rolled into a maki.",
      price: 699,
      imageUrl: null,
      category: "SUSHI",
    }),

    // MINI SUSHI
    upsertMenuItem(restaurant.id, {
      name: "Avocado Cream Cheese Roll (Mini)",
      description: "4 Pieces.",
      price: 349,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "California Roll (Mini)",
      description: "4 Pieces.",
      price: 339,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Oshinko Roll (Mini)",
      description: "4 Pieces.",
      price: 339,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Green Beans Tempura Roll (Mini)",
      description: "4 Pieces.",
      price: 349,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Ebi Tempura Roll (Mini)",
      description: "4 Pieces.",
      price: 399,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Roll (Mini)",
      description: "4 Pieces.",
      price: 369,
      imageUrl: null,
      category: "MINI_SUSHI",
    }),

    // DESSERT
    upsertMenuItem(restaurant.id, {
      name: "Goma Ice Cream",
      description: "Black sesame.",
      price: 349,
      imageUrl: null,
      category: "DESSERT",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Matcha Ice Cream",
      description: "Green tea.",
      price: 349,
      imageUrl: null,
      category: "DESSERT",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Tempura Ice Cream",
      description: "Vanilla fried in a tempura.",
      price: 349,
      imageUrl: null,
      category: "DESSERT",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Japanese Cheesecake",
      description: "Fluffier and lighter than the American cheesecake.",
      price: 379,
      imageUrl: null,
      category: "DESSERT",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Truffle Chokoreeto",
      description: "Orange Chocolate Cake.",
      price: 369,
      imageUrl: null,
      category: "DESSERT",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Orange Chocolate Cake",
      description: null,
      price: 249,
      imageUrl: null,
      category: "DESSERT",
    }),

    // BEVERAGE
    upsertMenuItem(restaurant.id, {
      name: "Fresh Juice",
      description: "Ask for today's special.",
      price: 199,
      imageUrl: null,
      category: "BEVERAGE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Soft Drinks / Energy Drink",
      description: null,
      price: 99,
      imageUrl: null,
      category: "BEVERAGE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Non Alcoholic Beer",
      description: null,
      price: 249,
      imageUrl: null,
      category: "BEVERAGE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Kombucha",
      description: null,
      price: 225,
      imageUrl: null,
      category: "BEVERAGE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Mineral Water",
      description: null,
      price: 99,
      imageUrl: null,
      category: "BEVERAGE",
    }),

    // DONBURI
    upsertMenuItem(restaurant.id, {
      name: "Tofu Yasai Don",
      description:
        "Steamed rice with stir-fried tofu and vegetables served with condiments. Jain & Vegan on request.",
      price: 629,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Teriyaki Vegetable Donburi",
      description:
        "Steamed rice with teriyaki vegetables, miso soup, salad, pickles, and fruit. Jain & Vegan on request.",
      price: 599,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Vegetable Tendon",
      description:
        "Mixed vegetable tempura over steamed rice, miso soup, salad, pickles, and fruit.",
      price: 649,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Chicken Teriyaki Don",
      description:
        "Steamed rice with teriyaki chicken, miso soup, salad, pickles, and fruit.",
      price: 699,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Oyako Don",
      description:
        "Steamed rice with egg, chicken, miso soup, salad, pickles, and fruit.",
      price: 699,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Katsu Don",
      description:
        "Steamed rice with breaded chicken cutlet, egg, miso soup, salad, pickles, and fruit.",
      price: 769,
      imageUrl: null,
      category: "DONBURI",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Ebi Tendon",
      description:
        "Steamed rice with prawn tempura, miso soup, salad, pickles, and fruit.",
      price: 789,
      imageUrl: null,
      category: "DONBURI",
    }),

    // BENTO
    upsertMenuItem(restaurant.id, {
      name: "Yaki Udon Bento (Veg)",
      description:
        "Yaki udon noodles, rock corn tempura, potato salad, teriyaki eggplant. Jain & Vegan on request.",
      price: 729,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yaki Udon Bento (Non-Veg)",
      description:
        "Yaki udon noodles, rock corn tempura, potato salad, teriyaki eggplant and egg. With Chicken: Rs. 779.",
      price: 759,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Teppanyaki Bento (Veg)",
      description:
        "Garlic rice, gyoza, avocado & potato salad. Jain & Vegan on request.",
      price: 729,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Teppanyaki Bento (Non-Veg)",
      description:
        "Garlic rice, gyoza, avocado, egg & potato salad. With Chicken: Rs. 779.",
      price: 759,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Katsu Curry Bento (Veg)",
      description:
        "Japanese curry served over a vegetarian Katsu, steamed rice with a side of avocado & potato salad.",
      price: 729,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Katsu Curry Bento (Non-Veg)",
      description:
        "Japanese curry served over a Chicken Katsu, steamed rice with a side of avocado & potato salad.",
      price: 779,
      imageUrl: null,
      category: "BENTO",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Buta Shogayaki Bento",
      description:
        "Pan grilled pork belly, mushroom & potato salad and steamed rice.",
      price: 779,
      imageUrl: null,
      category: "BENTO",
    }),

    // SPECIAL DISHES
    upsertMenuItem(restaurant.id, {
      name: "Hiyayakko",
      description: "Chilled Tofu topped with spring onions and ginger. Jain on request.",
      price: 329,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Seafood Clear Soup",
      description: "Clear soup topped with salmon and prawns.",
      price: 349,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Unagi Kabayaki",
      description: "Grilled eel with sweet soy glaze.",
      price: 969,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Buta Kakuni",
      description: "Braised pork belly.",
      price: 469,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Sake Shioyaki",
      description: "Salt-grilled salmon fillet.",
      price: 629,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Buta Shoga Yaki",
      description: "Stir-fried pork with ginger.",
      price: 469,
      imageUrl: null,
      category: "SPECIAL_DISHES",
    }),

    // FISH
    upsertMenuItem(restaurant.id, {
      name: "Grilled Sea Bass (Tare)",
      description:
        "A filet of sea bass with seasoned vegetables. Teriyaki sauce preparation.",
      price: 669,
      imageUrl: null,
      category: "FISH",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Grilled Sea Bass (Shio)",
      description: "A filet of sea bass with seasoned vegetables. Plain salted preparation.",
      price: 599,
      imageUrl: null,
      category: "FISH",
    }),

    // KOREAN DELIGHTS
    upsertMenuItem(restaurant.id, {
      name: "Bibimbap (Veg/Egg)",
      description:
        "Steamed rice served with blanched vegetables like carrot, zucchini, spinach, mushroom, and kimchi, alongside Gochujang sauce. Non-Veg: Rs. 679.",
      price: 629,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Jajangmyeon",
      description:
        "A hearty noodle dish with potato, onion, zucchini, and cabbage, coated in a savory, thick black bean sauce. Option of Sticky Rice instead of noodles.",
      price: 599,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Kimchi Bokkeum Bap",
      description:
        "Spicy and flavorful fried rice, tossed with kimchi and spring onions.",
      price: 399,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Gimbap (Veg/Egg)",
      description: "Korean style sushi with vegetables. With Egg: Rs. 649.",
      price: 599,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Tteokbokki (Veg/Egg)",
      description: "Korean rice cake in spicy sauce. With Egg: Rs. 629.",
      price: 599,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Doenjang Jjigae (Veg/Seafood)",
      description:
        "Soup consisting of miso and vegetables. Non-Veg: Rs. 349.",
      price: 329,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Yuringi",
      description:
        "Fried Chicken in Tapioca and Potato, served with Iceberg lettuce and soy lemon dressing.",
      price: 629,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Jjolmyeon Noodle Salad (Veg/Egg)",
      description:
        "A refreshing noodle salad with a mix of carrot, cucumber, apple, iceberg lettuce, and cabbage. Light and tangy with a satisfying chew. With Egg: Rs. 369.",
      price: 349,
      imageUrl: null,
      category: "KOREAN_DELIGHTS",
    }),

    // COFFEE
    upsertMenuItem(restaurant.id, {
      name: "Espresso",
      description: null,
      price: 190,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Long Black",
      description: null,
      price: 230,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Cappuccino",
      description: null,
      price: 250,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Latte",
      description: null,
      price: 250,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Flat White",
      description: null,
      price: 240,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Cortado",
      description: null,
      price: 240,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Piccolo",
      description: null,
      price: 220,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Mocha",
      description: null,
      price: 310,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Affogato",
      description: null,
      price: 329,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Cold Brew",
      description: null,
      price: 270,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Espresso Ginger Ale",
      description: null,
      price: 280,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Espresso Tonic",
      description: null,
      price: 280,
      imageUrl: null,
      category: "COFFEE",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Cold Coffee",
      description: null,
      price: 250,
      imageUrl: null,
      category: "COFFEE",
    }),

    // MATCHA
    upsertMenuItem(restaurant.id, {
      name: "Matcha Tea",
      description: null,
      price: 289,
      imageUrl: null,
      category: "MATCHA",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Hot Matcha Latte",
      description: null,
      price: 299,
      imageUrl: null,
      category: "MATCHA",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Matcha Latte",
      description: null,
      price: 299,
      imageUrl: null,
      category: "MATCHA",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Coconut Water Matcha",
      description: null,
      price: 349,
      imageUrl: null,
      category: "MATCHA",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Matcha Affogato",
      description: null,
      price: 389,
      imageUrl: null,
      category: "MATCHA",
    }),

    // COOKIES
    upsertMenuItem(restaurant.id, {
      name: "Choco Chip",
      description: null,
      price: 279,
      imageUrl: null,
      category: "COOKIES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Butter",
      description: null,
      price: 279,
      imageUrl: null,
      category: "COOKIES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Amadie Au Chocolate",
      description: null,
      price: 279,
      imageUrl: null,
      category: "COOKIES",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Almond Tuiles",
      description: null,
      price: 299,
      imageUrl: null,
      category: "COOKIES",
    }),

    // BREADS
    upsertMenuItem(restaurant.id, {
      name: "Morning Bun",
      description: null,
      price: 129,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Choco Muffin",
      description: null,
      price: 129,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Butter Roll",
      description: null,
      price: 129,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Custard Bread",
      description: null,
      price: 149,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Butter Cream",
      description: null,
      price: 199,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Red Bean Bread",
      description: null,
      price: 169,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Castella Cream",
      description: null,
      price: 169,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Madeleine",
      description: null,
      price: 99,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Milk Sweet Bread",
      description: null,
      price: 169,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Milk Toast Bread",
      description: null,
      price: 149,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Conch Choco Cream",
      description: null,
      price: 149,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Baby Choux Cream",
      description: null,
      price: 329,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Baby Choux Choco",
      description: null,
      price: 349,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Soboro Bread",
      description: null,
      price: 129,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Mammoth Bread",
      description: null,
      price: 269,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Baguette",
      description: null,
      price: 199,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Campagne",
      description: null,
      price: 279,
      imageUrl: null,
      category: "BREADS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Garlic Bread",
      description: null,
      price: 299,
      imageUrl: null,
      category: "BREADS",
    }),

    // PAIRINGS
    upsertMenuItem(restaurant.id, {
      name: "Iced Cortado With Milk Sweet Bread (2 Pcs)",
      description: null,
      price: 250,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Latte With Milk Sweet Bread (2 Pcs)",
      description: null,
      price: 265,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Cappuccino With Butter Roll (1 Piece)",
      description: null,
      price: 270,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Espresso With Madeleine (2 Pcs)",
      description: null,
      price: 275,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Flat White With Amadie Au Chocolate (2 Pcs)",
      description: null,
      price: 275,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Long Black With Baby Choux Cream (3 Pcs)",
      description: null,
      price: 300,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Piccolo With Conch Choco Cream",
      description: null,
      price: 320,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Long Black With Garlic Bread (3 Pcs)",
      description: null,
      price: 330,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Cortado With Custard Bread",
      description: null,
      price: 340,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Long Black With Dorayaki With Butter",
      description: null,
      price: 350,
      imageUrl: null,
      category: "PAIRINGS",
    }),
    upsertMenuItem(restaurant.id, {
      name: "Iced Espresso With Butter Cream",
      description: null,
      price: 370,
      imageUrl: null,
      category: "PAIRINGS",
    }),
  ]);

  const existingOrder = await prisma.order.findFirst({
    where: { restaurantId: restaurant.id },
  });

  if (!existingOrder && tables[0]) {
    const orderItems = menuItems.slice(0, 2).map((item) => ({
      menuItemId: item.id,
      menuItemName: item.name,
      quantity: 1,
      price: item.price,
    }));

    await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        tableId: tables[0].id,
        tableNumber: tables[0].code,
        status: "RECEIVED",
        totalAmount: orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        taxAmount: 0,
        tipAmount: 0,
        paymentMethod: "COUNTER",
        items: {
          create: orderItems,
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

