"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCallbackURL = () => {
    const requestedCallback = new URLSearchParams(
      window.location.search,
    ).get("callbackURL");

    if (!requestedCallback) {
      return "/";
    }

    const destination = new URL(requestedCallback, window.location.origin);
    return destination.origin === window.location.origin
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : "/";
  };

  const showValidationError = (message: string) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name) {
      showValidationError("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showValidationError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (password.length < 8) {
      showValidationError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      showValidationError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setIsSubmitting(true);
    try {
      const callbackURL = getCallbackURL();
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setErrorMessage(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
      router.push(
        `/signin?registered=1&callbackURL=${encodeURIComponent(callbackURL)}`,
      );
    } catch {
      const message =
        "অনুরোধটি সম্পন্ন করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUpWithSocialProvider = async (provider: "google" | "github") => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const callbackURL = getCallbackURL();
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (result.error) {
        const message =
          result.error.message || "সামাজিক অ্যাকাউন্ট দিয়ে সাইন আপ করা যায়নি।";
        setErrorMessage(message);
        toast.error(message);
      }
    } catch {
      const message =
        "সামাজিক অ্যাকাউন্ট দিয়ে সাইন আপ করা যায়নি। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center bg-[#f0f5f0] px-4 py-10">
      <section className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1d271f]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="mt-2 text-sm text-[#59645b]">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </header>

        <div className="rounded-xl border border-[#e5ebe5] bg-[#fafcfa] p-6 shadow-sm">
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-medium text-[#1d271f]"
              >
                নাম
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="যেমন: রহিম উদ্দিন"
                required
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-[#dce4dc] bg-[#fafcfa] px-3 text-sm text-[#1d271f] outline-none transition placeholder:text-[#8a948b] focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium text-[#1d271f]"
              >
                ইমেইল
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-[#dce4dc] bg-[#fafcfa] px-3 text-sm text-[#1d271f] outline-none transition placeholder:text-[#8a948b] focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-medium text-[#1d271f]"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-[#dce4dc] bg-[#fafcfa] px-3 text-sm text-[#1d271f] outline-none transition placeholder:text-[#8a948b] focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="mb-2 block text-sm font-medium text-[#1d271f]"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="আবার লিখুন"
                required
                disabled={isSubmitting}
                className="h-10 w-full rounded-md border border-[#dce4dc] bg-[#fafcfa] px-3 text-sm text-[#1d271f] outline-none transition placeholder:text-[#8a948b] focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15 disabled:opacity-60"
              />
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-md bg-[#05893e] px-4 text-sm font-semibold text-white transition hover:bg-[#047333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>

            <div className="flex items-center gap-3 py-1" aria-hidden="true">
              <span className="h-px flex-1 bg-[#1d271f]/10" />
              <span className="text-xs text-[#687169]">অথবা</span>
              <span className="h-px flex-1 bg-[#1d271f]/10" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => signUpWithSocialProvider("google")}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dce4dc] bg-white px-2 text-xs font-medium text-[#1d271f] transition hover:bg-[#f4f7f4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.2c0-.7-.06-1.37-.18-2.02H12v3.82h5.24a4.48 4.48 0 0 1-1.94 2.94v2.4h3.14c1.84-1.7 2.91-4.2 2.91-7.14Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.4c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.71-5.46-4.01H3.3v2.47A9.75 9.75 0 0 0 12 21.6Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.76a5.86 5.86 0 0 1 0-3.72V7.57H3.3a9.75 9.75 0 0 0 0 8.66l3.24-2.47Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.03c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.07 14.63 2.1 12 2.1a9.75 9.75 0 0 0-8.7 5.47l3.24 2.47C7.31 7.74 9.46 6.03 12 6.03Z"
                  />
                </svg>
                Google দিয়ে চালিয়ে যান
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => signUpWithSocialProvider("github")}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dce4dc] bg-white px-2 text-xs font-medium text-[#1d271f] transition hover:bg-[#f4f7f4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 fill-current"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.77 2.33 3.89 1.65.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.62 5.23-5.11 5.51.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                GitHub দিয়ে চালিয়ে যান
              </button>
            </div>

            <p className="pt-1 text-center text-sm text-[#59645b]">
              অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/signin"
                className="font-semibold text-[#05893e] hover:underline"
              >
                সাইন ইন করুন
              </Link>
            </p>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-medium text-[#05893e] transition hover:text-[#046d32]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
};

export default SignUpPage;
