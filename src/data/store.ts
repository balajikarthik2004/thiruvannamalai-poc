import { temples } from "./temples";
import type { Temple } from "./temples";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // whole rupees (INR)
  category: "Photos" | "Merchandise" | "Lamps" | "Idols" | "Hangings" | "Sachets" | "Apparel";
  image: string;
  stock: number;
  /** Attribution for licensed photos (e.g. Wikimedia Commons), shown on the product page. */
  credit?: string;
}

export interface Store {
  id: string;
  templeId: number;
  name: string;
  description: string;
  /** Card image (temple's square-friendly thumb). */
  image: string;
  /** Wide banner image for the store page. */
  heroImage: string;
  state: string;
  city: string;
  products: Product[];
}

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Divine Brass Oil Lamp (Diya)",
    description: "Traditional brass oil lamp, perfect for daily pooja and special occasions. Heavy base, premium quality.",
    price: 2149,
    category: "Lamps",
    image: "/store/diya.png",
    stock: 50,
  },
  {
    id: "p2",
    name: "Framed Deity Photo (8x10)",
    description: "High-resolution photo print of the main deity, beautifully framed in synthetic wood.",
    price: 2499,
    category: "Photos",
    image: "/store/murugan.png",
    stock: 25,
  },
  {
    id: "p6",
    name: "Customized Temple T-Shirt (Unisex)",
    description: "100% Cotton t-shirt featuring the temple deity's artwork. Available in multiple sizes.",
    price: 1799,
    category: "Apparel",
    image: "/store/devotee.png",
    stock: 100,
  },
  {
    id: "p3",
    name: "Premium Kumkum & Turmeric Sachet Set",
    description: "Auspicious set of pure kumkum and turmeric from the temple premises, blessed by the priests.",
    price: 799,
    category: "Sachets",
    image: "/store/kumkum.png",
    stock: 200,
  },
  {
    id: "p4",
    name: "Handcrafted Toran / Door Hanging",
    description: "Beautiful marigold and mango leaf design door hanging to welcome prosperity.",
    price: 1499,
    category: "Hangings",
    image: "/store/garlands.png",
    stock: 30,
  },
  {
    id: "p5",
    name: "Om & Swastika Wall Hanging",
    description: "Metal alloy wall hanging with traditional symbols for peace and good fortune.",
    price: 1249,
    category: "Hangings",
    image: "/store/om.png",
    stock: 45,
  },
  {
    id: "p7",
    name: "Framed Deity Photo (8x10)",
    description: "High-resolution photo print of the main deity, beautifully framed in synthetic wood.",
    price: 2499,
    category: "Photos",
    image: "/store/venkateswara.png",
    stock: 25,
  },
];

