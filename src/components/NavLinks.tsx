"use client";

import { Category } from "@/types/product";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = ({ categories }: { categories: Category[] }) => {
    const pathname = usePathname();

    return (
        <nav className="flex h-8 items-center">
            <div className="flex gap-3 overflow-x-auto">
                {categories.map((category) => {
                    const isActive =
                        pathname === `/category/${category.slug}`;

                    return (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] transition ${isActive
                                    ? "bg-green-700 font-semibold text-white"
                                    : "text-gray-700 hover:text-green-700"
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.nameBn}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default NavLinks;