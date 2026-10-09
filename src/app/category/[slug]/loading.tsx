const CategoryLoading = () => (
  <main
    aria-label="পণ্যের তালিকা লোড হচ্ছে"
    className="mx-auto w-full max-w-280 animate-pulse px-4 py-8 sm:py-10"
  >
    <div className="mb-7 flex items-start gap-4 rounded-2xl border border-[#e1e8e1] bg-[#fafcfa] p-5 sm:p-6">
      <div className="size-12 rounded-xl bg-gray-200" />
      <div className="space-y-2">
        <div className="h-7 w-28 rounded bg-gray-200" />
        <div className="h-4 w-56 max-w-full rounded bg-gray-200" />
      </div>
    </div>
    <div className="mb-5 flex justify-between border-b border-[#e1e8e1] pb-4">
      <div className="h-5 w-40 rounded bg-gray-200" />
      <div className="h-9 w-52 rounded-lg bg-gray-200" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-[138px] rounded-2xl border border-[#e1e8e1] bg-[#fafcfa] p-4"
        >
          <div className="flex gap-3">
            <div className="size-12 rounded-xl bg-gray-200" />
            <div className="space-y-2 pt-1">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
            <div className="h-6 w-14 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  </main>
);

export default CategoryLoading;
