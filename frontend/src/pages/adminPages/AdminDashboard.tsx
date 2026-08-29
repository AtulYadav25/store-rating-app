import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminDashboardStats } from "../../hooks/useDashboard";
import {
  Card,
  CardContent
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Building2,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: statsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminDashboardStats();

  const stats = statsResponse?.data;

  const actionCards = [
    {
      id: "all-users",
      title: "Show All Users",
      description: "Manage, filter, and inspect user accounts and assigned roles",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200/60",
      accentHover: "group-hover:border-blue-300 group-hover:shadow-blue-500/5",
      onClick: () => {
        navigate("/dashboard/admin/users");
      },
    },
    {
      id: "all-stores",
      title: "Show All Stores",
      description: "Explore listed stores, average ratings, and store owner records",
      icon: Building2,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/60",
      accentHover: "group-hover:border-amber-300 group-hover:shadow-amber-500/5",
      onClick: () => {
        console.log("Action: Show All Stores");
      },
    },
    {
      id: "add-user",
      title: "Add User",
      description: "Create and register a new user, store owner, or administrator",
      icon: UserPlus,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      accentHover: "group-hover:border-emerald-300 group-hover:shadow-emerald-500/5",
      onClick: () => {
        navigate("/dashboard/admin/add-user");
      },
    },
    {
      id: "add-store",
      title: "Add Store",
      description: "Onboard a new store with address, email, and owner credentials",
      icon: PlusCircle,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/60",
      accentHover: "group-hover:border-purple-300 group-hover:shadow-purple-500/5",
      onClick: () => {
        console.log("Action: Add Store");
      },
    },
  ];

  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              System Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1.5">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard platform overview and system management controls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-center flex items-center gap-2 text-xs font-medium"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : "text-slate-500"}`}
          />
          <span>{isFetching ? "Refreshing..." : "Refresh Stats"}</span>
        </Button>
      </div>

      {/* Top Section: 3 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <Card className="border-slate-200/80 bg-white shadow-xs hover:shadow-sm transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Users
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
              ) : isError ? (
                <span className="text-sm text-destructive font-medium">Error loading</span>
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {stats?.totalUsers ?? 0}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Registered platform accounts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Stores */}
        <Card className="border-slate-200/80 bg-white shadow-xs hover:shadow-sm transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Stores
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Store className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
              ) : isError ? (
                <span className="text-sm text-destructive font-medium">Error loading</span>
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {stats?.totalStores ?? 0}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Active stores onboarded
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Submitted Ratings */}
        <Card className="border-slate-200/80 bg-white shadow-xs hover:shadow-sm transition-shadow sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Submitted Ratings
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Star className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
              ) : isError ? (
                <span className="text-sm text-destructive font-medium">Error loading</span>
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {stats?.totalRatings ?? 0}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1">
                Total customer reviews submitted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decorative Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50/50 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            Management & Operations
          </span>
        </div>
      </div>

      {/* Bottom Section: 4 Action Box Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {actionCards.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`group relative text-left rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${action.accentHover}`}
            >
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="space-y-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${action.iconBg}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-slate-100">
                  <span>Open Management</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default AdminDashboard;