"use client";

import { useState, useEffect } from "react";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useRouter } from "next/navigation";
import { Mountain, Delete, Lock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LoginPage() {
  const { language, setRole } = useUserStore();
  const t = dict[language].login;
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = (role: Role) => {
    setRole(role);
    const target = role === "admin" ? "/command-center" : "/field";
    router.push(target);
  };

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      setIsError(false);
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === "1111") {
          handleAuth("admin");
        } else if (newPin === "2222") {
          handleAuth("installer_juan");
        } else if (newPin === "3333") {
          handleAuth("installer_carlos");
        } else {
          setIsError(true);
          setTimeout(() => {
            setPin("");
            setIsError(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  if (!mounted) return <div className="min-h-screen bg-rsg-background" />;

  return (
    <div className="h-screen max-h-screen bg-rsg-background flex items-center justify-center p-4 selection:bg-rsg-gold selection:text-rsg-text overflow-hidden">
      {/* Main Container: Responsive padding-top (pt-16) to clear 
          the demo banner on mobile devices. 
      */}
      <div className="w-full max-w-[380px] flex flex-col gap-4 sm:gap-8 pt-16 sm:pt-0">
        {/* Terminal Header - Compact on Mobile */}
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rsg-text flex items-center justify-center border-2 sm:border-4 border-rsg-border shadow-[3px_3px_0px_0px_var(--color-rsg-gold)]">
            <Mountain className="w-8 h-8 sm:w-10 sm:h-10 text-rsg-gold" />
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-[0.3em] leading-none text-rsg-text">
              Real Stone
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-rsg-gold mt-1 font-bold">
              Field Intelligence
            </p>
          </div>
        </div>

        {/* Auth Interface - Optimized vertical footprint */}
        <div className="bg-rsg-surface border-4 border-rsg-border p-4 sm:p-8 shadow-[6px_6px_0px_0px_var(--color-rsg-border)] relative">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-rsg-text/60 flex items-center gap-2">
                <Lock className="w-3 h-3" /> System Lock
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-rsg-text">
                Security PIN
              </h2>
            </div>

            {/* PIN Display - Tighter on mobile */}
            <motion.div
              animate={isError ? { x: [-8, 8, -8, 8, 0] } : {}}
              className={`flex justify-between gap-2 h-14 sm:h-20 p-2 sm:p-4 border-2 border-rsg-border bg-rsg-background ${isError ? "border-rsg-error" : ""}`}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 flex items-center justify-center border transition-all duration-75
                    ${
                      pin.length > i
                        ? "bg-rsg-gold border-rsg-text shadow-[1px_1px_0px_0px_var(--color-rsg-text)]"
                        : "border-rsg-border/20"
                    }`}
                >
                  <AnimatePresence>
                    {pin.length > i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-rsg-text rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Keypad - Button height responsive (h-14 on mobile) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-12 sm:h-16 bg-rsg-surface border-2 border-rsg-border text-lg sm:text-xl font-black text-rsg-text hover:bg-rsg-background active:translate-y-1 active:shadow-none transition-all shadow-[3px_3px_0px_0px_var(--color-rsg-border)]"
                >
                  {num}
                </button>
              ))}
              <div className="h-12 sm:h-16" />
              <button
                onClick={() => handlePinInput("0")}
                className="h-12 sm:h-16 bg-rsg-surface border-2 border-rsg-border text-lg sm:text-xl font-black text-rsg-text hover:bg-rsg-background active:translate-y-1 active:shadow-none transition-all shadow-[3px_3px_0px_0px_var(--color-rsg-border)]"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-12 sm:h-16 bg-rsg-surface border-2 border-rsg-border flex items-center justify-center text-rsg-text hover:bg-rsg-error hover:text-white active:translate-y-1 active:shadow-none transition-all shadow-[3px_3px_0px_0px_var(--color-rsg-border)]"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Industrial Footer - Lower opacity to recede */}
        <div className="text-center pb-4 sm:pb-0">
          <p className="font-mono text-[8px] uppercase tracking-widest text-rsg-text/30 leading-relaxed">
            Secure Session Active • RSG-FIELD-OPS <br />
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
