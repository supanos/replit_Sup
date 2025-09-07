import { 
  type MenuCategory, type InsertMenuCategory,
  type MenuItem, type InsertMenuItem,
  type Event, type InsertEvent,
  type Game, type InsertGame,
  type Reservation, type InsertReservation,
  type SiteSettings, type LandingContent, type Promotions
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import { join } from "path";

// Storage interface for sports bar data
export interface IStorage {
  // Menu Categories
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuCategory(id: string): Promise<MenuCategory | undefined>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: string, category: Partial<InsertMenuCategory>): Promise<MenuCategory | undefined>;
  deleteMenuCategory(id: string): Promise<boolean>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Games
  getGames(): Promise<Game[]>;
  getTodaysGames(): Promise<Game[]>;
  getUpcomingGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;

  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: string): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, reservation: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: string): Promise<boolean>;

  // Settings
  getSettings(): Promise<SiteSettings>;
  updateSettings?(settings: Partial<SiteSettings>): Promise<SiteSettings>;

  // Static data
  getLandingData(): Promise<LandingContent>;
  getPromotionsData(): Promise<Promotions>;
}

export class MemStorage implements IStorage {
  private menuCategories: Map<string, MenuCategory> = new Map();
  private menuItems: Map<string, MenuItem> = new Map();
  private events: Map<string, Event> = new Map();
  private games: Map<string, Game> = new Map();
  private reservations: Map<string, Reservation> = new Map();
  private settings: SiteSettings;
  private landingData: LandingContent;
  private promotionsData: Promotions;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Load menu data
      const menuData = JSON.parse(await readFile(join(process.cwd(), 'server/data/menu.json'), 'utf-8'));
      
      // Initialize menu categories
      for (const category of menuData.categories) {
        this.menuCategories.set(category.id, category);
      }
      
      // Initialize menu items
      for (const item of menuData.items) {
        const menuItem: MenuItem = {
          ...item,
          description: item.description || null,
          image: item.image || null,
          badges: Array.isArray(item.badges) ? item.badges : null,
          allergens: Array.isArray(item.allergens) ? item.allergens : null
        };
        this.menuItems.set(item.id, menuItem);
      }
      
      // Load events data
      const eventsData = JSON.parse(
        await readFile(join(process.cwd(), 'server/data/events.json'), 'utf-8')
      );
      for (const event of eventsData) {
        const newEvent: Event = {
          id: event.id,
          title: event.title,
          slug: event.slug,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          description: event.description || null,
          image: event.image || null,
          tags: Array.isArray(event.tags) ? event.tags : null
        };
        this.events.set(event.id, newEvent);
      }

      // Load games data
      const gamesData = JSON.parse(
        await readFile(join(process.cwd(), 'server/data/games.json'), 'utf-8')
      );
      for (const game of gamesData) {
        const newGame: Game = {
          id: game.id,
          league: game.league,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          homeAbbr: game.homeAbbr,
          awayAbbr: game.awayAbbr,
          startTime: new Date(game.startTime),
          channel: game.channel || null
        };
        this.games.set(game.id, newGame);
      }
      
      // Load landing data
      this.landingData = JSON.parse(await readFile(join(process.cwd(), 'server/data/landing.json'), 'utf-8'));
      
      // Load promotions data
      this.promotionsData = JSON.parse(await readFile(join(process.cwd(), 'server/data/promotions.json'), 'utf-8'));
      
