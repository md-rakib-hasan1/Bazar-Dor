import Link from "next/link";
import CategoryProductList from "@/components/CategoryProductList";
import { getCategories, getProductsByCategory } from "@/lib/api";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category || products.length === 0) {
    return (
      <main className="mx-auto flex min-h-[55vh] w-full max-w-280 items-center justify-center px-4 py-12 font-[var(--font-noto-serif-bengali)]">
        <section className="max-w-md text-center">
          <span aria-hidden="true" className="text-5xl">
            🧺
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[#1d271f]">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            বিভাগটি সরানো হয়ে থাকতে পারে অথবা এখানে এখনো কোনো পণ্য যোগ করা হয়নি।
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
  }

  return (
    <main className="mx-auto w-full max-w-280 px-4 py-8 font-[var(--font-noto-serif-bengali)] sm:py-10">
      <header className="mb-7 flex items-start gap-4 rounded-2xl border border-[#e1e8e1] bg-[#fafcfa] p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-3xl"
        >
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-[#1d271f]">
            {category.nameBn}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্যের
            আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </header>

      <CategoryProductList products={products} />
    </main>
  );
};

export default CategoryPage;
