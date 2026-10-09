import Link from "next/link";
import Image from "next/image";
import NavLinks from "./NavLinks";
import { getCategories } from "@/lib/api";

const Header = async () => {
  const date = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const categories = await getCategories();


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
                {date}
              </p>
            </div>
          </div>

          
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