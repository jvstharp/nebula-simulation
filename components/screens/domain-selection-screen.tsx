'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { COMPANY_CATALOG, COMPANY_DOMAIN_MAP } from '@/lib/data';
import type { SimDomain, SimCompany } from '@/lib/types';
import {
  Briefcase, BarChart3, Megaphone, Database,
  ChevronRight, Star, Lock, ArrowRight, Building2,
  Shield, Sparkles,
} from 'lucide-react';

const DOMAINS: { id: SimDomain; label: string; description: string; icon: typeof Briefcase; color: string }[] = [
  {
    id: 'pm',
    label: 'Product Management',
    description: 'Navigate roadmap conflicts, align stakeholders, and ship under pressure.',
    icon: Briefcase,
    color: '#6366f1',
  },
  {
    id: 'consulting',
    label: 'Consulting',
    description: 'Solve client problems, synthesise competing analyses, and deliver under deadline.',
    icon: BarChart3,
    color: '#f59e0b',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Balance brand and performance, allocate budgets, and drive growth.',
    icon: Megaphone,
    color: '#ec4899',
  },
  {
    id: 'data_analysis',
    label: 'Data & Analysis',
    description: 'Translate data into decisions, manage quality, and communicate findings.',
    icon: Database,
    color: '#14b8a6',
  },
];

export default function DomainSelectionScreen() {
  const { setScreen, setSelectedDomain, setUserProfile, userReputation } = useAppStore();
  const [selectedDomainId, setSelectedDomainId] = useState<SimDomain | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SimCompany | null>(null);
  const [step, setStep] = useState<'domain' | 'company'>('domain');

  // Get companies for selected domain
  const companiesForDomain = Object.entries(COMPANY_CATALOG)
    .filter(([id]) => COMPANY_DOMAIN_MAP[id] === selectedDomainId)
    .map(([, entry]) => entry.company);

  const handleDomainSelect = (domain: SimDomain) => {
    setSelectedDomainId(domain);
    setStep('company');
  };

  const handleCompanySelect = (company: SimCompany) => {
    setSelectedCompany(company);
  };

  const handleContinue = () => {
    if (!selectedDomainId || !selectedCompany) return;
    setSelectedDomain(selectedDomainId);
    setUserProfile({ chosenCompany: selectedCompany });
    setScreen('company-overview');
  };

  return (
    <div className="h-full bg-[#0a0a0f] text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold">
            {step === 'domain' ? 'Choose Your Domain' : 'Select a Company'}
          </h1>
          <p className="text-sm text-white/40 mt-2">
            {step === 'domain'
              ? 'Each domain offers unique challenges and skill development opportunities.'
              : `${companiesForDomain.length} companies available in ${DOMAINS.find(d => d.id === selectedDomainId)?.label ?? ''}`
            }
          </p>
          {userReputation && (
            <div className="flex items-center gap-2 mt-3">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-indigo-400">
                Reputation: {userReputation.tier} — {userReputation.totalSessions} sessions completed, avg score {userReputation.avgComposite}
              </span>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'domain' && (
            <motion.div
              key="domain-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {DOMAINS.map((domain, i) => {
                const companyCount = Object.values(COMPANY_DOMAIN_MAP).filter(d => d === domain.id).length;
                return (
                  <motion.button
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                    onClick={() => handleDomainSelect(domain.id)}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all text-left group"
                    style={{ '--accent': domain.color } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between">
                      <domain.icon className="w-8 h-8 mb-3" style={{ color: domain.color }} />
                      <span className="text-xs text-white/30">{companyCount} companies</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{domain.label}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{domain.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: domain.color }}>
                      <span>Explore companies</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.button>
                );
              })}

              {/* AI-Generated Scenario Option */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                className="col-span-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left group"
                onClick={() => {
                  // In production, this would trigger the Intelligence Engine
                  setSelectedDomain('pm');
                  setScreen('onboarding');
                }}
              >
                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-semibold">Generate a Custom Scenario</h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      The Intelligence Engine creates a unique scenario tailored to your profile, experience, and chosen domain. No two sessions are the same.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {step === 'company' && (
            <motion.div
              key="company-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setStep('domain')}
                className="text-xs text-white/40 hover:text-white/60 mb-4 flex items-center gap-1"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Back to domains
              </button>

              <div className="space-y-3">
                {companiesForDomain.map((company, i) => (
                  <motion.button
                    key={company.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
                    onClick={() => handleCompanySelect(company)}
                    className={`w-full bg-white/5 rounded-xl p-5 border transition-all text-left ${
                      selectedCompany?.id === company.id
                        ? 'border-indigo-500/50 bg-indigo-500/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-xs text-white/40">{company.industry} — {company.size}</p>
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <Star className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-3 leading-relaxed">{company.challenge}</p>
                  </motion.button>
                ))}
              </div>

              {/* Continue Button */}
              {selectedCompany && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleContinue}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 px-6 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Continue to {selectedCompany.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
