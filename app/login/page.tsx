"use client";

import { useState, useEffect } from "react";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useRouter } from "next/navigation";
import { Mountain, Delete, CheckCircle2, Camera, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { haptics } from "../../shared/lib/haptics";

export default function LoginPage() {
  const { language, setRole } = useUserStore();
  const t = dict[language].login;
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-6 selection:bg-rsg-gold selection:text-black relative">
      
      {/* Structural Backdrop */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row-reverse items-center lg:items-start justify-center gap-12 lg:gap-24 relative z-10 py-8 lg:py-20">
        
        {/* Right Side (Top on Mobile): Login Card */}
        <div className="w-full max-w-[360px] shrink-0">
          <div className="bg-card border border-border shadow-2xl p-8 space-y-10 rounded-2xl relative">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {isProcessing ? "One moment..." : "Welcome back!"}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Enter your 4-digit PIN to start
              </p>
            </div>

            {/* PIN Visualization */}
            <motion.div 
              animate={isError ? { x: [-4, 4, -4, 4, 0] } : {}}
              className="flex justify-between gap-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-16 flex-1 border-2 transition-all duration-200 flex items-center justify-center rounded-xl
                    ${pin.length > i ? "border-primary bg-primary/5" : "border-border bg-muted/20"}
                    ${isError ? "border-destructive bg-destructive/10" : ""}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {pin.length > i && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-rsg-gold),0.4)]"
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  disabled={isProcessing}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-16 bg-background border border-border text-xl font-bold rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-90 disabled:opacity-50 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                disabled={isProcessing}
                onClick={handleDelete}
                className="h-16 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all active:scale-90 cursor-pointer"
              >
                <Delete className="w-6 h-6" />
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handlePinInput("0")}
                className="h-16 bg-background border border-border text-xl font-bold rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-90 cursor-pointer"
              >
                0
              </button>
            </div>
          </div>

          {/* Mobile-Only Branding Placeholder */}
          <div className="mt-8 lg:hidden text-center">
             <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.4em] font-black">
                Scroll for more info
             </p>
          </div>
        </div>

        {/* Left Side (Bottom on Mobile): Human-Centric Intro */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 max-w-md">
          <div className="space-y-3">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-card border border-border flex items-center justify-center shadow-sm mb-6 rounded-xl mx-auto lg:mx-0"
            >
              <Mountain className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="text-5xl font-black tracking-tighter leading-none">
              <span className="text-foreground">REAL</span>
              <span className="text-primary italic ml-1">STONE</span>
            </h1>
            <p className="text-lg font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Field Ops
            </p>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8 pt-4">
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 text-center sm:text-left">
              <div className="shrink-0 w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                <Camera className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">Good photos matter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Instantly save clear photos and job details so your reports are always perfect.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 text-center sm:text-left">
              <div className="shrink-0 w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">Automatic Sync</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Your updates go straight to the office. No more phone calls to confirm work.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 text-center sm:text-left">
              <div className="shrink-0 w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                <CalendarDays className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">Daily Schedule</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">See exactly what’s on your plate for the day, all in one easy-to-use spot.</p>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="pt-12 w-full text-center lg:text-left">
            <a 
              href="https://tekguyz.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.4em] hover:text-primary transition-colors font-black"
            >
              Engineered by Tekguyz
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}