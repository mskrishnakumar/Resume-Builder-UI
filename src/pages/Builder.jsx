import { useState } from "react";
import Question from "../components/Question";
import SkillsSelector from "../components/SkillsSelector";
import ExperienceStep from "../components/ExperienceStep";

const steps = [
  { type: "text", key: "name", label: "What is your full name?" },
  { type: "text", key: "phone", label: "Your phone number" },
  { type: "text", key: "location", label: "City & state" },
  { type: "text", key: "education", label: "Highest qualification" },
  { type: "skills", key: "skills" },
  { type: "experience", key: "experience" },
  { type: "text", key: "jobTarget", label: "Job you are applying for" },
  { type: "review" }
];

export default function Builder() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    skills: [],
    experience: {}
  });

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-1">
          Guided Resume Builder
        </h1>

        <p className="text-sm text-gray-500 text-center mb-2">
          Step {step + 1} of {steps.length}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* STEP CONTENT */}
        {current.type === "text" && (
          <Question
            label={current.label}
            value={formData[current.key] || ""}
            onChange={(v) =>
              setFormData({ ...formData, [current.key]: v })
            }
          />
        )}

        {current.type === "skills" && (
          <SkillsSelector
            value={formData.skills}
            onChange={(skills) =>
              setFormData({ ...formData, skills })
            }
          />
        )}

        {current.type === "experience" && (
          <ExperienceStep
            value={formData.experience}
            onChange={(experience) =>
              setFormData({ ...formData, experience })
            }
          />
        )}

        {current.type === "review" && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Review your details</h2>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <button className="w-full mt-4 bg-green-600 text-white py-2 rounded">
              Generate Resume
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        {current.type !== "review" && (
          <div className="flex justify-between mt-6">
            <button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Back
            </button>

            <button
              onClick={next}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
