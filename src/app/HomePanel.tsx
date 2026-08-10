"use client";

import { SecondaryDiv, TertiaryDiv } from "./reusable/DivPresets";

export default function HomePanel() {
  return (
    <SecondaryDiv className="relative rounded-2xl flex flex-col justify-start items-center p-10 g-5">
      <TertiaryDiv className="relative flex flex-col justify-center items-center rounded-2xl p-5 g-5 ">
        <h2 className="text-xl">Points</h2>
        <p className="text-center font-bold text-4xl">0</p>
      </TertiaryDiv>
    </SecondaryDiv>
  );
}
