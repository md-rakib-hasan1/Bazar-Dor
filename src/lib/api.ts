import type { Category, Product } from "@/types/product";

const BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isProductList = (data: unknown): data is Product[] =>
  Array.isArray(data) &&
  data.every(
    (product) =>
      isRecord(product) &&
      typeof product.id === "number" &&
      typeof product.slug === "string" &&
      typeof product.nameBn === "string" &&
      typeof product.today === "number" &&
      isRecord(product.change) &&
      (product.change.dir === "up" ||
        product.change.dir === "down" ||
        product.change.dir === "flat") &&
      typeof product.change.pct === "number" &&
      Array.isArray(product.markets),
  );

const fetchApiData = async <T>(
  path: string,
  isValidResponse: (data: unknown) => data is T,
): Promise<T> => {
  let lastError: Error | undefined;

  for (const baseUrl of BASE_URLS) {
    try {
      const url = `${baseUrl}${path}`;
      const response = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(
          `API request to ${url} failed with status ${response.status}`,
        );
      }

      const data: unknown = await response.json();
      if (!isValidResponse(data)) {
        throw new Error(`API returned an invalid response for ${path}`);
      }

      return data;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("All product API requests failed");
};

export const getProducts = (): Promise<Product[]> =>
  fetchApiData("/products", isProductList);

export const getProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> =>
  (await getProducts()).filter((product) => product.category === category);

export const getCategories = async (): Promise<Category[]> => {
  const products = await getProducts();
  const categories = new Map<string, Category>();

  for (const product of products) {
    if (!categories.has(product.category)) {
      categories.set(product.category, {
        id: product.category,
        slug: product.category,
        nameBn: product.categoryNameBn,
        icon: product.categoryIcon,
      });
    }
  }

  return [...categories.values()];
};