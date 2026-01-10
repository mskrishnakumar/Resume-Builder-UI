const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { validateUser } = require("../shared/auth");

module.exports = async function (context, req) {
    context.log('SaveResume function processing a request.');

    // 1. Validate Auth
    const user = await validateUser(context, req);
    if (!user) {
        context.res = {
            status: 401,
            body: "Unauthorized"
        };
        return;
    }

    // 2. Parse Body
    const resumeData = req.body;
    if (!resumeData) {
        context.res = {
            status: 400,
            body: "No resume data provided"
        };
        return;
    }

    // 3. Save to Azure Table Storage
    try {
        const connectionString = process.env.RESUME_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("RESUME_STORAGE_CONNECTION_STRING connection string not configured");
        }

        const client = TableClient.fromConnectionString(connectionString, "Resumes");

        // Gracefully handle table creation
        try {
            await client.createTable();
        } catch (err) {
            if (err.statusCode !== 409) {
                context.log.error("Failed to create/check table:", err);
            }
        }

        const entity = {
            partitionKey: user.uid,
            rowKey: "current",
            data: JSON.stringify(resumeData),
            updatedAt: new Date().toISOString(),
            userEmail: user.email,
            userName: user.name || user.email // Fallback to email if name empty
        };

        context.log(`Attempting to save entity for ${user.email} (UID: ${user.uid})...`);
        await client.upsertEntity(entity, "Replace");
        context.log(`SUCCESS: Resume saved for ${user.email} at ${entity.updatedAt}`);

        context.res = {
            status: 200,
            body: { message: "Resume saved successfully" }
        };
    } catch (error) {
        context.log.error("Error saving resume:", error);
        context.res = {
            status: 500,
            body: {
                error: "Internal Server Error",
                message: error.message,
                hint: !process.env.RESUME_STORAGE_CONNECTION_STRING ? "Missing RESUME_STORAGE_CONNECTION_STRING" : "Check Azure Table Storage permissions"
            }
        };
    }
};
