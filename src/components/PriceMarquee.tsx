
import { getProducts } from "@/lib/api";

const PriceMarquee = async () => {
  const products = await getProducts();

  if (!products.length) return null;


  const tickerProducts = [...products, ...products];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD").format(price);

  return (
    <section
      aria-label="আজকের বাজারদর"
      className="w-full overflow-hidden border-y border-gray-200 bg-white"
    >
      <div className="price-marquee-track flex w-max items-center">
        {tickerProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2 text-[11px]"
          >
            <span>{product.image}</span>

            <span className="font-medium text-gray-800">
              {product.nameBn}
            </span>

            <span className="text-gray-600">
              {formatPrice(product.today)} টাকা/{product.unit}
            </span>

            <span
              className={`font-semibold ${
                product.change.dir === "up"
                  ? "text-red-600"
                  : product.change.dir === "down"
                    ? "text-green-700"
                    : "text-gray-500"
              }`}
            >
              {product.change.dir === "up"
                ? "▲"
                : product.change.dir === "down"
                  ? "▼"
                  : "●"}{" "}
              {formatPrice(product.change.pct)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceMarquee;

