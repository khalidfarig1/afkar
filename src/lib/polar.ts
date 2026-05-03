import { Polar } from "@polar-sh/sdk";

export function polar() {
  return new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: (process.env.POLAR_SERVER as "production" | "sandbox") ?? "sandbox",
  });
}

export const PRODUCTS = {
  monthly: process.env.POLAR_PRODUCT_MONTHLY!,
  yearly: process.env.POLAR_PRODUCT_YEARLY!,
};
