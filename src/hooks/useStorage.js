import { supabase } from "../lib/supabase";

const ADMIN_USER_ID = "05580dfa-fac9-4e8a-84b1-807a56457cba";

export function useStorage() {
  const getProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("name");
    return data || [];
  };

  const saveProduct = async (product) => {
    const clean = { ...product };
    if (!clean.preorder_date) clean.preorder_date = null;
    if (!clean.id) delete clean.id;

    if (clean.id) {
      const { data } = await supabase
        .from("products")
        .update(clean)
        .eq("id", clean.id)
        .select()
        .single();
      return data;
    } else {
      const newId = "P" + String(Math.floor(Math.random() * 90000) + 10000);
      const { data, error } = await supabase
        .from("products")
        .insert({ ...clean, id: newId })
        .select()
        .single();
      if (error) console.error("saveProduct error:", error);
      return data;
    }
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
  };

  const getCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    return data || [];
  };

  const getConfig = async () => {
    const { data } = await supabase.from("app_config").select("*");
    return data || [];
  };

  const setConfig = async (key, value) => {
    const { data } = await supabase
      .from("app_config")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single();
    return data;
  };

  const getProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return data;
  };

  const updateProfile = async (updates) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    return data;
  };

  const getAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    return data || [];
  };

  const saveAddress = async (address) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    if (address.id) {
      const { data } = await supabase
        .from("addresses")
        .update(address)
        .eq("id", address.id)
        .select()
        .single();
      return data;
    } else {
      const { data } = await supabase
        .from("addresses")
        .insert({ ...address, user_id: user.id })
        .select()
        .single();
      return data;
    }
  };

  const deleteAddress = async (id) => {
    await supabase.from("addresses").delete().eq("id", id);
  };

  const getCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("cart")
      .select("product_id, qty")
      .eq("user_id", user.id);
    return data || [];
  };

  const addToCart = async (productId, qty = 1) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: existing } = await supabase
      .from("cart")
      .select("qty")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();
    const newQty = (existing?.qty || 0) + qty;
    await supabase
      .from("cart")
      .upsert({ user_id: user.id, product_id: productId, qty: newQty });
    return getCart();
  };

  const updateCartQty = async (productId, qty) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    if (qty <= 0) {
      await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    } else {
      await supabase
        .from("cart")
        .upsert({ user_id: user.id, product_id: productId, qty });
    }
    return getCart();
  };

  const removeFromCart = async (productId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    return getCart();
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("cart").delete().eq("user_id", user.id);
  };

  const getWishlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("wishlist")
      .select("product_id, notify_when_available")
      .eq("user_id", user.id);
    return data || [];
  };

  const addToWishlist = async (productId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("wishlist")
      .upsert(
        { user_id: user.id, product_id: productId },
        { onConflict: "user_id,product_id" }
      );
  };

  const removeFromWishlist = async (productId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
  };

  const getOrders = async (limitToUser = true) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let query = supabase
      .from("orders")
      .select("*, profiles(name, phone)")
      .order("created_at", { ascending: false });
    if (limitToUser && user) query = query.eq("user_id", user.id);
    const { data } = await query;
    return data || [];
  };

  const createOrder = async (orderData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const id = "ORD" + String(Math.floor(Math.random() * 90000) + 10000);
    const { data } = await supabase
      .from("orders")
      .insert({ ...orderData, id, user_id: user.id })
      .select()
      .single();
    if (data) {
      for (const item of orderData.items || []) {
        const { data: prod } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();
        if (prod) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, (prod.stock || 0) - item.qty) })
            .eq("id", item.product_id);
        }
      }
      await supabase.from("notifications").insert({
        user_id: ADMIN_USER_ID,
        type: "order",
        msg: `Comandă nouă #${id} — ${orderData.total} RON`,
      });
    }
    return data;
  };

  const updateOrderStatus = async (orderId, status) => {
    const { data } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("*")
      .single();
    if (data?.user_id) {
      await supabase.from("notifications").insert({
        user_id: data.user_id,
        type: "order",
        msg: `Comanda #${orderId} este acum: ${status}`,
      });
    }
    return data;
  };

  const getNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  };

  const markNotificationsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  };

  const getReviews = async (productId) => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(name)")
      .eq("product_id", productId)
      .order("date", { ascending: false });
    return data || [];
  };

  const saveReview = async (productId, rating, text) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("reviews")
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          rating,
          text,
          date: new Date().toISOString().split("T")[0],
        },
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();
    return data;
  };

  const getSubscriptions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from("subscriptions")
      .select("*, products(*)")
      .eq("user_id", user.id)
      .eq("active", true);
    return data || [];
  };

  const saveSubscription = async (productId, qty) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("subscriptions")
      .upsert(
        { user_id: user.id, product_id: productId, qty, active: true },
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();
    return data;
  };

  const getAllSubscriptions = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, products(*), profiles(name, phone)")
      .order("created_at", { ascending: false });
    return data || [];
  };

  const updateSubscription = async (id, updates) => {
    const { data } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return data;
  };

  // --- Basket subscriptions stored in app_config (no FK constraint issues) ---

  const _getBasketSubsRaw = async () => {
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "cos_subscriptions")
      .single();
    return data?.value || [];
  };

  const isSubscribedToBasket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const list = await _getBasketSubsRaw();
    return list.some((s) => s.user_id === user.id && s.active);
  };

  const subscribeToBasket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prof } = await supabase
      .from("profiles")
      .select("name, phone")
      .eq("id", user.id)
      .single();
    const current = await _getBasketSubsRaw();
    const exists = current.find((s) => s.user_id === user.id);
    const updated = exists
      ? current.map((s) => (s.user_id === user.id ? { ...s, active: true } : s))
      : [
          ...current,
          {
            user_id: user.id,
            name: prof?.name || user.email,
            phone: prof?.phone || "",
            active: true,
            subscribed_at: new Date().toISOString(),
          },
        ];
    await supabase
      .from("app_config")
      .upsert(
        { key: "cos_subscriptions", value: updated },
        { onConflict: "key" }
      );
  };

  const unsubscribeFromBasket = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const current = await _getBasketSubsRaw();
    const updated = current.map((s) =>
      s.user_id === user.id ? { ...s, active: false } : s
    );
    await supabase
      .from("app_config")
      .upsert(
        { key: "cos_subscriptions", value: updated },
        { onConflict: "key" }
      );
  };

  const getBasketSubscriptions = async () => {
    return _getBasketSubsRaw();
  };

  const toggleBasketSubscription = async (userId, active) => {
    const current = await _getBasketSubsRaw();
    const updated = current.map((s) =>
      s.user_id === userId ? { ...s, active } : s
    );
    await supabase
      .from("app_config")
      .upsert(
        { key: "cos_subscriptions", value: updated },
        { onConflict: "key" }
      );
  };

  // ---

  const getClients = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  };

  const updateClientNote = async (clientId, notes) => {
    await supabase.from("profiles").update({ notes }).eq("id", clientId);
  };

  const getBlogPosts = async () => {
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "blog")
      .single();
    return data?.value || [];
  };

  const saveBlogPost = async (post) => {
    const posts = await getBlogPosts();
    const updated = post.id
      ? posts.map((p) => (p.id === post.id ? post : p))
      : [...posts, { ...post, id: Date.now() }];
    await setConfig("blog", updated);
    return post;
  };

  const notifyWishlistUsers = async (productId, productName) => {
    const { data: items } = await supabase
      .from("wishlist")
      .select("user_id")
      .eq("product_id", productId);
    if (!items?.length) return;
    await supabase.from("notifications").insert(
      items.map((i) => ({
        user_id: i.user_id,
        type: "stock",
        msg: `${productName} este din nou în stoc.`,
      }))
    );
  };

  return {
    getProducts,
    saveProduct,
    deleteProduct,
    getCategories,
    getConfig,
    setConfig,
    getProfile,
    updateProfile,
    getAddresses,
    saveAddress,
    deleteAddress,
    getCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getOrders,
    createOrder,
    updateOrderStatus,
    getNotifications,
    markNotificationsRead,
    getReviews,
    saveReview,
    getSubscriptions,
    saveSubscription,
    getAllSubscriptions,
    updateSubscription,
    isSubscribedToBasket,
    subscribeToBasket,
    unsubscribeFromBasket,
    getBasketSubscriptions,
    toggleBasketSubscription,
    getClients,
    updateClientNote,
    getBlogPosts,
    saveBlogPost,
    notifyWishlistUsers,
  };
}
