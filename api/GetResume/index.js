const { TableClient } = require("@azure/data-tables");
const { validateUser } = require("../shared/auth");

module.exports = async function (context, req) {
    context.log('GetResume function processing a request.');

    // 1. Validate Auth
    const user = await validateUser(context, req);
    if (!user) {
        context.res = {
            status: 401,
            body: "Unauthorized"
        };
        return;
    }

    // 2. Fetch from Azure Table Storage
    try {
        const connectionString = process.env.RESUME_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("RESUME_STORAGE_CONNECTION_STRING connection string not configured");
        }

        const client = TableClient.fromConnectionString(connectionString, "Resumes");

        // Use try-catch for getEntity in case it doesn't exist (404)
        try {
            const result = await client.getEntity(user.uid, "current");

            // Allow frontend to handle parsing, or parse here. 
            // Since we stored stringified JSON, we can return it.
            // But usually APIs return JSON objects.
            const resumeData = JSON.parse(result.data);

            context.res = {
                status: 200,
                body: resumeData
            };
        } catch (err) {
            if (err.statusCode === 404) {
                context.res = {
                    status: 200,
                    body: null // Return null if no resume ever saved
                };
            } else {
                throw err;
            }
        }
    } catch (error) {
        context.log.error("Error fetching resume:", error);
        context.res = {
            status: 500,
            body: "Internal Server Error"
        };
    }
};
