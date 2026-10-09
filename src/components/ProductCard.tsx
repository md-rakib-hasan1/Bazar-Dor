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
  const direction = {
    up: { symbol: "▲", color: "text-green-700" },
    down: { symbol: "▼", color: "text-red-600" },
    flat: { symbol: "—", color: "text-gray-500" },
  }[product.change.dir];

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
          {percentFormatter.format(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
