import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";
import { getProducts } from "@/lib/api";

const Home = async () => {
  const products = await getProducts();

  return (
    <main className="flex-1">
      <div className="px-4 pt-6 sm:pt-8">
        <Hero />
      </div>
      <ProductSections products={products} />
    </main>
  );
};

export default Home;