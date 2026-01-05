import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Resume Builder',
      description: 'Craft a modular, professional resume with our guided AI-powered builder.',
      path: '/builder',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
      shadow: 'hover:shadow-blue-500/20'
    },
    {
      title: 'Interview Coach',
      description: 'Ace your next big session with personalized AI feedback and mock scenarios.',
      path: '/interview-coach',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      color: 'bg-indigo-600',
      shadow: 'hover:shadow-indigo-500/20'
    },
    {
      title: 'Job Ready Skills',
      description: 'Bridge the gap between learning and earning with industry-vetted roadmaps.',
      path: '/job-skills',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-emerald-600',
      shadow: 'hover:shadow-emerald-500/20'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 selection:bg-blue-100">
      {/* Refined Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
        <header className="max-w-4xl mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700">Possible.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            A comprehensive ecosystem designed to transform your career path through data-driven resume building, AI interview coaching, and skill mastery.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className={`group flex flex-col bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition-all duration-500 ${feature.shadow} hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-${index * 150}`}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h2>

              <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                {feature.description}
              </p>

              <div className="flex items-center text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest leading-none">
                Begin Mission
                <svg className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Mission Possible. Built for the modern professional.
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-semibold">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
