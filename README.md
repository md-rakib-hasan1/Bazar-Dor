# বাজার দর (Bazar Dor)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর ও বিভিন্ন বাজারের দামের তুলনা দেখার responsive ওয়েব অ্যাপ।

## প্রযুক্তি

- Next.js App Router, React ও TypeScript
- Tailwind CSS ও DaisyUI
- Better Auth ও MongoDB
- Sonner toast notification

বর্তমানে শুধু signup flow যোগ করা হয়েছে। Sign-in, logout ও session পরে আলাদাভাবে যোগ করা হবে।

## প্রধান ফিচার

- আজ দাম বেড়েছে ও কমেছে—শীর্ষ পণ্যের তালিকা
- সব পণ্যের responsive card ও category অনুযায়ী তালিকা
- দামের সারসংক্ষেপ এবং বাজারভিত্তিক মূল্যতালিকাসহ product detail page
- category-তে দাম কম-বেশি অনুযায়ী sort
- Better Auth দিয়ে email/password ও Google/GitHub signup

## Product API

পণ্যের data প্রথমে `https://api.api-store.workers.dev/api/bazardor/products` থেকে আসে। এটি unavailable হলে `https://api.abcz.workers.dev/api/bazardor/products` বিকল্প হিসেবে ব্যবহৃত হয়। সফল products response এক ঘণ্টা cache থাকে; category ও category-filtered products একই response থেকে তৈরি হয়, তাই অপ্রয়োজনীয় API request এবং rate-limit কমে।

## Local setup

1. Node.js ও npm install করুন, তারপর project folder-এ:

   ```bash
   npm install
   ```

2. development server চালু করুন:

   ```bash
   npm run dev
   ```

3. [http://localhost:3000](http://localhost:3000) খুলুন।

## Validation

```bash
npm run lint
npm run build
```
