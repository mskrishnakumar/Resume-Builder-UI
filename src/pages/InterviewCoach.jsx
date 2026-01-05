import React from 'react';
import { Link } from 'react-router-dom';

const InterviewCoach = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-2xl w-full">
                <div className="text-6xl mb-6">🎙️</div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Interview Coach</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    Master your interview techniques with AI-powered feedback and real-world mock scenarios.
                    Coming soon to help you ace your next big opportunity!
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Missions
                </Link>
            </div>
        </div>
    );
};

export default InterviewCoach;
