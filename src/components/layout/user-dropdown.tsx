"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, Settings, Shield, Wrench } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { userLogout } from "@/features/users/user-actions";
import useFetch from "@/hooks/use-fetch";

interface UserDropdownProps {
  user: {
    fullName: string;
    email: string;
    role: string;
  };
}

const ROLE_LABELS: Record<string, string> = {
  DEV_ADMIN: "Dev Admin",
  MANAGEMENT_ADMIN: "Management Admin",
  EVENT_MANAGER: "Event Manager",
  INTERNAL_USER: "OPJU Participant",
  EXTERNAL_USER: "External Participant",
};

const getDashboardLink = (role: string) => {
  switch (role) {
    case "DEV_ADMIN":
      return "/dev";
    case "MANAGEMENT_ADMIN":
      return "/admin";
    case "EVENT_MANAGER":
      return "/event-manager";
    default:
      return "/dashboard";
  }
};

const getDashboardIcon = (role: string) => {
  switch (role) {
    case "DEV_ADMIN":
      return <Wrench className="h-4 w-4" />;
    case "MANAGEMENT_ADMIN":
      return <Shield className="h-4 w-4" />;
    case "EVENT_MANAGER":
      return <Settings className="h-4 w-4" />;
    default:
      return <LayoutDashboard className="h-4 w-4" />;
  }
};

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const { fn: logout, loading } = useFetch(userLogout);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
    router.refresh();
  };

  const dashboardLink = getDashboardLink(user.role);
  const dashboardLabel =
    user.role === "DEV_ADMIN"
      ? "Dev Panel"
      : user.role === "MANAGEMENT_ADMIN"
        ? "Admin Panel"
        : user.role === "EVENT_MANAGER"
          ? "Event Manager"
          : "Dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full border-2 border-[#f5c928] bg-transparent text-[#f5c928] hover:bg-[#f5c928] hover:text-black text-base font-bold uppercase tracking-wider">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline max-w-[120px] truncate">
            {user.fullName.split(" ")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {ROLE_LABELS[user.role] ?? user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
          {getDashboardIcon(user.role)}
          {dashboardLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading === true}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {loading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
