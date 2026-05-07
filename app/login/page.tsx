"use client";

import { useState, useEffect } from "react";
import { useUserStore, Role } from "../../entities/user/store";
import { useRouter } from "next/navigation";
import { Mountain, Delete, Camera, CheckCircle2, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { haptics } from "../../shared/lib/haptics";

export default function LoginPage() {
  const { setRole } = useUserStore();
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleAuth = async (role: Role) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 600));
    setRole(role);
    const target = role === "admin" ? "/command-center" : "/field";
    router.push(target);
  };

  const handlePinInput = (num: string) => {
    if (isProcessing) return;
    haptics.click();
    if (pin.length < 4) {
      setIsError(false);
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === "1111") handleAuth("admin");
        else if (newPin === "2222") handleAuth("installer_juan");
        else if (newPin === "3333") handleAuth("installer_carlos");
        else {
          haptics.error();
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
    if (isProcessing) return;
    setPin(pin.slice(0, -1));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-0 lg:p-6 selection:bg-rsg-gold selection:text-black">
      
      {/* THE PREMIUM CONTAINER */}
      <div className="w-full h-[100dvh] lg:h-auto lg:min-h-[640px] lg:max-w-5xl flex flex-col lg:flex-row bg-background lg:rounded-[2.5rem] lg:shadow-2xl lg:border lg:border-border overflow-hidden relative">

        {/* =========================================
            LEFT SIDE: DESKTOP BRANDING
        ========================================= */}
        <div className="hidden lg:flex w-1/2 bg-zinc-950 text-white flex-col justify-between p-12 relative overflow-hidden">
          {/* Subtle RSG Gold ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-primary text-black flex items-center justify-center rounded-2xl shadow-lg mb-8">
              <Mountain className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight uppercase mb-2">
              Real<span className="text-primary italic">Stone</span>
            </h1>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-400">
              Field Operations
            </p>
          </div>

          <div className="space-y-8 relative z-10 mb-8">
            <div className="flex items-center gap-4">
              <Camera className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Good photos matter</h3>
                <p className="text-xs text-zinc-400">Snap clear pictures of your work</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">No more phone calls</h3>
                <p className="text-xs text-zinc-400">The office is updated the second you finish</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CalendarDays className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Your daily plan</h3>
                <p className="text-xs text-zinc-400">See your routes and site notes at a glance</p>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] relative z-10">
            Engineered by Tekguyz
          </p>
        </div>

        {/* =========================================
            TOP SIDE: MOBILE BRANDING
        ========================================= */}
        <div className="lg:hidden w-full pt-safe px-6 mt-8 flex flex-col items-center">
          {/* MOBILE LOGO: bg-primary and text-black for consistent gold fill */}
          <div className="w-14 h-14 bg-primary text-black flex items-center justify-center rounded-2xl shadow-md mb-4">
            <Mountain className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            Real<span className="text-primary italic">Stone</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Field Ops
          </p>
        </div>

        {/* =========================================
            RIGHT/BOTTOM SIDE: LOGIN INTERACTION
        ========================================= */}
        <div className="flex-1 flex flex-col items-center px-6 pb-safe lg:p-12 relative w-full">
          
          <div className="flex-1 flex flex-col justify-center w-full max-w-[320px]">
            
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black tracking-tight mb-2">
                {isProcessing ? "Verifying..." : "Welcome Back"}
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Enter your 4-digit PIN
              </p>
            </div>

            {/* ELEGANT PIN DOTS */}
            <motion.div 
              animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="flex justify-center gap-5 mb-12"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300
                    ${pin.length > i ? "bg-primary scale-125 shadow-[0_0_12px_rgba(var(--color-rsg-gold),0.6)]" : "bg-muted-foreground/20"}
                    ${isError ? "bg-destructive shadow-none scale-100" : ""}
                  `}
                />
              ))}
            </motion.div>

            {/* CLEAN KEYPAD */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  disabled={isProcessing}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-16 rounded-2xl bg-surface border border-border text-2xl font-black hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95 flex items-center justify-center shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                disabled={isProcessing}
                onClick={() => handlePinInput("0")}
                className="h-16 rounded-2xl bg-surface border border-border text-2xl font-black hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95 flex items-center justify-center shadow-sm"
              >
                0
              </button>
              <button
                disabled={isProcessing}
                onClick={handleDelete}
                className="h-16 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-all active:scale-90"
              >
                <Delete className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* MOBILE FOOTER */}
          <div className="lg:hidden text-center mt-4 mb-2">
             <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] font-bold">
               Engineered by Tekguyz
             </span>
          </div>

        </div>
      </div>
    </div>
  );
}