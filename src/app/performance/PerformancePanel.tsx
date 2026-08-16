"use client";

import { useEffect, useState } from "react";
import { useBooleanPopup } from "../hooks/Popup";
import { SecondaryDiv, SessionDiv, TertiaryDiv } from "../reusable/Presets";
import {
  calculateTotalPoints,
  createEmptySessionRecord,
} from "@/utils/data/universal";
import { GrHistory } from "react-icons/gr";
import { Grade, SessionRecord } from "@/types/data";
import { getAllRecords } from "@/utils/data/server";

export default function PerformancePanel() {
  const [popupComponent, triggerPopup] = useBooleanPopup({
    initialVisible: false,
  });
  const [totalRecord, setTotalRecord] = useState(createEmptySessionRecord());
  const [history, setHistory] = useState<Record<string, SessionRecord>>({});

  useEffect(() => {
    getAllRecords().then((result) => setHistory(result));
  }, []);

  useEffect(() => {
    let newTotal = createEmptySessionRecord();
    Object.values(history).forEach((record) => {
      for (const [grade, value] of Object.entries(record)) {
        newTotal[grade as Grade].flashed += value.flashed;
        newTotal[grade as Grade].regular += value.regular;
      }
    });
    setTotalRecord(newTotal);
  }, [history]);

  return (
    <>
      {popupComponent}
      <SecondaryDiv className="relative mt-10 rounded-2xl flex flex-col justify-start items-center p-5 md:p-10 gap-2 md:gap-5">
        <SessionDiv record={totalRecord} increasePts={0}>
          <GrHistory className="text-xl" />
          <h1>Total Points</h1>
        </SessionDiv>
        <div className="relative mt-5 w-full flex flex-col gap-1 md:gap-2">
          <div className="relative w-full flex flex-row justify-between items-center rounded-2xl gap-2">
            <h2 className="font-bold">Timestamp</h2>
            <p className="font-bold">Points</p>
          </div>
          {Object.entries(history)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, record]) => (
              <RecordDiv key={`history-${date}`} date={date} record={record} />
            ))}
        </div>
      </SecondaryDiv>
    </>
  );
}

function RecordDiv({ date, record }: { date: string; record: SessionRecord }) {
  const d = new Date(date);
  const formatted = d.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <TertiaryDiv className="relative w-full flex flex-row justify-between items-center rounded-2xl p-5 gap-2">
      <h2>{formatted}</h2>
      <p className="font-bold">{calculateTotalPoints(record)}</p>
    </TertiaryDiv>
  );
}
