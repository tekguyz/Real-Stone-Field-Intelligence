'use client';

import { useState } from 'react';
import { useUserStore, Role } from '../../entities/user/store';
import { dict } from '../../entities/i18n/dict';
import { useRouter } from 'next/navigation';
import { Mountain, ArrowRight, Delete } from 'lucide-react';
import { ThemeForcer } from '../../shared/ui/ThemeForcer';

export default function LoginPage() {
  const { language, setRole } = useUserStore();
  const t = dict[language].login;
  const router = useRouter();
  
  const [pin, setPin] = useState('');
  const [showBypass, setShowBypass] = useState(false);

  const handleBypass = (role: Role) => {
    setRole(role);
    if (role === 'admin') {
      router.push('/command-center');
    } else {
      router.push('/field');
    }
  };

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Auto-submit if 4 digits
      if (newPin === '1234') {
        handleBypass('admin');
      } else if (newPin === '4321') {
        handleBypass('installer_juan');
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <ThemeForcer theme="dark" />
      
      {/* Left branding area */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-surface border-r border-border/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background/50 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-4 text-primary">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
            <Mountain className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Real Stone</span>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-semibold tracking-tighter leading-[1.1] mb-6">
            Industrial <br/>
            Luxury <br/>
            <span className="text-foreground/40">Field OS.</span>
          </h1>
          <p className="text-foreground/50 max-w-sm font-mono text-sm leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Right Form area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="md:hidden flex flex-col items-center gap-4 text-center mb-4">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center text-primary">
              <Mountain className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Real Stone</h1>
            <p className="text-foreground/50 text-sm">{t.subtitle}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold">{t.title}</h2>
            <p className="text-foreground/50 text-sm">Enter your PIN to access the system.</p>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* PIN Display */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-12 h-16 border flex items-center justify-center text-2xl font-black transition-all ${
                    pin.length > i ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface text-foreground/20'
                  }`}
                >
                  {pin.length > i ? '*' : ''}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-16 bg-card border border-border hover:bg-primary/5 text-xl font-black active:scale-[0.98] transition-all"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinInput('0')}
                className="h-16 bg-card border border-border hover:bg-primary/5 text-xl font-black active:scale-[0.98] transition-all"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-16 bg-card border border-border flex items-center justify-center hover:bg-red-500/10 active:scale-[0.98] transition-all"
              >
                <Delete className="w-6 h-6 text-foreground/40" />
              </button>
            </div>

            {/* Quick Access / Bypass */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <button 
                  onClick={() => setShowBypass(!showBypass)}
                  className="text-xs font-mono text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {t.bypass}
                </button>
                <div className="h-px flex-1 bg-border" />
              </div>

              {showBypass && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => handleBypass('admin')} className="flex items-center justify-between w-full p-4 border border-border bg-foreground/[0.03] text-foreground hover:bg-foreground/10 transition-colors group">
                    <span className="font-medium">Admin Portal (1234)</span>
                    <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </button>
                  <button onClick={() => handleBypass('installer_juan')} className="flex items-center justify-between w-full p-4 border border-border bg-foreground/[0.03] text-foreground hover:bg-foreground/10 transition-colors group">
                    <span className="font-medium">Installer App (4321)</span>
                    <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
