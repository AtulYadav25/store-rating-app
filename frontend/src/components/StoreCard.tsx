import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Card, CardContent } from "./ui/card";
import { MapPin, Star, Store as StoreIcon } from "lucide-react";
import type { Store } from "../api/store.api";

export type StoreItem = Store;

interface StoreCardProps {
  store: StoreItem;
  onClick?: (store: StoreItem) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  return (
    <Card
      onClick={() => onClick?.(store)}
      className="group overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all hover:border-slate-300 hover:shadow-md cursor-pointer"
    >
      {/* Store Image with Aspect Ratio */}
      <div className="w-full bg-slate-100 overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          {store.image ? (
            <img
              src={store.image}
              alt={store.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <StoreIcon className="h-10 w-10 stroke-[1.5]" />
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Card Content */}
      <CardContent className="p-4 space-y-2.5">
        {/* Name and Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
            {store.name}
          </h3>

          <div className="flex items-center gap-1 shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span>{store.avgRating > 0 ? Number(store.avgRating).toFixed(1) : "New"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <p className="line-clamp-2 leading-relaxed">{store.address}</p>
        </div>

        {/* Rating Count */}
        {typeof store.ratingCount === "number" && (
          <div className="pt-1 text-[11px] text-slate-400">
            {store.ratingCount} {store.ratingCount === 1 ? "rating" : "ratings"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreCard;
