import ProductSections from "@/components/ProductSections";
import { getProducts } from "@/lib/api";

const Home = async () => {
  const products = await getProducts();

  return (
    <main>
      <ProductSections products={products} />
    </main>
  );
};

export default Home;