"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

type SortOrder = "default" | "price-ascending" | "price-descending";

const priceFormatter = new Intl.NumberFormat("bn-BD");

const CategoryProductList = ({ products }: { products: Product[] }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const sortedProducts = useMemo(() => {
    if (sortOrder === "default") {
      return products;
    }

    return [...products].sort((a, b) =>
      sortOrder === "price-ascending"
        ? a.today - b.today
        : b.today - a.today,
    );
  }, [products, sortOrder]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e1e8e1] pb-4">
        <p className="text-sm text-gray-600">
          মোট {priceFormatter.format(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>
        <label className="flex items-center gap-2 text-sm text-[#1d271f]">
          <span>সাজান:</span>
          <select
            value={sortOrder}
            onChange={(event) => {
              const { value } = event.target;
              if (
                value === "default" ||
                value === "price-ascending" ||
                value === "price-descending"
              ) {
                setSortOrder(value);
              }
            }}
            className="h-9 rounded-lg border border-[#e1e8e1] bg-white px-3 text-sm outline-none focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/15"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-ascending">দাম: কম থেকে বেশি</option>
            <option value="price-descending">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default CategoryProductList;
