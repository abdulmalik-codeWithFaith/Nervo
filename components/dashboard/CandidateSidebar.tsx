"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions, useAuthState } from "@/lib/hooks/useAuth";

interface Props {
  collapsed: boolean;
  onToggle:  () => void;
}

const NAV = [
  { href: "/dashboard",          icon: "⊞",  label: "Dashboard" },
  { href: "/dashboard/practice", icon: "🎙", label: "Practice"  },
  { href: "/dashboard/feedback", icon: "📊", label: "Feedback"  },
];

export default function CandidateSidebar({ collapsed, onToggle }: Props) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user }    = useAuthState();
  const { signOut } = useAuthActions();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  async function handleSignOut() {
    await signOut();
    router.replace("/get-started");
  }

  const W = collapsed ? 68 : 224;

  const s = {
    sidebar: {
      position:    "fixed"           as const,
      top:         0,
      left:        0,
      bottom:      0,
      width:       W,
      zIndex:      40,
      display:     "flex"            as const,
      flexDirection:"column"         as const,
      background:  "rgba(7,7,18,0.97)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      transition:  "width 0.22s ease",
      overflow:    "hidden"          as const,
    },

    top: {
      display:        "flex"         as const,
      alignItems:     "center"       as const,
      justifyContent: "space-between"as const,
      padding:        "20px 14px 16px",
      minHeight:      62,
      borderBottom:   "1px solid rgba(255,255,255,0.05)",
      gap:            8,
    },

    logo: {
      fontFamily:  "var(--font-syne), sans-serif",
      fontSize:    18,
      fontWeight:  800,
      letterSpacing: "-0.5px",
      background:  "linear-gradient(120deg, #c084fc, #818cf8 50%, #38bdf8)",
      WebkitBackgroundClip: "text"   as const,
      WebkitTextFillColor:  "transparent",
      backgroundClip: "text"        as const,
      textDecoration: "none"        as const,
      whiteSpace:  "nowrap"         as const,
      opacity:     collapsed ? 0 : 1,
      pointerEvents: collapsed ? "none" as const : "auto" as const,
      transition:  "opacity 0.15s",
    },

    toggle: {
      width:        26,
      height:       26,
      borderRadius: 7,
      flexShrink:   0,
      background:   "rgba(255,255,255,0.05)",
      border:       "1px solid rgba(255,255,255,0.08)",
      cursor:       "pointer"        as const,
      display:      "flex"          as const,
      alignItems:   "center"        as const,
      justifyContent: "center"      as const,
      fontSize:     11,
      color:        "#8b8aa6",
    },

    nav: {
      flex:          1,
      padding:       "10px 8px",
      display:       "flex"         as const,
      flexDirection: "column"       as const,
      gap:           2,
    },

    label: (active: boolean) => ({
      display:        "flex"        as const,
      alignItems:     "center"      as const,
      gap:            11,
      padding:        "10px 10px",
      borderRadius:   9,
      fontSize:       13,
      fontWeight:     400,
      color:          active ? "#c4b5fd" : "#8b8aa6",
      textDecoration: "none"        as const,
      whiteSpace:     "nowrap"      as const,
      background:     active
        ? "rgba(124,58,237,0.13)"
        : "transparent",
      border: active
        ? "1px solid rgba(124,58,237,0.2)"
        : "1px solid transparent",
      transition: "background 0.18s, color 0.18s",
    }),

    icon: {
      fontSize:   16,
      flexShrink: 0,
      width:      20,
      textAlign:  "center" as const,
      lineHeight: 1,
    },

    linkLabel: {
      opacity:    collapsed ? 0 : 1,
      transition: "opacity 0.15s",
      overflow:   "hidden"  as const,
    },

    logoutWrap: {
      margin:       "6px 8px",
      borderRadius: 10,
      overflow:     "hidden" as const,
      border:       "1px solid rgba(239,68,68,0.18)",
    },

    logoutBtn: {
      width:          "100%",
      display:        "flex"         as const,
      alignItems:     "center"       as const,
      gap:            11,
      padding:        "10px 10px",
      cursor:         "pointer"      as const,
      background:     "rgba(239,68,68,0.07)",
      border:         "none"         as const,
      color:          "#f87171",
      fontFamily:     "var(--font-dm-sans), sans-serif",
      fontSize:       13,
      fontWeight:     400,
    },

    logoutLabel: {
      opacity:    collapsed ? 0 : 1,
      transition: "opacity 0.15s",
      whiteSpace: "nowrap" as const,
    },

    userRow: {
      padding:     "12px 10px",
      borderTop:   "1px solid rgba(255,255,255,0.05)",
      display:     "flex"  as const,
      alignItems:  "center"as const,
      gap:         9,
    },

    avatar: {
      width:          32,
      height:         32,
      borderRadius:   "50%",
      flexShrink:     0,
      background:     "linear-gradient(135deg, #7c3aed, #4f46e5)",
      display:        "flex"   as const,
      alignItems:     "center" as const,
      justifyContent: "center" as const,
      fontSize:       11,
      fontWeight:     700,
      color:          "#fff",
    },

    userInfo: {
      flex:       1,
      minWidth:   0,
      opacity:    collapsed ? 0 : 1,
      transition: "opacity 0.15s",
    },

    userName: {
      fontSize:     12,
      fontWeight:   500,
      color:        "#fff",
      whiteSpace:   "nowrap"   as const,
      overflow:     "hidden"   as const,
      textOverflow: "ellipsis" as const,
    },

    userRole: {
      fontSize:     10,
      color:        "#4f4e6a",
      whiteSpace:   "nowrap"   as const,
      overflow:     "hidden"   as const,
      textOverflow: "ellipsis" as const,
    },
  };

  return (
    <aside style={s.sidebar}>

      {/* ── Logo + collapse toggle ── */}
      <div style={s.top}>
        <Link href="/" style={s.logo}>Nervo</Link>
        <button style={s.toggle} onClick={onToggle}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* ── Nav links ── */}
      <nav style={s.nav}>
        {NAV.map(n => {
          const active = pathname === n.href
            || (n.href !== "/dashboard" && pathname.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} style={s.label(active)}>
              <span style={s.icon}>{n.icon}</span>
              <span style={s.linkLabel}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Sign out ── */}
      <div style={s.logoutWrap}>
        <button style={s.logoutBtn} onClick={handleSignOut}>
          <span style={s.icon}>🚪</span>
          <span style={s.logoutLabel}>Sign out</span>
        </button>
      </div>

      {/* ── User info ── */}
      <div style={s.userRow}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.userInfo}>
          <div style={s.userName}>
            {user?.displayName || user?.email || "Candidate"}
          </div>
          <div style={s.userRole}>Candidate account</div>
        </div>
      </div>

    </aside>
  );
}