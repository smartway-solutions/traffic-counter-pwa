import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

export function useClock(): string {
  const [now, setNow] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(formatter.format(new Date()));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return now;
}
