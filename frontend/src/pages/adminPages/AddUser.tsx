import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/useUser";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    UserPlus,
    ShieldCheck,
    Store,
} from "lucide-react";
import { ROLES, type UserRole } from "../../constants/ROLES";
import toast from "react-hot-toast";

const AddUser: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: addUserMutation, isPending } = useAddUser();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: ROLES.USER as UserRole,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Live password rules validation
    const passwordRules = useMemo(() => {
        const pwd = formData.password;
        return {
            length: pwd.length >= 8 && pwd.length <= 16,
            hasUppercase: /[A-Z]/.test(pwd),
            hasSpecialChar: /[^a-zA-Z0-9]/.test(pwd),
        };
    }, [formData.password]);

    // Form validity checks
    const isFormValid =
        formData.name.trim().length >= 3 &&
        formData.name.trim().length <= 60 &&
        formData.email.trim().length > 0 &&
        formData.address.trim().length <= 400 &&
        passwordRules.length &&
        passwordRules.hasUppercase &&
        passwordRules.hasSpecialChar;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (role: UserRole) => {
        setFormData((prev) => ({ ...prev, role }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (formData.name.trim().length < 3 || formData.name.trim().length > 60) {
            setErrorMessage("Name must be between 3 and 60 characters.");
            return;
        }

        if (formData.address.trim().length > 400) {
            setErrorMessage("Address must not exceed 400 characters.");
            return;
        }

        if (
            !passwordRules.length ||
            !passwordRules.hasUppercase ||
            !passwordRules.hasSpecialChar
        ) {
            setErrorMessage(
                "Password must be 8-16 characters and contain at least 1 uppercase letter and 1 special character."
            );
            return;
        }

        addUserMutation(
            {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                address: formData.address.trim(),
                password: formData.password,
                role: formData.role,
            },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || "User created successfully!");
                    setFormData({
                        name: "",
                        email: "",
                        address: "",
                        password: "",
                        role: ROLES.USER as UserRole,
                    });
                    setShowPassword(false);
                    setErrorMessage(null);
                },
                onError: (err: any) => {
                    const msg =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "Failed to create user. Please try again.";
                    setErrorMessage(typeof msg === "string" ? msg : "Error creating user");
                    toast.error(typeof msg === "string" ? msg : "Error creating user");
                },
            }
        );
    };

    return (
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Top Back Navigation */}
            <div>
                <Link
                    to="/dashboard/admin"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            {/* Add User Card */}
            <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-semibold text-slate-900">
                                Add New User
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-xs">
                                Create a new user, store owner, or administrator account
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-5">
                        {errorMessage && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium animate-in fade-in duration-200">
                                {errorMessage}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            >
                                Full Name <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    required
                                    minLength={3}
                                    maxLength={60}
                                    className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Between 3 and 60 characters
                            </p>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            >
                                Email Address <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    required
                                    className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                Account Role <span className="text-destructive">*</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Normal User */}
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect(ROLES.USER)}
                                    disabled={isPending}
                                    className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${formData.role === ROLES.USER
                                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary/30"
                                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100/70"
                                        }`}
                                >
                                    <User className="h-5 w-5 mb-1.5" />
                                    <span className="text-xs font-bold">Normal User</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">
                                        Browse & rate stores
                                    </span>
                                </button>

                                {/* Store Owner */}
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect(ROLES.STORE_OWNER)}
                                    disabled={isPending}
                                    className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${formData.role === ROLES.STORE_OWNER
                                        ? "border-amber-500 bg-amber-50/60 text-amber-800 shadow-xs ring-1 ring-amber-500/30"
                                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100/70"
                                        }`}
                                >
                                    <Store className="h-5 w-5 mb-1.5 text-amber-600" />
                                    <span className="text-xs font-bold">Store Owner</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">
                                        Manage own store
                                    </span>
                                </button>

                                {/* System Admin */}
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect(ROLES.ADMIN)}
                                    disabled={isPending}
                                    className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${formData.role === ROLES.ADMIN
                                        ? "border-purple-500 bg-purple-50/60 text-purple-800 shadow-xs ring-1 ring-purple-500/30"
                                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100/70"
                                        }`}
                                >
                                    <ShieldCheck className="h-5 w-5 mb-1.5 text-purple-600" />
                                    <span className="text-xs font-bold">Administrator</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">
                                        Full platform control
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="address"
                                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            >
                                Physical Address
                            </Label>
                            <div className="relative">
                                <Textarea
                                    id="address"
                                    name="address"
                                    rows={2}
                                    placeholder="e.g. 123 Main Street, Pune"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    maxLength={400}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Max 400 characters ({formData.address.length}/400)
                            </p>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            >
                                Initial Password <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter initial password (8-16 characters)"
                                    maxLength={16}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    required
                                    className="pl-9 pr-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {/* Password Rules Checklist */}
                            {formData.password && (
                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                                    <p className="font-medium text-slate-700">
                                        Password requirements:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="flex items-center gap-1.5">
                                            {passwordRules.length ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                            )}
                                            <span className={passwordRules.length ? "text-emerald-700" : ""}>
                                                8-16 chars
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {passwordRules.hasUppercase ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                            )}
                                            <span className={passwordRules.hasUppercase ? "text-emerald-700" : ""}>
                                                1 Uppercase
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {passwordRules.hasSpecialChar ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                            )}
                                            <span className={passwordRules.hasSpecialChar ? "text-emerald-700" : ""}>
                                                1 Special char
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/dashboard/admin/users")}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !isFormValid}
                            className="font-medium gap-2"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    <span>Creating User...</span>
                                </div>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    <span>Create User</span>
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
};

export default AddUser;