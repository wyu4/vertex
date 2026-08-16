"use client";

import { useEffect, useRef, useState } from "react";
import { PopupButton, useBooleanPopup } from "../hooks/Popup";
import {
  GradeCounter,
  SecondaryDiv,
  SessionDiv,
  TertiaryDiv,
} from "../reusable/Presets";
import {
  calculateTotalPoints,
  createEmptySessionRecord,
} from "@/utils/data/universal";
import { GrHistory } from "react-icons/gr";
import { Grade, SessionRecord } from "@/types/data";
import { deleteRecord, getAllRecords } from "@/utils/data/server";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTimelineRef } from "../hooks/Animation";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";

export default function PerformancePanel() {
  const [popupComponent, triggerPopup] = useBooleanPopup({
    initialVisible: false,
  });
  const [totalRecord, setTotalRecord] = useState(createEmptySessionRecord());
  const [history, setHistory] = useState<Record<string, SessionRecord>>({});
  const [maximizedHistory, setMaximizedHistory] = useState<
    [string, SessionRecord] | null
  >(null);

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
      <MaximizeDiv
        data={maximizedHistory}
        onClose={() => setMaximizedHistory(null)}
        onTrash={() => {
          triggerPopup(
            "Confirm Delete",
            `Are you sure you want to PERMANENTALLY delete this record?`,
            () => {
              const [timestamp] = maximizedHistory!;
              setMaximizedHistory(null);
              deleteRecord(timestamp).then((success) => {
                if (!success) return;
                setHistory(({ [timestamp]: _, ...rest }) => rest);
              });
            },
            undefined,
          );
        }}
      />
      <SecondaryDiv className="relative mt-10 rounded-2xl flex flex-col justify-start items-center p-5 md:p-10 gap-2 md:gap-5">
        <SessionDiv record={totalRecord} increasePts={0}>
          <GrHistory className="text-xl" />
          <h1>Total Points</h1>
        </SessionDiv>
        <div className="relative mt-5 w-full flex flex-col items-center justify-start gap-1 md:gap-2">
          <div className="relative w-full flex flex-row justify-between items-center rounded-2xl gap-2">
            <h2 className="font-bold">Timestamp</h2>
            <p className="font-bold">Points</p>
          </div>
          {Object.entries(history)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, record]) => (
              <RecordButton
                key={`history-${date}`}
                date={date}
                record={record}
                disabled={maximizedHistory !== null}
                onClick={() => setMaximizedHistory([date, record])}
              />
            ))}
        </div>
      </SecondaryDiv>
    </>
  );
}

function RecordButton({
  date,
  record,
  onClick,
  disabled = false,
}: {
  date: string;
  record: SessionRecord;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const d = new Date(date);
  const formatted = d.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const ref = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(() => {
    gsap.to(ref.current, {
      width: hovering ? "110%" : "100%",
      ease: "power1.inOut",
      duration: 0.2,
    });
  }, [hovering]);

  return (
    <button
      ref={ref}
      className="relative w-full flex flex-row justify-between items-center bg-bg-tertiary rounded-2xl shadow-md/5 ring-1 ring-black/10 p-5 gap-2 cursor-grab"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={disabled}
    >
      <h2>{formatted}</h2>
      <p className="font-bold">{calculateTotalPoints(record)}</p>
    </button>
  );
}

function MaximizeDiv({
  data,
  onClose,
  onTrash,
}: {
  data?: [string, SessionRecord] | null;
  onClose?: () => void;
  onTrash?: () => void;
}) {
  const isVisible = data !== null;

  const [formattedDate, setFormattedDate] = useState("");
  const [record, setRecord] = useState<SessionRecord | null>(null);

  const container = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const timeline = useTimelineRef((tl) => {
    tl.fromTo(
      container.current,
      {
        opacity: 0,
        pointerEvents: "none",
      },
      { opacity: 1, pointerEvents: "all", duration: 0.25, ease: "sine.out" },
    ).fromTo(
      popup.current,
      {
        y: "100vh",
      },
      {
        delay: 0.1,
        y: 0,
        ease: "power1.out",
        duration: 0.25,
      },
      "<",
    );
  });

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (!data) {
      tl.reverse();
      return;
    }
    tl.play();
    const [date, record] = data;
    const d = new Date(date);
    setFormattedDate(
      d.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    );
    setRecord(record);
  }, [data]);

  return (
    <div
      ref={container}
      className="fixed z-25 top-0 left-0 w-full h-full bg-black/25 backdrop-blur-xs opacity-0 pointer-events-none"
    >
      <div
        ref={popup}
        className="absolute bottom-0 left-0 w-full rounded-t-2xl bg-bg-tertiary flex flex-col justify-start items-center p-5 pb-25 gap-2"
      >
        <div className="relative w-full flex flex-row justify-between items-center">
          <PopupButton onClick={onTrash}>
            <FaRegTrashAlt className="text-2xl" />
          </PopupButton>
          <PopupButton onClick={onClose}>
            <FaPlus className="text-2xl rotate-45" />
          </PopupButton>
        </div>
        <h1 className="text-xl mt-5 md:text-2xl font-bold">{formattedDate}</h1>
        <p className="text-8xl text-center font-bold">
          {calculateTotalPoints(record ?? undefined)}
        </p>
        <div className="flex flex-row flex-nowrap justify-around items-center w-full gap-10 pt-3 border-t border-font-tertiary/15">
          {record && (
            <>
              <GradeCounter color="var(--grade-pink)" count={record.pink} />
              <GradeCounter color="var(--grade-yellow)" count={record.yellow} />
              <GradeCounter color="var(--grade-green)" count={record.green} />
              <GradeCounter color="var(--grade-orange)" count={record.orange} />
              <GradeCounter color="var(--grade-blue)" count={record.blue} />
              <GradeCounter color="var(--grade-white)" count={record.white} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
