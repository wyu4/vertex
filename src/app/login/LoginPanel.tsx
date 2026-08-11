"use client";

import { SubmitEventHandler, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SecondaryDiv, TertiaryDiv } from "../reusable/DivPresets";
import { signIn, signUp, sendVerificationEmail } from "@/utils/auth/client";

gsap.registerPlugin(useGSAP);

export default function LoginPanel() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const resendRef = useRef<HTMLButtonElement>(null);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const isLogin = mode === "login";

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Entrance animation, once on mount.
  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, []);

  // Slide/fade the extra "Name" field in when switching to register.
  useGSAP(
    () => {
      if (!isLogin) {
        gsap.from(nameFieldRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [isLogin], scope: containerRef },
  );

  // Shake the error message whenever a new error comes in.
  useGSAP(
    () => {
      if (error) {
        gsap.fromTo(
          errorRef.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" },
        );
      }
    },
    { dependencies: [error], scope: containerRef },
  );

  const pop = contextSafe((target: Element | null) => {
    if (!target) return;
    gsap.fromTo(
      target,
      { scale: 0.94 },
      { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" },
    );
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setLoading(true);
    pop(submitRef.current);

    const { error } = isLogin
      ? await signIn.email({ email, password })
      : await signUp.email({ name, email, password });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong");
      setNeedsVerification(error.message === "Email not verified");
      return;
    }

    if (!isLogin) {
      // Sign-up doesn't create a session until the email is verified.
      setVerificationSent(true);
      return;
    }

    router.refresh();
  };

  const handleResend = async () => {
    setLoading(true);
    pop(resendRef.current);
    await sendVerificationEmail({ email, callbackURL: "/" });
    setLoading(false);
    setVerificationSent(true);
  };

  const switchMode = (nextMode: "login" | "register") => {
    setError(null);
    setNeedsVerification(false);
    setVerificationSent(false);
    setMode(nextMode);
  };

  if (verificationSent) {
    return (
      <SecondaryDiv
        ref={containerRef}
        className="relative rounded-2xl flex flex-col justify-start items-center p-10 gap-5"
      >
        <TertiaryDiv
          ref={cardRef}
          className="relative flex flex-col justify-center items-center rounded-2xl min-w-70 p-10 gap-3 text-center"
        >
          <h1 className="text-xl font-bold">Check your email</h1>
          <p className="text-font-secondary text-sm">
            We sent a verification link to{" "}
            <span className="font-bold">{email}</span>. Click it to activate
            your account, then log in.
          </p>
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="text-font-secondary text-sm underline mt-2"
          >
            Back to log in
          </button>
        </TertiaryDiv>
      </SecondaryDiv>
    );
  }

  return (
    <SecondaryDiv
      ref={containerRef}
      className="relative rounded-2xl flex flex-col justify-start items-center p-10 gap-5"
    >
      <TertiaryDiv className="relative flex flex-col justify-center items-center rounded-2xl min-w-70 p-5 gap-1">
        <h1 className="text-xl text-center font-bold">
          {isLogin ? "Log In" : "Register"}
        </h1>
        <p className="text-center text-font-secondary text-sm">
          {isLogin ? "Welcome back" : "Create an account to get started"}
        </p>
      </TertiaryDiv>

      <TertiaryDiv
        ref={cardRef}
        className="relative flex flex-col justify-center items-stretch rounded-2xl p-10 gap-4 min-w-70"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              ref={nameFieldRef}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-bg-secondary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-font-tertiary"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-bg-secondary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-font-tertiary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="bg-bg-secondary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-font-tertiary"
          />

          {error && (
            <div ref={errorRef} className="flex flex-col items-center gap-1">
              <p className="text-negative-primary text-sm text-center">
                {error}
              </p>
              {needsVerification && (
                <button
                  ref={resendRef}
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-font-secondary text-sm underline disabled:opacity-50"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          <button
            ref={submitRef}
            type="submit"
            disabled={loading}
            className="bg-positive-primary text-bg-tertiary font-bold rounded-xl px-4 py-2 disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "Log In" : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode(isLogin ? "register" : "login")}
          className="text-font-secondary text-sm text-center underline"
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Log in"}
        </button>
      </TertiaryDiv>
    </SecondaryDiv>
  );
}
