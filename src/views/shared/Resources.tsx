import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookMarked, 
  ExternalLink, 
  ChevronRight, 
  FileText, 
  Book, 
  Lock,
  ArrowLeft,
  Search
} from 'lucide-react';

interface ResourcesProps {
  role: 'teacher' | 'student';
}

export default function Resources({ role }: ResourcesProps) {
  const [showNewNcert, setShowNewNcert] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const mainResources = [
    { 
      name: "NCERT books", 
      url: "https://ncert.nic.in/ebooks.php?ln=hi", 
      desc: "Official digital textbooks from NCERT.", 
      icon: "📚",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      name: "CBSE Resources", 
      url: "https://cbseacademic.nic.in/", 
      desc: "Academic guidelines and syllabus.", 
      icon: "🏫",
      color: "from-green-500 to-teal-500"
    }
  ];

  if (role === 'teacher') {
    mainResources.push({
      name: "Free Reference Hub",
      url: "https://www.selfstudys.com/", // A popular free reference site in India
      desc: "Reference books and notes digitsolly for free.",
      icon: "📔",
      color: "from-purple-500 to-pink-500"
    });
  }

  const handleComingSoon = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Digital Library</h1>
          <p className="text-slate-400">Curated resources for the Zēhn community.</p>
        </div>
        {!showNewNcert && (
          <div className="glass-light px-4 py-2 rounded-xl flex items-center gap-2 text-slate-400">
            <Search className="w-4 h-4" />
            <input placeholder="Search resources..." className="bg-transparent border-none outline-none text-sm" />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showNewNcert ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {mainResources.map((res) => (
              <a 
                key={res.name}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="group glass p-8 rounded-3xl hover:border-accent transition-all flex items-start gap-6 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${res.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity animate-pulse`} />
                <div className="text-5xl">{res.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {res.name}
                    <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-slate-400 text-sm">{res.desc}</p>
                </div>
              </a>
            ))}

            <button
              onClick={() => setShowNewNcert(true)}
              className="group glass p-8 rounded-3xl hover:border-orange-500 transition-all flex items-start gap-6 bg-gradient-to-br from-orange-500/10 to-transparent text-left"
            >
              <div className="text-5xl">🆕</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                  New NCERT
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-slate-400 text-sm">Access the latest 2026-27 curriculum books.</p>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="ncert"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setShowNewNcert(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Resources
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Kaveri', link: 'file:///C:/Users/dell/Downloads/2026-27%20NCERT%209%20Kaveri%20Full%20Book%20PDF%20(1).pdf' },
                { name: 'Ganga', link: null },
                { name: 'Science', link: null },
              ].map((book) => (
                <button
                  key={book.name}
                  onClick={book.link ? () => window.open(book.link, '_blank') : handleComingSoon}
                  className="glass p-10 rounded-3xl flex flex-col items-center gap-4 hover:border-accent group"
                >
                  <Book className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                  <span className="text-xl font-bold">{book.name}</span>
                  {book.link ? (
                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full">Available</span>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Coming Soon</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 glass p-4 rounded-2xl border-accent/50 text-accent font-bold z-50 shadow-2xl"
          >
            Coming Soon!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
