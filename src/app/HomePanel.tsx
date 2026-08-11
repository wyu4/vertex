"use client";

import { SecondaryDiv, TertiaryDiv } from "./reusable/DivPresets";

export default function HomePanel() {
  return (
    <SecondaryDiv className="relative rounded-2xl flex flex-col justify-start items-center p-10 gap-5">
      <TertiaryDiv className="relative flex flex-col justify-center items-center rounded-2xl min-w-50 p-5 ">
        <h1 className="text-xl text-center font-bold">Points</h1>
        <p className="text-center font-bold text-8xl">{0}</p>
      </TertiaryDiv>
      <TertiaryDiv className="relative flex flex-col justify-center items-center rounded-2xl p-10 gap-10"></TertiaryDiv>
    </SecondaryDiv>
  );
}

function Divider() {
  return (
    <div className="relative bg-font-tertiary w-[0.1rem] opacity-50 rounded-full my-1" />
  );
}
