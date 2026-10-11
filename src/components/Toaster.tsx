"use client";

import { useEffect } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { toast } from "sonner";

const Toaster = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const signedOut = url.searchParams.get("signedOut") === "1";
    const signOutError = url.searchParams.get("signOutError") === "1";

    if (!signedOut && !signOutError) {
      return;
    }

    if (signedOut) {
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
    } else {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }

    url.searchParams.delete("signedOut");
    url.searchParams.delete("signOutError");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  return <SonnerToaster closeButton position="top-center" richColors />;
};

export default Toaster;
