import Link from "next/link";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("bn-BD");
const percentFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const ProductCard = ({ product }: { product: Product }) => {
  const { dir, pct } = product.change;
  const direction = {
    up: { symbol: "▲", color: "text-green-700" },
    down: { symbol: "▼", color: "text-red-600" },
    flat: { symbol: "—", color: "text-gray-500" },
  }[dir];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex min-h-[138px] flex-col justify-between rounded-2xl border border-[#e1e8e1] bg-[#fafcfa] p-4 transition hover:border-[#05893e] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e]"
      aria-label={`${product.nameBn}, ${priceFormatter.format(product.today)} টাকা - বিস্তারিত দেখুন`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-3xl"
        >
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#1d271f]">
            {product.nameBn}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {unitLabels[product.unit] ?? `প্রতি ${product.unit}`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-0.5 font-bold text-[#1d271f]">
            {priceFormatter.format(product.today)} টাকা
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold ${direction.color}`}
        >
          {direction.symbol}
          {percentFormatter.format(Math.abs(pct))}%
        </span>
      </div>
    </Link>
  );
};

const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

const ProductSections = ({ products }: { products: Product[] }) => {
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <div className="mx-auto mt-10 max-w-280 space-y-10 px-4 pb-12 font-[var(--font-noto-serif-bengali)]">
      <section aria-labelledby="price-risers-heading">
        <h2
          id="price-risers-heading"
          className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1d271f]"
        >
          <span className="text-green-700" aria-hidden="true">
            ▲
          </span>
          আজ দাম বেড়েছে
        </h2>
        <ProductGrid products={risers} />
      </section>

      <section aria-labelledby="price-fallers-heading">
        <h2
          id="price-fallers-heading"
          className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1d271f]"
        >
          <span className="text-red-600" aria-hidden="true">
            ▼
          </span>
          আজ দাম কমেছে
        </h2>
        <ProductGrid products={fallers} />
      </section>

      <section id="সব-পণ্য" aria-labelledby="all-products-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="all-products-heading"
              className="text-xl font-bold text-[#1d271f]"
            >
              সব পণ্য
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে।
            </p>
          </div>
          <p className="text-sm text-gray-500">
            মোট {priceFormatter.format(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default ProductSections;
