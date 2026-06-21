'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="border-b border-border/50 last:border-0">
      <button onClick={onToggle} className="flex items-center justify-between w-full py-4 text-left group">
        <span className="font-medium text-sm md:text-base pr-4 group-hover:text-cyan-400 transition-colors">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    { q: 'Where does the data come from?', a: 'All stock data is sourced from Yahoo Finance API through a server-side proxy to handle CORS and caching.' },
    { q: 'How often is the data updated?', a: 'Data is automatically refreshed every 60 seconds. You can also manually refresh using the refresh button.' },
    { q: 'Is the data real-time?', a: 'The data is near real-time with a 15-20 minute delay typical of free Yahoo Finance data.' },
    { q: 'Can I use this for trading?', a: 'This dashboard is for educational purposes only. Always verify data with your broker before trading.' },
    { q: 'Is my data saved?', a: 'Only your theme and language preferences are saved locally. No personal or financial data is stored.' },
  ];

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold">FAQ</h2>
      </div>
      <div>
        {faqItems.map((item, index) => (
          <FAQItem key={index} question={item.q} answer={item.a} isOpen={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} index={index} />
        ))}
      </div>
    </GlassCard>
  );
}
