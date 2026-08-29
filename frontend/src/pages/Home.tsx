import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { StoreCard } from "../components/StoreCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useStores } from "../hooks/useStores";
import { Search, ChevronLeft, ChevronRight, Store, X, AlertCircle, RefreshCw } from "lucide-react";

const STORES_PER_PAGE = 9;

const Home: React.FC = () => {
    // Input state for search field (updates as user types)
    const [searchInput, setSearchInput] = useState("");
    // Active search query triggered only on search button click / submit
    const [activeSearch, setActiveSearch] = useState("");
    // Current page state
    const [currentPage, setCurrentPage] = useState(1);

    // TanStack Query hook connected to backend API
    const {
        data: storesResponse,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useStores({
        page: currentPage,
        limit: STORES_PER_PAGE,
        search: activeSearch,
    });

    const stores = storesResponse?.data || [];
    const meta = storesResponse?.meta;

    const hasNextPage = meta ? meta.hasNextPage : false;
    const hasPrevPage = meta ? meta.hasPrevPage : currentPage > 1;

    // Handle Search Submission on button click or Enter key
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearch(searchInput.trim());
        setCurrentPage(1);
    };

    // Clear search field and reset query
    const handleClearSearch = () => {
        setSearchInput("");
        setActiveSearch("");
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            {/* 1. Reusable Navbar */}
            <Navbar />

            {/* Main Content Container */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header and Search Section */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Explore Stores
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Find and review top-rated stores and local businesses in your area.
                        </p>
                    </div>

                    {/* 2. Search Bar with Clickable Search Button */}
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search by Name or Address"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="h-10 pl-10 pr-9 bg-white border-slate-200 shadow-xs focus:bg-white text-sm"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label="Clear search input"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="h-10 px-4 font-medium shrink-0 shadow-xs"
                            disabled={isFetching}
                        >
                            Search
                        </Button>
                    </form>

                    {/* Active Search Filter Badge */}
                    {activeSearch && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span>Showing results for:</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                                "{activeSearch}"
                                <button
                                    onClick={handleClearSearch}
                                    className="hover:text-primary/70 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {/* 3. Loading, Error, or Store Listing Grid */}
                {isLoading ? (
                    /* Loading Skeletons */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 animate-pulse"
                            >
                                <div className="aspect-16/9 w-full rounded-lg bg-slate-200" />
                                <div className="h-4 w-3/4 rounded-sm bg-slate-200" />
                                <div className="h-3 w-1/2 rounded-sm bg-slate-100" />
                                <div className="h-3 w-1/4 rounded-sm bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
                        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                        <h3 className="text-base font-semibold text-slate-900">
                            Failed to load stores
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm">
                            {error instanceof Error
                                ? error.message
                                : "An unexpected error occurred while fetching stores."}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="mt-4 flex items-center gap-2"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Try Again</span>
                        </Button>
                    </div>
                ) : stores.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onClick={(s) => console.log("Clicked store:", s.name)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                            <Store className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            No stores found
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm">
                            {activeSearch
                                ? `We couldn't find any stores matching "${activeSearch}". Try another search term.`
                                : "There are currently no registered stores available."}
                        </p>
                        {activeSearch && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearSearch}
                                className="mt-4"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                )}

                {/* 4. Pagination Controls */}
                {!isLoading && !isError && stores.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={!hasPrevPage || isFetching}
                            className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Prev</span>
                        </Button>

                        <div className="text-xs text-slate-500 font-medium">
                            Page <span className="font-semibold text-slate-900">{currentPage}</span>
                            {isFetching && <span className="ml-2 text-slate-400">Updating...</span>}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={!hasNextPage || isFetching}
                            className="flex items-center gap-1 text-xs font-medium text-slate-700 disabled:opacity-50"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;