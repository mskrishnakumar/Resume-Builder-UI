import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, signOut, isAuthenticated, refreshUser } = useAuth();
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with name
        if (fullName) {
          await updateProfile(userCredential.user, {
            displayName: fullName
          });
          // Force context to update with new display name
          refreshUser();
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowLoginPanel(false);
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = 'Failed to authenticate. Please try again.';
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Auth Bar */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-500 hidden md:inline">
                Signed in as <span className="font-bold text-slate-900">{user?.displayName || user?.email}</span>
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setShowLoginPanel(true);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setShowLoginPanel(true);
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Header with enhanced content */}
        <header className="max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700">Possible.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-8">
            Empowering Indian Youth with employability opportunities — <span className="font-semibold text-slate-800">completely free.</span>
          </p>

        </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className={`group flex flex-col bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition-all duration-500 ${feature.shadow} hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700`}
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

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100">
            <p className="text-3xl font-black text-slate-900 mb-1">100%</p>
            <p className="text-sm text-slate-500 font-medium">Free Forever</p>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100">
            <p className="text-3xl font-black text-slate-900 mb-1">AI</p>
            <p className="text-sm text-slate-500 font-medium">Powered Tools</p>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100">
            <p className="text-3xl font-black text-slate-900 mb-1">🇮🇳</p>
            <p className="text-sm text-slate-500 font-medium">Made for India</p>
          </div>
        </div>

        {/* Panel Footer (Main Page) */}
        <footer className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Mission Possible. Built by volunteers for Indian youth.
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-semibold">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>

      {/* Login Side Panel */}
      {showLoginPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowLoginPanel(false)}
          ></div>

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col p-8">
              {/* Close Button */}
              <button
                onClick={() => setShowLoginPanel(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Panel Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-500">
                  {isSignUp ? 'Join Mission Possible today' : 'Sign in to access your dashboard'}
                </p>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name Field (Sign Up Only) */}
                {isSignUp && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password || (isSignUp && !fullName)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </span>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Toggle Sign Up / Sign In */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-sm text-slate-600 mb-2">
                  {isSignUp ? 'Already have an account?' : "First time user?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wide"
                >
                  {isSignUp ? 'Sign In Instead' : 'Create New Account'}
                </button>
              </div>

              {/* Panel Footer */}
              <div className="mt-auto pt-8 border-t border-slate-100">

                <p className="text-xs text-slate-400 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
