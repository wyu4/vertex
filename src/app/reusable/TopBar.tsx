"use client";

import { authClient } from "@/utils/auth/client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { MouseEventHandler, ReactNode, useRef, useState } from "react";
import { MdOutlineLogin } from "react-icons/md";
import { useFadeIn } from "../hooks/Animation";

export default function TopBar({
  currentPage,
}: {
  currentPage?: "home" | "performance";
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useFadeIn(ref, {
    offsetY: "-10rem",
    delay: 0.25,
    duration: 1,
    ease: "power1.out",
  });

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-90 w-full overflow-clip bg-linear-to-b from-0% from-bg-primary to-bg-tertiary/50 backdrop-blur-md h-15"
    >
      <div></div>
      <div></div>
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
}: {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
  }, [hovering]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      ref={ref}
    >
      {children}
    </button>
  );
}
