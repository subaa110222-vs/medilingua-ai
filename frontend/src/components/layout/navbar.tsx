import React from "react";
import { User, Bell, Shield, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  title?: string;
  isOnline?: boolean;
}

export function Navbar({ title = "MediLingua AI Dashboard", isOnline = true }: NavbarProps) {
  return (
    <header className="w-full h-16 glass-panel border-b border-card-border px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* System connectivity status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-card-border bg-muted/30">
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-green-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">Cloud Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">Local Edge Mode</span>
            </>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <Button variant="ghost" size="icon">
            <Shield className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* User avatar indicator */}
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
