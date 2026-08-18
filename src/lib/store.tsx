import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as seed from "./mock-data";
import type {
  Delivery,
  DeliveryStatus,
  Notification,
  Order,
  OrderStatus,
  Produce,
  Role,
  TrustProfile,
  User,
} from "./types";

/**
 * Local mock persistence layer.
 * Everything in this module is a stand-in for a future API service. Swap the
 * body of these functions for network calls and the UI keeps working.
 */

const STORAGE_KEY = "agrolink.state.v1";
const ROLE_KEY = "agrolink.role.v1";

export interface AppState {
  users: User[];
  trust: TrustProfile[];
  produce: Produce[];
  orders: Order[];
  deliveries: Delivery[];
  notifications: Notification[];
}

const freshState = (): AppState => ({
  users: structuredClone(seed.users),
  trust: structuredClone(seed.trustProfiles),
  produce: structuredClone(seed.produce),
  orders: structuredClone(seed.orders),
  deliveries: structuredClone(seed.deliveries),
  notifications: structuredClone(seed.notifications),
});

export const demoUserByRole: Record<Role, string> = {
  farmer: "u-farmer-1",
  buyer: "u-buyer-1",
  transporter: "u-transporter-1",
  admin: "u-admin-1",
};

const levelFor = (score: number): TrustProfile["level"] =>
  score >= 90 ? "High Trust" : score >= 75 ? "Trusted" : score >= 50 ? "Building Trust" : "New";

interface Ctx {
  state: AppState;
  hydrated: boolean;
  role: Role | null;
  currentUser: User | null;
  setRole: (role: Role | null) => void;
  resetDemo: () => void;
  getUser: (id: string) => User | undefined;
  getTrust: (id: string) => TrustProfile | undefined;
  getProduce: (id: string) => Produce | undefined;
  createListing: (input: Omit<Produce, "id" | "listedAt" | "farmerId" | "available">) => Produce;
  toggleListing: (produceId: string) => void;
  placeOrder: (input: {
    produceId: string;
    quantityKg: number;
    urgency: Delivery["urgency"];
  }) => Order | null;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  acceptDelivery: (deliveryId: string) => void;
  setDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  rateCounterparty: (orderId: string, targetUserId: string, rating: number) => void;
  markNotificationsRead: (userId: string) => void;
  notificationsFor: (userId: string) => Notification[];
}

