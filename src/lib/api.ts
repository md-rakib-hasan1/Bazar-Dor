import { Category, Product } from "@/types/product";

const BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.items;
};

export const getProductBySlug = async (
  slug: string
): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();

  return data;
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const response = await fetch(
    `${BASE_URL}/products?category=${category}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  const data = await response.json();

  return data.items;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();

  return data;
};