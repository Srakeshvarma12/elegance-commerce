import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import api from "../services/api";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const AVATAR_OPTIONS = [
  { id: "Felix", url: "https://api.dicebear.com/9.x/micah/svg?seed=Felix" },
  { id: "Aneka", url: "https://api.dicebear.com/9.x/micah/svg?seed=Aneka" },
  { id: "Abby", url: "https://api.dicebear.com/9.x/micah/svg?seed=Abby" },
  { id: "Jack", url: "https://api.dicebear.com/9.x/micah/svg?seed=Jack" },
  { id: "Jasper", url: "https://api.dicebear.com/9.x/micah/svg?seed=Jasper" },
];

export default function Profile() {
  const { username: storeUsername, avatarUrl: storeAvatarUrl, setProfile } = useUserStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    avatar_url: storeAvatarUrl || "",
    address_line1: "",
    city: "",
    postal_code: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const profileRes = await api.get("auth/profile/");
        const data = profileRes.data || {};
        setUser(data);
        setProfileForm(prev => ({ ...prev, ...(data.profile || {}) }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProfile = async (payload) => {
    setSaving(true);
    try {
      const res = await api.put("auth/profile/", { profile: payload });
      setUser(res.data);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-8 md:pt-16 md:pb-10">
        <p className="label mb-2">Account</p>
        <h1 className="heading-xl">My Profile</h1>
      </header>

      <div className="section-container pb-20 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">
        {/* Profile Card */}
        <div className="flex flex-col gap-6">
          <div className="card bg-text-primary text-white p-8 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl border border-white/20 p-0.5 mb-6 overflow-hidden">
              <img src={profileForm.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
            <p className="text-xs text-white/50 mb-6">Member</p>
            <div className="space-y-3 pt-5 border-t border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Status</span>
                <span className="text-accent font-medium">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Since</span>
                <span className="text-white/70">2026</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="form-label mb-4">Choose Avatar</h3>
            <div className="flex flex-wrap gap-3">
              {AVATAR_OPTIONS.map(a => (
                <button
                  key={a.id}
                  onClick={() => saveProfile({...profileForm, avatar_url: a.url})}
                  className={`w-11 h-11 rounded-xl overflow-hidden transition-all hover:scale-105 ${
                    profileForm.avatar_url === a.url ? "ring-2 ring-text-primary ring-offset-2 scale-105" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={a.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <h3 className="font-semibold">Personal Information</h3>
            <button
              onClick={() => setEditingAddress(!editingAddress)}
              className="text-sm font-medium text-accent hover:underline transition-colors"
            >
              {editingAddress ? "Cancel" : "Edit"}
            </button>
          </div>

          {editingAddress ? (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={(e) => { e.preventDefault(); saveProfile(profileForm); setEditingAddress(false); }}
            >
              <div className="md:col-span-2">
                <label className="form-label">Full Name</label>
                <input className="input" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="input" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Postal Code</label>
                <input className="input" value={profileForm.postal_code} onChange={e => setProfileForm({...profileForm, postal_code: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Address</label>
                <input className="input" value={profileForm.address_line1} onChange={e => setProfileForm({...profileForm, address_line1: e.target.value})} />
              </div>
              <div>
                <label className="form-label">City</label>
                <input className="input" value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} />
              </div>
              <div className="md:col-span-2 mt-2">
                <LiquidButton size="xl" disabled={saving} className="!text-text-primary font-semibold w-full disabled:opacity-40">
                  {saving ? "Saving..." : "Save Changes"}
                </LiquidButton>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-text-muted mb-1">Full Name</p>
                <p className="font-medium">{profileForm.full_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Phone</p>
                <p className="font-medium">{profileForm.phone || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Address</p>
                <p className="font-medium text-text-secondary">{profileForm.address_line1 || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">City</p>
                <p className="font-medium text-text-secondary">{profileForm.city || "Not set"}</p>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-border flex justify-center">
            <button
              onClick={() => { localStorage.clear(); navigate("/login"); }}
              className="text-sm text-error hover:underline transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
