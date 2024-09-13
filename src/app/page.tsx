"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useMemo, useState } from "react";

const round = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export default function Home() {
  const [startPage, setStartPage] = useState<number | undefined>();
  const [endPage, setEndPage] = useState<number | undefined>();
  const [pagesPerDayCount, setPagesPerDayCount] = useState<
    number | undefined
  >();

  const pagesCount =
    startPage && endPage && endPage > startPage && endPage - startPage;
  const pagesCountReadDays =
    pagesCount && pagesPerDayCount && pagesCount / pagesPerDayCount;
  const pagesCountReadMonths =
    pagesCountReadDays && pagesCountReadDays / 30;

  const output = useMemo(() => {
    if (startPage && endPage && pagesPerDayCount) {
      const days = [];
      let currentDayIndex = 1;
      const currentDate = new Date();
      for (
        let currentStartPage = startPage;
        currentStartPage < endPage;
        currentStartPage += pagesPerDayCount
      ) {
        const currentEndPage = currentStartPage + pagesPerDayCount - 1;
        const currentDateDay = currentDate.getDate();
        const currentMonthNameLocalized = currentDate.toLocaleDateString(
          "ru-RU",
          {
            month: "short",
          }
        );
        days.push(
          `${currentDateDay} ${currentMonthNameLocalized} (день ${currentDayIndex}) — стр. ${currentStartPage}-${currentEndPage}`
        );

        currentDayIndex += 1;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return days.join("\n");
    }
  }, [startPage, endPage, pagesPerDayCount]);

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <form>
          <div>
            <p>Введи с какой страницы будешь начинать читать</p>
            <div>
              <input onChange={(e) => setStartPage(+e.target.value)} />
            </div>
          </div>

          <div>
            <p>Введи до какой страницы будешь читать</p>
            <div>
              <input onChange={(e) => setEndPage(+e.target.value)} />
            </div>
          </div>

          <div>
            <p>Введи по сколько страниц в день будешь читать</p>
            <div>
              <input
                onChange={(e) => setPagesPerDayCount(+e.target.value)}
              />
            </div>
          </div>
        </form>

        <p>
          План чтения {pagesCount && `${pagesCount} страниц`}{" "}
          {pagesCountReadDays &&
            `за ${pagesCountReadDays} дней (${round(
              pagesCountReadMonths as number
            )} месяца)`}
        </p>
        <div>
          <textarea readOnly value={output} />
        </div>
      </div>
    </main>
  );
}
