import { Category, Product } from "@/types/product";

const BASE_URL =
  "https://api.abcz.workers.dev/api/bazardor";

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid products response");
  }

  return data;
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

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid category products response");
  }

  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid categories response");
  }

  return data;
};