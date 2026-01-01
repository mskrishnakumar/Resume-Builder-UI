module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const formData = req.body;

    if (!formData) {
        context.res = {
            status: 400,
            body: "Please pass resume data in the request body"
        };
        return;
    }

    // In a real scenario, we might generate a PDF here or format HTML.
    // For now, let's return a structured response that the frontend can display/print.

    // Simple logic to format a "story" from the inputs
    const summary = `Driven professional with skills in ${formData.skills?.join(', ') || 'various areas'}.`;

    const resumeData = {
        ...formData,
        generatedSummary: summary,
        generatedAt: new Date().toISOString()
    };

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            message: "Resume generated successfully",
            resume: resumeData
        }
    };
}