const AppContext = createContext<Ctx | null>(null);

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(freshState);
  const [role, setRoleState] = useState<Role | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...freshState(), ...(JSON.parse(raw) as AppState) });
      const savedRole = localStorage.getItem(ROLE_KEY) as Role | null;
      if (savedRole) setRoleState(savedRole);
    } catch {
      /* corrupted storage — fall back to seed */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next);
    if (next) localStorage.setItem(ROLE_KEY, next);
    else localStorage.removeItem(ROLE_KEY);
  }, []);

  const resetDemo = useCallback(() => {
    setState(freshState());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentUser = useMemo(
    () => (role ? (state.users.find((u) => u.id === demoUserByRole[role]) ?? null) : null),
    [role, state.users],
  );

  const notify = (
    list: Notification[],
    userId: string,
    title: string,
    body: string,
    tone: Notification["tone"] = "info",
  ): Notification[] => [
    {
      id: uid("n"),
      userId,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: false,
      tone,
    },
    ...list,
  ];

  const value: Ctx = {
    state,
    hydrated,
    role,
    currentUser,
    setRole,
    resetDemo,
    getUser: (id) => state.users.find((u) => u.id === id),
    getTrust: (id) => state.trust.find((t) => t.userId === id),
    getProduce: (id) => state.produce.find((p) => p.id === id),

    createListing: (input) => {
      const farmerId = currentUser?.id ?? demoUserByRole.farmer;
      const listing: Produce = {
        ...input,
        id: uid("p"),
        farmerId,
        available: true,
        listedAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        produce: [listing, ...s.produce],
        notifications: notify(
          s.notifications,
          farmerId,
          "Listing published",
          `${listing.name} (${listing.quantityKg}kg) is now live on the marketplace.`,
          "success",
        ),
      }));
      return listing;
    },

    toggleListing: (produceId) =>
      setState((s) => ({
        ...s,
        produce: s.produce.map((p) => (p.id === produceId ? { ...p, available: !p.available } : p)),
      })),

    placeOrder: ({ produceId, quantityKg, urgency }) => {
      const item = state.produce.find((p) => p.id === produceId);
      const buyerId = currentUser?.role === "buyer" ? currentUser.id : demoUserByRole.buyer;
      if (!item) return null;
      const farmer = state.users.find((u) => u.id === item.farmerId);
      const buyer = state.users.find((u) => u.id === buyerId);
      const orderId = uid("o");
      const deliveryId = uid("d");
      const order: Order = {
        id: orderId,
        produceId,
        buyerId,
        farmerId: item.farmerId,
        quantityKg,
        totalPrice: quantityKg * item.pricePerKg,
        status: "Pending",
        createdAt: new Date().toISOString(),
        deliveryId,
      };
      const delivery: Delivery = {
        id: deliveryId,
        orderId,
        pickup: {
          label: `${farmer?.name ?? "Farm"}, ${item.location.split(",")[0]}`,
          lat: farmer?.coords.lat ?? 9,
          lng: farmer?.coords.lng ?? 8,
        },
        destination: {
          label: `${buyer?.name ?? "Buyer"}, ${(buyer?.location ?? "Lagos").split(",")[0]}`,
          lat: buyer?.coords.lat ?? 6.52,
          lng: buyer?.coords.lng ?? 3.38,
        },
        distanceKm: Math.max(
          40,
          Math.round(
            Math.hypot(
              (farmer?.coords.lat ?? 9) - (buyer?.coords.lat ?? 6.5),
              (farmer?.coords.lng ?? 8) - (buyer?.coords.lng ?? 3.4),
            ) * 111,
          ),
        ),
        fee: Math.round(quantityKg * 40 + (urgency === "Urgent" ? 25_000 : 0)),
        urgency,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      setState((s) => {
        let n = notify(
          s.notifications,
          item.farmerId,
          "New order received",
          `${buyer?.name ?? "A buyer"} ordered ${quantityKg}kg of ${item.name}.`,
          "success",
        );
        n = notify(
          n,
          demoUserByRole.transporter,
          "New delivery job available",
          `${delivery.pickup.label} → ${delivery.destination.label}, ${delivery.distanceKm}km.`,
        );
        return {
          ...s,
          orders: [order, ...s.orders],
          deliveries: [delivery, ...s.deliveries],
          produce: s.produce.map((p) =>
            p.id === produceId ? { ...p, quantityKg: Math.max(0, p.quantityKg - quantityKg) } : p,
          ),
          notifications: n,
        };
      });
      return order;
    },

    setOrderStatus: (orderId, status) =>
      setState((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order) return s;
        return {
          ...s,
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
          notifications: notify(
            s.notifications,
            order.buyerId,
            `Order ${status.toLowerCase()}`,
            `Your order ${orderId} is now marked "${status}".`,
            status === "Cancelled" ? "warning" : "success",
          ),
        };
      }),

    acceptDelivery: (deliveryId) =>
      setState((s) => {
        const delivery = s.deliveries.find((d) => d.id === deliveryId);
        if (!delivery) return s;
        const order = s.orders.find((o) => o.id === delivery.orderId);
        const transporterId = demoUserByRole.transporter;
        let n = s.notifications;
        if (order) {
          n = notify(
            n,
            order.buyerId,
            "Your delivery has been accepted",
            `SwiftHaul Logistics accepted the delivery for order ${order.id}.`,
            "success",
          );
          n = notify(
            n,
            order.farmerId,
            "Transporter assigned",
            `A transporter is en route to pick up ${order.id}.`,
          );
        }
        return {
          ...s,
          deliveries: s.deliveries.map((d) =>
            d.id === deliveryId ? { ...d, transporterId, status: "Accepted" } : d,
          ),
          orders: s.orders.map((o) =>
            o.id === delivery.orderId ? { ...o, status: "Awaiting Pickup" } : o,
          ),
          notifications: n,
        };
      }),

    setDeliveryStatus: (deliveryId, status) =>
      setState((s) => {
        const delivery = s.deliveries.find((d) => d.id === deliveryId);
        if (!delivery) return s;
        const orderStatus: OrderStatus | null =
          status === "Picked Up"
            ? "In Transit"
            : status === "In Transit"
              ? "In Transit"
              : status === "Delivered"
                ? "Delivered"
                : status === "Accepted"
                  ? "Awaiting Pickup"
                  : null;
        const order = s.orders.find((o) => o.id === delivery.orderId);
        let n = s.notifications;
        if (order && status === "Delivered") {
          n = notify(
            n,
            order.buyerId,
            "Your order has been delivered",
            `Order ${order.id} arrived. Confirm to complete.`,
            "success",
          );
          n = notify(
            n,
            order.farmerId,
            "Delivery completed",
            `Order ${order.id} was delivered successfully.`,
            "success",
          );
        }
        return {
          ...s,
          deliveries: s.deliveries.map((d) => (d.id === deliveryId ? { ...d, status } : d)),
          orders: orderStatus
            ? s.orders.map((o) => (o.id === delivery.orderId ? { ...o, status: orderStatus } : o))
            : s.orders,
          notifications: n,
        };
      }),

    rateCounterparty: (orderId, targetUserId, rating) =>
      setState((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order) return s;
        const isBuyerRating = targetUserId !== order.buyerId;
        const trust = s.trust.map((t) => {
          if (t.userId !== targetUserId) return t;
          const completed = t.completedTransactions + 1;
          const newRating = Number(
            ((t.rating * t.completedTransactions + rating) / completed).toFixed(2),
          );
          const score = Math.max(
            0,
            Math.min(100, Math.round(t.score + (rating >= 4 ? 2 : rating >= 3 ? 0 : -4))),
          );
          return {
            ...t,
            completedTransactions: completed,
            rating: newRating,
            score,
            level: levelFor(score),
            history: [
              ...t.history,
              {
                date: new Date().toISOString(),
                score,
                reason: `${rating}-star rating on order ${orderId}`,
              },
            ],
          };
        });
        return {
          ...s,
          trust,
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "Completed",
                  ratedByBuyer: isBuyerRating ? true : o.ratedByBuyer,
                  ratedByFarmer: isBuyerRating ? o.ratedByFarmer : true,
                }
              : o,
          ),
          notifications: notify(
            s.notifications,
            targetUserId,
            "Your trust score was updated",
            `A ${rating}-star rating was recorded for order ${orderId}.`,
            "success",
          ),
        };
      }),

    markNotificationsRead: (userId) =>
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
      })),

    notificationsFor: (userId) =>
      state.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

export const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export const timeAgo = (iso: string) => {
  const diff = Date.now() - +new Date(iso);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60_000);
  return mins > 0 ? `${mins}m ago` : "just now";
};
