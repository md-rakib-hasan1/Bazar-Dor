import { notFound } from "next/navigation";
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
    notFound();
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
