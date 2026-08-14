"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BooleanSwitch,
  ChangingLabel,
  SecondaryDiv,
  TertiaryDiv,
} from "./reusable/Presets";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaBoltLightning } from "react-icons/fa6";
import { GrScorecard, GrTableAdd, GrTrophy } from "react-icons/gr";
import { resolveCssColor } from "@/utils/animation-helpers";
import {
  calculatePointsForClimb,
  calculateTotalPoints,
  createEmptySessionRecord,
} from "@/utils/data/universal";
import { Grade, GradeRecord } from "@/types/data";

export default function HomePanel() {
  const [currentRecord, setCurrentRecord] = useState(
    createEmptySessionRecord(),
  );
  const [grade, setGrade] = useState<Grade | null>(null);
  const [flashed, setFlashed] = useState(false);

  const [increasePts, setIncreasePts] = useState(0);

  useEffect(
    () => setIncreasePts(calculatePointsForClimb(grade, flashed)),
    [grade, flashed],
  );

  return (
    <SecondaryDiv className="relative rounded-2xl flex flex-col justify-start items-center p-5 md:p-10 gap-2 md:gap-5">
      <TertiaryDiv className="relative flex flex-col w-full justify-center items-center rounded-2xl p-5 gap-2">
        <div className="text-xl md:text-2xl font-bold flex flex-col justify-center items-center gap-2">
          <GrTrophy className="text-xl" />
          <h1>Points</h1>
        </div>

        <div className="relative">
          <ChangingLabel
            className="text-center font-bold text-8xl leading-none"
            text={calculateTotalPoints(currentRecord).toString()}
          />
          <ChangingLabel
            className="absolute left-full bottom-1 ml-2 font-bold text-2xl text-positive-primary"
            text={increasePts > 0 ? `+${increasePts}` : undefined}
            easeTime={0.15}
          />
        </div>

        <div className="flex flex-row flex-nowrap justify-around items-center w-full gap-2 pt-3 border-t border-font-tertiary/15">
          <GradeCounter color="var(--grade-pink)" count={currentRecord.pink} />
          <GradeCounter
            color="var(--grade-yellow)"
            count={currentRecord.yellow}
          />
          <GradeCounter
            color="var(--grade-green)"
            count={currentRecord.green}
          />
          <GradeCounter
            color="var(--grade-orange)"
            count={currentRecord.orange}
          />
          <GradeCounter color="var(--grade-blue)" count={currentRecord.blue} />
          <GradeCounter
            color="var(--grade-white)"
            count={currentRecord.white}
          />
        </div>
      </TertiaryDiv>
      <TertiaryDiv className="relative flex flex-col w-full justify-center items-center rounded-2xl p-5 gap-2">
        <div className="text-xl md:text-2xl font-bold flex flex-row justify-center items-center gap-2">
          <GrScorecard className="text-xl" />
          <h1>Grade</h1>
        </div>

        <div className="relative h-10 flex flex-row justify-center items-center flex-nowrap gap-4 md:gap-5">
          <GradeButton
            color="var(--grade-pink)"
            selected={grade === "pink"}
            onSelect={() => setGrade("pink")}
          />
          <GradeButton
            color="var(--grade-yellow)"
            selected={grade === "yellow"}
            onSelect={() => setGrade("yellow")}
          />
          <TertiaryDiv className="relative h-5 bg-positive-primary/25 rounded-xl flex flex-row justify-center items-center flex-nowrap gap-[inherit] p-5">
            <GradeButton
              color="var(--grade-green)"
              selected={grade === "green"}
              onSelect={() => setGrade("green")}
            />
            <GradeButton
              color="var(--grade-orange)"
              selected={grade === "orange"}
              onSelect={() => setGrade("orange")}
            />
            <GradeButton
              color="var(--grade-blue)"
              selected={grade === "blue"}
              onSelect={() => setGrade("blue")}
            />
            <GradeButton
              color="var(--grade-white)"
              selected={grade === "white"}
              onSelect={() => setGrade("white")}
            />
          </TertiaryDiv>
        </div>
      </TertiaryDiv>
      <TertiaryDiv className="relative flex flex-row w-full justify-between items-center rounded-2xl p-5 gap-2">
        <div className="text-xl font-bold flex flex-row justify-start items-center gap-2">
          <FaBoltLightning className="text-sm" />
          <p>
            Flash climb{" "}
            <i className="font-normal text-font-secondary">(x2 points)</i>
          </p>
        </div>
        <BooleanSwitch
          overrideValue={flashed}
          onSwitch={(v) => setFlashed(v)}
        />
      </TertiaryDiv>
      <AddButton
        onClick={() => {
          if (grade !== null) {
            const key = flashed ? "flashed" : "regular";
            setCurrentRecord((prev) => ({
              ...prev,
              [grade]: {
                ...prev[grade],
                [key]: prev[grade][key] + 1,
              },
            }));
          }
          setIncreasePts(0);
          setGrade(null);
          setFlashed(false);
        }}
      />
    </SecondaryDiv>
  );
}