// Generate store data based on temples
export const stores: Store[] = temples.map((temple) => {
  // Add some specific items based on temple id
  const specificProducts = [...defaultProducts];
  
  if (temple.slug.includes('murugan')) {
    const newItems: Product[] = [
      {
        id: `p-murugan-vel-${temple.id}`,
        name: "Silver Vel (Spear) Replica",
        description: "Miniature silver-plated Vel, the divine weapon of Lord Murugan.",
        price: 2899,
        category: "Idols",
      image: "/store/vel1.png",
        stock: 15,
      },
      {
        id: `p-murugan-panchamirtham-${temple.id}`,
        name: "Palani Panchamirtham (500g)",
        description: "The world-famous divine prasadam made of five natural ingredients: banana, jaggery, cow ghee, honey, and cardamom.",
        price: 999,
        category: "Merchandise",
        image: "/store/Panchamirtham.png", // reusing an available image
        stock: 100,
      },
      {
        id: `p-murugan-vibhuthi-${temple.id}`,
        name: "Sacred Vibhuthi & Jawadhu Set",
        description: "Authentic holy ash (Bhasma) and traditional Jawadhu perfume powder blessed at the temple.",
        price: 749,
        category: "Sachets",
        image: "/store/vibhuthi.png",
        stock: 150,
      },
      {
        id: `p-murugan-vati-${temple.id}`,
        name: "Premium Cotton Wicks (Vati) & Agarbatti",
        description: "Pure cotton wicks (diya bati) and aromatic incense sticks for your daily pooja.",
        price: 449,
        category: "Lamps",
        image: "/store/vati.png",
        stock: 300,
      }
    ];

    const p4Index = specificProducts.findIndex(p => p.id === "p4");
    if (p4Index !== -1) {
      specificProducts.splice(p4Index, 0, ...newItems);
    } else {
      specificProducts.push(...newItems);
    }
  }

  if (temple.slug === 'tiruvannamalai') {
    // Show the Annamalaiyar portrait instead of the generic (Murugan / Venkateswara) frames
    for (let i = specificProducts.length - 1; i >= 0; i--) {
      if (specificProducts[i].category === "Photos") specificProducts.splice(i, 1);
    }
    specificProducts.unshift(
      {
        id: `p-tvm-deepam-lamp-${temple.id}`,
        name: "Karthigai Deepam Brass Agal Vilakku (Set of 5)",
        description: "Traditional brass agal lamps for lighting at home on Karthigai Deepam evening, when the Maha Deepam is lit atop Arunachala.",
        price: 1649,
        category: "Lamps",
        image: "/store/diya.png",
        stock: 80,
      },
      {
        id: `p-tvm-rajagopuram-photo-${temple.id}`,
        name: "Framed Arunachaleswarar Rajagopuram Photo (8x10)",
        description: "Print of the 11-storey, 217 ft East Rajagopuram of the Annamalaiyar Temple, framed in synthetic wood.",
        price: 2499,
        category: "Photos",
        image: "/store/shiva/framed-rajagopuram.jpg",
        stock: 25,
      },
      {
        id: `p-tvm-maha-deepam-photo-${temple.id}`,
        name: "Framed Arunachala Maha Deepam Photo (8x10)",
        description: "Print of the Maha Deepam glowing on the summit of the holy Arunachala hill.",
        price: 2499,
        category: "Photos",
        image: "/temples/tiruvannamalai/maha-deepam.jpg",
        stock: 25,
      },
      {
        id: `p-tvm-vibhuthi-${temple.id}`,
        name: "Sacred Vibhuthi & Kumkum Set",
        description: "Holy ash (vibhuthi) and kumkum for daily worship of Lord Annamalaiyar and Unnamulai Amman.",
        price: 749,
        category: "Sachets",
        image: "/store/vibhuthi.png",
        stock: 150,
      },
      {
        id: `p-tvm-vati-${temple.id}`,
        name: "Ghee Lamp Cotton Wicks & Agarbatti",
        description: "Pure cotton wicks and incense for lighting the lamp at home on Pournami and Karthigai days.",
        price: 449,
        category: "Lamps",
        image: "/store/vati.png",
        stock: 300,
      },
    );
  }

  // Lord Shiva collection for Arunachaleswarar (Annamalaiyar) — shown first in the store.
  if (temple.slug === 'tiruvannamalai') {
    specificProducts.unshift(
      {
        id: `p-tvm-annamalaiyar-photo-${temple.id}`,
        name: "Framed Annamalaiyar Lingam Portrait (8x10)",
        description: "Devotional print of a decorated Shiva Lingam with lamps and flowers — for the home shrine of every Annamalaiyar devotee.",
        price: 1999,
        category: "Photos",
        image: "/store/shiva/framed-annamalaiyar.jpg",
        stock: 40,
      },
      {
        id: `p-tvm-rudraksha-mala-${temple.id}`,
        name: "Panchamukhi Rudraksha Japa Mala (108 + 1)",
        description: "Five-faced (Panchamukhi) Rudraksha beads strung on cotton thread with a guru bead — sacred to Lord Shiva and used for chanting \"Om Namah Shivaya\".",
        price: 1799,
        category: "Merchandise",
        image: "/store/shiva/rudraksha-mala.jpg",
        stock: 60,
        credit: "Photo: शिव साहिल, CC BY-SA 4.0, via Wikimedia Commons",
      },
      {
        id: `p-tvm-rudraksha-beads-${temple.id}`,
        name: "Rudraksha Beads for Bracelet (Set of 27)",
        description: "Loose natural Rudraksha beads to string a wrist mala or bracelet for daily Shiva japa.",
        price: 999,
        category: "Merchandise",
        image: "/store/shiva/rudraksha-beads.jpg",
        stock: 80,
        credit: "Photo: Merasmita, CC BY-SA 4.0, via Wikimedia Commons",
      },
      {
        id: `p-tvm-bilva-${temple.id}`,
        name: "Bilva (Vilvam) Archana Pack",
        description: "Dried trifoliate bilva leaves, the offering most dear to Lord Shiva — for Pradosham, Shivaratri and Monday archana at home.",
        price: 549,
        category: "Sachets",
        image: "/store/shiva/bilva-pack.jpg",
        stock: 150,
      },
      {
        id: `p-tvm-damaru-${temple.id}`,
        name: "Shiva Damaru (Hand Drum)",
        description: "Traditional hourglass-shaped damaru with beaded strikers — the drum of Lord Shiva as Nataraja.",
        price: 1199,
        category: "Merchandise",
        image: "/store/shiva/damaru.jpg",
        stock: 35,
        credit: "Photo: Suyash Dwivedi, CC BY-SA 4.0, via Wikimedia Commons",
      },
      {
        id: `p-tvm-nataraja-${temple.id}`,
        name: "Bronze-finish Nataraja Idol (8 inch)",
        description: "Lord Shiva as the cosmic dancer within the ring of fire, in a South Indian bronze style finish.",
        price: 4899,
        category: "Idols",
        image: "/images/nataraja.png",
        stock: 12,
      },
      {
        id: `p-tvm-trishul-${temple.id}`,
        name: "Trishul with Ardhanarishvara — Museum Replica",
        description: "Bronze-finish replica of an 11th-century South Indian processional trishul showing Ardhanarishvara (Shiva and Parvati as one) with Nandi.",
        price: 6149,
        category: "Idols",
        image: "/store/shiva/trishul.jpg",
        stock: 8,
        credit: "Photo of the original: Cleveland Museum of Art, CC0",
      },
    );
  }

  if (temple.slug.includes('shiva') || temple.deity.toLowerCase().includes('shiva')) {
    specificProducts.unshift({
      id: `p-shiva-${temple.id}`,
      name: "Crystal Shiva Lingam",
      description: "Small pure crystal (Sphatik) Shiva Lingam for home worship.",
      price: 3750,
      category: "Idols",
      image: "/store/shiva/crystal-lingam.jpg",
      stock: 10,
    });
  }

  return {
    id: `store-${temple.slug}`,
    templeId: temple.id,
    name: `${temple.name} Official Store`,
    description: `Purchase authentic prasadam, merchandise, and pooja items directly from ${temple.name}. Includes a temple pickup option for your convenience.`,
    image: temple.thumb || temple.image || "/store/diya.png",
    heroImage: temple.image || temple.thumb || "/store/diya.png",
    state: temple.state,
    city: temple.city,
    products: specificProducts,
  };
});

export function getStoreById(storeId: string): Store | undefined {
  return stores.find((s) => s.id === storeId);
}

export function getProductById(storeId: string, productId: string): Product | undefined {
  const store = getStoreById(storeId);
  return store?.products.find((p) => p.id === productId);
}
