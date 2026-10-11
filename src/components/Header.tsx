import Link from "next/link";
import Image from "next/image";
import NavLinks from "./NavLinks";
import BanglaDate from "@/components/BanglaDate";
import { getCategories } from "@/lib/api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const signOut = async () => {
  "use server";

  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (!result.success) {
    redirect("/?signOutError=1");
  }

  redirect("/?signedOut=1");
};

const Header = async () => {
  const categories = await getCategories();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userName = session?.user.name || session?.user.email || "";
  const avatarInitial = userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 rounded-lg bg-green-600 p-1.5"
            />

            <div>
              <Link
                href="/"
                className="block text-base font-bold leading-tight text-gray-900"
              >
                বাজার দর
              </Link>

              <p className="text-[9px] text-gray-500">
                <BanglaDate />
              </p>
            </div>
          </div>

          {session ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
                    {avatarInitial}
                  </span>
                )}
                <span className="hidden max-w-28 truncate text-xs font-medium text-gray-700 sm:block">
                  {userName}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-gray-500 transition group-open:rotate-180"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="sr-only">প্রোফাইল মেনু খুলুন</span>
              </summary>

              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                <Link
                  href="/profile"
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  👤 আমার প্রোফাইল
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    ↩ সাইন আউট
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/signin"
                className="rounded-md px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-green-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-4">
          <NavLinks categories={categories} />
        </div>
      </div>
    </header>
  );
};

export default Header;