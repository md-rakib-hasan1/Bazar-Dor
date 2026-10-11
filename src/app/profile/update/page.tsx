"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [hasEditedName, setHasEditedName] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentName = session?.user.name ?? "";
  const value = hasEditedName ? name : currentName;

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setErrorMessage("");

    if (!file) {
      setAvatar(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      const message = "ছবির সাইজ ৫ MB-এর মধ্যে হতে হবে।";
      setErrorMessage(message);
      toast.error(message);
      event.target.value = "";
      setAvatar(null);
      setPreviewUrl(null);
      return;
    }

    if (
      !["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
        file.type,
      )
    ) {
      const message = "শুধু JPG, PNG, GIF অথবা WebP ছবি ব্যবহার করুন।";
      setErrorMessage(message);
      toast.error(message);
      event.target.value = "";
      setAvatar(null);
      setPreviewUrl(null);
      return;
    }

    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const updatedName = value.trim();
    if (!updatedName) {
      const message = "আপনার নাম লিখুন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    const nameChanged = updatedName !== currentName;
    if (!nameChanged && !avatar) {
      toast.error("কোনো পরিবর্তন করা হয়নি।");
      return;
    }

    setIsSubmitting(true);
    try {
      if (avatar) {
        const formData = new FormData();
        formData.set("avatar", avatar);
        formData.set("name", updatedName);

        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });
        const result: { error?: string } = await response.json();

        if (!response.ok) {
          const message = result.error || "ছবি আপডেট করা যায়নি।";
          setErrorMessage(message);
          toast.error(message);
          return;
        }
      } else {
        const result = await authClient.updateUser({ name: updatedName });

        if (result.error) {
          const message = result.error.message || "নাম আপডেট করা যায়নি।";
          setErrorMessage(message);
          toast.error(message);
          return;
        }
      }

      toast.success("প্রোফাইল আপডেট হয়েছে।");
      router.push("/profile");
      router.refresh();
    } catch {
      const message =
        "অনুরোধটি সম্পন্ন করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <main
        aria-busy="true"
        className="flex flex-1 justify-center bg-[#f0f5f0] px-4 py-10"
      >
        <div className="h-64 w-full max-w-xl animate-pulse rounded-xl bg-gray-200" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-[#f0f5f0] px-4 py-10 text-center">
        <h1 className="text-xl font-bold text-[#1d271f]">
          প্রোফাইল দেখতে সাইন ইন করুন
        </h1>
        <Link
          href="/signin?callbackURL=%2Fprofile%2Fupdate&required=1"
          className="mt-4 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  const initial = currentName.trim().charAt(0).toUpperCase() || "U";
  const picture = previewUrl || session.user.image;

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f0] px-4 py-10">
      <section className="w-full max-w-xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#1d271f]">
            প্রোফাইল তথ্য আপডেট
          </h1>
          <p className="mt-2 text-sm text-[#59645b]">
            আপনার নাম ও profile picture পরিবর্তন করুন।
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-[#e5ebe5] bg-[#fafcfa] p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {picture ? (
              <Image
                src={picture}
                alt="Profile picture preview"
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-semibold text-green-800"
              >
                {initial}
              </div>
            )}
            <div className="w-full flex-1">
              <label
                htmlFor="profile-avatar"
                className="mb-2 block text-sm font-medium text-[#1d271f]"
              >
                প্রোফাইল ছবি
              </label>
              <input
                id="profile-avatar"
                name="avatar"
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleAvatarChange}
                disabled={isSubmitting}
                className="block w-full text-sm text-[#59645b] file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-800 hover:file:bg-green-100 disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-[#687169]">
                JPG, PNG, GIF বা WebP · সর্বোচ্চ ৫ MB
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-medium text-[#1d271f]"
            >
              নাম
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              value={value}
              onChange={(event) => {
                setName(event.target.value);
                setHasEditedName(true);
              }}
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border border-[#dce4dc] bg-white px-3 text-sm text-[#1d271f] outline-none transition placeholder:text-[#8a948b] focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15 disabled:opacity-60"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link
              href="/profile"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#dce4dc] bg-white px-4 text-sm font-medium text-[#1d271f] transition hover:bg-[#f4f7f4]"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-md bg-[#05893e] px-4 text-sm font-semibold text-white transition hover:bg-[#047333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateProfilePage;
