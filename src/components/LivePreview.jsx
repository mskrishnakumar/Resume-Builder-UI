import { forwardRef } from "react";
import { COLOR_SCHEMES } from "./ColorSchemeSelector";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Convert hex color to rgba with opacity (for PDF compatibility)
const hexToRgba = (hex, opacity) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const LivePreview = forwardRef(function LivePreview({ data }, ref) {
    const educations = Array.isArray(data.education) ? data.education : [];
    const experiences = data.experience?.experiences || [];

    // Get color scheme
    const colorScheme = COLOR_SCHEMES.find(s => s.id === data.colorScheme) || COLOR_SCHEMES[0];
    const primaryColor = colorScheme.primary;
    const accentColor = colorScheme.accent;

    // Pre-compute rgba colors for PDF compatibility
    const accentBgLight = hexToRgba(accentColor, 0.1);
    const accentBorderLight = hexToRgba(accentColor, 0.2);

    // A4 aspect ratio: 210mm x 297mm = 1:1.414
    return (
        <div className="sticky top-24">
            {/* Header Removed as per user request */}

            {/* A4 Paper Container Wrapper (UI Styling) */}
            <div
                className="mx-auto"
                style={{
                    maxWidth: "595px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    border: "1px solid #e5e7eb"
                }}
            >
                {/* Printable Content (Clean) */}
                <div
                    ref={ref}
                    className="bg-white font-resume"
                    style={{
                        width: "210mm",
                        height: "296mm", // Strictly slightly less than A4 height (297mm) to avoid spillage
                        padding: "40px 48px",
                        boxSizing: "border-box",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "optimizeLegibility",
                        overflow: "hidden",
                        backgroundColor: "white"
                    }}
                >
                    {/* Header */}
                    <div className="pb-6 mb-8" style={{ borderBottom: `2px solid ${primaryColor}` }}>
                        <div className="flex items-start gap-6">
                            {/* Photo */}
                            {data.photo ? (
                                <div className="flex-shrink-0">
                                    <img
                                        src={data.photo}
                                        alt="Profile"
                                        className="w-24 h-32 object-cover"
                                        style={{ border: `2px solid ${accentColor}` }}
                                    />
                                </div>
                            ) : null}

                            {/* Name and Contact */}
                            <div className={`flex-1 ${data.photo ? "text-left" : "text-center"}`}>
                                <h1
                                    className="text-4xl font-bold tracking-wide uppercase mb-2"
                                    style={{ color: primaryColor }}
                                >
                                    {data.name || "Your Name"}
                                </h1>
                                <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 ${data.photo ? "justify-start" : "justify-center"}`}>
                                    {data.email && <span>{data.email}</span>}
                                    {data.email && (data.phone || data.location) && <span>•</span>}
                                    {data.phone && <span>{data.phone}</span>}
                                    {data.phone && data.location && <span>•</span>}
                                    {data.location && <span>{data.location}</span>}
                                </div>
                                {data.jobTarget && (
                                    <div className="mt-4 text-gray-500 italic">
                                        Targeting: {data.jobTarget}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">

                        {/* Education */}
                        <div className="space-y-3">
                            <h2
                                className="text-sm font-bold uppercase tracking-widest pb-1"
                                style={{ color: primaryColor, borderBottom: `1px solid ${accentBorderLight}` }}
                            >
                                Education
                            </h2>
                            {educations.length > 0 ? (
                                <div className="space-y-4">
                                    {educations.map((edu, index) => (
                                        <div key={edu.id || index}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {edu.qualification || "Your Qualification"}
                                                        {edu.specialization && (
                                                            <span className="font-normal text-gray-600"> in {edu.specialization}</span>
                                                        )}
                                                    </div>
                                                    {edu.institution && (
                                                        <p className="text-gray-600">
                                                            {edu.institution}
                                                        </p>
                                                    )}
                                                </div>
                                                {edu.year && (
                                                    <span className="text-sm text-gray-500">
                                                        {edu.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No education added yet...</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <h2
                                className="text-sm font-bold uppercase tracking-widest pb-1"
                                style={{ color: primaryColor, borderBottom: `1px solid ${accentBorderLight}` }}
                            >
                                Skills
                            </h2>
                            {data.skills && data.skills.length > 0 ? (
                                <div className="text-gray-700 leading-relaxed font-medium">
                                    {data.skills.join(" • ")}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No skills selected yet...</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="space-y-3">
                            <h2
                                className="text-sm font-bold uppercase tracking-widest pb-1"
                                style={{ color: primaryColor, borderBottom: `1px solid ${accentBorderLight}` }}
                            >
                                Experience
                            </h2>
                            {data.experience?.hasExperience && experiences.length > 0 ? (
                                <div className="space-y-6">
                                    {experiences.map((exp, index) => (
                                        <div key={exp.id || index}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {exp.role || "Job Title"}
                                                    </h3>
                                                    {exp.company && (
                                                        <p style={{ color: accentColor }}>
                                                            {exp.company}
                                                        </p>
                                                    )}
                                                </div>
                                                {(exp.startDate || exp.endDate) && (
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(exp.startDate)}
                                                        {exp.startDate && " - "}
                                                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                                                    </span>
                                                )}
                                            </div>
                                            {exp.details && (
                                                <p className="text-gray-700 mt-2 leading-relaxed">
                                                    {exp.details}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">Fresh graduate / No prior experience</p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="space-y-3">
                            <h2
                                className="text-sm font-bold uppercase tracking-widest pb-1"
                                style={{ color: primaryColor, borderBottom: `1px solid ${accentBorderLight}` }}
                            >
                                Languages Known
                            </h2>
                            {data.languages && data.languages.length > 0 ? (
                                <div className="text-gray-700 leading-relaxed font-medium">
                                    {data.languages.join(" • ")}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No languages selected yet...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default LivePreview;
