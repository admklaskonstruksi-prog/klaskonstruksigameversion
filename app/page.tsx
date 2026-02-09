'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Layers, Trophy, Users, Briefcase, Zap, Flame, Star, Quote
} from "lucide-react";

export default function Home() {
  return (
    // PERBAIKAN DISINI:
    // Kita paksa "bg-[#0a0505]" (Hitam Merah) dan "text-white" HANYA di halaman ini.
    // Halaman lain (Dashboard) akan mengikuti globals.css (Putih/Hitam).
    <div className="min-h-screen font-sans selection:bg-red-500 selection:text-white overflow-hidden bg-[#0a0505] text-white">
      
      {/* === HEADER IMAGE SECTION === */}
      <header className="relative w-full h-[850px]">
        
        {/* CONTAINER GAMBAR */}
        <div className="absolute inset-0 h-full w-full z-0 overflow-hidden">
            <Image 
            src="/header-bg-new.png" 
            alt="Header Background" 
            fill
            className="object-cover object-right scale-125 -translate-y-32 opacity-90"
            priority
            />
            
            {/* Overlay Merah Gelap */}
            <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply"></div>

            {/* Fade Out Bawah */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0a0505] via-[#0a0505]/80 to-transparent z-10"></div>
        </div>


        {/* --- NAVBAR --- */}
        <nav className="absolute top-0 w-full z-50 pt-6">
          <div className="max-w-7xl mx-auto px-6 h-40 flex items-center justify-between">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer -ml-4">
              <div className="relative w-[40rem] h-32"> 
                <Image 
                  src="/logo.png" 
                  alt="KlasKonstruksi Logo" 
                  fill
                  className="object-contain object-left drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                  priority
                />
              </div>
            </Link>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-10 font-bold text-sm uppercase tracking-widest text-white mt-4">
              {['Home', 'Courses', 'Testimonials'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-orange-400 transition relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4 font-bold uppercase tracking-wider text-sm mt-4 text-white">
              <Link href="/login" className="hidden md:block px-6 py-3 hover:text-orange-400 transition font-bold">
                Log In
              </Link>
              <Link href="/register" className="relative group scale-110 ml-4">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 blur opacity-70 group-hover:opacity-100 transition duration-200 rounded-xl"></div>
                <button className="relative px-8 py-4 bg-[#1a0505] text-white leading-none flex items-center rounded-xl border border-red-500/50 hover:bg-red-950 transition shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                   <Zap className="w-5 h-5 mr-2 text-orange-500 animate-bounce" /> JOIN
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* --- HERO CONTENT --- */}
        <div className="absolute inset-0 flex items-center z-20 pt-20">
           <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 w-full">
              
              <div className="text-left relative z-30">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/50 border border-red-500/30 backdrop-blur-md text-orange-300 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>PROJECT: IGNITE V.1</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8 drop-shadow-[0_5px_30px_rgba(220,38,38,0.6)]">
                    BUILD YOUR <br />
                    <span className="text-anime-gradient text-7xl md:text-9xl">
                      LEGACY.
                    </span>
                  </h1>
                  
                  <p className="text-xl text-red-100/90 max-w-xl leading-relaxed mb-12 font-medium p-6 backdrop-blur-md rounded-2xl border border-red-500/20 bg-[#1a0505]/60 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]">
                    LMS Konstruksi pertama dengan gaya <strong className="text-orange-400">RPG Anime</strong>. Tingkatkan level karaktermu dari Pemula hingga Project Manager.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-start">
                    <Link href="/register" className="group relative inline-block focus:outline-none focus:ring scale-110 hover:scale-125 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition animate-pulse"></div>
                      <span className="relative inline-block border-2 border-red-400/50 px-12 py-6 text-lg font-black uppercase tracking-widest text-white bg-[#2c0b0e] rounded-lg group-hover:bg-red-600 group-hover:border-red-600 transition-colors flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                        Start Your Journey <ArrowRight className="w-6 h-6 inline ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
              </div>
              <div></div>
           </div>
        </div>
      </header>
      
      {/* === CURRICULUM SECTION === */}
      <section id="courses" className="py-32 relative z-20">
        <div className="absolute inset-0 bg-cyber-grid-subtle opacity-20"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
             <span className="text-orange-500 font-mono uppercase tracking-[0.3em] text-sm mb-4 block font-bold glow-text-red">
               [ MISSION_DATA // LOADED ]
             </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-orange-200 to-red-200 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              SKILL TREE PATH
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            <div className="hidden lg:block absolute top-[45%] left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent -z-10 border-b border-dashed border-red-500/40"></div>

            <LevelCard level="01" title="Novice" desc="Basic Blueprint" icon={<Layers className="w-6 h-6" />} theme="red" />
            <LevelCard level="02" title="Operator" desc="AutoCAD Mastery" icon={<Zap className="w-6 h-6" />} theme="orange" />
            <LevelCard level="03" title="Supervisor" desc="QA/QC Field" icon={<Users className="w-6 h-6" />} theme="yellow" />
            <LevelCard level="04" title="ENGINEER" desc="Structure Analysis" icon={<Briefcase className="w-7 h-7" />} theme="pro-orange" isPro={true} />
            <LevelCard level="05" title="MASTER" desc="Project Lead" icon={<Trophy className="w-7 h-7" />} theme="pro-red" isPro={true} />
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS SECTION === */}
      <section id="testimonials" className="py-32 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 relative">
             <h2 className="text-4xl md:text-5xl font-black uppercase inline-block relative z-10 leading-tight">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Fighter's Hall of Fame</span>
             </h2>
             <div className="absolute inset-0 blur-2xl bg-red-500/10 -z-10 scale-150"></div>
             <p className="text-red-200/60 mt-4 font-mono uppercase tracking-widest">What others are saying</p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-40 relative overflow-hidden z-30">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(220,38,38,0.6)] leading-none">
            READY TO <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">IGNITE?</span>
          </h2>
          <p className="text-red-100/90 text-2xl mb-16 max-w-3xl mx-auto font-bold uppercase tracking-wide bg-red-950/30 p-4 border-x-4 border-red-500/50">
            Join Hundreds of Fighter's on This Construction Journey
          </p>
          <Link href="/register" className="group relative inline-block focus:outline-none focus:ring scale-125 hover:scale-150 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-xl blur-xl opacity-80 group-hover:opacity-100 transition animate-pulse"></div>
              <span className="relative inline-block border-4 border-red-400/80 px-16 py-6 text-3xl font-black uppercase tracking-[0.15em] text-white bg-[#2c0b0e] rounded-xl group-hover:bg-red-700 transition-colors shadow-[inset_0_0_30px_rgba(220,38,38,0.5)] flex items-center gap-4">
                <Flame className="w-8 h-8 animate-bounce" /> START YOUR OWN
              </span>
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-[#1a0505]/90 backdrop-blur-md border-t border-red-500/30 font-mono text-xs uppercase tracking-widest text-red-300/50 relative z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="relative w-12 h-12 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition drop-shadow-[0_0_5px_red]">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
             </div>
            <span className="text-red-400 font-bold text-sm">KlasKonstruksi Systems</span>
          </div>
          <div className="flex gap-10 font-bold">
            <Link href="#" className="hover:text-orange-400 transition">Privacy</Link>
            <Link href="#" className="hover:text-orange-400 transition">Terms</Link>
            <Link href="#" className="hover:text-orange-400 transition">Support</Link>
          </div>
          <p>© 2026 KK Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ... (Bagian TestimonialSlider dan LevelCard tetap sama, tidak perlu diubah karena sudah menggunakan class Tailwind lokal yang benar)
function TestimonialSlider() {
  const testimonials = [
    { id: 1, name: "Alex R.", role: "Level 3 Supervisor", quote: "The RPG style made learning RAB actually fun. I leveled up my real-world skills faster than I expected. The missions are addictive!", rating: 5 },
    { id: 2, name: "Sarah K.", role: "Level 4 Engineer", quote: "Finally, a system that understands Gen Z. The simulation modules felt like playing a strategy game, but for real construction projects.", rating: 5 },
    { id: 3, name: "Dimas P.", role: "Level 2 Operator", quote: "From novice to understanding complex structures. The skill tree path is brilliant and keeps you motivated to grind for the next level.", rating: 5 },
    { id: 4, name: "Nadia T.", role: "Level 5 Master", quote: "The blockchain certificates helped me land a major project role. This isn't just a course, it's career acceleration with serious style.", rating: 5 },
    { id: 5, name: "Ryan G.", role: "Level 1 Novice", quote: "Just started my journey. The interface is insane! It doesn't feel like studying at all. Can't wait to unlock the next tier.", rating: 5 },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px]">
      <div className="relative h-full overflow-hidden rounded-3xl border-2 border-red-500/30 bg-red-950/20 backdrop-blur-xl shadow-[0_0_40px_rgba(220,38,38,0.2)] p-8 md:p-12 flex items-center justify-center">
         <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid-subtle opacity-10"></div>
         <Quote className="absolute top-8 left-8 w-16 h-16 text-red-500/20 transform -scale-x-100" />
         <Quote className="absolute bottom-8 right-8 w-16 h-16 text-red-500/20" />

        {testimonials.map((item, index) => (
          <div 
            key={item.id}
            className={`absolute inset-0 p-8 md:p-16 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out transform
              ${index === current ? 'opacity-100 translate-x-0 scale-100' : 
                index < current ? 'opacity-0 -translate-x-full scale-90' : 'opacity-0 translate-x-full scale-90'
              }
            `}
          >
            <div className="flex gap-1 mb-6">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-pulse" />
              ))}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-100 leading-relaxed mb-8 italic">
              "{item.quote}"
            </p>
            <div>
              <h4 className="text-xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{item.name}</h4>
              <p className="text-red-300/70 font-mono text-sm uppercase tracking-wider">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all duration-300 ${current === index ? 'w-12 bg-orange-500 shadow-[0_0_10px_orange]' : 'w-3 bg-red-900/50 hover:bg-red-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

function LevelCard({ level, title, desc, icon, theme, isPro = false }: any) {
  const themes: any = {
    red:    { bg: 'bg-red-950/30', border: 'border-red-500/30', text: 'text-red-400', glow: 'group-hover:shadow-red-500/30', hoverBg: 'group-hover:bg-red-950/50' },
    orange: { bg: 'bg-orange-950/30', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'group-hover:shadow-orange-500/30', hoverBg: 'group-hover:bg-orange-950/50' },
    yellow: { bg: 'bg-yellow-950/30', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'group-hover:shadow-yellow-500/30', hoverBg: 'group-hover:bg-yellow-950/50' },
    'pro-orange': { bg: 'bg-orange-900/40', border: 'border-orange-400/50', text: 'text-orange-300', glow: 'shadow-orange-500/40 group-hover:shadow-orange-400/60', hoverBg: 'group-hover:bg-orange-900/60' },
    'pro-red':  { bg: 'bg-red-900/50',  border: 'border-red-500/60',  text: 'text-red-300',  glow: 'shadow-red-500/50 group-hover:shadow-red-500/70',  hoverBg: 'group-hover:bg-red-900/70' },
  };
  const t = themes[theme] || themes.red;

  return (
    <div className={`${t.bg} backdrop-blur-md border ${t.border} p-6 flex flex-col justify-between h-[340px] transition-all duration-500 cursor-default group relative overflow-hidden rounded-3xl hover:scale-105 hover:-translate-y-2 shadow-lg ${t.glow} ${t.hoverBg}`}>
      
      <div className="flex justify-between items-start relative z-10 mb-4">
        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] font-bold ${isPro ? t.text + ' animate-pulse' : 'text-red-300/50'}`}>
          LVL_{level}
        </span>
        <div className={`p-2.5 rounded-xl bg-[#1a0505]/50 border border-white/10 text-white transform group-hover:rotate-12 transition duration-500 ${isPro ? 'drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' : ''} ${t.text}`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <h3 className={`font-black text-2xl uppercase mb-2 ${isPro ? 'text-white drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'text-red-100'}`}>
          {title}
        </h3>
        <div className={`h-1 w-12 mb-3 rounded-full bg-gradient-to-r from-current to-transparent ${t.text} opacity-50`}></div>
        <p className="text-sm opacity-80 font-medium leading-relaxed text-red-200/70">
          {desc}
        </p>
      </div>

      <span className={`absolute -bottom-8 -right-2 font-black text-[12rem] opacity-[0.05] group-hover:opacity-[0.1] transition select-none leading-none ${t.text}`}>
        {level}
      </span>
    </div>
  )
}