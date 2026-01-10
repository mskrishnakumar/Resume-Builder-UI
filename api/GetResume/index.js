// CRITICAL: Crypto Polyfill for Azure Functions (to fix @azure/data-tables failure)
const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
}
if (typeof global.crypto === 'undefined') {
    global.crypto = globalThis.crypto;
}
if (globalThis.crypto && !globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = nodeCrypto.randomUUID;
}

const { TableClient } = require("@azure/data-tables");
const { validateUser } = require("../shared/auth");

module.exports = async function (context, req) {
    context.log(`[GetResume] Function starting. Node version: ${process.version}`);

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
            const mainResult = await client.getEntity(user.uid, "current");
            const resumeData = JSON.parse(mainResult.data);

            // Fetch photo if it exists
            if (mainResult.hasPhoto) {
                try {
                    const photoResult = await client.getEntity(user.uid, "photo");
                    resumeData.photo = photoResult.photoData;
                } catch (photoErr) {
                    context.log.warn("Photo indicated but not found:", photoErr.message);
                }
            }

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
