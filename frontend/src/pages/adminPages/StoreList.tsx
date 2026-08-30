import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStores, useDeleteStore } from "../../hooks/useStores";
import { useAdminDashboardStats } from "../../hooks/useDashboard";
import {
    Card,
    CardContent
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
    Store,
    Search,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Star,
    Edit,
    Trash2,
    PlusCircle,
    ExternalLink,
    User,
    AlertTriangle,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import toast from "react-hot-toast";

const STORES_PER_PAGE = 10;

const StoreList: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    // Sorting state
    const [sortBy, setSortBy] = useState<
        "name" | "email" | "address" | "avgRating" | "createdAt"
    >("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Store to delete state for modal
    const [storeToDelete, setStoreToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    // Queries & Mutations
    const { data: statsResponse } = useAdminDashboardStats();
    const totalStoresCount = statsResponse?.data?.totalStores;

    const {
        data: storesResponse,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useStores({
        page: currentPage,
        limit: STORES_PER_PAGE,
        search: appliedSearch,
        sortBy,
        sortOrder,
    });

    const { mutate: deleteStoreMutation, isPending: isDeleting } =
        useDeleteStore();

    const stores = storesResponse?.data || [];
    const meta = storesResponse?.meta;

    const hasPrevPage = meta ? meta.hasPrevPage : currentPage > 1;
    const hasNextPage = meta ? meta.hasNextPage : false;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedSearch(searchInput.trim());
        setCurrentPage(1);
    };

    const handleResetSearch = () => {
        setSearchInput("");
        setAppliedSearch("");
        setCurrentPage(1);
    };

    const handleSort = (
        field: "name" | "email" | "address" | "avgRating" | "createdAt"
    ) => {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder(field === "createdAt" || field === "avgRating" ? "desc" : "asc");
        }
        setCurrentPage(1);
    };

    const renderSortIcon = (
        field: "name" | "email" | "address" | "avgRating" | "createdAt"
    ) => {
        if (sortBy !== field) {
            return (
                <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
            );
        }
        return sortOrder === "asc" ? (
            <ArrowUp className="h-3 w-3 text-primary font-bold" />
        ) : (
            <ArrowDown className="h-3 w-3 text-primary font-bold" />
        );
    };

    const handleDeleteConfirm = () => {
        if (!storeToDelete) return;

        deleteStoreMutation(storeToDelete.id, {
            onSuccess: () => {
                toast.success(`Store "${storeToDelete.name}" deleted successfully`);
                setStoreToDelete(null);
            },
            onError: (err: any) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to delete store";
                toast.error(typeof msg === "string" ? msg : "Failed to delete store");
            },
        });
    };

    const getInitials = (name?: string) => {
        if (!name) return "S";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header Section */}
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
                        Store Management
                    </h1>
                    <p className="text-sm text-slate-500">
                        View, search, edit details, or remove registered stores from the platform.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs">
                        <Store className="h-4 w-4 text-amber-600" />
                        <span>
                            {totalStoresCount !== undefined
                                ? `${totalStoresCount} Stores`
                                : "Loading..."}
                        </span>
                    </span>

                    <Button
                        size="sm"
                        onClick={() => navigate("/dashboard/admin/add-store")}
                        className="gap-1.5 font-medium shadow-xs"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Add Store</span>
                    </Button>
                </div>
            </div>

            {/* Search Filter Card */}
            <Card className="border-slate-200 bg-white shadow-xs">
                <CardContent className="p-4 sm:p-5">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col sm:flex-row items-center gap-3"
                    >
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search stores by name or address..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {appliedSearch && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetSearch}
                                    className="text-xs h-10 gap-1 text-slate-500 hover:text-slate-900"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    <span>Reset</span>
                                </Button>
                            )}
                            <Button type="submit" size="sm" className="h-10 px-4 text-xs gap-1.5">
                                <Search className="h-3.5 w-3.5" />
                                <span>Search</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Stores Table Card */}
            <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                <th
                                    className="py-3 px-4 sm:px-6 cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
                                    onClick={() => handleSort("name")}
                                    title="Click to sort by Store Name"
                                >
                                    <div className="flex items-center gap-1.5 group">
                                        <span>Store</span>
                                        {renderSortIcon("name")}
                                    </div>
                                </th>
                                <th
                                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
                                    onClick={() => handleSort("email")}
                                    title="Click to sort by Email"
                                >
                                    <div className="flex items-center gap-1.5 group">
                                        <span>Email</span>
                                        {renderSortIcon("email")}
                                    </div>
                                </th>
                                <th
                                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
                                    onClick={() => handleSort("address")}
                                    title="Click to sort by Address"
                                >
                                    <div className="flex items-center gap-1.5 group">
                                        <span>Address</span>
                                        {renderSortIcon("address")}
                                    </div>
                                </th>
                                <th
                                    className="py-3 px-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
                                    onClick={() => handleSort("avgRating")}
                                    title="Click to sort by Rating"
                                >
                                    <div className="flex items-center gap-1.5 group">
                                        <span>Rating</span>
                                        {renderSortIcon("avgRating")}
                                    </div>
                                </th>
                                <th className="py-3 px-4">Assigned Owner</th>
                                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                                                <div className="space-y-1">
                                                    <div className="h-4 w-36 bg-slate-200 rounded" />
                                                    <div className="h-3 w-20 bg-slate-100 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-36 bg-slate-100 rounded" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-48 bg-slate-100 rounded" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-5 w-20 bg-slate-100 rounded-md" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="h-4 w-28 bg-slate-100 rounded" />
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-right">
                                            <div className="h-7 w-20 bg-slate-100 rounded ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <p className="text-sm font-semibold text-destructive">
                                            Error fetching stores.
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
                            ) : stores.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <div className="flex justify-center mb-2">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Store className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            No stores found
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {appliedSearch
                                                ? "Try modifying your search keywords"
                                                : "Click 'Add Store' to onboard the first store"}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                stores.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        {/* Store Name & Avatar/Image */}
                                        <td className="py-3.5 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                {s.image ? (
                                                    <img
                                                        src={s.image}
                                                        alt={s.name}
                                                        className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar className="h-10 w-10 rounded-lg border border-slate-200 bg-amber-50 text-amber-700 shrink-0">
                                                        <AvatarFallback className="bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">
                                                            {getInitials(s.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div>
                                                    <Link
                                                        to={`/store/${s.id}`}
                                                        className="font-semibold text-slate-900 text-sm hover:text-primary transition-colors flex items-center gap-1 group"
                                                    >
                                                        <span>{s.name}</span>
                                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                                            {s.email}
                                        </td>

                                        {/* Address */}
                                        <td
                                            className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate"
                                            title={s.address}
                                        >
                                            {s.address}
                                        </td>

                                        {/* Rating Badge */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold text-xs">
                                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                    <span>{s.avgRating > 0 ? s.avgRating.toFixed(1) : "New"}</span>
                                                </div>
                                                <span className="text-[11px] text-slate-400">
                                                    ({s.ratingCount || 0})
                                                </span>
                                            </div>
                                        </td>

                                        {/* Store Owner */}
                                        <td className="py-3.5 px-4 text-xs">
                                            {s.owner ? (
                                                <div className="flex items-center gap-1.5 text-slate-700">
                                                    <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    <span className="font-medium truncate max-w-[130px]" title={s.owner.email}>
                                                        {s.owner.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions: Edit & Delete */}
                                        <td className="py-3.5 px-4 sm:px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(`/dashboard/admin/edit-store/${s.id}`)
                                                    }
                                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                    title="Edit Store"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setStoreToDelete({ id: s.id, name: s.name })
                                                    }
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                                                    title="Delete Store"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
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

            {/* Delete Confirmation Modal */}
            {storeToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-destructive">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Delete Store
                                </h3>
                                <p className="text-xs text-slate-500">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Are you sure you want to delete{" "}
                            <strong className="text-slate-900">"{storeToDelete.name}"</strong>?
                            All customer ratings and reviews associated with this store will also be permanently deleted.
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStoreToDelete(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="gap-1.5"
                            >
                                {isDeleting ? "Deleting..." : "Delete Store"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default StoreList;