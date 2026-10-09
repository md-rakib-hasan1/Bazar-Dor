
import Image from "next/image";
import Link from "next/link";
import BanglaDate from "@/components/BanglaDate";

const Hero = () => {
  return (
    <section
      className="mx-auto grid min-h-70.75 max-w-280 grid-cols-1 items-center justify-items-center gap-6 overflow-hidden rounded-3xl border border-[#e1e8e1] bg-[#fafcfa] px-4 py-6 font-[var(--font-noto-serif-bengali)] lg:grid-cols-[minmax(0,576px)_315px] lg:justify-between lg:gap-0 lg:py-2.25"
    >
      <div className="w-full max-w-xl lg:justify-self-start">
        <p className="inline-flex h-7 items-center rounded-full bg-[#05893e]/10 px-3 text-sm font-medium leading-5 text-green-600">
          <BanglaDate />
        </p>

        <h1 className="mt-2 text-3xl font-bold leading-tight text-[#1d271f]">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mt-5 text-base font-normal leading-6 text-[#1d271f]">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
          বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>

        <Link
          href="#সব-পণ্য"
          className="mt-7 inline-flex h-10 items-center rounded-lg border border-[#047f39] bg-[#05893e] px-5.5 text-sm font-semibold leading-5 text-white transition-colors hover:bg-[#047f39]"
        >
          সব পণ্য দেখুন
        </Link>
      </div>

      <div className="relative flex h-65.75 w-full max-w-78.75 items-center justify-center lg:justify-self-end">
        <Image
          src="/bazar-hero.png"
          alt="নিত্যপ্রয়োজনীয় বাজারের পণ্য"
          width={315}
          height={263}
          priority
          className="h-full w-full object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;