const Loading = () => (
  <main
    aria-label="পণ্যের তথ্য লোড হচ্ছে"
    aria-busy="true"
    className="mx-auto w-full max-w-280 flex-1 animate-pulse space-y-10 px-4 py-6 sm:py-8"
  >
    <div className="grid min-h-70.75 grid-cols-1 items-center gap-6 rounded-3xl border border-[#e1e8e1] bg-[#fafcfa] p-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="h-7 w-32 rounded-full bg-gray-200" />
        <div className="h-9 w-full max-w-md rounded bg-gray-200" />
        <div className="h-16 w-full max-w-xl rounded bg-gray-200" />
        <div className="h-10 w-36 rounded-lg bg-gray-200" />
      </div>
      <div className="mx-auto h-56 w-full max-w-72 rounded-2xl bg-gray-200" />
    </div>

    {[0, 1, 2].map((section) => (
      <section key={section} aria-hidden="true">
        <div className="mb-4 h-7 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((card) => (
            <div
              key={card}
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
      </section>
    ))}
  </main>
);

export default Loading;
