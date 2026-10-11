import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Image from "next/image";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?callbackURL=%2Fprofile&required=1");
  }

  const initial = session.user.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="flex flex-1 justify-center bg-[#f0f5f0] px-4 py-10">
      <section className="w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#1d271f]">আমার প্রোফাইল</h1>
          <p className="mt-2 text-sm text-[#59645b]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        <div className="rounded-xl border border-[#e5ebe5] bg-[#fafcfa] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={`${session.user.name} profile picture`}
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
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-[#1d271f]">
                {session.user.name}
              </h2>
              <p className="truncate text-sm text-[#59645b]">
                {session.user.email}
              </p>
            </div>
            <Link
              href="/profile/update"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#dce4dc] bg-white px-4 text-sm font-medium text-[#1d271f] transition hover:bg-[#f4f7f4]"
            >
              ছবি ও তথ্য আপডেট
            </Link>
          </div>

          <div className="mt-8 border-t border-[#e5ebe5] pt-6">
            <h3 className="mb-4 text-sm font-semibold text-[#1d271f]">
              তথ্য
            </h3>
            <dl className="grid gap-4 rounded-lg border border-[#e5ebe5] bg-white p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#687169]">নাম</dt>
                <dd className="mt-1 text-sm font-medium text-[#1d271f]">
                  {session.user.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#687169]">ইমেইল</dt>
                <dd className="mt-1 break-all text-sm font-medium text-[#1d271f]">
                  {session.user.email}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
