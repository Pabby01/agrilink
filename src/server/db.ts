// =============================================================================
// AGROLINK BACKEND DATABASE & STATE LAYER
// Supabase PostgreSQL & Persistent Server-Side Relational Store
// =============================================================================

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  role: "farmer" | "buyer" | "transporter" | "admin";
  full_name: string;
  business_name: string;
  phone: string;
  location_name: string;
  latitude: number;
  longitude: number;
  avatar_initials: string;
  bio: string;
  kyb_tier: number;
  is_verified: boolean;
  is_active: boolean;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBSession {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent?: string;
  ip_address?: string;
  expires_at: string;
  created_at: string;
}

export interface DBKYBVerification {
  id: string;
  user_id: string;
  company_name: string;
  cac_rc_number: string;
  tin_number?: string;
  director_nin_bvn?: string;
  business_address: string;
  document_urls: Record<string, string>;
  status: "unsubmitted" | "pending_review" | "verified" | "rejected" | "action_required";
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DBProduce {
  id: string;
  farmer_id: string;
  name: string;
  category: "Vegetables" | "Grains" | "Tubers" | "Fruits" | "Legumes";
  description: string;
  quality_grade: "Grade A" | "Grade B" | "Grade C" | "Organic Certified";
  quantity_kg: number;
  available_quantity_kg: number;
  price_per_kg: number;
  min_order_kg: number;
  harvest_date: string;
  packaging_type: string;
  location_name: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBOrder {
  id: string;
  order_number: string;
  produce_id: string;
  buyer_id: string;
  farmer_id: string;
  quantity_kg: number;
  unit_price_per_kg: number;
  produce_subtotal: number;
  delivery_fee: number;
  total_escrow_amount: number;
  escrow_status: "unfunded" | "funded_in_escrow" | "disbursed" | "refunded" | "disputed";
  order_status:
    | "Pending"
    | "Accepted"
    | "Awaiting Pickup"
    | "In Transit"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  delivery_urgency: "Standard" | "Urgent" | "Cold Chain Refrigerated";
  delivery_id?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface DBDelivery {
  id: string;
  order_id: string;
  transporter_id?: string;
  vehicle_id?: string;
  pickup_location: { label: string; lat: number; lng: number };
  dropoff_location: { label: string; lat: number; lng: number };
  corridor_name: string;
  distance_km: number;
  delivery_fee: number;
  current_latitude?: number;
  current_longitude?: number;
  current_speed_kmh?: number;
  cargo_temp_celsius?: number;
  status: "Pending" | "Accepted" | "Picked Up" | "In Transit" | "Delivered";
  pod_recipient_name?: string;
  pod_otp_code?: string;
  pod_signature_url?: string;
  estimated_arrival?: string;
  actual_arrival?: string;
  created_at: string;
  updated_at: string;
}

export interface DBVehicle {
  id: string;
  transporter_id: string;
  plate_number: string;
  vehicle_type: "Truck 40T" | "Reefer 30T" | "Flatbed 20T" | "Van 5T" | "Dispatch Bike";
  capacity_kg: number;
  is_refrigerated: boolean;
  roadworthiness_cert_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface DBTrustProfile {
  user_id: string;
  score: number;
  level: "High Trust" | "Trusted" | "Building Trust" | "New";
  rating: number;
  completed_transactions: number;
  successful_deliveries: number;
  cancelled_orders: number;
  fulfilment_rate: number;
  cancellation_rate: number;
  verified: boolean;
  history: { date: string; score: number; reason: string }[];
  updated_at: string;
}

export interface DBAuditLog {
  id: string;
  actor_id?: string;
  action: string;
  target_entity: string;
  target_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface DBPayment {
  id: string;
  order_id: string;
  payer_id: string;
  recipient_farmer_id: string;
  recipient_transporter_id?: string;
  reference: string;
  amount: number;
  channel: string;
  status: "pending" | "successful" | "failed" | "refunded";
  escrow_locked_at?: string;
  escrow_released_at?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// In-Memory Synchronized Relational Store (with initial seed data)
class BackendDatabase {
  users: Map<string, DBUser> = new Map();
  sessions: Map<string, DBSession> = new Map();
  kybVerifications: Map<string, DBKYBVerification> = new Map();
  produce: Map<string, DBProduce> = new Map();
  orders: Map<string, DBOrder> = new Map();
  deliveries: Map<string, DBDelivery> = new Map();
  vehicles: Map<string, DBVehicle> = new Map();
  trustProfiles: Map<string, DBTrustProfile> = new Map();
  auditLogs: DBAuditLog[] = [];
  payments: Map<string, DBPayment> = new Map();

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Users
    const defaultPasswordHash = "c81308a3f81de408990c74fb553d100fbca5728a49f50e9ec195fa3fa7a9b0c7"; // 'Agrolink@2026'

    const farmer: DBUser = {
      id: "u-farmer-1",
      email: "abdul@agrolink.ng",
      password_hash: defaultPasswordHash,
      password_salt: "salt_farmer_kano_2026",
      role: "farmer",
      full_name: "Alhaji Abdul Ibrahim",
      business_name: "Abdul Integrated Farms",
      phone: "+234 803 111 2233",
      location_name: "Kano State",
      latitude: 12.0022,
      longitude: 8.592,
      avatar_initials: "AF",
      bio: "Commercial producer of Roma tomatoes, yellow maize, and grains in Kano agricultural belt.",
      kyb_tier: 2,
      is_verified: true,
      is_active: true,
      is_flagged: false,
      created_at: "2026-01-10T08:00:00Z",
      updated_at: "2026-08-15T10:00:00Z",
    };

    const buyer: DBUser = {
      id: "u-buyer-1",
      email: "buyer@freshmart.ng",
      password_hash: defaultPasswordHash,
      password_salt: "salt_buyer_lagos_2026",
      role: "buyer",
      full_name: "Ngozi Eze",
      business_name: "FreshMart Retail & Processing",
      phone: "+234 802 222 3344",
      location_name: "Lagos (Mile 12)",
      latitude: 6.5244,
      longitude: 3.3792,
      avatar_initials: "FM",
      bio: "Wholesale buyer and supermarket supplier across Southwestern Nigeria.",
      kyb_tier: 2,
      is_verified: true,
      is_active: true,
      is_flagged: false,
      created_at: "2026-02-14T09:00:00Z",
      updated_at: "2026-08-16T12:00:00Z",
    };

    const transporter: DBUser = {
      id: "u-transporter-1",
      email: "haulage@swifthaul.ng",
      password_hash: defaultPasswordHash,
      password_salt: "salt_transporter_abuja_2026",
      role: "transporter",
      full_name: "Tunde Bakare",
      business_name: "SwiftHaul Cold-Chain Logistics",
      phone: "+234 809 333 4455",
      location_name: "Abuja FCT",
      latitude: 9.0765,
      longitude: 7.3986,
      avatar_initials: "SH",
      bio: "Specialized cold-chain and heavy haulage operator on northern interstate corridors.",
      kyb_tier: 3,
      is_verified: true,
      is_active: true,
      is_flagged: false,
      created_at: "2026-01-20T10:00:00Z",
      updated_at: "2026-08-18T08:00:00Z",
    };

    const admin: DBUser = {
      id: "u-admin-1",
      email: "admin@agrolink.ng",
      password_hash: defaultPasswordHash,
      password_salt: "salt_admin_ops_2026",
      role: "admin",
      full_name: "Agrolink Operations Team",
      business_name: "Agrolink Governance HQ",
      phone: "+234 800 000 0000",
      location_name: "Abuja Command Center",
      latitude: 9.0765,
      longitude: 7.3986,
      avatar_initials: "AO",
      bio: "Compliance, KYB oversight, dispute resolution, and escrow settlement control.",
      kyb_tier: 3,
      is_verified: true,
      is_active: true,
      is_flagged: false,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-08-18T00:00:00Z",
    };

    [farmer, buyer, transporter, admin].forEach((u) => this.users.set(u.id, u));

    // 2. KYB Verifications
    this.kybVerifications.set("kyb-1", {
      id: "kyb-1",
      user_id: "u-farmer-1",
      company_name: "Abdul Integrated Farms Ltd",
      cac_rc_number: "RC-1849204",
      tin_number: "TIN-92841029",
      business_address: "Plot 14, Bompai Industrial Area, Kano",
      document_urls: { cac_cert: "https://agrolink.ng/docs/cac_abdul.pdf" },
      status: "verified",
      reviewed_by: "u-admin-1",
      reviewed_at: "2026-01-15T12:00:00Z",
      created_at: "2026-01-11T09:00:00Z",
      updated_at: "2026-01-15T12:00:00Z",
    });

    this.kybVerifications.set("kyb-2", {
      id: "kyb-2",
      user_id: "u-buyer-1",
      company_name: "FreshMart Retail & Logistics Nigeria Ltd",
      cac_rc_number: "RC-1492019",
      tin_number: "TIN-39201948",
      business_address: "KM 14 Ikorodu Road, Ketu, Lagos",
      document_urls: { cac_cert: "https://agrolink.ng/docs/cac_freshmart.pdf" },
      status: "verified",
      reviewed_by: "u-admin-1",
      reviewed_at: "2026-02-18T14:00:00Z",
      created_at: "2026-02-15T11:00:00Z",
      updated_at: "2026-02-18T14:00:00Z",
    });

    this.kybVerifications.set("kyb-3", {
      id: "kyb-3",
      user_id: "u-transporter-1",
      company_name: "SwiftHaul Freight Carriers Ltd",
      cac_rc_number: "RC-2049182",
      tin_number: "TIN-10492810",
      business_address: "Plot 88, Idu Industrial District, Abuja",
      document_urls: { cac_cert: "https://agrolink.ng/docs/cac_swifthaul.pdf" },
      status: "verified",
      reviewed_by: "u-admin-1",
      reviewed_at: "2026-01-25T16:00:00Z",
      created_at: "2026-01-22T08:00:00Z",
      updated_at: "2026-01-25T16:00:00Z",
    });

    // 3. Vehicles
    this.vehicles.set("v-1", {
      id: "v-1",
      transporter_id: "u-transporter-1",
      plate_number: "KJA-829-XA",
      vehicle_type: "Reefer 30T",
      capacity_kg: 30000,
      is_refrigerated: true,
      is_active: true,
      created_at: "2026-01-25T10:00:00Z",
    });

    this.vehicles.set("v-2", {
      id: "v-2",
      transporter_id: "u-transporter-1",
      plate_number: "ABJ-314-MK",
      vehicle_type: "Truck 40T",
      capacity_kg: 40000,
      is_refrigerated: false,
      is_active: true,
      created_at: "2026-02-01T10:00:00Z",
    });

    // 4. Produce
    const sampleProduce: DBProduce[] = [
      {
        id: "prod-1",
        farmer_id: "u-farmer-1",
        name: "Fresh Roma Tomatoes",
        category: "Vegetables",
        description:
          "Vine-ripened, firm-grade red tomatoes harvested in Kano farm cluster. Low moisture content suitable for haulage.",
        quality_grade: "Grade A",
        quantity_kg: 15000,
        available_quantity_kg: 14200,
        price_per_kg: 850,
        min_order_kg: 100,
        harvest_date: "2026-08-16",
        packaging_type: "50kg Plastic Crates",
        location_name: "Kano State",
        latitude: 12.0022,
        longitude: 8.592,
        images: [
          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop",
        ],
        is_available: true,
        created_at: "2026-08-15T08:00:00Z",
        updated_at: "2026-08-15T08:00:00Z",
      },
      {
        id: "prod-2",
        farmer_id: "u-farmer-1",
        name: "Yellow Feed Maize",
        category: "Grains",
        description:
          "Double-cleaned dry yellow corn with moisture level under 12%. Perfect for industrial milling and feed formulation.",
        quality_grade: "Grade A",
        quantity_kg: 40000,
        available_quantity_kg: 38000,
        price_per_kg: 520,
        min_order_kg: 500,
        harvest_date: "2026-08-12",
        packaging_type: "100kg Poly Jute Bags",
        location_name: "Kano State",
        latitude: 12.0022,
        longitude: 8.592,
        images: [
          "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop",
        ],
        is_available: true,
        created_at: "2026-08-13T10:00:00Z",
        updated_at: "2026-08-13T10:00:00Z",
      },
      {
        id: "prod-3",
        farmer_id: "u-farmer-1",
        name: "Benue White Yam Tubers",
        category: "Tubers",
        description:
          "Premium dry export-grade white yams from Zaki Biam farm gate. Minimum 3kg per tuber.",
        quality_grade: "Grade A",
        quantity_kg: 20000,
        available_quantity_kg: 19500,
        price_per_kg: 1100,
        min_order_kg: 50,
        harvest_date: "2026-08-14",
        packaging_type: "Bulk Bundles of 100",
        location_name: "Benue (Zaki Biam)",
        latitude: 7.5255,
        longitude: 9.6105,
        images: [
          "https://images.unsplash.com/photo-1596483785714-386d34b22c2a?w=800&auto=format&fit=crop",
        ],
        is_available: true,
        created_at: "2026-08-14T11:00:00Z",
        updated_at: "2026-08-14T11:00:00Z",
      },
      {
        id: "prod-4",
        farmer_id: "u-farmer-1",
        name: "Sokoto Red Dry Onions",
        category: "Vegetables",
        description:
          "Cured, hard-skin red onions with high shelf-life. Inspected and bagged under Agrolink standard.",
        quality_grade: "Grade A",
        quantity_kg: 25000,
        available_quantity_kg: 25000,
        price_per_kg: 720,
        min_order_kg: 100,
        harvest_date: "2026-08-15",
        packaging_type: "100kg Ventilated Net Bags",
        location_name: "Sokoto State",
        latitude: 13.0609,
        longitude: 5.2476,
        images: [
          "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop",
        ],
        is_available: true,
        created_at: "2026-08-15T14:00:00Z",
        updated_at: "2026-08-15T14:00:00Z",
      },
    ];

    sampleProduce.forEach((p) => this.produce.set(p.id, p));

    // 5. Trust Profiles
    this.trustProfiles.set("u-farmer-1", {
      user_id: "u-farmer-1",
      score: 94,
      level: "High Trust",
      rating: 4.9,
      completed_transactions: 48,
      successful_deliveries: 47,
      cancelled_orders: 1,
      fulfilment_rate: 98,
      cancellation_rate: 2,
      verified: true,
      history: [
        {
          date: "2026-08-15",
          score: 94,
          reason: "Consistent Grade A tomato batch delivery to Lagos",
        },
      ],
      updated_at: "2026-08-15T12:00:00Z",
    });

    this.trustProfiles.set("u-buyer-1", {
      user_id: "u-buyer-1",
      score: 91,
      level: "High Trust",
      rating: 4.8,
      completed_transactions: 36,
      successful_deliveries: 35,
      cancelled_orders: 1,
      fulfilment_rate: 97,
      cancellation_rate: 3,
      verified: true,
      history: [
        {
          date: "2026-08-12",
          score: 91,
          reason: "Prompt delivery receipt confirmation and escrow clearance",
        },
      ],
      updated_at: "2026-08-12T15:00:00Z",
    });

    this.trustProfiles.set("u-transporter-1", {
      user_id: "u-transporter-1",
      score: 96,
      level: "High Trust",
      rating: 4.95,
      completed_transactions: 62,
      successful_deliveries: 61,
      cancelled_orders: 1,
      fulfilment_rate: 99,
      cancellation_rate: 1,
      verified: true,
      history: [
        {
          date: "2026-08-16",
          score: 96,
          reason: "Zero cargo loss across Kano-Lagos corridor on Reefer fleet",
        },
      ],
      updated_at: "2026-08-16T18:00:00Z",
    });
  }

  logAudit(
    actorId: string | undefined,
    action: string,
    targetEntity: string,
    targetId?: string,
    details: Record<string, unknown> = {},
    ip?: string,
  ) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actor_id: actorId,
      action,
      target_entity: targetEntity,
      target_id: targetId,
      details,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });
  }
}

export const db = new BackendDatabase();