      // Load settings data
      const settingsData = JSON.parse(await readFile(join(process.cwd(), 'server/data/settings.json'), 'utf-8'));
      this.settings = {
        id: "main",
        ...settingsData,
        hours: Array.isArray(settingsData.hours) ? settingsData.hours : [],
        socials: settingsData.socials || {},
        hero: settingsData.hero || { backgroundImage: "", title: "", subtitle: "" },
        footer: settingsData.footer || { description: "", links: [], copyright: "" }
      };
    } catch (error) {
      console.error('Error loading data files:', error);
      // Initialize with default empty data
      this.initializeDefaultData();
    }
  }

  private initializeDefaultData() {
    this.settings = {
      id: "main",
      name: "Supono's Sports Bar",
      address: "123 Stadium Drive, Downtown, State 12345",
      phone: "(555) SPORT-BAR",
      email: "info@suponos.com",
      hours: [],
      socials: {},
      hero: { backgroundImage: "", title: "", subtitle: "" },
      footer: { description: "", links: [], copyright: "" }
    };
    
    this.landingData = {
      popup: { enabled: false, duration: 20, autoRedirect: true },
      hero: { title: "", subtitle: "", description: "", backgroundImage: "", ctaText: "", ctaLink: "" },
      features: [],
      specialOffer: { enabled: false, title: "", description: "", badge: "" }
    };
    
    this.promotionsData = {
      landing: { enabled: false, start: "", end: "", redirectAllRoutes: false },
      sideBanner: { enabled: false, start: "", end: "", message: "", link: "", placement: "" },
      happyHour: { enabled: false, title: "", subtitle: "", description: "", days: "", timeRange: "", offers: [] }
    };
  }

  // Menu Categories
  async getMenuCategories(): Promise<MenuCategory[]> {
      return Array.from(this.menuCategories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getMenuCategory(id: string): Promise<MenuCategory | undefined> {
    return this.menuCategories.get(id);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    this.menuCategories.set(category.id, category);
    return category;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.categoryId === categoryId);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const menuItem: MenuItem = {
      ...item,
      description: item.description || null,
      image: item.image || null,
      badges: item.badges ? [...item.badges] : null,
      allergens: item.allergens ? [...item.allergens] : null
    };
    this.menuItems.set(item.id, menuItem);
    return menuItem;
  }

  // Events
  async getEvents(): Promise<Event[]> {
      return Array.from(this.events.values()).sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    return Array.from(this.events.values()).find(event => event.slug === slug);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      ...event,
      description: event.description || null,
      image: event.image || null,
      tags: event.tags ? [...event.tags] : null
    };
    this.events.set(event.id, newEvent);
    return newEvent;
  }

  // Games
  async getGames(): Promise<Game[]> {
      return Array.from(this.games.values()).sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }

  async getTodaysGames(): Promise<Game[]> {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      return Array.from(this.games.values())
        .filter(game => {
          const gameDate = new Date(game.startTime);
          return gameDate >= startOfDay && gameDate < endOfDay;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const newGame: Game = {
      ...game,
      channel: game.channel || null
    };
    this.games.set(game.id, newGame);
    return newGame;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const newReservation: Reservation = {
      ...reservation,
      id,
      status: "pending",
      specialRequests: reservation.specialRequests || null,
      createdAt: new Date()
    };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return this.settings;
  }

  // Static data
  async getLandingData(): Promise<LandingContent> {
    return this.landingData;
  }

  async getPromotionsData(): Promise<Promotions> {
    return this.promotionsData;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database with existing data
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Check if data already exists
      const existingCategories = await this.getMenuCategories();
      if (existingCategories.length === 0) {
        // Load and migrate data from JSON files
        await this.migrateDataFromJSON();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async migrateDataFromJSON() {
    try {
      // Create the database client
      const { db } = await import("./db");
      const { menuCategories: menuCategoriesTable, menuItems: menuItemsTable, events: eventsTable, games: gamesTable } = await import("@shared/schema");
      
      // Load menu data
      const menuData = JSON.parse(await readFile(join(process.cwd(), 'server/data/menu.json'), 'utf-8'));
      
      // Insert categories
      for (const category of menuData.categories) {
        try {
          await db.insert(menuCategoriesTable).values({
            id: category.id,
            name: category.name,
            slug: category.slug,
            displayOrder: category.order
          }).onConflictDoNothing();
        } catch (e) {
          console.log('Category already exists:', category.id);
        }
      }
      
      // Insert menu items
      for (const item of menuData.items) {
        try {
          await db.insert(menuItemsTable).values({
            id: item.id,
            categoryId: item.categoryId,
            name: item.name,
            description: item.description || null,
            price: item.price,
            image: item.image || null,
            badges: item.badges || null,
            allergens: item.allergens || null
          }).onConflictDoNothing();
        } catch (e) {
          console.log('Menu item already exists:', item.id);
        }
      }
      
      // Load and insert events
      const eventsData = JSON.parse(
        await readFile(join(process.cwd(), 'server/data/events.json'), 'utf-8')
      );
      for (const event of eventsData) {
        try {
          await db
            .insert(eventsTable)
            .values({
              id: event.id,
              title: event.title,
              slug: event.slug,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
              image: event.image || null,
              description: event.description || null,
              tags: event.tags || null
            })
            .onConflictDoNothing();
        } catch (e) {
          console.log('Event already exists:', event.id);
        }
      }

      // Load and insert games
      const gamesData = JSON.parse(
        await readFile(join(process.cwd(), 'server/data/games.json'), 'utf-8')
      );
      for (const game of gamesData) {
        try {
          await db
            .insert(gamesTable)
            .values({
              id: game.id,
              league: game.league,
              homeTeam: game.homeTeam,
              awayTeam: game.awayTeam,
              homeAbbr: game.homeAbbr,
              awayAbbr: game.awayAbbr,
              startTime: new Date(game.startTime),
              channel: game.channel || null
            })
            .onConflictDoNothing();
        } catch (e) {
          console.log('Game already exists:', game.id);
        }
      }
      
      console.log('Database migration completed successfully');
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  }

  // Menu Categories
  async getMenuCategories(): Promise<MenuCategory[]> {
    const { db } = await import("./db");
    const { menuCategories } = await import("@shared/schema");
    return await db.select().from(menuCategories).orderBy(menuCategories.displayOrder);
  }

  async getMenuCategory(id: string): Promise<MenuCategory | undefined> {
    const { db } = await import("./db");
    const { menuCategories } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [category] = await db.select().from(menuCategories).where(eq(menuCategories.id, id));
    return category || undefined;
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const { db } = await import("./db");
    const { menuCategories } = await import("@shared/schema");
    const [newCategory] = await db
      .insert(menuCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateMenuCategory(id: string, category: Partial<InsertMenuCategory>): Promise<MenuCategory | undefined> {
    const { db } = await import("./db");
    const { menuCategories } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(menuCategories)
      .set(category)
      .where(eq(menuCategories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMenuCategory(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { menuCategories } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db.delete(menuCategories).where(eq(menuCategories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    return await db.select().from(menuItems).orderBy(menuItems.name);
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    const [newItem] = await db
      .insert(menuItems)
      .values(item as any)
      .returning();
    return newItem;
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(menuItems)
      .set(item as any)
      .where(eq(menuItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { menuItems } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    return await db.select().from(events).orderBy(events.startDate);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    const [newEvent] = await db
      .insert(events)
      .values(event as any)
      .returning();
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(events)
      .set(event as any)
      .where(eq(events.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { events } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Games
  async getGames(): Promise<Game[]> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    return await db.select().from(games).orderBy(games.startTime);
  }

  async getTodaysGames(): Promise<Game[]> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const { like } = await import("drizzle-orm");
    const today = new Date().toISOString().split('T')[0];
    return await db.select().from(games).where(like(games.startTime, `${today}%`)).orderBy(games.startTime);
  }

  async getUpcomingGames(): Promise<Game[]> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const { gte } = await import("drizzle-orm");
    const now = new Date();
    return await db.select().from(games).where(gte(games.startTime, now)).orderBy(games.startTime);
  }

  async getGame(id: string): Promise<Game | undefined> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const [newGame] = await db
      .insert(games)
      .values(game)
      .returning();
    return newGame;
  }

  async updateGame(id: string, game: Partial<InsertGame>): Promise<Game | undefined> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(games)
      .set(game)
      .where(eq(games.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteGame(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { games } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db.delete(games).where(eq(games.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    const { db } = await import("./db");
    const { reservations } = await import("@shared/schema");
    return await db.select().from(reservations).orderBy(reservations.createdAt);
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    const { db } = await import("./db");
    const { reservations } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation || undefined;
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const { db } = await import("./db");
    const { reservations } = await import("@shared/schema");
    const [newReservation] = await db
      .insert(reservations)
      .values({
        ...reservation,
        id: randomUUID(),
        status: "pending",
        createdAt: new Date()
      })
      .returning();
    return newReservation;
  }

  async updateReservation(id: string, reservation: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const { db } = await import("./db");
    const { reservations } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [updated] = await db
      .update(reservations)
      .set(reservation)
      .where(eq(reservations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteReservation(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { reservations } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db.delete(reservations).where(eq(reservations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Settings - Legacy compatibility
  async getSettings(): Promise<SiteSettings> {
    return {
      id: "main",
      name: "Supono's Sports Bar",
      address: "123 Stadium Drive, Downtown, State 12345",
      phone: "(555) SPORT-BAR",
      email: "info@suponos.com",
      hours: [],
      socials: {},
      hero: { backgroundImage: "", title: "", subtitle: "" },
      footer: { description: "", links: [], copyright: "" }
    };
  }

  // Static data - Legacy compatibility
  async getLandingData(): Promise<LandingContent> {
    return {
      id: "default",
      popup: { enabled: false, duration: 20, autoRedirect: true, redirectUrl: "" }
    };
  }

  async getPromotionsData(): Promise<Promotions> {
    return {
      id: "default",
      landing: { enabled: true, start: "2025-08-25", end: "2025-12-31", redirectAllRoutes: false },
      sideBanner: { enabled: false, start: "", end: "", message: "", link: "", placement: "" },
      happyHour: { enabled: false, title: "", subtitle: "", description: "", days: "", timeRange: "", offers: [] }
    };
  }
}

export const storage = new DatabaseStorage();

