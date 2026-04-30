"use client";

import { useState, useEffect } from "react";
import { useUserStore, Role } from "../../entities/user/store";
import { dict } from "../../entities/i18n/dict";
import { useRouter } from "next/navigation";
import { Mountain, Delete, Fingerprint, Activity } from "lucide-react";
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
    setMounted(true);
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
        // Logic remains identical to your existing auth
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 selection:bg-rsg-gold selection:text-black">
      {/* Structural Backdrop */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="w-full max-w-[380px] flex flex-col gap-8 relative z-10">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-16 h-16 bg-background border border-border flex items-center justify-center shadow-sm"
          >
            <Mountain className="w-10 h-10 text-primary" />
          </motion.div>
          
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black uppercase tracking-[0.3em] leading-tight">
              RS&G <span className="text-primary">OPERATING SYSTEM</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Secure Gateway Access
            </p>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-8">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                <Activity className="w-3 h-3 animate-pulse" />
                System Ready
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">V 4.2.0</span>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-tight">
              {isProcessing ? "Verifying..." : "Enter Access PIN"}
            </h2>
          </div>

          {/* PIN Input Visualization */}
          <motion.div 
            animate={isError ? { x: [-4, 4, -4, 4, 0] } : {}}
            className="flex justify-between gap-4"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-14 flex-1 border transition-all duration-200 flex items-center justify-center
                  ${pin.length > i ? "border-primary bg-primary/5" : "border-border bg-muted/30"}
                  ${isError ? "border-destructive bg-destructive/5" : ""}
                `}
              >
                <AnimatePresence mode="wait">
                  {pin.length > i && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>

          {/* Numerical Interface */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                disabled={isProcessing}
                onClick={() => handlePinInput(num.toString())}
                className="h-14 bg-background border border-border text-lg font-bold hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              disabled={isProcessing}
              onClick={handleDelete}
              className="h-14 bg-muted/20 border border-border flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all active:scale-95"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handlePinInput("0")}
              className="h-14 bg-background border border-border text-lg font-bold hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95"
            >
              0
            </button>
            <div className="h-14 flex items-center justify-center text-muted-foreground opacity-30">
              <Fingerprint className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Diagnostic Footer */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border/50"></div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
              Station: RSG-ADMIN-MAIN
            </p>
            <div className="h-[1px] flex-1 bg-border/50"></div>
          </div>
          
          <div className="flex justify-center gap-6 opacity-40 grayscale">
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <span className="text-[8px] font-mono uppercase tracking-tighter">Encrypted</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <span className="text-[8px] font-mono uppercase tracking-tighter">Auth_Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}