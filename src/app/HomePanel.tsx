"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChangingLabel, SecondaryDiv, TertiaryDiv } from "./reusable/Presets";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HomePanel() {
  const [grade, setGrade] = useState<Grade | null>(null);
  const [flashed, setFlashed] = useState(false);

  const [increasePts, setIncreasePts] = useState(0);

  useEffect(() => {
    let points = 0;
    switch (grade) {
      case "green":
        points = 1;
        break;
      case "orange":
        points = 4;
        break;
      case "blue":
        points = 10;
        break;
      case "white":
        points = 25;
        break;
    }

    if (flashed) points *= 2;

    setIncreasePts(points);
  }, [grade, flashed]);

  return (
    <SecondaryDiv className="relative rounded-2xl flex flex-col justify-start items-center p-10 gap-5">
      <TertiaryDiv className="relative flex flex-col justify-center items-center rounded-2xl min-w-50 p-5 ">
        <h1 className="text-xl text-center font-bold">Points</h1>
        <p className="relative z-0 text-center font-bold text-8xl">{0}</p>
        <ChangingLabel
          className="absolute z-1 font-bold right-5 bottom-5 text-2xl text-right text-positive-primary"
          text={increasePts > 0 ? `+${increasePts}` : undefined}
          easeTime={0.15}
        />
      </TertiaryDiv>
      <TertiaryDiv className="relative flex flex-col w-full justify-center items-center rounded-2xl p-5 gap-2">
        <h1 className="text-2xl text-center font-bold">Grade</h1>
        <div className="relative h-10 flex flex-row justify-center items-center flex-nowrap gap-5">
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
      <TertiaryDiv className="relative flex flex-col w-full justify-center items-center rounded-2xl p-5 gap-2"></TertiaryDiv>
    </SecondaryDiv>
  );
}

function Divider() {
  return (
    <div className="relative bg-font-tertiary w-[0.1rem] opacity-50 rounded-full my-1" />
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
      className="relative bg-bg-secondary rounded-xl overflow-clip place-items-center w-10 h-5 shadow-lg shadow-black/20 ring-1 ring-black/10"
    >
      <button
        ref={ref}
        className="absolute w-full h-full"
        onMouseEnter={() => setMouseEntered(true)}
        onMouseLeave={() => setMouseEntered(false)}
        onClick={onSelect}
      />
    </span>
  );
}
