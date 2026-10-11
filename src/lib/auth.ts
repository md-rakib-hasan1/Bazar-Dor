import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

export const client = new MongoClient(process.env.MONGODB_URI as string);
export const db = client.db("bazar_dor");

export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL || 
process.env.BETTER_AUTH_BASE_URL,
secret:process.env.BETTER_AUTH_SECRET,
database:mongodbAdapter(db,{client}),
trustedOrigins:[
"http://localhost:3000",
"https://bazar-dor-phi-ebon.vercel.app"
],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [nextCookies()],
});