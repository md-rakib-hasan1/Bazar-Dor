const Footer = () => (
  <footer className="mt-auto border-t border-[#e5ebe5] bg-[#fafcfa]">
    <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="font-semibold text-[#1d271f]">
        বাজার দর
        <span className="font-normal text-[#59645b]">
          {" "}
          — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </span>
      </p>
      <p className="text-xs leading-relaxed text-[#687169] sm:text-right">
        সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
      </p>
    </div>
  </footer>
);

export default Footer;
