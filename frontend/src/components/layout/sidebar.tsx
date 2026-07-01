"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  Heart,
  History,
  Languages,
  Bell,
  MapPin,
  AlertTriangle,
  BarChart3,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: Activity },
    { name: "Live Translator", href: "/translate", icon: Languages },
    { name: "Patient History", href: "/history", icon: History },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Hospitals", href: "/hospitals", icon: MapPin },
    { name: "SOS Alerts", href: "/emergency", icon: AlertTriangle },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Admin Panel", href: "/admin", icon: ShieldCheck },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "w-64 h-screen glass-panel flex flex-col justify-between p-4 border-r border-card-border fixed left-0 top-0 hidden md:flex z-30",
        className
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2 px-3 py-2">
          <Heart className="h-6 w-6 text-primary fill-primary/20 animate-pulse" />
          <span className="text-xl font-bold tracking-tight text-foreground bg-clip-text">
            MediLingua<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  {
                    "bg-primary text-white shadow-sm scale-102": isActive,
                    "text-muted-foreground hover:bg-muted hover:text-foreground": !isActive,
                  }
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", { "text-white": isActive, "text-muted-foreground": !isActive })} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Quick Profile section */}
      <div className="border-t border-card-border pt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">Dr. Rajesh Patel</span>
            <span className="text-[10px] text-muted-foreground">Rural Medical Officer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
