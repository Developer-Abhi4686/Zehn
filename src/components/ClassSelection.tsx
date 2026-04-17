import React, { useState } from 'react';
import { motion } from 'motion/react';
import { School, ChevronRight } from 'lucide-react';

import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ClassSelectionProps {
  onClassSelect: (selectedClass: string) => void;
}

const CLASSES = [
  'Nursery', 'LKG', 'UKG', 
  'I', 'II', 'III', 'IV', 'V', 
  'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
];

export default function ClassSelection({ onClassSelect }: ClassSelectionProps) {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setLoading(true);
      try {
        if (auth.currentUser) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            userClass: selected
          });
        }
        onClassSelect(selected);
      } catch (error) {
        console.error('Error updating class:', error);
        onClassSelect(selected); // fallback to guest mode behavior
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4 font-['Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1a237e] rounded-xl flex items-center justify-center shadow-md">
              <School className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-[#1a237e] uppercase tracking-tight mb-2">
            Welcome to Zēhn
          </h1>
          <h2 className="text-[#636e72] font-semibold text-xs uppercase tracking-widest px-4">
            St Michael's School, Bhind &bull; Academic Portal
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-xl border border-[#dee2e6] shadow-lg"
        >
          <h3 className="text-lg font-bold mb-6 text-[#1a237e]">Select Your Grade</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-[10px] font-black text-[#636e72] uppercase tracking-[0.2em] pl-1">
                Academic Class
              </label>
              <div className="relative">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-[#dee2e6] rounded-lg p-4 text-[#1a1a1a] focus:border-[#1a237e] outline-none font-bold appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Choose your class...</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-5 h-5 text-[#636e72] rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selected || loading}
              className="w-full bg-gradient-to-r from-[#1a237e] to-[#303f9f] hover:opacity-95 text-white font-black py-4 rounded-lg transition-all text-xs tracking-[0.2em] shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  CONTINUE TO DASHBOARD
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <footer className="mt-12 text-[#636e72] text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-widest px-4 leading-relaxed">
          <p>Zēhn designed for St. MIchael's By Abhi Sharma(9-d)</p>
        </footer>
      </div>
    </div>
  );
}
