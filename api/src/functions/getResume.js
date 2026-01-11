const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const { validateUser } = require("../../shared/auth");

app.http('getResume', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`[GetResume v4] Function starting. Node version: ${process.version}`);

        // 1. Validate Auth
        const user = await validateUser(context, request);
        if (!user) {
            return { status: 401, body: "Unauthorized" };
        }

        try {
            const connectionString = process.env.RESUME_STORAGE_CONNECTION_STRING;
            if (!connectionString) {
                throw new Error("RESUME_STORAGE_CONNECTION_STRING not configured");
            }

            const client = TableClient.fromConnectionString(connectionString, "Resumes");

            try {
                // Fetch main entity
                const mainResult = await client.getEntity(user.uid, "current");
                const resumeData = JSON.parse(mainResult.data);

                // Fetch photo if it exists
                if (mainResult.hasPhoto) {
                    try {
                        const photoResult = await client.getEntity(user.uid, "photo");

                        // Reassemble from chunks
                        if (photoResult.chunkCount) {
                            let photoData = "";
                            for (let i = 0; i < photoResult.chunkCount; i++) {
                                photoData += photoResult[`photo_${i}`] || "";
                            }
                            resumeData.photo = photoData;
                        } else if (photoResult.photoData) {
                            // Support legacy single-property photos if they exist (and somehow didn't crash)
                            resumeData.photo = photoResult.photoData;
                        }
                    } catch (photoErr) {
                        context.log.warn("Photo indicated but not found:", photoErr.message);
                    }
                }

                return {
                    status: 200,
                    jsonBody: resumeData
                };

            } catch (err) {
                if (err.statusCode === 404) {
                    return {
                        status: 200,
                        jsonBody: null
                    };
                }
                throw err;
            }

        } catch (error) {
            context.log.error("Error fetching resume:", error);
            return {
                status: 500,
                body: "Internal Server Error"
            };
        }
    }
});
