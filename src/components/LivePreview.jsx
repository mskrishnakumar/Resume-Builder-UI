export default function LivePreview({ data }) {
    return (
        <div className="bg-white shadow-2xl rounded-sm w-full min-h-[800px] p-8 md:p-12 border border-gray-200 sticky top-8">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-wide uppercase mb-2">
                    {data.name || "Your Name"}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-medium">
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

            {/* Sections */}
            <div className="space-y-8">

                {/* Education */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
                        Education
                    </h2>
                    <div className="text-gray-800 font-serif">
                        {data.education || "Your University or School"}
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
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
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
                        Experience
                    </h2>
                    {data.experience?.hasExperience ? (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {data.experience.role || "Job Title"}
                            </h3>
                            <p className="text-gray-700 mt-2 leading-relaxed">
                                {data.experience.details || "Description of your responsibilities and achievements..."}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Fresh graduate / No prior experience</p>
                    )}
                </div>
            </div>
        </div>
    );
}
