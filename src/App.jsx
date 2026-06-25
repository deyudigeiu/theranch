import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { useStorage } from "./hooks/useStorage";
import { useDelivery } from "./hooks/useDelivery";

import Toast from "./components/shared/Toast";
import LoginScreen from "./components/shared/LoginScreen";
import Header from "./components/shared/Header";
import TabBar from "./components/shared/TabBar";
import HamburgerMenu from "./components/shared/HamburgerMenu";
import ErrorBoundary from "./components/shared/ErrorBoundary";

import Home from "./components/client/Home";
import Produse from "./components/client/Produse";
import Detail from "./components/client/Detail";
import Cos from "./components/client/Cos";
import Checkout from "./components/client/Checkout";
import Confirmare from "./components/client/Confirmare";
import Comenzi from "./components/client/Comenzi";
import Profile from "./components/client/Profile";
import Addresses from "./components/client/Addresses";
import Wishlist from "./components/client/Wishlist";
import Notifs from "./components/client/Notifs";
import Help from "./components/client/Help";
import About from "./components/client/About";
import Gallery from "./components/client/Gallery";
import Blog from "./components/client/Blog";
import Live from "./components/client/Live";

import AdminHome from "./components/admin/AdminHome";
import AdminOrders from "./components/admin/AdminOrders";
import AdminProducts from "./components/admin/AdminProducts";
import AdminSettings from "./components/admin/AdminSettings";
import AdminContent from "./components/admin/AdminContent";
import AdminAbout from "./components/admin/AdminAbout";
import AdminCosBaza from "./components/admin/AdminCosBaza";
import AdminClients from "./components/admin/AdminClients";
import AdminBroadcast from "./components/admin/AdminBroadcast";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminDeliveryList from "./components/admin/AdminDeliveryList";
import AdminSubscriptions from "./components/admin/AdminSubscriptions";
import AdminList from "./components/admin/AdminList";
import AdminBlog from "./components/admin/AdminBlog";
import AdminGallery from "./components/admin/AdminGallery";
import AdminLive from "./components/admin/AdminLive";

const ADMIN_EMAIL = "andrei.spataru2391@gmail.com";

export default function App() {
  const { session, loading: authLoading } = useAuth();
  const storage = useStorage();

  const admin = session?.user?.email === ADMIN_EMAIL;
  const [viewAsClient, setViewAsClient] = useState(false);

  const sendMagicLink = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return { error };
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const [page, setPage] = useState("home");
  const [adminPage, setAdminPage] = useState("dash");
  const [menuOpen, setMenuOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [clients, setClients] = useState([]);

  const [settings, setSettings] = useState({});
  const [deliveryConfig, setDeliveryConfig] = useState({});
  const [modules, setModules] = useState({});
  const [bannerText, setBannerText] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [cosBaza, setCosBaza] = useState(null);
  const [aboutData, setAboutData] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  const { nextDelivery, cutoff } = useDelivery(deliveryConfig);
  const slots = deliveryConfig?.slots || [];

  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const notifCount = notifications.filter((n) => !n.read).length;

  const showToast = (msg, type = "✓") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const [prods, cats, rows] = await Promise.all([
          storage.getProducts(),
          storage.getCategories(),
          storage.getConfig(),
        ]);
        setProducts(prods || []);
        setCategories(cats || []);
        const cfg = {};
        (rows || []).forEach((r) => {
          cfg[r.key] = r.value;
        });
        setSettings(cfg.settings || {});
        setDeliveryConfig(cfg.delivery || {});
        setModules(cfg.modules || {});
        setBannerText(cfg.bannerText || "");
        setWelcomeMsg(cfg.welcomeMsg || "");
        setCosBaza(cfg.cosBaza || null);
        setAboutData(cfg.about || {});
      } catch (e) {
        console.error("Load public data error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!session) {
      setCart([]);
      setWishlist([]);
      setOrders([]);
      setProfile(null);
      setAddresses([]);
      setNotifications([]);
      setClients([]);
      setDataLoaded(false);
      return;
    }
    (async () => {
      setDataLoaded(false);
      try {
        const isAdminUser = session.user.email === ADMIN_EMAIL;
        const [prof, cartData, wishData, addrsData, notifsData, ordersData] =
          await Promise.all([
            storage.getProfile(),
            storage.getCart(),
            storage.getWishlist(),
            storage.getAddresses(),
            storage.getNotifications(),
            storage.getOrders(!isAdminUser),
          ]);
        setProfile(prof || null);
        setCart(cartData || []);
        setWishlist(wishData || []);
        setAddresses(addrsData || []);
        setNotifications(notifsData || []);
        setOrders(ordersData || []);
        if (isAdminUser) {
          const clientsData = await storage.getClients();
          setClients(clientsData || []);
        }
      } catch (e) {
        console.error("Load user data error:", e);
      }
      setDataLoaded(true);
    })();
  }, [session]);

