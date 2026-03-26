import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const AVATAR_OPTIONS = [
  { id: "Felix", url: "https://api.dicebear.com/9.x/micah/svg?seed=Felix" },
  { id: "Aneka", url: "https://api.dicebear.com/9.x/micah/svg?seed=Aneka" },
  { id: "Abby", url: "https://api.dicebear.com/9.x/micah/svg?seed=Abby" },
  { id: "Jack", url: "https://api.dicebear.com/9.x/micah/svg?seed=Jack" },
  { id: "Jasper", url: "https://api.dicebear.com/9.x/micah/svg?seed=Jasper" },
  { id: "Leo", url: "https://api.dicebear.com/9.x/micah/svg?seed=Leo" },
  { id: "Milo", url: "https://api.dicebear.com/9.x/micah/svg?seed=Milo" },
  { id: "Oliver", url: "https://api.dicebear.com/9.x/micah/svg?seed=Oliver" },
];

export default function Profile() {
  const { username: storeUsername, avatarUrl: storeAvatarUrl, setProfile } = useUserStore();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    avatar_url: storeAvatarUrl || "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    email_notifications: true,
    order_updates: true,
    personalized_offers: false,
  });
  
  const navigate = useNavigate();
  const isGuest = !localStorage.getItem("access");

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setUser({ username: "Guest", email: "" });
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const profileRes = await api.get("auth/profile/");
        const data = profileRes.data || {};
        setUser(data);
        setProfileForm(prev => ({
          ...prev,
          ...(data.profile || {}),
        }));

        const ordersRes = await api.get("orders/");
        const ordersData = ordersRes.data;
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || []);
      } catch (err) {
        setError("Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveProfile = async (payload) => {
    if (isGuest) {
      setProfileForm(prev => ({ ...prev, ...(payload || {}) }));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.put("auth/profile/", { profile: payload });
      setUser(res.data);
      setProfileForm(prev => ({ ...prev, ...(res.data.profile || {}) }));
      setProfile(res.data);
    } catch (err) {
      setError("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    await saveProfile(profileForm);
    setEditingAddress(false);
  };

  const togglePreference = async (field) => {
    const nextValue = !profileForm[field];
    setProfileForm(prev => ({ ...prev, [field]: nextValue }));
    await saveProfile({ ...profileForm, [field]: nextValue });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted animate-pulse">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Personal Suite</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-display text-ink mb-4">{storeUsername}</h1>
            <p className="text-muted text-sm max-w-md">Your sanctuary for collection management, preferences, and personal aesthetics.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate("/account")} className="btn-elegant bg-white text-ink border border-black/10 px-8 py-3 text-[10px]">Orders</button>
             <button onClick={() => navigate("/shop")} className="btn-elegant bg-ink text-white px-8 py-3 text-[10px]">Shop Collection</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-10 pb-4 border-b border-black/5 opacity-60">Identity Avatar</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-6">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => saveProfile({ ...profileForm, avatar_url: avatar.url })}
                  className={`relative rounded-full p-1 transition-all duration-500 hover:scale-110 ${
                    profileForm.avatar_url === avatar.url 
                      ? "ring-2 ring-ink shadow-lg scale-105" 
                      : "opacity-40 hover:opacity-100"
                  }`}
                  disabled={saving}
                >
                  <img src={avatar.url} alt={avatar.id} className="w-full aspect-square rounded-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-60">Shipping Logistics</h3>
              <button
                onClick={() => setEditingAddress(!editingAddress)}
                className="text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition"
              >
                {editingAddress ? "Cancel" : "Modify Details"}
              </button>
            </div>

            {editingAddress ? (
              <form onSubmit={handleAddressSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block ml-1">Full Designation</label>
                  <input
                    className="w-full bg-black/5 border-none px-6 py-4 rounded-2xl text-xs focus:ring-1 ring-ink/10 outline-none transition"
                    value={profileForm.full_name}
                    onChange={e => setProfileForm({...profileForm, full_name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block ml-1">Connectivity (Phone)</label>
                  <input
                    className="w-full bg-black/5 border-none px-6 py-4 rounded-2xl text-xs focus:ring-1 ring-ink/10 outline-none transition"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block ml-1">Primary Line</label>
                   <input
                    className="w-full bg-black/5 border-none px-6 py-4 rounded-2xl text-xs focus:ring-1 ring-ink/10 outline-none transition"
                    value={profileForm.address_line1}
                    onChange={e => setProfileForm({...profileForm, address_line1: e.target.value})}
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block ml-1">City</label>
                   <input
                    className="w-full bg-black/5 border-none px-6 py-4 rounded-2xl text-xs focus:ring-1 ring-ink/10 outline-none transition"
                    value={profileForm.city}
                    onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block ml-1">Postal Code</label>
                   <input
                    className="w-full bg-black/5 border-none px-6 py-4 rounded-2xl text-xs focus:ring-1 ring-ink/10 outline-none transition"
                    value={profileForm.postal_code}
                    onChange={e => setProfileForm({...profileForm, postal_code: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="btn-elegant w-full py-5 bg-ink text-white shadow-xl shadow-black/10 text-[10px]">
                    {saving ? "Updating System..." : "Confirm Logistics"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Recipient</p>
                  <p className="text-sm font-medium text-ink">{profileForm.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Location</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {profileForm.address_line1 ? (
                      <>
                        {profileForm.address_line1}<br />
                        {profileForm.city}, {profileForm.postal_code}<br />
                        {profileForm.country}
                      </>
                    ) : "No address specified."}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-10">
          <section className="bg-ink text-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full border border-white/20 p-1 mb-8">
                <img src={profileForm.avatar_url || storeAvatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-2">Curated Profile</p>
              <h4 className="text-2xl font-display mb-8">{user?.username}</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-white/10 pb-4">
                  <span className="opacity-50">Status</span>
                  <span className="text-[var(--color-gold)]">Verified Member</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest pt-2">
                  <span className="opacity-50">Discovery Year</span>
                  <span>{user?.member_since ? new Date(user.member_since).getFullYear() : "2024"}</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
          </section>

          <section className="bg-white rounded-[2.5rem] border border-black/5 p-10 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-60">Preferences</h3>
            <div className="space-y-6">
              {[
                { label: "Dispatch Alerts", field: "order_updates" },
                { label: "Design Curations", field: "email_notifications" },
                { label: "Bespoke Offers", field: "personalized_offers" }
              ].map(pref => (
                <div key={pref.field} className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-muted">{pref.label}</span>
                  <button
                    onClick={() => togglePreference(pref.field)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-500 ${profileForm[pref.field] ? "bg-ink" : "bg-black/10"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 transform ${profileForm[pref.field] ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="w-full mt-10 pt-6 border-t border-black/5 text-[10px] uppercase tracking-[0.4em] text-red-500 hover:text-red-700 transition"
            >
              Sign Out
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

