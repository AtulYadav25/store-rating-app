import React, { useState } from "react";
import { useOwnerStoreRatings } from "../../hooks/useDashboard";
import { useCurrentUser } from "../../hooks/useAuth";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
    Store,
    Star,
    Users,
    Mail,
    MapPin,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Clock,
    Sparkles,
} from "lucide-react";

const RATINGS_PER_PAGE = 10;

const OwnerDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: currentUser } = useCurrentUser();

    const {
        data: dashboardData,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useOwnerStoreRatings({
        page: currentPage,
        limit: RATINGS_PER_PAGE,
    });

    const store = dashboardData?.data?.store;
    const ratings = dashboardData?.data?.ratings || [];
    const meta = dashboardData?.meta;

    const hasPrevPage = meta ? meta.hasPrevPage : currentPage > 1;
    const hasNextPage = meta ? meta.hasNextPage : false;

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                            Store Owner Portal
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
                        Welcome back, {currentUser?.name || "Store Owner"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor customer feedback, view submitted ratings, and track your store performance.
                    </p>
                </div>

                {store && (
                    <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs">
                            <Store className="h-4 w-4 text-amber-600" />
                            <span>{store.name}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* If Owner has No Store Assigned */}
            {!isLoading && !store && (
                <Card className="border-amber-200/80 bg-amber-50/50 shadow-xs">
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-amber-900">
                                No Store Assigned to Your Account
                            </h3>
                            <p className="text-xs text-amber-800/80 leading-relaxed">
                                Your account is registered as a Store Owner, but no store is currently linked.
                                Please contact an administrator to assign your store.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Store Statistics Overview Cards */}
            {store && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Average Rating Card */}
                    <Card className="border-slate-200 bg-white shadow-xs overflow-hidden relative group hover:border-amber-200 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Overall Average Rating
                                </CardDescription>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">
                                    {store.avgRating > 0 ? store.avgRating.toFixed(1) : "0.0"}
                                </span>
                                <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= Math.round(store.avgRating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-slate-100 text-slate-200"
                                            }`}
                                    />
                                ))}
                                <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
                                    {store.avgRating >= 4.5
                                        ? "Excellent"
                                        : store.avgRating >= 3.5
                                            ? "Good"
                                            : store.avgRating > 0
                                                ? "Average"
                                                : "No ratings"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Submitted Ratings Card */}
                    <Card className="border-slate-200 bg-white shadow-xs overflow-hidden relative group hover:border-blue-200 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Total Reviews Received
                                </CardDescription>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
                                    <Users className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-slate-900">
                                    {meta?.total !== undefined ? meta.total : store.ratingCount || 0}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">submitted ratings</span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Total customer reviews submitted for this store.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Store Details Card */}
                    <Card className="border-slate-200 bg-white shadow-xs overflow-hidden relative group hover:border-purple-200 hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Store Contact & Info
                                </CardDescription>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60">
                                    <Store className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2 truncate">
                                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{store.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-relaxed">{store.address}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Ratings & Customers Table Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                            Customer Ratings & Feedback
                        </h2>
                        <p className="text-xs text-slate-500">
                            List of registered users who rated your store
                        </p>
                    </div>

                    {meta?.total !== undefined && (
                        <span className="text-xs font-semibold text-slate-600 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-lg">
                            {meta.total} Total Ratings
                        </span>
                    )}
                </div>

                {/* Reviews Table Card */}
                <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4 sm:px-6">Customer</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Address</th>
                                    <th className="py-3 px-4">Rating Given</th>
                                    <th className="py-3 px-4 sm:px-6 text-right">Submitted Date</th>
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
                                                <div className="h-5 w-24 bg-slate-100 rounded-md" />
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="h-4 w-20 bg-slate-100 rounded ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <p className="text-sm font-semibold text-destructive">
                                                Error fetching store ratings.
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
                                ) : ratings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                                    <Sparkles className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                No ratings submitted yet
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                When users rate your store, their ratings and details will appear here.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    ratings.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 transition-colors"
                                        >
                                            {/* Customer Name & Avatar */}
                                            <td className="py-3.5 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-slate-200 shadow-xs">
                                                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                            {getInitials(item.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-sm">
                                                            {item.user.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                                                {item.user.email}
                                            </td>

                                            {/* Address */}
                                            <td
                                                className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate"
                                                title={item.user.address}
                                            >
                                                {item.user.address || "—"}
                                            </td>

                                            {/* Rating Given */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 font-bold text-xs">
                                                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                        <span>{item.rating}</span>
                                                        <span className="text-[10px] text-amber-600/70 font-normal">
                                                            / 5
                                                        </span>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`h-3 w-3 ${s <= item.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "fill-slate-100 text-slate-200"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Submitted Date */}
                                            <td className="py-3.5 px-4 sm:px-6 text-right text-xs text-slate-500">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    <span>{formatDate(item.createdAt)}</span>
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
                            {meta?.totalPages ? ` of ${meta.totalPages}` : ""}
                            {meta?.total !== undefined && ` (${meta.total} total ratings)`}
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
            </div>
        </main>
    );
};

export default OwnerDashboard;