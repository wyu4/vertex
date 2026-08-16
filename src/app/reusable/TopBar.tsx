"use client";

import { authClient } from "@/utils/auth/client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { redirect, useRouter } from "next/navigation";
import { MouseEventHandler, ReactNode, useRef, useState } from "react";
import { MdOutlineLogin } from "react-icons/md";
import { useFadeIn } from "../hooks/Animation";
import { GrHistory, GrSubtract, GrTrophy } from "react-icons/gr";

export default function TopBar({
  currentPage,
}: {
  currentPage?: "home" | "performance";
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const upArrow = (
    <div className="absolute left-0 right-0 -bottom-4 flex flex-row justify-center items-center">
      <GrSubtract className="text-xl" />
    </div>
  );

  useFadeIn(ref, {
    offsetY: "-10rem",
    delay: 0.25,
    duration: 1,
    ease: "power1.out",
  });

  const navigateTo = (url: string) => {
    redirect(url);
  };

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-90 w-full overflow-clip bg-linear-to-b from-0% from-bg-primary to-bg-tertiary/50 backdrop-blur-md h-15 flex flex-row justify-center items-center"
    >
      <div className="flex flex-row justify-center items-center gap-5">
        <TopBarButton
          disabled={currentPage === "home"}
          onClick={() => navigateTo("/")}
        >
          <GrTrophy className="text-2xl" />
          {currentPage === "home" && upArrow}
        </TopBarButton>
        <TopBarButton
          disabled={currentPage === "performance"}
          onClick={() => navigateTo("/performance")}
        >
          <GrHistory className="text-2xl" />
          {currentPage === "performance" && upArrow}
        </TopBarButton>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex flex-row justify-end items-center p-5 gap-5">
        <TopBarButton
          onClick={() => {
            authClient.signOut().then(() => {
              router.refresh();
            });
          }}
        >
          <MdOutlineLogin className="text-2xl" />
        </TopBarButton>
      </div>
    </div>
  );
}

function TopBarButton({
  children,
  onClick,
  disabled = false,
}: {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(() => {
    gsap.to(ref.current, {
      opacity: hovering ? 0.5 : 1,
      y: hovering ? 2 : 0,
      duration: 0.1,
      ease: "sine.inOut",
    });
  }, [hovering, disabled]);

  return (
    <button
      className="relative aspect-square"
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      ref={ref}
    >
      {children}
    </button>
  );
}
