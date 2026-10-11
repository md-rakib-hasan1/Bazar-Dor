import Link from "next/link";

const NotFound = () => (
  <main className="flex flex-1 items-center justify-center px-4 py-12 font-[var(--font-noto-serif-bengali)]">
    <section className="max-w-md text-center">
      <span aria-hidden="true" className="text-5xl">
        🧺
      </span>
      <p className="mt-4 text-sm font-semibold tracking-wide text-green-700">
        ৪০৪ · পৃষ্ঠা পাওয়া যায়নি
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[#1d271f]">
        আপনি যে পৃষ্ঠাটি খুঁজছেন, সেটি এখানে নেই
      </h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        ঠিকানা পরিবর্তিত হয়ে থাকতে পারে অথবা পৃষ্ঠাটি সরানো হয়েছে।
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#05893e] px-4 text-sm font-semibold text-white transition hover:bg-[#047f39]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  </main>
);

export default NotFound;
