import { Sequelize, DataTypes, Model } from "sequelize";
import mysql2 from "mysql2";
import { unlink } from "fs/promises";
import path from "path";

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME || "limo",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    dialectModule: mysql2, // Explicitly pass mysql2 dialect module to work cleanly in Next.js builds
    logging: false, // Turn off query logs for console cleanliness
  }
);

// 1. Booking Model
export class Booking extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare pickup: string;
  declare dropoff: string;
  declare dateTime: string;
  declare vehicle: string;
  declare passengers: string;
  declare status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  declare createdAt: Date;
  declare updatedAt: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickup: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dropoff: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengers: {
      type: DataTypes.STRING,
      defaultValue: "1",
    },
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Completed", "Cancelled"),
      defaultValue: "Pending",
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
  }
);

// 2. FleetItem Model
export class FleetItem extends Model {
  declare id: string;
  declare name: string;
  declare category: string;
  declare image: string;
  declare description: string;
  declare price: string;
  declare passengers: number;
  declare luggage: number;
  declare available: boolean;
  declare imagesJson: string;
  declare amenitiesJson: string;
}

FleetItem.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    luggage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imagesJson: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
    },
    amenitiesJson: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
    },
  },
  {
    sequelize,
    modelName: "FleetItem",
    tableName: "fleet",
    timestamps: false,
  }
);

// 3. SeoConfig Model
export class SeoConfig extends Model {
  declare route: string;
  declare title: string;
  declare description: string;
  declare keywords: string;
  declare ogTitle: string;
  declare ogDescription: string;
  declare ogImage: string;
  declare canonicalUrl: string;
}

SeoConfig.init(
  {
    route: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ogTitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ogDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ogImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    canonicalUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SeoConfig",
    tableName: "seo",
    timestamps: false,
  }
);

// 4. AdminAccount Model
export class AdminAccount extends Model {
  declare username: string;
  declare passwordHash: string;
}

AdminAccount.init(
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdminAccount",
    tableName: "admins",
    timestamps: false,
  }
);

// 5. LocationService Model
export class LocationService extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare image: string;
  declare location: string;
  declare price: string;
  declare available: boolean;
  declare slug: string;
  declare tagline: string;
  declare bulletPoints: string;
  declare featuresJson: string;
  declare imagesJson: string;
}

LocationService.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    bulletPoints: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
    },
    featuresJson: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
    },
    imagesJson: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
    },
  },
  {
    sequelize,
    modelName: "LocationService",
    tableName: "location_services",
    timestamps: false,
  }
);


