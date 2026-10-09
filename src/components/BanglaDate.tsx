"use client";

import { useEffect, useState } from "react";

const BanglaDate = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: "Asia/Dhaka",
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date()),
      );
    };

    updateDate();
    const intervalId = window.setInterval(updateDate, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <time>{date}</time>;
};

export default BanglaDate;
