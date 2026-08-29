import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";
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
  User as UserIcon,
  Mail,
  MapPin,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { ROLES } from "../constants/ROLES";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRoleName = (role?: string) => {
    switch (role) {
      case ROLES.ADMIN:
        return "System Administrator";
      case ROLES.STORE_OWNER:
        return "Store Owner";
      case ROLES.USER:
      default:
        return "Normal User";
    }
  };

  return (
    <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stores</span>
          </Link>
        </div>

        {/* Profile Card */}
        {isLoading ? (
          <Card className="border-slate-200 bg-white p-8 space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-100" />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="h-10 w-full rounded bg-slate-100" />
              <div className="h-10 w-full rounded bg-slate-100" />
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header Identity Card */}
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-primary/15 via-primary/5 to-slate-100 border-b border-slate-200/60" />
              <CardContent className="relative px-6 pb-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
                  <div className="flex items-end gap-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-1 ring-slate-200/60">
                      <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 pb-1">
                      <h1 className="text-2xl font-bold text-slate-900 leading-none">
                        {user?.name || "User"}
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {formatRoleName(user?.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/update-password")}
                    className="flex items-center gap-2 text-xs font-medium self-start sm:self-end"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                    <span>Change Password</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Account Details
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Personal profile information associated with your account
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <UserIcon className="h-3.5 w-3.5 text-primary" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 break-words">
                      {user?.name || "—"}
                    </p>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Email Address</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 break-words">
                      {user?.email || "—"}
                    </p>
                  </div>

                  {/* Role field */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>Account Role</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatRoleName(user?.role)}
                    </p>
                  </div>

                  {/* Address field (spans full width if needed) */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 md:col-span-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Physical Address</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
                      {user?.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
  );
};

export default Profile;