// Database Seeding Logic for empty instances
async function seedDatabase() {
  // Seed Admins
  const adminCount = await AdminAccount.count();
  if (adminCount === 0) {
    await AdminAccount.create({
      username: "admin",
      // admin123 SHA-256 hash
      passwordHash: "240a1048a29a10c30202d0cfd173c442e32f7902d334997787383a8b27db2938",
    });
    console.log("Seeded default administrator successfully.");
  }

  // Seed Fleet
  const fleetCount = await FleetItem.count();
  console.log(fleetCount)
  // if (fleetCount === 0) {
  //   const defaultFleet = [{}]
  //   await FleetItem.bulkCreate(defaultFleet);
  //   console.log("Seeded fleet collection successfully.");
  // }

  // // Seed SEO
  // const seoCount = await SeoConfig.count();
  // if (seoCount === 0) {
  //   const defaultSeo = [
  //     {
  //       route: "/",
  //       title: "FantasticLimo | Luxury Limousine & VIP Transport Service",
  //       description: "Experience the pinnacle of luxury, privacy, and safety. FantasticLimo Service offers elite airport transfers, corporate travel, wedding limousines, and VIP logistics worldwide.",
  //       keywords: "luxury limo, vip transport, airport transfer, dubai chauffeur, private driver, wedding limousine",
  //       ogTitle: "FantasticLimo | Luxury Limousine & VIP Transport Service",
  //       ogDescription: "Experience the pinnacle of luxury, privacy, and safety. FantasticLimo Service offers elite airport transfers, corporate travel, wedding limousines, and VIP logistics worldwide.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com",
  //     },
  //     {
  //       route: "/about",
  //       title: "Our Legacy & Standards | FantasticLimo Chauffeurs",
  //       description: "Founded on the standards of private aviation, FantasticLimo delivers bespoke ground transportation to executives, diplomats, and VIP entities.",
  //       keywords: "about fantasticlimo, elite chauffeurs, luxury transport standards, secure driving",
  //       ogTitle: "Our Legacy & Standards | FantasticLimo Chauffeurs",
  //       ogDescription: "Founded on the standards of private aviation, FantasticLimo delivers bespoke ground transportation to executives, diplomats, and VIP entities.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/about",
  //     },
  //     {
  //       route: "/fleet",
  //       title: "Executive Fleet Collection | FantasticLimo Prestige",
  //       description: "Browse the Pinnacle Collection: Rolls-Royce Phantom, Mercedes S-Class, Bentley Flying Spur, Cadillac Escalade, Stretch Limousines, and VIP Sprinters.",
  //       keywords: "rolls royce rental, mercedes s-class chauffeur, luxury suv transfer, limousine service fleet",
  //       ogTitle: "Executive Fleet Collection | FantasticLimo Prestige",
  //       ogDescription: "Browse the Pinnacle Collection: Rolls-Royce Phantom, Mercedes S-Class, Bentley Flying Spur, Cadillac Escalade, Stretch Limousines, and VIP Sprinters.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/fleet",
  //     },
  //     {
  //       route: "/booking",
  //       title: "Online Dispatch & Booking | FantasticLimo Reservation",
  //       description: "Reserve your luxury chauffeur online. Specify pickup, dropoff, date, and select your premium vehicle from our elite collection.",
  //       keywords: "book chauffeur online, luxury car reservation, executive airport shuttle",
  //       ogTitle: "Online Dispatch & Booking | FantasticLimo Reservation",
  //       ogDescription: "Reserve your luxury chauffeur online. Specify pickup, dropoff, date, and select your premium vehicle from our elite collection.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/booking",
  //     },
  //     {
  //       route: "/contact",
  //       title: "Elite Concierge & 24/7 Operations | Contact FantasticLimo",
  //       description: "Our dispatch planners and security coordinators are available 24/7. Reach out for custom event configurations or executive corporate accounts.",
  //       keywords: "contact chauffeur service, limo dispatch, vip client support, corporate travel desk",
  //       ogTitle: "Elite Concierge & 24/7 Operations | Contact FantasticLimo",
  //       ogDescription: "Our dispatch planners and security coordinators are available 24/7. Reach out for custom event configurations or executive corporate accounts.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/contact",
  //     },
  //     {
  //       route: "/services",
  //       title: "Bespoke Transport Services | FantasticLimo Experiences",
  //       description: "Tailored luxury mobility solutions including airport meet-and-greets, corporate roadshows, wedding transfers, and armored security details.",
  //       keywords: "corporate chauffeur services, wedding limo, airport vip greeting, roadshow transport",
  //       ogTitle: "Bespoke Transport Services | FantasticLimo Experiences",
  //       ogDescription: "Tailored luxury mobility solutions including airport meet-and-greets, corporate roadshows, wedding transfers, and armored security details.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/services",
  //     },
  //     {
  //       route: "/video",
  //       title: "Cinematic Showcase | FantasticLimo Chauffeur Experience",
  //       description: "Watch the FantasticLimo journey. Experience the comfort, style, and absolute luxury of our premium chauffeur services.",
  //       keywords: "limousine video, chauffeur showcase, luxury vehicle commercial",
  //       ogTitle: "Cinematic Showcase | FantasticLimo Chauffeur Experience",
  //       ogDescription: "Watch the FantasticLimo journey. Experience the comfort, style, and absolute luxury of our premium chauffeur services.",
  //       ogImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       canonicalUrl: "https://fantasticlimo.com/video",
  //     }
  //   ];
  //   await SeoConfig.bulkCreate(defaultSeo);
  //   console.log("Seeded SEO configurations successfully.");
  // }

  // // Seed Location-based Services
  // const servicesCount = await LocationService.count();
  // if (servicesCount === 0) {
  //   const defaultServices = [
  //     {
  //       name: "Airport VIP Meet & Greet",
  //       description: "Flawless transitions from runway to suite. Personalized terminal gate greeting and luggage handling.",
  //       image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  //       location: "Dubai",
  //       price: "$180/hr",
  //       available: true,
  //       slug: "airport-transfers",
  //       tagline: "VIP Arrivals & Departures",
  //       bulletPoints: JSON.stringify([
  //         "Complimentary flight tracking & wait time adjustments",
  //         "Professional chauffeur terminal greetings",
  //         "Elite luxury vehicle lineup",
  //         "Onboard refreshments & connectivity tools"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "Flight Tracking",
  //           description: "We monitor your incoming flights in real-time. Whether early or delayed, your chauffeur will be waiting."
  //         },
  //         {
  //           title: "Extended Wait Times",
  //           description: "Enjoy complimentary wait times of 60 minutes for international arrivals, and 30 minutes for domestic routes."
  //         },
  //         {
  //           title: "Meet & Greet Protocol",
  //           description: "Your chauffeur will greet you inside the terminal with an electronic nameplate, handles baggage, and guides you to the vehicle."
  //         },
  //         {
  //           title: "Discreet Kerbside Pickups",
  //           description: "For rapid departures, choose our premium curbside meet. Step directly out of the terminal door and into the car."
  //         }
  //       ])
  //     },
  //     {
  //       name: "Desert Safari Chauffeur",
  //       description: "Experience the desert dunes with a professional chauffeur navigating customized luxury 4x4 vehicles.",
  //       image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
  //       location: "Dubai",
  //       price: "$250/hr",
  //       available: true,
  //       slug: "desert-safari",
  //       tagline: "Elite Dune Adventures",
  //       bulletPoints: JSON.stringify([
  //         "Luxury 4x4 vehicles configured for desert conditions",
  //         "Highly trained desert-navigation chauffeurs",
  //         "Customized hotel pick-up and drop-off",
  //         "Cold beverages and dune gear included"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "4x4 Performance",
  //           description: "Prestige SUVs with special dune configuration and safety setups."
  //         },
  //         {
  //           title: "Desert Chauffeurs",
  //           description: "Drivers with specialized desert-survival and dune-crossing navigation training."
  //         },
  //         {
  //           title: "Sunset Timing",
  //           description: "Bespoke departure planning to catch the golden desert sunset perfectly."
  //         },
  //         {
  //           title: "VIP Campsite Drop",
  //           description: "Direct drop-off access to elite desert camp enclosures and private resorts."
  //         }
  //       ])
  //     },
  //     {
  //       name: "Diplomatic Protection Escort",
  //       description: "Armed or unarmed close security protection details synchronized with logistics and armored vehicles.",
  //       image: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800",
  //       location: "London",
  //       price: "$350/hr",
  //       available: true,
  //       slug: "diplomatic-escort",
  //       tagline: "VIP Security & Close Protection",
  //       bulletPoints: JSON.stringify([
  //         "Armed or unarmed close security protection details",
  //         "Coordinated multi-vehicle security motorcades",
  //         "Armored vehicles (B6/B7 class Mercedes/Escalades)",
  //         "Advanced route intelligence and threat assessment"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "Close Protection",
  //           description: "Elite personal bodyguards trained to international diplomatic protocols."
  //         },
  //         {
  //           title: "Armored Fleet",
  //           description: "Certified armored prestige vehicles resistant to ammunition and force."
  //         },
  //         {
  //           title: "Advanced Intelligence",
  //           description: "Pre-scouted routes, alternative escapes, and dispatcher timing synchronization."
  //         },
  //         {
  //           title: "Embassy Liaison",
  //           description: "Direct coordination with state security details and consulate offices."
  //         }
  //       ])
  //     },
  //     {
  //       name: "Royalty Protocol Services",
  //       description: "Calibrated protocol services matching international royal court standards, including flags and bespoke timing.",
  //       image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
  //       location: "London",
  //       price: "$450/hr",
  //       available: true,
  //       slug: "wedding-chauffeur",
  //       tagline: "Stately Luxury & Ceremonial Protocol",
  //       bulletPoints: JSON.stringify([
  //         "Bespoke wedding ribbons & vehicle detailing",
  //         "Professional etiquette-trained uniform chauffeurs",
  //         "Full coordination with wedding planners",
  //         "Chilled mineral water & tissue boxes onboard"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "Bespoke Detailing",
  //           description: "Meticulous interior cleaning and silk exterior ribbons configured to your palette."
  //         },
  //         {
  //           title: "Elite Protocol",
  //           description: "Drivers trained in high-profile royal court etiquette and ceremonial timing."
  //         },
  //         {
  //           title: "VIP Privacy",
  //           description: "Full-security glass parameters and custom window shades for complete privacy."
  //         },
  //         {
  //           title: "VIP Coordination",
  //           description: "Coordinated route planning to match photographer locations and guest drop-offs."
  //         }
  //       ])
  //     },
  //     {
  //       name: "Corporate Roadshows",
  //       description: "Multi-stop business logistics managed by coordinate dispatch desk. Real-time driver updates and timing synchronization.",
  //       image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
  //       location: "New York",
  //       price: "$200/hr",
  //       available: true,
  //       slug: "corporate-travel",
  //       tagline: "Executive Mobility Solutions",
  //       bulletPoints: JSON.stringify([
  //         "Executive high-speed Wi-Fi & charger options",
  //         "Discreet privacy glass & quiet luxury cabins",
  //         "Bespoke hourly dispatch routing structures",
  //         "Consolidated monthly corporate billing accounts"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "Absolute Secrecy",
  //           description: "Every driver signed a strict NDA. Discussions remain fully private."
  //         },
  //         {
  //           title: "Precise Timing",
  //           description: "Drivers arrive 15 minutes before pickup. Your schedule is our master document."
  //         },
  //         {
  //           title: "Roadshow Coordinator",
  //           description: "Dedicated dispatcher oversight for multi-stop corporate meetings."
  //         },
  //         {
  //           title: "Corporate Accounts",
  //           description: "Consolidated monthly billing, receipts on demand, and billing setups."
  //         }
  //       ])
  //     },
  //     {
  //       name: "Manhattan Luxury Tour",
  //       description: "Cinematic private tour of Manhattan's iconic landmarks from the quiet comfort of a Rolls-Royce.",
  //       image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800",
  //       location: "New York",
  //       price: "$300/hr",
  //       available: true,
  //       slug: "manhattan-tour",
  //       tagline: "Cinematic Skyline Tours",
  //       bulletPoints: JSON.stringify([
  //         "Cinematic custom routes through Manhattan landmarks",
  //         "Professional tour-guide trained chauffeur",
  //         "Chilled premium water and local guides",
  //         "Photo stops planned at prime skyline angles"
  //       ]),
  //       featuresJson: JSON.stringify([
  //         {
  //           title: "Bespoke Routes",
  //           description: "Skip the traffic with optimal routing to Central Park, DUMBO, and Times Square."
  //         },
  //         {
  //           title: "Skyline Views",
  //           description: "Driver guides you to the absolute best spots for photography and sightseeing."
  //         },
  //         {
  //           title: "Rolls-Royce Comfort",
  //           description: "Quiet luxury cabin with star-lit headliner and soft leather seating."
  //         },
  //         {
  //           title: "Flexible Stasis",
  //           description: "Driver waits at each monument as long as you wish to explore."
  //         }
  //       ])
  //     }
  //   ];
  //   await LocationService.bulkCreate(defaultServices);
  //   console.log("Seeded location-based services successfully.");
  // }

}

