import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Play, BookOpen, ShieldAlert, Database, Code, ShieldCheck, Cpu, ArrowLeft, Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ZONES_CONTENT } from './data/analogies';
import { QuizEngine } from './components/QuizEngine';
import { BadgeToast } from './components/BadgeToast';
import { useQuestStore } from './store/useQuestStore';

// Mock Data for the Zones
const ZONES = [
  {
    id: 'manual',
    title: 'Manual Testing',
    icon: <ShieldAlert size={32} className="text-orange-400" />,
    description: 'Explore the foundations of breaking things before the users do.',
    progress: 100, // 100% means mastered
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badge: 'The Detective',
    colorText: 'text-orange-400'
  },
  {
    id: 'sql',
    title: 'SQL Sorcery',
    icon: <Database size={32} className="text-blue-400" />,
    description: 'Master the art of demanding data from the kitchen without crashing the server.',
    progress: 33,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badge: 'Data Whisperer',
    colorText: 'text-blue-400'
  },
  {
    id: 'api',
    title: 'API Testing',
    icon: <Cpu size={32} className="text-purple-400" />,
    description: 'The invisible glue. Order unicorns from waiters and handle 404s with grace.',
    progress: 0,
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badge: 'The Postman',
    colorText: 'text-purple-400'
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    icon: <Code size={32} className="text-sky-400" />,
    description: 'JavaScript with an overly protective mother. Learn to build Tupperware for your code.',
    progress: 0,
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badge: 'Type Guardian',
    colorText: 'text-sky-400'
  },
  {
    id: 'playwright',
    title: 'Playwright',
    icon: <Play size={32} className="text-emerald-400" />,
    description: 'Give the hitman a precise description, not just "the guy in the shirt".',
    progress: 66,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Grandmaster Automaton',
    colorText: 'text-emerald-400'
  },
  {
    id: 'ai-qa',
    title: 'AI for QA',
    icon: <ShieldCheck size={32} className="text-rose-400" />,
    description: 'Talk to literal-minded genies and build self-healing zombie scripts.',
    progress: 0,
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badge: 'Cyborg Tester',
    colorText: 'text-rose-400'
  }
];

function HubMap() {
  const navigate = useNavigate();
  const zoneProgress = useQuestStore((state) => state.zoneProgress);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent flex items-center gap-3">
          <BookOpen size={40} className="text-emerald-400" />
          QA Quest: The Knowledge Hub
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Choose a realm to explore or complete quests to earn your mastery badges.</p>
      </header>

      {/* Quest Board */}
      <section className="mb-12 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-amber-400">⚔️</span> Daily Bounties
          </h2>
          <p className="text-slate-400 mt-1">Read 1 new TypeScript article today for +50 XP.</p>
        </div>
        <button className="px-6 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg hover:bg-amber-500/30 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          Claim Bounty
        </button>
      </section>

      {/* The Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ZONES.map((zone, i) => {
          const progress = zoneProgress[zone.id] || 0;
          const isMastered = progress >= 100;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={zone.id}
              onClick={() => navigate(`/zone/${zone.id}`)}
              className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${zone.bgColor} ${isMastered ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]' : zone.borderColor + ' hover:border-slate-500'}`}
            >
              {isMastered && (
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                  ⭐ {zone.badge}
                </div>
              )}
              
              {/* Fog of war overlay if 0% */}
              {progress === 0 && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-0 transition-opacity group-hover:opacity-0" />
              )}
              
              <div className="p-6 relative z-10">
                <div className="w-16 h-16 rounded-xl bg-slate-900 shadow-xl border border-slate-700/50 flex items-center justify-center mb-6">
                  {zone.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{zone.title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed h-10">{zone.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-400">Map Explored</span>
                      <span className={isMastered ? 'text-amber-400' : 'text-slate-300'}>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isMastered ? 'bg-amber-400' : 'bg-indigo-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <button className="font-bold text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition">
                    Enter
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}

// The Library & Arena
function ZoneView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState<'library' | 'arena'>('library');
  const [level, setLevel] = useState<string>('');
  
  const zoneMeta = ZONES.find(z => z.id === id);
  const contentData = ZONES_CONTENT[id || ''];

  React.useEffect(() => {
    if (contentData && contentData.levels.length > 0 && !contentData.levels.find(l => l.id === level)) {
      setLevel(contentData.levels[0].id);
    }
  }, [contentData, level]);

  if (!zoneMeta) return <div className="p-8 text-white">Zone not found</div>;

  const currentContent = contentData?.levels.find(l => l.id === level);

  const availableLevels = contentData?.levels.map(l => l.id) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            {zoneMeta.icon}
            <h1 className="text-xl font-bold text-white">{zoneMeta.title}</h1>
          </div>
        </div>
        
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button 
            onClick={() => setMode('library')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition ${mode === 'library' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen size={16} /> The Library
          </button>
          <button 
            onClick={() => setMode('arena')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition ${mode === 'arena' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Swords size={16} /> The Arena
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 flex gap-8">
        
        {/* Left Sidebar: Level Selection */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-2">
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-4">Select Module</h3>
            {availableLevels.map((lvl) => {
              const levelMeta = contentData?.levels.find(l => l.id === lvl);
              // Extract the short title (e.g., "Module 1" or "Basic") for the sidebar
              const shortTitle = levelMeta?.title.split(':')[0] || lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    level === lvl 
                      ? `bg-slate-800 border-slate-600 ${zoneMeta.colorText}` 
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold capitalize">{shortTitle}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          {mode === 'library' ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={`library-${level}`}>
              {currentContent ? (
                <>
                  <div className="prose prose-invert prose-indigo max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl border border-slate-700"
                              {...props}
                            />
                          ) : (
                            <code className="bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {currentContent.lessonMarkdown}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-12 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                      <span>💡</span> The Core Analogy Summary
                    </h4>
                    <p className="text-lg text-slate-300 italic leading-relaxed">
                      "{currentContent.analogy}"
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-slate-500 py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                  Content for this level is being scribed by the Quality Oracle...
                </div>
              )}
            </motion.div>
          ) : (
            <QuizEngine 
              zoneId={zoneMeta.id} 
              level={level} 
              onComplete={() => setMode('library')} 
            />
          )}

        </main>
      </div>
    </div>
  )
}

export default function App() {
  const badgesMap = ZONES.reduce((acc, zone) => {
    acc[zone.id] = zone.badge;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Router>
      <BadgeToast badgesMap={badgesMap} />
      <Routes>
        <Route path="/" element={<HubMap />} />
        <Route path="/zone/:id" element={<ZoneView />} />
      </Routes>
    </Router>
  );
}
