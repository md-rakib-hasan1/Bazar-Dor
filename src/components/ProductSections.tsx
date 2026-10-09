import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("bn-BD");

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
