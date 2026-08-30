import { useParams, Link } from "react-router-dom";
import { useStore } from "../hooks/useStores";
import { useStoreRatings, useSubmitRating, useDeleteRating } from "../hooks/useRatings";
import { useCurrentUser } from "../hooks/useAuth";
import { ROLES } from "../constants/ROLES";
import { AspectRatio } from "../components/ui/aspect-ratio";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
    Store as StoreIcon,
    MapPin,
    Mail,
    Star,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Calendar,
    AlertCircle,
    Edit,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const RATINGS_PAGE_LIMIT = 5;

const StoreDetails: React.FC = () => {
    const { storeId = "" } = useParams<{ storeId: string }>();
    const { data: currentUser } = useCurrentUser();

    // Ratings pagination state
    const [ratingPage, setRatingPage] = useState(1);

    // User interactive rating state
    const [hoverRating, setHoverRating] = useState(0);

    // Queries
    const {
        data: storeResponse,
        isLoading: isStoreLoading,
        isError: isStoreError,
    } = useStore(storeId);

    const {
        data: ratingsResponse,
        isLoading: isRatingsLoading,
        isFetching: isRatingsFetching,
    } = useStoreRatings({
        storeId,
        page: ratingPage,
        limit: RATINGS_PAGE_LIMIT,
    });

    const { mutate: submitRatingMutation, isPending: isSubmittingRating } =
        useSubmitRating();

    const { mutate: deleteRatingMutation, isPending: isDeletingRating } =
        useDeleteRating();

    const store = storeResponse?.data;
    const ratings = ratingsResponse?.data || [];
    const ratingsMeta = ratingsResponse?.meta;

    const hasPrevPage = ratingsMeta ? ratingsMeta.hasPrevPage : ratingPage > 1;
    const hasNextPage = ratingsMeta ? ratingsMeta.hasNextPage : false;

    // Current user's rating comes reliably and directly from store.userRating
    const userCurrentRating = store?.userRating ?? null;

    const handleRatingSubmit = (ratingValue: number) => {
        if (!storeId) return;

        const isUpdating = userCurrentRating !== null;

        submitRatingMutation(
            { storeId, rating: ratingValue },
            {
                onSuccess: () => {
                    toast.success(
                        isUpdating
                            ? "Your rating has been updated!"
                            : "Rating submitted successfully!"
                    );
                },
                onError: (err: any) => {
                    const msg =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "Failed to save rating.";
                    toast.error(typeof msg === "string" ? msg : "Failed to save rating");
                },
            }
        );
    };

    const handleRatingDelete = () => {
        if (!storeId || !userCurrentRating) return;

        deleteRatingMutation(storeId, {
            onSuccess: () => {
                toast.success("Rating removed successfully!");
                setHoverRating(0);
            },
            onError: (err: any) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to remove rating.";
                toast.error(typeof msg === "string" ? msg : "Failed to remove rating");
            },
        });
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isStoreLoading) {
        return (
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 space-y-6">
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
                <Card className="border-slate-200 bg-white p-6 space-y-4 animate-pulse">
                    <div className="aspect-16/9 w-full rounded-lg bg-slate-200" />
                    <div className="h-6 w-1/2 bg-slate-200 rounded" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                </Card>
            </main>
        );
    }

    if (isStoreError || !store) {
        return (
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-12 text-center space-y-4">
                <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Store Not Found</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    The store you are looking for does not exist or may have been removed.
                </p>
                <Link to="/" className="inline-block mt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Stores</span>
                    </Button>
                </Link>
            </main>
        );
    }

    return (
        <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 space-y-6">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Stores</span>
                </Link>

                {currentUser?.role === ROLES.ADMIN && (
                    <Link to={`/dashboard/admin/edit-store/${storeId}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300 bg-white hover:bg-slate-50 shadow-xs"
                        >
                            <Edit className="h-3.5 w-3.5 text-primary" />
                            <span>Edit Store</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Main Store Information Card */}
            <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
                {/* Store Banner Image */}
                <div className="w-full bg-slate-100 overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                        {store.image ? (
                            <img
                                src={store.image}
                                alt={store.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                <StoreIcon className="h-16 w-16 stroke-[1.2]" />
                            </div>
                        )}
                    </AspectRatio>
                </div>

                {/* Store Header Details */}
                <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {store.name}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span>{store.email}</span>
                            </div>
                        </div>

                        {/* Rating Summary Badge */}
                        <div className="flex items-center gap-2 shrink-0 rounded-xl bg-amber-50 px-3.5 py-2 border border-amber-200/80">
                            <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                            <div>
                                <div className="text-base font-bold text-amber-900 leading-none">
                                    {store.avgRating > 0 ? Number(store.avgRating).toFixed(1) : "New"}
                                    <span className="text-xs font-normal text-amber-700"> / 5.0</span>
                                </div>
                                <div className="text-[11px] text-amber-700/80 leading-none mt-0.5">
                                    {store.ratingCount || 0}{" "}
                                    {store.ratingCount === 1 ? "review" : "reviews"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                        <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                        <p className="leading-relaxed">{store.address}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Rate This Store Interactive Section */}
            <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                {userCurrentRating ? "Your Rating" : "Rate This Store"}
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                                {userCurrentRating
                                    ? "You have rated this store. Click any star to modify or remove your rating."
                                    : "Share your experience by leaving a rating between 1 and 5 stars"}
                            </CardDescription>
                        </div>

                        {userCurrentRating && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRatingDelete}
                                disabled={isSubmittingRating || isDeletingRating}
                                className="h-8 gap-1.5 text-xs font-semibold text-rose-600 border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 hover:text-rose-700 hover:border-rose-300 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                            >
                                {isDeletingRating ? (
                                    <>
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
                                        <span>Removing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                                        <span>Remove Rating</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    disabled={isSubmittingRating || isDeletingRating}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRatingSubmit(star)}
                                    className="p-1.5 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                    <Star
                                        className={`h-7 w-7 transition-colors ${(hoverRating || userCurrentRating || 0) >= star
                                            ? "fill-amber-400 text-amber-500"
                                            : "fill-slate-100 text-slate-300"
                                            }`}
                                    />
                                </button>
                            ))}

                            <span className="ml-2 text-sm font-medium text-slate-600">
                                {hoverRating
                                    ? `${hoverRating} Star${hoverRating > 1 ? "s" : ""}`
                                    : userCurrentRating
                                        ? `${userCurrentRating} Star${userCurrentRating > 1 ? "s" : ""}`
                                        : "Select a rating"}
                            </span>
                        </div>

                        {(isSubmittingRating || isDeletingRating) && (
                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                {isDeletingRating ? "Removing rating..." : "Saving rating..."}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Customer Ratings / Reviews Section */}
            <Card className="border-slate-200 bg-white shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Customer Ratings
                        </CardTitle>
                        <span className="text-xs font-medium text-slate-500">
                            Page {ratingPage}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    {isRatingsLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 animate-pulse"
                                >
                                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                                    <div className="h-3 w-1/4 bg-slate-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : ratings.length > 0 ? (
                        <div className="space-y-3">
                            {ratings.map((ratingItem) => (
                                <div
                                    key={ratingItem.id}
                                    className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-slate-200">
                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                {getInitials(ratingItem.user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                                {ratingItem.user?.name || "Customer"}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                <Calendar className="h-3 w-3 text-slate-400" />
                                                <span>{formatDate(ratingItem.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Stars Badge */}
                                    <div className="flex items-center gap-1 shrink-0 rounded-md bg-amber-50 px-2.5 py-1 border border-amber-200/60">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                                        <span className="text-xs font-bold text-amber-800">
                                            {ratingItem.rating}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            <p>No ratings yet for this store.</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Be the first to submit a rating above!
                            </p>
                        </div>
                    )}

                    {/* Pagination with ONLY Prev & Next buttons */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRatingPage((prev) => Math.max(prev - 1, 1))}
                            disabled={!hasPrevPage || isRatingsFetching}
                            className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Prev</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRatingPage((prev) => prev + 1)}
                            disabled={!hasNextPage || isRatingsFetching}
                            className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};

export default StoreDetails;