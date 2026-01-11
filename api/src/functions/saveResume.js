const { app, TableClient, AzureNamedKeyCredential } = require("@azure/functions");
const { TableClient: AzureTableClient } = require("@azure/data-tables");
const { validateUser } = require("../../shared/auth");

// CRITICAL: Azure Table Storage property limit is 64KB. 
// Photos are stored as base64 and can easily exceed this.
// We split the photo into multiple properties: photo_0, photo_1... each 32KB.
const MAX_PROPERTY_SIZE = 32000;

function chunkString(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }
    return chunks;
}

app.http('saveResume', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`[SaveResume v4] Function starting. Node version: ${process.version}`);

        // 1. Validate Auth
        const user = await validateUser(context, request);
        if (!user || user._authError) {
            return {
                status: 401,
                jsonBody: {
                    error: "Unauthorized",
                    debug: user?._authError ? user : null
                }
            };
        }

        // 2. Parse Body
        const resumeData = await request.json();
        if (!resumeData) {
            return { status: 400, body: "No resume data provided" };
        }

        try {
            const connectionString = process.env.RESUME_STORAGE_CONNECTION_STRING;
            if (!connectionString) {
                throw new Error("RESUME_STORAGE_CONNECTION_STRING not configured");
            }

            const client = AzureTableClient.fromConnectionString(connectionString, "Resumes");

            // Ensure table exists
            try {
                await client.createTable();
            } catch (err) {
                if (err.statusCode !== 409) context.log("Table check/create failed:", err);
            }

            // 3. Handle photo chunking
            const photo = resumeData.photo;
            const cleanResumeData = { ...resumeData };
            delete cleanResumeData.photo;

            const mainEntity = {
                partitionKey: user.uid,
                rowKey: "current",
                data: JSON.stringify(cleanResumeData),
                updatedAt: new Date().toISOString(),
                userEmail: user.email,
                userName: user.name || user.email,
                hasPhoto: !!photo
            };

            context.log(`Saving main resume for ${user.email}...`);
            await client.upsertEntity(mainEntity, "Replace");

            if (photo) {
                context.log(`Saving chunked photo for ${user.email} (Length: ${photo.length})...`);
                const chunks = chunkString(photo, MAX_PROPERTY_SIZE);

                const photoEntity = {
                    partitionKey: user.uid,
                    rowKey: "photo",
                    updatedAt: new Date().toISOString(),
                    chunkCount: chunks.length
                };

                // Add chunks as properties
                chunks.forEach((chunk, index) => {
                    photoEntity[`photo_${index}`] = chunk;
                });

                await client.upsertEntity(photoEntity, "Replace");
            }

            return {
                status: 200,
                jsonBody: { message: "Resume saved successfully" }
            };

        } catch (error) {
            context.log("Error saving resume:", error);
            return {
                status: 500,
                jsonBody: {
                    error: "Internal Server Error",
                    message: error.message
                }
            };
        }
    }
});
