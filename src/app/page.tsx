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

  const pagesReadCount =
    startPage && endPage && endPage > startPage && endPage - startPage + 1;
  const pagesReadCountDays =
    pagesReadCount &&
    pagesPerDayCount &&
    pagesReadCount / pagesPerDayCount;
  const pagesReadCountMonths =
    pagesReadCountDays && pagesReadCountDays / 30;

  const resultPlan = useMemo(() => {
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
          <div className={styles.inputGroup}>
            <p>Введи с какой страницы будешь начинать читать</p>
            <div>
              <input
                onChange={(e) => setStartPage(+e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <p>Введи до какой страницы будешь читать</p>
            <div>
              <input
                onChange={(e) => setEndPage(+e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <p>Введи по сколько страниц в день будешь читать</p>
            <div>
              <input
                onChange={(e) => setPagesPerDayCount(+e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </form>

        <p>
          План чтения {pagesReadCount && `${pagesReadCount} страниц`}{" "}
          {pagesReadCountDays &&
            `за ${pagesReadCountDays} дней (${round(
              pagesReadCountMonths as number
            )} месяца)`}
        </p>
        <div>
          <textarea
            readOnly
            value={resultPlan}
            rows={20}
            className={styles.resultArea}
          />
        </div>
      </div>
    </main>
  );
}
