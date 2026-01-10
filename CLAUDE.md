# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mission Possible - A career development platform with a guided resume builder. Built with React 19, Vite, and Tailwind CSS.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

### Tech Stack
- React 19.2 with React Router 7
- Vite 4.5 for bundling
- Tailwind CSS 3.4 for styling
- ESLint 9 with React hooks plugin

### Structure
```
src/
├── main.jsx          # Entry point, renders App with BrowserRouter
├── App.jsx           # Route definitions
├── pages/            # Full-page route components
│   ├── Home.jsx      # Landing page with feature cards
│   ├── Builder.jsx   # Resume builder (main feature, accordion form + live preview)
│   ├── InterviewCoach.jsx  # Placeholder
│   └── JobSkills.jsx       # Placeholder
└── components/       # Reusable form and display components
    ├── Question.jsx       # Text input with label
    ├── ExperienceStep.jsx # Conditional experience form
    ├── SkillsSelector.jsx # Multi-select skills checkboxes
    └── LivePreview.jsx    # Real-time resume preview
```

### Routes
- `/` - Home/landing page
- `/builder` - Resume builder
- `/interview-coach` - Coming soon placeholder
- `/job-skills` - Coming soon placeholder

### State Management
Builder.jsx uses local `useState` for form data. No global state library. Form components receive data via props with `onChange` callbacks.

### Styling
100% Tailwind utility classes. Custom fonts (Bricolage Grotesque, Inter, Outfit) loaded via HTML. Responsive grid layout (mobile-first).


