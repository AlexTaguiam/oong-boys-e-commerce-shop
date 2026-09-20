import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { updateMyProfile } from "@/services/profile.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFieldErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  const { user, dbProfile, refreshProfile, loading } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // The email always comes from the DB profile if present, otherwise the
  // Firebase user. It is read-only — customers cannot change it here.
  const email = dbProfile?.email || user?.email || "";

  // Seed the form once the DB profile resolves.
  useEffect(() => {
    if (dbProfile) {
      setName(dbProfile.name ?? "");
      setPhone(dbProfile.phone ?? "");
      setAddress(dbProfile.address ?? "");
    }
  }, [dbProfile]);

  // A "name" that merely mirrors the email local-part (our OAuth fallback)
  // is treated as "not really set" so we can nudge the user to complete it.
  const emailLocalPart = email ? email.split("@")[0] : "";
  const nameLooksUnset =
    !dbProfile?.name?.trim() ||
    dbProfile.name.trim().toLowerCase() === emailLocalPart.toLowerCase();

  const isDirty = useMemo(() => {
    if (!dbProfile) return false;
    return (
      name !== (dbProfile.name ?? "") ||
      phone !== (dbProfile.phone ?? "") ||
      address !== (dbProfile.address ?? "")
    );
  }, [name, phone, address, dbProfile]);

  const validate = (): boolean => {
    const next: ProfileFieldErrors = {};

    if (!name.trim()) {
      next.name = "Please enter your name.";
    } else if (name.trim().length > 100) {
      next.name = "Name must be 100 characters or fewer.";
    }

    if (phone.trim() && !/^\+?[0-9]{7,15}$/.test(phone.trim())) {
      next.phone = "Enter a valid phone (7–15 digits, optional leading +).";
    }

    if (address.length > 300) {
      next.address = "Address must be 300 characters or fewer.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await updateMyProfile({
        name: name.trim(),
        // "" is a deliberate clear signal understood by the backend.
        phone: phone.trim(),
        address: address.trim(),
      });
      await refreshProfile();
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors[0].message || "Validation failed.");
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Could not update your profile. Please try again.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] bg-[#faf8f4] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#4c6a46]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#faf8f4] font-sans antialiased py-8 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center">
          <Button
            nativeButton={false}
            render={
              <Link to="/">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            }
            variant="ghost"
            className="text-[#4c6a46] hover:text-[#3d5538] hover:bg-[#4c6a46]/5 rounded-xl font-semibold text-xs gap-2 -ml-2"
          ></Button>
        </div>

        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2d4029]">
            My Profile
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Keep your details up to date. We use them to auto-fill your checkout.
          </p>
        </div>

        {/* Completion nudge for OAuth users who never set a real name */}
        {nameLooksUnset && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Please set your full name (and delivery address) so we can process
              your orders. You&apos;ll need this before you can check out.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200/60 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6"
        >
          {/* Email — read only */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#2d4029] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </Label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 h-10 px-3">
              <span className="text-xs text-gray-500 truncate">{email}</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                <ShieldCheck className="w-3 h-3" />
                Locked
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Your email is tied to your login and can&apos;t be changed here.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="profile-name"
              className="text-xs font-bold uppercase tracking-wider text-[#2d4029] flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-gray-400" />
              Full Name
            </Label>
            <Input
              id="profile-name"
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`rounded-xl text-xs h-10 text-[#2d4029] border-gray-200 focus-visible:ring-[#4c6a46] ${
                errors.name ? "border-red-300 focus-visible:ring-red-400" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-[11px] font-semibold">
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="profile-phone"
              className="text-xs font-bold uppercase tracking-wider text-[#2d4029] flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Phone Number
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              placeholder="0917XXXXXXX or +63XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`rounded-xl text-xs h-10 text-[#2d4029] border-gray-200 focus-visible:ring-[#4c6a46] ${
                errors.phone ? "border-red-300 focus-visible:ring-red-400" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-[11px] font-semibold">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label
              htmlFor="profile-address"
              className="text-xs font-bold uppercase tracking-wider text-[#2d4029] flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Default Delivery Address
            </Label>
            <Textarea
              id="profile-address"
              placeholder="Street Name, Barangay, City, Province"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className={`rounded-xl text-xs text-[#2d4029] border-gray-200 focus-visible:ring-[#4c6a46] resize-none ${
                errors.address
                  ? "border-red-300 focus-visible:ring-red-400"
                  : ""
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-[11px] font-semibold">
                {errors.address}
              </p>
            )}
            <p className="text-[11px] text-gray-400">
              We&apos;ll pre-fill this at checkout. You can still change it per
              order.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              className="rounded-xl text-xs font-bold uppercase tracking-wider h-11 px-6 shadow-md bg-[#4c6a46] hover:bg-[#3d5538] text-white transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
