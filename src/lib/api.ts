import { Category, Product } from "@/types/product";

const BASE_URLS = [
  "https://api.abcz.workers.dev/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
];

const fetchApiData = async (path: string): Promise<unknown> => {
  let lastError: Error | undefined;

  for (const baseUrl of BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("All product API requests failed");
};

export const getProducts = async (): Promise<Product[]> => {
  const data = await fetchApiData("/products");

  if (!Array.isArray(data)) {
    throw new Error("Invalid products response");
  }

  return data;
};

export const getProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const data = await fetchApiData(
    `/products?category=${encodeURIComponent(category)}`,
  );

  if (!Array.isArray(data)) {
    throw new Error("Invalid category products response");
  }

  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await fetchApiData("/categories");

  if (!Array.isArray(data)) {
    throw new Error("Invalid categories response");
  }

  return data;
};