const addToCart = async (productOrId, qty = 1) => {
  if (settings?.shopOpen === false) {
    showToast("Magazinul este momentan închis", "🔒");
    return;
  }
  const product =
    typeof productOrId === "string"
      ? products.find((p) => p.id === productOrId)
      : productOrId;
  if (!product) return;
  const currentQty = cart.find((i) => i.product_id === product.id)?.qty || 0;
  if (product.stock != null && currentQty + qty > product.stock) {
    showToast(`Stoc insuficient — doar ${product.stock} disponibil`, "⚠️");
    return;
  }
  await storage.addToCart(product.id, qty);
  setCart((prev) => {
    const existing = prev.find((i) => i.product_id === product.id);
    if (existing) {
      return prev.map((i) =>
        i.product_id === product.id ? { ...i, qty: i.qty + qty } : i
      );
    }
    return [...prev, { product_id: product.id, qty }];
  });
  showToast(`${product.name} adăugat în coș`);
};

const updateCartQty = async (productId, qty) => {
  if (settings?.shopOpen === false) {
    showToast("Magazinul este momentan închis", "🔒");
    return;
  }
  if (qty <= 0) return removeFromCart(productId);
  const product = findProduct(productId);
  if (product && product.stock != null && qty > product.stock) {
    showToast(`Stoc maxim disponibil: ${product.stock} ${product.unit || "buc"}`, "⚠️");
    return;
  }
  await storage.updateCartQty(productId, qty);
  setCart((prev) =>
    prev.map((i) => (i.product_id === productId ? { ...i, qty } : i))
  );
};
  const clearCart = async () => {  const removeFromCart = async (productId) => {
    await storage.removeFromCart(productId);
    setCart((prev) => prev.filter((i) => i.product_id !== productId));
  };

    const removeFromCart = async (productId) => {
    await storage.removeFromCart(productId);
    setCart((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const clearCart = async () => {
    await storage.clearCart();
    setCart([]);
  };

  const toggleWishlist = async (productId) => {
    const inList = wishlist.some((w) => w.product_id === productId);
    if (inList) {
      await storage.removeFromWishlist(productId);
      setWishlist((w) => w.filter((i) => i.product_id !== productId));
    } else {
      await storage.addToWishlist(productId);
      setWishlist((w) => [...w, { product_id: productId }]);
    }
  };

  const placeOrder = async (orderData) => {
    if (settings?.shopOpen === false) {
      showToast("Magazinul este momentan închis", "🔒");
      return null;
    }
    for (const item of cart) {
      const p = findProduct(item.product_id);
      if (p && p.stock < item.qty) {
        showToast(
          `Stoc insuficient pentru ${p.name} (${p.stock} disponibil)`,
          "⚠️"
        );
        return null;
      }
    }
    const order = await storage.createOrder({ ...orderData, items: cart });
    if (order) {
      setLastOrderId(order.id);
      await clearCart();
      const [refreshedOrders, refreshedProducts] = await Promise.all([
        storage.getOrders(!admin),
        storage.getProducts(),
      ]);
      setOrders(refreshedOrders || []);
      setProducts(refreshedProducts || []);
      setPage("confirmare");
    }
    return order;
  };
  const updateProfile = async (data) => {
    const updated = await storage.updateProfile(data);
    if (updated) setProfile(updated);
    return updated;
  };

  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!cutoff) return;
    const calc = () => {
      const ms = new Date(cutoff) - new Date();
      if (ms <= 0) {
        setCountdown("Închis");
        return;
      }
      const dy = Math.floor(ms / 86400000);
      const hr = Math.floor((ms % 86400000) / 3600000);
      const mn = Math.floor((ms % 3600000) / 60000);
      setCountdown(
        dy > 0 ? `${dy}z ${hr}h` : hr > 0 ? `${hr}h ${mn}m` : `${mn} min`
      );
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [cutoff]);

  useEffect(() => {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        (payload) => {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === payload.new.id ? { ...p, ...payload.new } : p
            )
          );
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  const findCategory = (id) =>
    categories.find((c) => c.id === id) || {
      ac: "#666",
      bg: "#f5f5f5",
      lt: "#eee",
      name: "—",
      emoji: "📦",
    };
  const findProduct = (id) => products.find((p) => p.id === id);
  const openProduct = (p) => {
    setSelectedProduct(p);
    setPage("detail");
  };
  const setCartQty = updateCartQty;

  const content = {
    banner_open: "Comenzi deschise",
    banner_closed: "Comenzi închise",
    home_message: welcomeMsg || "",
    home_photo: "🌾",
    section_recommended: "Recomandate luna asta",
    section_categories: "Răsfoiește categorii",
    time_remaining_label: "timp rămas",
    modules,
  };

  const appConfig = { cos_lunii: cosBaza };

  const ctx = {
    session,
    admin,
    viewAsClient,
    setViewAsClient,
    dataLoaded,
    sendMagicLink,
    signOut,
    page,
    setPage,
    adminPage,
    setAdminPage,
    menuOpen,
    setMenuOpen,
    setMenu: setMenuOpen,
    products,
    setProducts,
    categories,
    setCategories,
    selectedProduct,
    setSelectedProduct,
    cart,
    setCart,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    setCartQty,
    wishlist,
    setWishlist,
    toggleWishlist,
    orders,
    setOrders,
    placeOrder,
    lastOrderId,
    setLastOrderId,
    profile,
    setProfile,
    updateProfile,
    addresses,
    setAddresses,
    notifications,
    setNotifications,
    notifCount,
    clients,
    setClients,
    settings,
    setSettings,
    deliveryConfig,
    setDeliveryConfig,
    modules,
    setModules,
    bannerText,
    setBannerText,
    welcomeMsg,
    setWelcomeMsg,
    cosBaza,
    setCosBaza,
    aboutData,
    setAboutData,
    nextDelivery,
    cutoff,
    slots,
    countdown,
    storage,
    showToast,
    findCategory,
    findProduct,
    openProduct,
    setCartQty,
    content,
    appConfig,
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#F0EBE0",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 44 }}>🌿</div>
        <div style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>
          Drăgăneasa Ranch
        </div>
      </div>
    );
  }

  if (!session) return <LoginScreen ctx={ctx} />;

  if (admin && !viewAsClient) {
    return (
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          background: "#F0EBE0",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {toast && <Toast toast={toast} />}
        <HamburgerMenu ctx={ctx} />
        <Header ctx={ctx} />
        <ErrorBoundary onBack={() => setAdminPage("dash")}>
          <div style={{ paddingTop: 64 }}>
            {adminPage === "dash" && <AdminHome ctx={ctx} />}
            {adminPage === "orders" && <AdminOrders ctx={ctx} />}
            {adminPage === "products" && <AdminProducts ctx={ctx} />}
            {adminPage === "clients" && <AdminClients ctx={ctx} />}
            {adminPage === "analytics" && <AdminAnalytics ctx={ctx} />}
            {adminPage === "broadcast" && <AdminBroadcast ctx={ctx} />}
            {adminPage === "cosBaza" && <AdminCosBaza ctx={ctx} />}
            {adminPage === "settings" && <AdminSettings ctx={ctx} />}
            {adminPage === "content" && <AdminContent ctx={ctx} />}
            {adminPage === "about" && <AdminAbout ctx={ctx} />}
            {adminPage === "deliveryList" && <AdminDeliveryList ctx={ctx} />}
            {adminPage === "subscriptions" && <AdminSubscriptions ctx={ctx} />}
            {adminPage === "list" && <AdminList ctx={ctx} />}
            {adminPage === "blog" && <AdminBlog ctx={ctx} />}
            {adminPage === "gallery" && <AdminGallery ctx={ctx} />}
            {adminPage === "live" && <AdminLive ctx={ctx} />}
          </div>
        </ErrorBoundary>
      </div>
    );
  }

  const hideChrome = ["checkout", "confirmare"].includes(page);

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        background: "#F0EBE0",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {toast && <Toast toast={toast} />}
      <HamburgerMenu ctx={ctx} />
      {!hideChrome && <Header ctx={ctx} />}
      <ErrorBoundary onBack={() => setPage("home")}>
        <div style={{ paddingBottom: hideChrome ? 0 : 70 }}>
          {page === "home" && <Home ctx={ctx} />}
          {page === "produse" && <Produse ctx={ctx} />}
          {page === "detail" && <Detail ctx={ctx} />}
          {page === "cos" && <Cos ctx={ctx} />}
          {page === "checkout" && <Checkout ctx={ctx} />}
          {page === "confirmare" && <Confirmare ctx={ctx} />}
          {page === "comenzi" && <Comenzi ctx={ctx} />}
          {page === "profile" && <Profile ctx={ctx} />}
          {page === "addresses" && <Addresses ctx={ctx} />}
          {page === "wishlist" && <Wishlist ctx={ctx} />}
          {page === "notifs" && <Notifs ctx={ctx} />}
          {page === "help" && <Help ctx={ctx} />}
          {page === "about" && <About ctx={ctx} />}
          {page === "gallery" && <Gallery ctx={ctx} />}
          {page === "blog" && <Blog ctx={ctx} />}
          {page === "live" && <Live ctx={ctx} />}
        </div>
      </ErrorBoundary>
      {!hideChrome && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
            zIndex: 10,
          }}
        >
          <TabBar ctx={ctx} />
        </div>
      )}
    </div>
  );
}
