import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import { ROLES } from "../constants/ROLES";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Store,
  LayoutDashboard,
  User,
  KeyRound,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/login");
      },
      onError: () => {
        toast.error("Failed to log out");
      },
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const showDashboard =
    user?.role === ROLES.ADMIN || user?.role === ROLES.STORE_OWNER;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                StoreRating
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Community Reviews
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <Store className="h-4 w-4" />
            <span>Stores</span>
          </Link>

          {showDashboard && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/dashboard")
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
              {user?.role === ROLES.ADMIN && (
                <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Admin
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Right: User Avatar / Profile Dropdown */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="group flex items-center gap-2.5 rounded-full p-1 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="User menu"
              >
                <Avatar className="h-9 w-9 border border-slate-200 transition-transform group-hover:scale-105">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize leading-tight">
                    {user?.role?.replace("_", " ") || "Normal User"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
            >
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name || "My Account"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              <DropdownMenuItem
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer focus:bg-slate-100"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4 text-slate-500" />
                <span>My Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer focus:bg-slate-100"
                onClick={() => navigate("/update-password")}
              >
                <KeyRound className="h-4 w-4 text-slate-500" />
                <span>Update Password</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-slate-100" />

              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="h-4 w-4 text-destructive" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
