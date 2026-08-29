import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUpdatePassword } from "../hooks/useUser";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: updatePasswordMutation, isPending } = useUpdatePassword();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Live password rules checklist
    const passwordRules = useMemo(() => {
        const pwd = formData.newPassword;
        return {
            length: pwd.length >= 8 && pwd.length <= 16,
            hasUppercase: /[A-Z]/.test(pwd),
            hasSpecialChar: /[^a-zA-Z0-9]/.test(pwd),
            isDifferent: formData.oldPassword ? pwd !== formData.oldPassword : true,
            matchesConfirm: formData.confirmPassword
                ? pwd === formData.confirmPassword
                : false,
        };
    }, [formData.oldPassword, formData.newPassword, formData.confirmPassword]);

    const isFormValid =
        formData.oldPassword &&
        passwordRules.length &&
        passwordRules.hasUppercase &&
        passwordRules.hasSpecialChar &&
        formData.newPassword !== formData.oldPassword &&
        formData.newPassword === formData.confirmPassword;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.oldPassword) {
            setErrorMessage("Please enter your current password.");
            return;
        }

        if (
            !passwordRules.length ||
            !passwordRules.hasUppercase ||
            !passwordRules.hasSpecialChar
        ) {
            setErrorMessage(
                "New password must be 8-16 characters long and include at least 1 uppercase letter and 1 special character."
            );
            return;
        }

        if (formData.oldPassword === formData.newPassword) {
            setErrorMessage("New password must be different from the old password.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        updatePasswordMutation(
            {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || "Password updated successfully!");
                    navigate("/profile");
                },
                onError: (err: any) => {
                    const msg =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "Failed to update password. Please check your current password.";
                    setErrorMessage(typeof msg === "string" ? msg : "Error updating password");
                    toast.error(typeof msg === "string" ? msg : "Error updating password");
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">

            <main className="flex-1 mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Top Back Navigation */}
                <div>
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Profile</span>
                    </Link>
                </div>

                {/* Update Password Card */}
                <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-900">
                                    Update Password
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    Ensure your account is using a secure, updated password
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

                            {/* Old Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="oldPassword"
                                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                >
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="oldPassword"
                                        name="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        required
                                        className="pl-9 pr-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label={showOldPassword ? "Hide password" : "Show password"}
                                    >
                                        {showOldPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="newPassword"
                                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                >
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password (8-16 characters)"
                                        maxLength={16}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        required
                                        className="pl-9 pr-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Rules Checklist */}
                                {formData.newPassword && (
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                                        <p className="font-medium text-slate-700">
                                            New password must satisfy:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="flex items-center gap-1.5">
                                                {passwordRules.length ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                                )}
                                                <span className={passwordRules.length ? "text-emerald-700" : ""}>
                                                    8-16 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {passwordRules.hasUppercase ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                                )}
                                                <span className={passwordRules.hasUppercase ? "text-emerald-700" : ""}>
                                                    1 Uppercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {passwordRules.hasSpecialChar ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                                )}
                                                <span className={passwordRules.hasSpecialChar ? "text-emerald-700" : ""}>
                                                    1 Special character
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {formData.oldPassword && formData.newPassword !== formData.oldPassword ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                                )}
                                                <span
                                                    className={
                                                        formData.oldPassword && formData.newPassword !== formData.oldPassword
                                                            ? "text-emerald-700"
                                                            : ""
                                                    }
                                                >
                                                    Different from old
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                                >
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter new password"
                                        maxLength={16}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        required
                                        className="pl-9 pr-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <div className="flex items-center gap-1.5 text-xs pt-0.5">
                                        {passwordRules.matchesConfirm ? (
                                            <>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                <span className="text-emerald-700 font-medium">
                                                    Passwords match
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                                                <span className="text-destructive font-medium">
                                                    Passwords do not match
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/profile")}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !isFormValid}
                                className="font-medium"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                        <span>Updating Password...</span>
                                    </div>
                                ) : (
                                    <span>Update Password</span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
};

export default UpdatePassword;