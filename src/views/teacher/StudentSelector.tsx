import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, RotateCcw, UserCircle, Edit3, Check } from 'lucide-react';

export default function StudentSelector() {
  const [students, setStudents] = useState(['Student A', 'Student B', 'Student C', 'Student D']);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSelect = () => {
    setIsSpinning(true);
    setSelectedIdx(null);
    
    // Animation effect
    let count = 0;
    const interval = setInterval(() => {
      setSelectedIdx(Math.floor(Math.random() * students.length));
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const updateStudentName = (idx: number, name: string) => {
    const newStudents = [...students];
    newStudents[idx] = name;
    setStudents(newStudents);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-[#f0f2ff] text-[#1a237e] border border-[#e9ecef]">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1a237e] uppercase tracking-tight">Student Selector</h1>
          <p className="text-[#636e72] font-bold text-xs uppercase tracking-widest">Automatically select a student for asking questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {students.map((name, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: selectedIdx === idx ? 1.05 : 1,
              backgroundColor: selectedIdx === idx ? '#f0f2ff' : '#ffffff',
              borderColor: selectedIdx === idx ? '#1a237e' : '#e9ecef'
            }}
            className="p-6 rounded-2xl border flex flex-col items-center gap-4 group relative overflow-hidden shadow-sm"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedIdx === idx ? 'bg-[#1a237e] text-white' : 'bg-[#f8f9fa] text-[#1a237e] border border-[#dee2e6]'}`}>
              <UserCircle className="w-8 h-8" />
            </div>

            {editingIndex === idx ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  value={name}
                  onChange={(e) => updateStudentName(idx, e.target.value)}
                  onBlur={() => setEditingIndex(null)}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  className="bg-[#ffffff] border-2 border-[#1a237e] rounded-lg px-2 py-1 text-sm text-center outline-none w-full font-black text-[#1a237e]"
                />
                <button onClick={() => setEditingIndex(null)}><Check className="w-5 h-5 text-green-600" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span 
                  onClick={() => setEditingIndex(idx)}
                  className="font-extrabold text-[#1a1a1a] text-base cursor-pointer hover:text-[#1a237e] transition-colors"
                >
                  {name}
                </span>
                <button 
                  onClick={() => setEditingIndex(idx)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-[#636e72] hover:text-[#1a237e] transition-opacity"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {selectedIdx === idx && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 bg-[#00b8d4] rounded-full p-1 border-2 border-white shadow-sm"
              >
                <Check className="w-4 h-4 text-white font-black" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSelect}
        disabled={isSpinning}
        className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:opacity-90 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg uppercase tracking-widest shadow-lg transition-all disabled:opacity-50"
      >
        <RotateCcw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? 'Selecting...' : 'Select Student'}
      </button>

      {selectedIdx !== null && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-[#f0f2ff] border border-[#1a237e]/20 rounded-2xl"
        >
          <p className="text-[#1a237e] text-[10px] uppercase tracking-widest font-black mb-1">Selected Student</p>
          <h3 className="text-3xl font-black text-[#1a237e] uppercase">{students[selectedIdx]}</h3>
          <p className="text-[#636e72] font-bold text-xs mt-2 uppercase">Ready to answer your question!</p>
        </motion.div>
      )}
    </div>
  );
}
