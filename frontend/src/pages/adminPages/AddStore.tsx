import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAddStore } from "../../hooks/useStores";
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
  Store,
  Mail,
  Image as ImageIcon,
  User,
  ArrowLeft,
  PlusCircle,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

const AddStore: React.FC = () => {
  const { mutate: addStoreMutation, isPending } = useAddStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    image: "",
    ownerEmail: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation rules
  const isNameValid =
    formData.name.trim().length >= 20 && formData.name.trim().length <= 60;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isAddressValid =
    formData.address.trim().length > 0 && formData.address.trim().length <= 400;
  const isOwnerEmailValid =
    !formData.ownerEmail.trim() ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail.trim());

  const isFormValid =
    isNameValid && isEmailValid && isAddressValid && isOwnerEmailValid;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
      setErrorMessage("Store name must be between 20 and 60 characters.");
      return;
    }

    if (!isEmailValid) {
      setErrorMessage("Please enter a valid store email address.");
      return;
    }

    if (formData.address.trim().length > 400) {
      setErrorMessage("Store address must not exceed 400 characters.");
      return;
    }

    if (formData.ownerEmail.trim() && !isOwnerEmailValid) {
      setErrorMessage("Please enter a valid store owner email address.");
      return;
    }

    addStoreMutation(
      {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        image: formData.image.trim() || null,
        ownerEmail: formData.ownerEmail.trim() ? formData.ownerEmail.trim().toLowerCase() : null,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Store created successfully!");
          setFormData({
            name: "",
            email: "",
            address: "",
            image: "",
            ownerEmail: "",
          });
          setErrorMessage(null);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to add store. Please try again.";
          setErrorMessage(typeof msg === "string" ? msg : "Error adding store");
          toast.error(typeof msg === "string" ? msg : "Error adding store");
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

      {/* Add Store Card */}
      <Card className="border-slate-200 bg-white shadow-xs overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Add New Store
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs">
                Register and onboard a new store to the rating platform
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

            {/* Store Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Store Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Store className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Starbucks Coffee Downtown"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                  minLength={20}
                  maxLength={60}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span
                  className={
                    formData.name && !isNameValid
                      ? "text-destructive font-medium"
                      : "text-slate-400"
                  }
                >
                  Must be between 20 and 60 characters
                </span>
                <span className="text-slate-400">
                  {formData.name.trim().length}/60
                </span>
              </div>
            </div>

            {/* Store Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Store Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. contact@starbucksdowntown.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Store Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Store Physical Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                  maxLength={400}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Max 400 characters ({formData.address.length}/400)
              </p>
            </div>

            {/* Banner Image URL (Optional) */}
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Banner Image URL <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={handleChange}
                  disabled={isPending}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                />
              </div>
              {formData.image && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 aspect-16/9 max-h-36 bg-slate-100">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Assigned Store Owner Email (Optional) */}
            <div className="space-y-2">
              <Label
                htmlFor="ownerEmail"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Store Owner Email <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="ownerEmail"
                  name="ownerEmail"
                  type="email"
                  placeholder="e.g. owner@example.com"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  disabled={isPending}
                  className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Enter the email address of an existing store owner to link this store.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  address: "",
                  image: "",
                  ownerEmail: "",
                });
                setErrorMessage(null);
              }}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="font-medium gap-2"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Adding Store...</span>
                </div>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Store</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default AddStore;