function GradeCounter({
  color,
  count = { regular: 0, flashed: 0 },
}: {
  color: string;
  count?: GradeRecord;
}) {
  return (
    <div className="relative flex flex-col md:flex-row gap-1.5 justify-center items-center">
      <div
        className="relative aspect-square h-3 rounded-full ring-1 ring-black/20"
        style={{ backgroundColor: color }}
      />
      <ChangingLabel
        className="text-sm font-medium leading-none"
        text={(count.regular + count.flashed).toString()}
      />
    </div>
  );
}

export function GradeButton({
  color,
  onSelect,
  selected = false,
}: {
  color: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  const container = useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const [mouseEntered, setMouseEntered] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.style.backgroundColor = color;
  }, [color]);

  useGSAP(() => {
    gsap.to(container.current, {
      opacity: mouseEntered ? 0.75 : 1,
      height: selected ? "3rem" : mouseEntered ? "2rem" : "1.25rem",
      ease: "power1.inOut",
      duration: 0.1,
    });
  }, [mouseEntered, selected]);

  return (
    <span
      ref={container}
      className="relative bg-bg-secondary rounded-xl overflow-clip place-items-center w-7 md:w-10 h-5 shadow-lg shadow-font-primary/20 ring-1 ring-black/10"
    >
      <button
        ref={ref}
        className="absolute w-full h-full cursor-grab"
        onMouseEnter={() => setMouseEntered(true)}
        onMouseLeave={() => setMouseEntered(false)}
        onClick={onSelect}
      />
    </span>
  );
}

export function AddButton({
  onClick,
  color = "var(--bg-tertiary)",
}: {
  onClick?: () => void;
  color?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const initialLoad = useRef(true);
  const [mouseEntered, setMouseEntered] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  useGSAP(() => {
    const button = ref.current!;
    const targetColor = resolveCssColor(color, button);
    if (initialLoad.current) {
      gsap.set(button, {
        backgroundColor: targetColor,
      });
      return;
    }
    gsap.to(button, {
      backgroundColor: targetColor,
      ease: "sine.inOut",
      duration: 0.5,
    });
  }, [color]);

  useGSAP(() => {
    const button = ref.current!;
    gsap.to(button, {
      scale: (mouseEntered ? 1.25 : 1) * (mouseDown ? 0.8 : 1),
      ease: "power1.inOut",
      duration: 0.1,
    });
  }, [mouseEntered, mouseDown]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="relative select-none place-items-center p-5 rounded-full aspect-square text-2xl md:text-3xl ring-1 ring-black/10 bg-bg-tertiary shadow-md/5"
      onMouseEnter={() => setMouseEntered(true)}
      onMouseLeave={() => setMouseEntered(false)}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      <GrTableAdd />
    </button>
  );
}
