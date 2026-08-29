import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminUsers,
  useUpdateUserRole,
  useAdminDashboardStats,
} from "../../hooks/useDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Store,
  User,
  RotateCcw,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import { ROLES, type UserRole } from "../../constants/ROLES";
import toast from "react-hot-toast";

const USERS_PER_PAGE = 10;

const AllUsers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter input states
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");

  // Applied query filters
  const [appliedFilters, setAppliedFilters] = useState<{
    name: string;
    email: string;
    address: string;
    role: UserRole | "";
  }>({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  // Admin stats for total platform users count
  const { data: statsResponse } = useAdminDashboardStats();
  const totalUsersCount = statsResponse?.data?.totalUsers;

  // Query users
  const {
    data: usersResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminUsers({
    page: currentPage,
    limit: USERS_PER_PAGE,
    ...(appliedFilters.role ? { role: appliedFilters.role as UserRole } : {}),
    ...(appliedFilters.name ? { name: appliedFilters.name } : {}),
    ...(appliedFilters.email ? { email: appliedFilters.email } : {}),
    ...(appliedFilters.address ? { address: appliedFilters.address } : {}),
  });

  const { mutate: updateRoleMutation, isPending: isUpdatingRole } =
    useUpdateUserRole();


  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;

  const hasNextPage = meta ? meta.hasNextPage : false;
  const hasPrevPage = meta ? meta.hasPrevPage : currentPage > 1;

  // Handle Search / Filter Form Submit
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      name: nameInput.trim(),
      email: emailInput.trim(),
      address: addressInput.trim(),
      role: selectedRole,
    });
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setNameInput("");
    setEmailInput("");
    setAddressInput("");
    setSelectedRole("");
    setAppliedFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });
    setCurrentPage(1);
  };

  // Quick Role Toggle / Filter selection
  const handleRoleToggle = (role: UserRole | "") => {
    const newRole = selectedRole === role ? "" : role;
    setSelectedRole(newRole);
    setAppliedFilters((prev) => ({ ...prev, role: newRole }));
    setCurrentPage(1);
  };

  // Update user role
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRoleMutation(
      { userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("User role updated successfully!");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to update user role.";
          toast.error(typeof msg === "string" ? msg : "Failed to update user role");
        },
      }
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case ROLES.ADMIN:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>
        );
      case ROLES.STORE_OWNER:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Store className="h-3 w-3" />
            Store Owner
          </span>
        );
      case ROLES.USER:
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <User className="h-3 w-3" />
            User
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeFilterCount =
    (appliedFilters.name ? 1 : 0) +
    (appliedFilters.email ? 1 : 0) +
    (appliedFilters.address ? 1 : 0) +
    (appliedFilters.role ? 1 : 0);

  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-slate-500">
            View, search, and update roles for all registered users across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {totalUsersCount !== undefined
                ? `${totalUsersCount} Users`
                : "Loading..."}
            </span>
          </span>
        </div>
      </div>

      {/* Filter and Search Card */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-slate-900">
                Filter & Search Users
              </CardTitle>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            {/* Role Filter Checkboxes / Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 mr-1">
                Role:
              </span>
              <button
                type="button"
                onClick={() => handleRoleToggle("")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${selectedRole === ""
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle(ROLES.USER)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${selectedRole === ROLES.USER
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <User className="h-3 w-3" />
                <span>Normal Users</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle(ROLES.STORE_OWNER)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${selectedRole === ROLES.STORE_OWNER
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60"
                  }`}
              >
                <Store className="h-3 w-3" />
                <span>Store Owners</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle(ROLES.ADMIN)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${selectedRole === ROLES.ADMIN
                  ? "bg-purple-600 text-white"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
                  }`}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Admins</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleApplyFilters} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Search by Name */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Filter by Name..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* Search by Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Filter by Email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* Search by Address */}
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Filter by Address..."
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {activeFilterCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-600 hover:text-slate-900 gap-1.5 h-8"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </Button>
              )}
              <Button type="submit" size="sm" className="text-xs h-8 gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Users Table Card */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Store Rating</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-200" />
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-36 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-48 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 w-16 bg-slate-100 rounded-full" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 w-20 bg-slate-100 rounded-md" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="h-7 w-20 bg-slate-100 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold text-destructive">
                      Error fetching users.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="mt-3 text-xs"
                    >
                      Try Again
                    </Button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      No users found
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try clearing or modifying your filter criteria
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* User Name & Avatar */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200 shadow-xs">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                      {user.email}
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate" title={user.address}>
                      {user.address || "—"}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Store Rating (For Store Owners) */}
                    <td className="py-3.5 px-4">
                      {user.role === ROLES.STORE_OWNER ? (
                        user.stores && user.stores.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold text-xs w-fit">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span>{user.stores[0].avgRating.toFixed(1)}</span>
                              <span className="text-[10px] text-amber-600/80 font-normal">
                                ({user.stores[0].ratingCount})
                              </span>
                            </div>
                            <span
                              className="text-[11px] text-slate-400 truncate max-w-[130px]"
                              title={user.stores[0].name}
                            >
                              {user.stores[0].name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            No store linked
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Role Update Selector */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        disabled={isUpdatingRole}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label={`Change role for ${user.name}`}
                      >
                        <option value={ROLES.USER}>Normal User</option>
                        <option value={ROLES.STORE_OWNER}>Store Owner</option>
                        <option value={ROLES.ADMIN}>Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 p-4 bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-semibold text-slate-900">{currentPage}</span>
            {meta?.total !== undefined && ` (${meta.total} total users)`}
            {isFetching && <span className="ml-2 text-slate-400">Updating...</span>}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!hasPrevPage || isFetching}
              className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!hasNextPage || isFetching}
              className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50 h-8"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default AllUsers;