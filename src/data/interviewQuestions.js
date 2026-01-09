// Interview questions tailored for entry-level candidates and fresh graduates
export const INTERVIEW_CATEGORIES = [
  {
    id: "about-you",
    title: "About You",
    icon: "user",
    color: "blue",
    description: "Personal introduction questions"
  },
  {
    id: "strengths-weaknesses",
    title: "Strengths & Weaknesses",
    icon: "scale",
    color: "purple",
    description: "Self-awareness questions"
  },
  {
    id: "behavioral",
    title: "Behavioral",
    icon: "chat",
    color: "green",
    description: "Past experience & situation handling"
  },
  {
    id: "motivation",
    title: "Motivation & Goals",
    icon: "target",
    color: "orange",
    description: "Career aspirations"
  },
  {
    id: "situational",
    title: "Situational",
    icon: "lightbulb",
    color: "pink",
    description: "How would you handle..."
  }
];

export const INTERVIEW_QUESTIONS = [
  // About You
  {
    id: 1,
    category: "about-you",
    question: "Tell me about yourself.",
    difficulty: "common",
    tips: [
      "Keep it professional and relevant to the job",
      "Structure: Present → Past → Future",
      "Aim for 1-2 minutes, not longer",
      "Focus on skills and achievements, not personal life"
    ],
    sampleAnswer: "I recently completed my [degree] from [college]. During my studies, I developed strong skills in [relevant skills]. I also completed an internship/project at [company/college] where I [achievement]. I'm excited about this opportunity because [connection to role]. I'm looking to grow my career in [field] and believe this position is a great fit for my goals.",
    doNot: [
      "Don't recite your entire resume",
      "Don't share too much personal information",
      "Don't speak for more than 2 minutes"
    ]
  },
  {
    id: 2,
    category: "about-you",
    question: "Why do you want to work here?",
    difficulty: "common",
    tips: [
      "Research the company beforehand",
      "Connect company values to your own",
      "Mention specific things that attracted you",
      "Show enthusiasm for the role"
    ],
    sampleAnswer: "I've researched [Company] and I'm impressed by [specific thing - mission, products, culture]. Your focus on [value/initiative] aligns with my own values. I believe my skills in [relevant skills] would contribute well to your team, and I'm excited about the opportunity to learn and grow here.",
    doNot: [
      "Don't say 'I need a job' or mention salary first",
      "Don't be generic - show you've done research",
      "Don't criticize your previous employer"
    ]
  },
  {
    id: 3,
    category: "about-you",
    question: "Walk me through your resume.",
    difficulty: "common",
    tips: [
      "Go chronologically or reverse-chronologically",
      "Highlight relevant experiences",
      "Connect each experience to the current role",
      "Be concise - hit the highlights"
    ],
    sampleAnswer: "I started with [education], where I focused on [relevant subjects]. Then I [internship/project experience], which taught me [skills]. Most recently, I [latest experience]. Throughout this journey, I've developed strong [skills relevant to job], which I'm excited to bring to this role.",
    doNot: [
      "Don't read your resume word-for-word",
      "Don't include irrelevant details",
      "Don't skip explaining gaps if any"
    ]
  },

  // Strengths & Weaknesses
  {
    id: 4,
    category: "strengths-weaknesses",
    question: "What are your greatest strengths?",
    difficulty: "common",
    tips: [
      "Choose strengths relevant to the job",
      "Give specific examples as proof",
      "Be confident but not arrogant",
      "Pick 2-3 strengths maximum"
    ],
    sampleAnswer: "My greatest strength is [strength 1]. For example, during [situation], I [specific action and result]. I'm also strong in [strength 2], which helped me [another example]. These strengths have helped me [positive outcome].",
    doNot: [
      "Don't be vague - always give examples",
      "Don't list too many strengths",
      "Don't mention irrelevant strengths"
    ]
  },
  {
    id: 5,
    category: "strengths-weaknesses",
    question: "What is your biggest weakness?",
    difficulty: "common",
    tips: [
      "Choose a real weakness (not a fake one)",
      "Show self-awareness",
      "Explain how you're working to improve",
      "Don't pick a critical job skill as weakness"
    ],
    sampleAnswer: "I used to struggle with [genuine weakness]. I realized this was holding me back when [situation]. Since then, I've been actively working on it by [specific improvement steps]. I've already seen progress - for example, [improvement example]. It's still something I'm conscious of, but I'm committed to continued growth.",
    doNot: [
      "Don't say 'I'm a perfectionist' or 'I work too hard'",
      "Don't mention a weakness critical to the job",
      "Don't say you have no weaknesses"
    ]
  },
  {
    id: 6,
    category: "strengths-weaknesses",
    question: "How do you handle criticism?",
    difficulty: "medium",
    tips: [
      "Show you're open to feedback",
      "Give an example of learning from criticism",
      "Demonstrate emotional maturity",
      "Focus on growth mindset"
    ],
    sampleAnswer: "I view criticism as an opportunity to improve. When I receive feedback, I listen carefully without getting defensive, ask clarifying questions if needed, and then work on implementing the suggestions. For example, [specific example of receiving and acting on feedback]. This helped me become better at [skill/area].",
    doNot: [
      "Don't say you've never been criticized",
      "Don't become defensive when answering",
      "Don't blame others in your example"
    ]
  },

  // Behavioral
  {
    id: 7,
    category: "behavioral",
    question: "Tell me about a time you worked in a team.",
    difficulty: "common",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on YOUR contribution",
      "Show collaboration skills",
      "Include the positive outcome"
    ],
    sampleAnswer: "During [project/situation], I worked with a team of [number] people on [task]. My responsibility was [your role]. We faced [challenge], and I contributed by [your specific actions]. As a result, we [positive outcome]. I learned [lesson about teamwork].",
    doNot: [
      "Don't take all the credit",
      "Don't speak negatively about teammates",
      "Don't give a vague answer without specifics"
    ]
  },
  {
    id: 8,
    category: "behavioral",
    question: "Describe a challenging situation and how you handled it.",
    difficulty: "medium",
    tips: [
      "Choose a professional challenge",
      "Show problem-solving skills",
      "Focus on your actions and decisions",
      "End with positive results and learnings"
    ],
    sampleAnswer: "In [situation], I faced [specific challenge]. Initially, I [initial reaction/assessment]. I then [steps you took to address it]. The result was [positive outcome]. This experience taught me [lesson learned] and I now [how you apply this learning].",
    doNot: [
      "Don't choose a trivial challenge",
      "Don't blame others for the situation",
      "Don't leave out the resolution"
    ]
  },
  {
    id: 9,
    category: "behavioral",
    question: "Give an example of when you showed leadership.",
    difficulty: "medium",
    tips: [
      "Leadership isn't just about titles",
      "Can be from college projects, volunteering, etc.",
      "Show initiative and influence",
      "Highlight the impact you made"
    ],
    sampleAnswer: "During [project/event], I took the initiative to [leadership action]. Even though I wasn't the official leader, I noticed [issue/opportunity] and decided to [action]. I [specific steps - organized, motivated, delegated]. This resulted in [positive outcome]. The experience showed me that leadership is about [your insight].",
    doNot: [
      "Don't say you've never led anything",
      "Don't confuse leadership with bossing people around",
      "Don't forget to mention the outcome"
    ]
  },

  // Motivation & Goals
  {
    id: 10,
    category: "motivation",
    question: "Where do you see yourself in 5 years?",
    difficulty: "common",
    tips: [
      "Show ambition but be realistic",
      "Align goals with the company's growth",
      "Focus on skills and responsibilities, not titles",
      "Show commitment to the field"
    ],
    sampleAnswer: "In 5 years, I see myself having grown significantly in [field/role]. I want to develop expertise in [specific skills] and take on more responsibilities. Ideally, I'd be [reasonable progression] and contributing to [larger goals]. I'm excited about growing with a company like this where I can learn and make an impact.",
    doNot: [
      "Don't say 'In your job' or 'Running this place'",
      "Don't mention plans to leave or start own business",
      "Don't be completely vague"
    ]
  },
  {
    id: 11,
    category: "motivation",
    question: "Why should we hire you?",
    difficulty: "common",
    tips: [
      "Summarize your key qualifications",
      "Connect your skills to their needs",
      "Show enthusiasm and cultural fit",
      "Be confident but not arrogant"
    ],
    sampleAnswer: "You should hire me because I bring [key qualification 1] and [key qualification 2] that directly match what you're looking for. My experience with [relevant experience] has prepared me well for this role. I'm also [positive trait - quick learner, adaptable, etc.] and genuinely excited about [aspect of job/company]. I'm confident I can contribute to your team from day one.",
    doNot: [
      "Don't be generic",
      "Don't undersell yourself",
      "Don't compare yourself to other candidates"
    ]
  },
  {
    id: 12,
    category: "motivation",
    question: "What motivates you?",
    difficulty: "medium",
    tips: [
      "Be honest and specific",
      "Connect motivation to the job",
      "Show intrinsic motivation",
      "Give examples"
    ],
    sampleAnswer: "I'm motivated by [genuine motivator - learning new things, solving problems, helping others, seeing results, etc.]. For example, in my previous [project/role], I was most energized when [specific example]. This role excites me because it offers [connection to your motivator]. I find that when I'm [doing motivating activity], I do my best work.",
    doNot: [
      "Don't just say 'money' or 'salary'",
      "Don't give generic answers like 'success'",
      "Don't be dishonest about what drives you"
    ]
  },

  // Situational
  {
    id: 13,
    category: "situational",
    question: "How would you handle a disagreement with a coworker?",
    difficulty: "medium",
    tips: [
      "Show maturity and professionalism",
      "Focus on resolution, not winning",
      "Emphasize communication",
      "Keep emotions in check"
    ],
    sampleAnswer: "If I disagreed with a coworker, I would first try to understand their perspective by listening carefully. I'd then share my viewpoint calmly and look for common ground. If we still disagreed, I'd suggest we focus on data or facts to make a decision, or involve a supervisor if needed. The goal is always finding the best solution for the team, not winning an argument.",
    doNot: [
      "Don't say you avoid conflict entirely",
      "Don't suggest escalating immediately",
      "Don't sound confrontational"
    ]
  },
  {
    id: 14,
    category: "situational",
    question: "What would you do if you made a mistake at work?",
    difficulty: "medium",
    tips: [
      "Show accountability",
      "Focus on fixing the problem",
      "Mention learning from mistakes",
      "Be honest and proactive"
    ],
    sampleAnswer: "If I made a mistake, I would first acknowledge it immediately rather than hiding it. I'd assess the impact and then inform my supervisor with both the problem and my proposed solution. I'd take responsibility, fix what I can, and most importantly, learn from it to prevent it from happening again. Mistakes are opportunities to improve, and honesty builds trust.",
    doNot: [
      "Don't say you don't make mistakes",
      "Don't suggest hiding mistakes",
      "Don't blame others or circumstances"
    ]
  },
  {
    id: 15,
    category: "situational",
    question: "How do you prioritize when you have multiple deadlines?",
    difficulty: "common",
    tips: [
      "Show organizational skills",
      "Mention specific methods/tools",
      "Talk about communication",
      "Be realistic about limitations"
    ],
    sampleAnswer: "When facing multiple deadlines, I first list all tasks and their deadlines. I prioritize based on urgency and importance - what's due soonest and what has the biggest impact. I break larger tasks into smaller steps and allocate time accordingly. If I realize I can't meet all deadlines, I communicate early with stakeholders to manage expectations or get help. I also use [tools - to-do lists, calendars, etc.] to stay organized.",
    doNot: [
      "Don't say you just work longer hours",
      "Don't seem disorganized",
      "Don't forget to mention communication"
    ]
  }
];

export const DIFFICULTY_LABELS = {
  common: { label: "Commonly Asked", color: "green" },
  medium: { label: "Moderate", color: "yellow" },
  hard: { label: "Challenging", color: "red" }
};
