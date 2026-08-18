// =============================================================================
// AGROLINK BACKEND API ROUTER
// Central Dispatch for Auth, Payments, KYB, Produce, Orders & Deliveries
// =============================================================================

import { AuthController } from "./auth";
import { PaymentsController } from "./payments";
import { KYBController } from "./kyb";
import { MarketplaceController } from "./marketplace";
import { LogisticsController } from "./logistics";
import { AIIntelligenceController } from "./ai";
import { db } from "./db";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function getAuthUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  return AuthController.getUserFromToken(token);
}

export async function handleApiRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (!path.startsWith("/api/")) {
    return null; // Not an API request, let TanStack / SSR handle it
  }

  try {
    // ---------------------------------------------------------------------------
    // 1. AUTH API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/auth/register" && method === "POST") {
      const body = await req.json();
      const res = await AuthController.register(body);
      return json(res, res.success ? 201 : 400);
    }

    if (path === "/api/auth/login" && method === "POST") {
      const body = await req.json();
      const res = await AuthController.login(body);
      return json(res, res.success ? 200 : 401);
    }

    if (path === "/api/auth/me" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const trust = db.trustProfiles.get(user.id);
      return json({ success: true, data: { user, trust } });
    }

    if (path === "/api/auth/switch-demo" && method === "POST") {
      const body = await req.json();
      const res = AuthController.switchDemoRole(body.role || "farmer");
      return json({ success: true, data: res });
    }

    // ---------------------------------------------------------------------------
    // 2. KYB / KYC GOVERNANCE API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/kyb/submit" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = KYBController.submitVerification(user.id, body);
      return json(res, res.success ? 200 : 400);
    }

    if (path === "/api/kyb/status" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const status = KYBController.getStatus(user.id);
      return json({ success: true, data: status });
    }

    if (path === "/api/kyb/admin/list" && method === "GET") {
      const user = getAuthUser(req);
      if (!user || user.role !== "admin") return json({ success: false, error: "Forbidden" }, 403);
      const list = KYBController.listAllForAdmin();
      return json({ success: true, data: list });
    }

    if (path === "/api/kyb/admin/review" && method === "POST") {
      const user = getAuthUser(req);
      if (!user || user.role !== "admin") return json({ success: false, error: "Forbidden" }, 403);
      const body = await req.json();
      const res = KYBController.reviewVerification(user.id, body);
      return json(res, res.success ? 200 : 400);
    }

    // ---------------------------------------------------------------------------
    // 3. PRODUCE & MARKETPLACE API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/produce" && method === "GET") {
      const category = url.searchParams.get("category") || undefined;
      const farmerId = url.searchParams.get("farmerId") || undefined;
      const query = url.searchParams.get("q") || undefined;
      const produce = MarketplaceController.listProduce({ category, farmerId, query });
      return json({ success: true, data: produce });
    }

    if (path === "/api/produce/create" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = MarketplaceController.createProduce(user.id, body);
      return json(res, res.success ? 201 : 400);
    }

    if (path.startsWith("/api/produce/") && path.endsWith("/toggle") && method === "PATCH") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const produceId = path.split("/")[3] || "";
      const res = MarketplaceController.toggleAvailability(user.id, produceId);
      return json(res, res.success ? 200 : 400);
    }

    // ---------------------------------------------------------------------------
    // 4. ESCROW PAYMENTS & ORDERS API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/orders/create-escrow" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = PaymentsController.createEscrowOrder(user.id, body);
      return json(res, res.success ? 201 : 400);
    }

    if (path === "/api/orders/release-escrow" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = PaymentsController.releaseEscrow(user.id, body.orderId);
      return json(res, res.success ? 200 : 400);
    }

    if (path === "/api/orders" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      let orders = Array.from(db.orders.values());
      if (user.role === "buyer") {
        orders = orders.filter((o) => o.buyer_id === user.id);
      } else if (user.role === "farmer") {
        orders = orders.filter((o) => o.farmer_id === user.id);
      }
      return json({
        success: true,
        data: orders.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
      });
    }

    // ---------------------------------------------------------------------------
    // 5. LOGISTICS & FLEET API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/deliveries" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const deliveries = LogisticsController.listDeliveries(
        user.role === "transporter" ? { transporterId: user.id } : undefined,
      );
      return json({ success: true, data: deliveries });
    }

    if (path === "/api/deliveries/available" && method === "GET") {
      const openJobs = LogisticsController.listDeliveries({ status: "Pending" });
      return json({ success: true, data: openJobs });
    }

    if (path === "/api/deliveries/accept" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = LogisticsController.acceptDeliveryJob(user.id, body);
      return json(res, res.success ? 200 : 400);
    }

    if (path === "/api/deliveries/milestone" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = LogisticsController.updateMilestone(user.id, body);
      return json(res, res.success ? 200 : 400);
    }

    if (path === "/api/vehicles" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const vehicles = LogisticsController.listVehicles(user.id);
      return json({ success: true, data: vehicles });
    }

    if (path === "/api/vehicles/register" && method === "POST") {
      const user = getAuthUser(req);
      if (!user) return json({ success: false, error: "Unauthorized" }, 401);
      const body = await req.json();
      const res = LogisticsController.registerVehicle(user.id, body);
      return json(res, res.success ? 201 : 400);
    }

    // ---------------------------------------------------------------------------
    // 6. ADMIN & AUDIT TRAIL API ROUTES
    // ---------------------------------------------------------------------------
    if (path === "/api/admin/metrics" && method === "GET") {
      const user = getAuthUser(req);
      if (!user || user.role !== "admin") return json({ success: false, error: "Forbidden" }, 403);
      const allOrders = Array.from(db.orders.values());
      const gmv = allOrders
        .filter((o) => o.order_status === "Completed")
        .reduce((sum, o) => sum + o.total_escrow_amount, 0);
      const flaggedUsers = Array.from(db.users.values()).filter((u) => u.is_flagged);
      const activeDeliveries = Array.from(db.deliveries.values()).filter(
        (d) => d.status === "In Transit" || d.status === "Accepted",
      );

      return json({
        success: true,
        data: {
          gmv,
          totalUsers: db.users.size,
          activeOrders: allOrders.filter(
            (o) => o.order_status !== "Completed" && o.order_status !== "Cancelled",
          ).length,
          activeDeliveries: activeDeliveries.length,
          flaggedAccounts: flaggedUsers.length,
          auditLogs: db.auditLogs.slice(0, 50),
        },
      });
    }

    // ---------------------------------------------------------------------------
    // 7. REAL-DATA GROUNDED AI INTELLIGENCE ROUTE
    // ---------------------------------------------------------------------------
    if (path === "/api/ai/query" && method === "POST") {
      const body = await req.json();
      const user = getAuthUser(req);
      const res = await AIIntelligenceController.processQuery({
        prompt: body.prompt,
        role: body.role || user?.role || "buyer",
        userId: user?.id,
      });
      return json(res, res.success ? 200 : 400);
    }

    return json({ success: false, error: "Endpoint not found" }, 404);
  } catch (err: unknown) {
    console.error("API error:", err);
    return json(
      { success: false, error: err instanceof Error ? err.message : "Internal Server Error" },
      500,
    );
  }
}
