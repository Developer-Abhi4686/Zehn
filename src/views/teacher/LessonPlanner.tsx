import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MonitorPlay, Send, Copy, RotateCcw } from 'lucide-react';
import { getGeminiResponse, prompts } from '../../lib/geminiService';
import ReactMarkdown from 'react-markdown';
import SaveButton from '../../components/SaveButton';

export default function LessonPlanner({ userClass }: { userClass: string | null }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const res = await getGeminiResponse(`Generate a lesson plan for: ${topic}`, prompts.lessonPlanner, userClass);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#f0f2ff] flex items-center justify-center border border-[#e9ecef] shadow-sm">
          <MonitorPlay className="w-6 h-6 text-[#1a237e]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#1a237e] uppercase tracking-tight">Lesson Planner</h1>
          <p className="text-[#636e72] text-[11px] font-bold uppercase tracking-widest">Design engaging and structured lessons.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#636e72] pl-1">Topic or Subject Area</label>
          <textarea 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis in plants..." 
            rows={3}
            className="w-full bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4 text-[#1a1a1a] focus:border-[#1a237e] outline-none font-bold placeholder:font-normal resize-none"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:opacity-90 py-4 rounded-lg flex items-center justify-center gap-2 font-black text-xs uppercase tracking-[0.2em] text-white transition-all disabled:opacity-50 shadow-md"
        >
          {loading ? <RotateCcw className="w-4 h-4 animate-spin text-[#00b8d4]" /> : <> <Send className="w-4 h-4 text-[#00b8d4]" /> Generate Lesson Plan </>}
        </button>
      </div>

      {response && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl border border-[#e9ecef] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1a237e]" />
          <div className="absolute top-4 right-4 flex gap-2">
            <SaveButton 
              type="lesson-plan" 
              title={`Lesson Plan: ${topic.slice(0, 30)}${topic.length > 30 ? '...' : ''}`} 
              content={response} 
            />
            <button 
              onClick={() => navigator.clipboard.writeText(response)}
              className="p-2 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-[#636e72] hover:text-[#1a237e] transition-all shadow-sm"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="markdown-body prose max-w-none text-[#1a1a1a] prose-headings:text-[#1a237e] prose-headings:font-black prose-p:font-medium prose-p:text-sm">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
