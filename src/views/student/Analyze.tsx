import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, Camera, FileText, Upload, RotateCcw, Copy } from 'lucide-react';
import { getGeminiResponse, prompts } from '../../lib/geminiService';
import ReactMarkdown from 'react-markdown';

export default function Analyze({ userClass }: { userClass: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    const mockContext = "Analyzing the provided academic document for performance patterns...";
    const res = await getGeminiResponse(mockContext, prompts.analyzer, userClass);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#f0f2ff] flex items-center justify-center border border-[#e9ecef] shadow-sm">
          <FileSearch className="w-6 h-6 text-[#1a237e]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#1a237e] uppercase tracking-tight">Analyze Performance</h1>
          <p className="text-[#636e72] text-[11px] font-bold uppercase tracking-widest">Identify weak areas and get a personalized improvement plan.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-xl border-dashed border-2 border-[#dee2e6] flex flex-col items-center justify-center gap-6 text-center hover:border-[#1a237e] transition-all group">
        <div className="w-20 h-20 bg-[#f8f9fa] border border-[#e9ecef] rounded-full flex items-center justify-center shadow-inner group-hover:bg-[#f0f2ff] transition-colors">
          <Upload className="w-10 h-10 text-[#3949ab]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#1a237e] uppercase tracking-tight mb-2">Upload Test/Quiz Paper</h2>
          <p className="text-[#636e72] text-[11px] font-bold uppercase tracking-widest max-w-xs mx-auto">Upload a photo or PDF for deep AI analysis.</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer bg-[#f8f9fa] border border-[#dee2e6] hover:bg-[#f1f3f5] px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-[#636e72] flex items-center gap-2 transition-all">
            <Camera className="w-4 h-4" /> Camera
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <label className="cursor-pointer bg-[#f8f9fa] border border-[#dee2e6] hover:bg-[#f1f3f5] px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-[#636e72] flex items-center gap-2 transition-all">
            <FileText className="w-4 h-4" /> Document
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        {file && (
          <div className="flex items-center gap-2 text-[#2b8a3e] bg-[#ebfbee] border border-[#c3fae8] px-4 py-2 rounded-lg text-xs font-bold shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <FileText className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !file}
        className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:opacity-90 text-white font-black py-5 rounded-xl shadow-md transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
      >
        {loading ? <RotateCcw className="w-6 h-6 animate-spin mx-auto text-[#00b8d4]" /> : 'Analyze Performance'}
      </button>

      {response && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl border border-[#e9ecef] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1a237e]" />
          <button 
            onClick={() => navigator.clipboard.writeText(response)}
            className="absolute top-4 right-4 p-2 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-[#636e72] hover:text-[#1a237e] transition-all shadow-sm"
          >
            <Copy className="w-4 h-4" />
          </button>
          <div className="markdown-body prose max-w-none text-[#1a1a1a] prose-headings:text-[#1a237e] prose-headings:font-black prose-p:font-medium prose-p:text-sm">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
