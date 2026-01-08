import { forwardRef } from "react";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const LivePreview = forwardRef(function LivePreview({ data }, ref) {
    const educations = Array.isArray(data.education) ? data.education : [];
    const experiences = data.experience?.experiences || [];

    return (
        <div ref={ref} className="bg-white shadow-2xl rounded-sm w-full min-h-[800px] p-8 md:p-12 border border-gray-200 sticky top-24 font-resume">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-8">
                <div className="flex items-start gap-6">
                    {/* Photo */}
                    {data.photo ? (
                        <div className="flex-shrink-0">
                            <img
                                src={data.photo}
                                alt="Profile"
                                className="w-24 h-32 object-cover border-2 border-gray-300"
                            />
                        </div>
                    ) : null}

                    {/* Name and Contact */}
                    <div className={`flex-1 ${data.photo ? "text-left" : "text-center"}`}>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-wide uppercase mb-2">
                            {data.name || "Your Name"}
                        </h1>
                        <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${data.photo ? "justify-start" : "justify-center"}`}>
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
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1">
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
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1">
                        Skills
                    </h2>
                    {data.skills && data.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 px-2 py-1 text-sm text-gray-700 rounded">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No skills selected yet...</p>
                    )}
                </div>

                {/* Experience */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1">
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
                                                <p className="text-gray-600">
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
            </div>
        </div>
    );
});

export default LivePreview;
