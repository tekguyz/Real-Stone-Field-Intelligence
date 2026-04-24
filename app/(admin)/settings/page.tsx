'use client';

import { useState } from 'react';
import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { Settings as SettingsIcon, Globe, Bell, Lock, CheckCircle2 } from 'lucide-react';

type Tab = 'general' | 'operations' | 'security';

export default function SettingsPage() {
  const { language, setLanguage } = useUserStore();
  const t = dict[language].admin;
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t.settings}</h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">SYSTEM CONFIGURATION & PREFERENCES</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Tabs */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {[
            { id: 'general', label: t.general, icon: Globe },
            { id: 'operations', label: t.operations, icon: Bell },
            { id: 'security', label: t.security, icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors text-sm font-black tracking-[0.2em] uppercase ${
                activeTab === tab.id 
                  ? 'bg-primary border-l-4 border-primary text-primary-foreground' 
                  : 'border-l-4 border-transparent text-foreground/70 hover:bg-surface/50 hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-card border border-border overflow-hidden flex flex-col">
            
            <div className="p-8">
              {activeTab === 'general' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight mb-6">{t.general}</h2>
                    <div className="flex flex-col gap-6">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border">
                        <div>
                          <h3 className="font-medium text-foreground">{t.languagePref}</h3>
                          <p className="text-sm text-foreground/50 mt-1">Select the primary language for the admin interface.</p>
                        </div>
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                          className="bg-surface border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors w-40"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border">
                        <div>
                          <h3 className="font-medium text-foreground">{t.defaultTheme}</h3>
                          <p className="text-sm text-foreground/50 mt-1">Appearance of the portal.</p>
                        </div>
                        <select className="bg-surface border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors w-40">
                          <option>System Auto</option>
                          <option>Light Mode</option>
                          <option>Dark Mode</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight mb-6">{t.operations} & {t.notifications}</h2>
                    <div className="flex flex-col gap-6">
                      
                      <div className="flex items-center justify-between py-4 border-b border-border">
                        <div className="pr-4">
                          <h3 className="font-medium text-foreground">{t.verifiedProofEmail}</h3>
                          <p className="text-sm text-foreground/50 mt-1">Send an automated email to clients with photo proof when a job moves to &quot;Verified&quot;.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-surface border border-border peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border-border after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-border">
                        <div className="pr-4">
                          <h3 className="font-medium text-foreground">{t.jobCompleteSms}</h3>
                          <p className="text-sm text-foreground/50 mt-1">Send a quick SMS to lead installer assigned to the job upon office verification.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-surface border border-border peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border-border after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight mb-6">{t.security}</h2>
                    <div className="flex flex-col gap-6">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border">
                        <div className="max-w-md">
                          <h3 className="font-medium text-foreground">{t.masterPin}</h3>
                          <p className="text-sm text-foreground/50 mt-1">Global override PIN for office administration bypassing per-user access limits.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="password" 
                            maxLength={4}
                            defaultValue="1234"
                            className="bg-surface border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors w-24 text-center font-mono tracking-[0.2em]"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface/50 p-6 border-t border-border flex justify-end items-center gap-4">
              {saved && (
                <span className="text-green-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Preferences saved
                </span>
              )}
              <button 
                onClick={handleSave}
                className="bg-foreground text-background px-6 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
