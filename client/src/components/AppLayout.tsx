import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, Heart, Home, LogOut, Menu, Shield, Ticket, Trophy, UserCircle, X, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = role === "ADMIN" ? [
    { to: "/admin", label: "Command Center", icon: Shield },
    { to: "/dashboard", label: "User View", icon: Home },
    { to: "/draws", label: "Draws", icon: Ticket },
    { to: "/charity", label: "Charities", icon: Heart },
    { to: "/winnings", label: "Winners", icon: Trophy },
    { to: "/scores", label: "Score Data", icon: BarChart3 },
  ] : [
    { to: "/dashboard", label: "Overview", icon: Home },
    { to: "/scores", label: "My Scores", icon: BarChart3 },
    { to: "/draws", label: "Monthly Draw", icon: Ticket },
    { to: "/charity", label: "My Impact", icon: Heart },
    { to: "/subscription", label: "Membership", icon: CreditCard },
    { to: "/winnings", label: "My Winnings", icon: Trophy },
  ];
  async function signOut() { await logout(); navigate("/login"); }
  return (
    <div className={`app-shell ${role === "ADMIN" ? "admin-shell" : "user-shell"}`}>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">DH</div><div><strong>Digital Heroes</strong><span>{role === "ADMIN" ? "Operations studio" : "Player experience"}</span></div><button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20}/></button></div>
        <div className="side-section-label">{role === "ADMIN" ? "CONTROL" : "YOUR GAME"}</div>
        <nav onClick={() => setOpen(false)}>{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Icon size={18}/><span>{label}</span>{to === "/admin" && <span className="nav-dot"/>}</NavLink>)}</nav>
        <div className="sidebar-bottom"><NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><UserCircle size={18}/>Profile</NavLink><div className="mini-user"><div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div><div><strong>{user?.name}</strong><span>{role === "ADMIN" ? "Administrator" : "Member"}</span></div><ChevronDown size={14}/></div><button className="btn btn-sidebar-logout" onClick={signOut}><LogOut size={16}/> Sign out</button></div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22}/></button><div><span className="topbar-eyebrow">{role === "ADMIN" ? "ADMINISTRATION" : "MEMBER AREA"}</span><strong>{role === "ADMIN" ? "Operations" : "My clubhouse"}</strong></div></div><div className="topbar-actions"><button className="icon-btn notification-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="topbar-profile"><div className="avatar small">{user?.name?.charAt(0).toUpperCase()}</div><span>{user?.name?.split(" ")[0]}</span></div></div></header>
        <div className="page-content"><Outlet/></div>
      </main>
    </div>
  );
}