let isInitialized = false;

// Initialize Database connection & sync
export async function initDb() {
  if (isInitialized) return sequelize;

  try {
    const host = process.env.DB_HOST || "localhost";
    const port = parseInt(process.env.DB_PORT || "3306");
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "root";
    const database = process.env.DB_NAME || "limo";

    // Pre-create database if not exists using mysql2 raw connection
    await new Promise<void>((resolve, reject) => {
      const conn = mysql2.createConnection({
        host,
        port,
        user,
        password,
      });
      conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`, (err) => {
        conn.end();
        if (err) reject(err);
        else resolve();
      });
    });

    // Connect & Sync database structures
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    // Seed default settings if empty
    await seedDatabase();

    isInitialized = true;
    console.log("MySQL connection and schema structures established successfully.");
  } catch (error) {
    console.error("Unable to connect to the MySQL database:", error);
  }
  return sequelize;
}

// Quick async helper for Page metadata generation
export async function getDbSeoMetadata(route: string) {
  try {
    await initDb();
    const config = await SeoConfig.findByPk(route);
    if (config) {
      return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        ogTitle: config.ogTitle,
        ogDescription: config.ogDescription,
        ogImage: config.ogImage,
        canonicalUrl: config.canonicalUrl,
      };
    }
  } catch (error) {
    console.error(`Error loading SEO configs for ${route} from MySQL:`, error);
  }

  // Primary hardcoded fallback
  return {
    title: "FantasticLimo | Luxury Chauffeur Service",
    description: "Premium limousine and VIP chauffeur transport.",
    keywords: "limo, chauffeur, luxury travel",
  };
}

// Helper to delete old local uploads when an image URL changes or is deleted
export async function deleteLocalUpload(imagePath: string | null | undefined) {
  if (!imagePath) return;

  // Extract relative path from absolute URL if prepended
  let relativePath = imagePath;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (serverUrl) {
    const baseUrl = serverUrl.replace(/\/$/, "");
    if (imagePath.startsWith(baseUrl)) {
      relativePath = imagePath.substring(baseUrl.length);
    }
  }

  if (!relativePath.startsWith("/uploads/")) return;

  try {
    const filename = relativePath.replace("/uploads/", "");
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
    const absolutePath = path.join(uploadDir, filename);
    await unlink(absolutePath);
    console.log(`Successfully deleted local image file: ${absolutePath}`);
  } catch (error) {
    // If file doesn't exist, we don't want to fail the main transaction
    console.error(`Failed to delete old image ${imagePath}:`, error);
  }
}
