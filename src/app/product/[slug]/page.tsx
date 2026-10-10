import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/api";

const priceFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const marketPrices = product.markets.map((market) => ({
    ...market,
    average: (market.min + market.max) / 2,
  }));
  const lowestMarket = marketPrices.reduce<
    (typeof marketPrices)[number] | undefined
  >(
    (lowest, market) =>
      !lowest || market.min < lowest.min ? market : lowest,
    undefined,
  );
  const highestMarket = marketPrices.reduce<
    (typeof marketPrices)[number] | undefined
  >(
    (highest, market) =>
      !highest || market.max > highest.max ? market : highest,
    undefined,
  );
  const averagePrice = marketPrices.length
    ? marketPrices.reduce((total, market) => total + market.average, 0) /
      marketPrices.length
    : product.today;
  const unitLabel = unitLabels[product.unit] ?? `প্রতি ${product.unit}`;
  const changeText =
    product.change.dir === "up"
      ? `গতকালের তুলনায় আজ দাম বেড়েছে · ${priceFormatter.format(Math.abs(product.today - product.yesterday))} টাকা`
      : product.change.dir === "down"
        ? `গতকালের তুলনায় আজ দাম কমেছে · ${priceFormatter.format(Math.abs(product.today - product.yesterday))} টাকা`
        : "গতকালের তুলনায় আজকের দাম অপরিবর্তিত";
  const priceColor = {
    up: "text-[#d03739]",
    down: "text-[#1a9951]",
    flat: "text-[#1d271f]",
  }[product.change.dir];
  const changeColor = {
    up: "text-[#d03739]",
    down: "text-[#1a9951]",
    flat: "text-[#1d271f]",
  }[product.change.dir];

  return (
    <main className="mx-auto w-full max-w-280 space-y-8 px-4 py-8 font-[var(--font-noto-serif-bengali)] sm:py-10">
      <nav aria-label="ব্রেডক্রাম্ব">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-green-700">
              হোম
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link
              href={`/#${encodeURIComponent("সব-পণ্য")}`}
              className="hover:text-green-700"
            >
              {product.categoryNameBn}
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li aria-current="page" className="font-medium text-[#1d271f]">
            {product.nameBn}
          </li>
        </ol>
      </nav>

      <section className="rounded-3xl border border-[#e1e8e1] bg-[#fafcfa] p-5 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span aria-hidden="true" className="shrink-0 text-4xl sm:text-5xl">
              {product.image}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[#1d271f] sm:text-3xl">
                {product.nameBn}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{unitLabel}</p>
              <p className="mt-3 text-sm text-[#1d271f]">{changeText}</p>
            </div>
          </div>
          <div className="sm:min-w-36 sm:text-right">
            <p className="text-sm text-gray-600">আজকের দাম</p>
            <p className={`mt-1 text-3xl font-bold ${priceColor}`}>
              {priceFormatter.format(product.today)}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              টাকা / {unitLabel.replace(/^প্রতি /, "")}
            </p>
            <p className={`mt-2 text-sm font-semibold ${changeColor}`}>
              {product.change.dir === "up"
                ? "▲"
                : product.change.dir === "down"
                  ? "▼"
                  : "—"}{" "}
              {priceFormatter.format(Math.abs(product.change.pct))}%
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#e1e8e1] bg-[#fafcfa]">
        <div
          aria-labelledby="price-summary-heading"
          className="p-5 sm:p-8"
        >
          <h2
            id="price-summary-heading"
            className="text-xl font-bold text-[#1d271f]"
          >
            দামের সারসংক্ষেপ
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "সর্বনিম্ন দাম",
                price: lowestMarket?.min ?? product.today,
                note: lowestMarket
                  ? `সবচেয়ে কম দামের বাজার · ${lowestMarket.market}`
                  : "বাজারের তথ্য পাওয়া যায়নি",
                color: "text-[#1a9951]",
              },
              {
                label: "সর্বাধিক দাম",
                price: highestMarket?.max ?? product.today,
                note: highestMarket
                  ? `সবচেয়ে বেশি দামের বাজার · ${highestMarket.market}`
                  : "বাজারের তথ্য পাওয়া যায়নি",
                color: "text-[#d03739]",
              },
              {
                label: "গড় দাম",
                price: averagePrice,
                note: `${unitLabel}-এর হিসাবে`,
                color: "text-[#1a9951]",
              },
            ].map(({ label, price, note, color }) => (
              <article
                key={label}
                className="rounded-2xl border border-[#e1e8e1] bg-white p-4 sm:p-5"
              >
                <p className="text-sm text-gray-600">{label}</p>
                <p className={`mt-2 text-xl font-bold ${color}`}>
                  {priceFormatter.format(price)} টাকা
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e1e8e1] p-5 sm:p-8">
          <h2
            id="market-prices-heading"
            className="text-xl font-bold text-[#1d271f]"
          >
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e1e8e1] bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-[#f0f5f0] text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
                    বাজার
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
                    বিভাগ
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-semibold sm:px-5"
                  >
                    সর্বনিম্ন
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-semibold sm:px-5"
                  >
                    সর্বাধিক
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-semibold sm:px-5"
                  >
                    গড়
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketPrices.map((market) => (
                  <tr
                    key={`${market.market}-${market.division}`}
                    className="border-t border-gray-100 text-[#1d271f]"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-medium sm:px-5"
                    >
                      {market.market}
                    </th>
                    <td className="px-4 py-3 text-gray-600 sm:px-5">
                      {market.division}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      {priceFormatter.format(market.min)} টাকা
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      {priceFormatter.format(market.max)} টাকা
                    </td>
                    <td className="px-4 py-3 text-right font-medium sm:px-5">
                      {priceFormatter.format(market.average)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Link
        href={`/#${encodeURIComponent("সব-পণ্য")}`}
        className="inline-flex rounded-lg border border-[#e1e8e1] px-4 py-2 text-sm font-medium text-[#1d271f] transition hover:border-[#05893e] hover:text-green-700"
      >
        ← সব পণ্যে ফিরে যান
      </Link>
    </main>
  );
};

export default ProductPage;
