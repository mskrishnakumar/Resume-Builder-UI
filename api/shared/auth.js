const admin = require('firebase-admin');

// Prevent multiple initializations
if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : null;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT not found. Auth verification will fail.");
            // Initialize with default strategy (might work if running on GCP/Azure with managed identity linked, unlikely here)
            // admin.initializeApp(); 
        }
    } catch (e) {
        console.error("Failed to initialize Firebase Admin:", e);
    }
}

/**
 * Validates the Firebase ID Token from the Authorization header.
 * @param {Object} context - Azure Function context
 * @param {Object} req - Azure Function request
 * @returns {Object|null} - Decoded token object or null if invalid
 */
async function validateUser(context, req) {
    // Use custom header to avoid Azure SWA intercepting Authorization header
    const idToken = req.headers.get ? req.headers.get('x-firebase-token') : req.headers['x-firebase-token'];
    if (!idToken) {
        context.log('No X-Firebase-Token header found');
        return null;
    }

    // Diagnostic logging - remove after debugging
    let debugInfo = {};
    try {
        const parts = idToken.split('.');
        debugInfo.tokenParts = parts.length;
        if (parts.length === 3) {
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            debugInfo.header = header;
            debugInfo.aud = payload.aud;
            const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
                ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
                : null;
            debugInfo.serviceAccountProject = serviceAccount?.project_id;
            context.log('DEBUG INFO:', JSON.stringify(debugInfo));
        }
    } catch (debugErr) {
        debugInfo.parseError = debugErr.message;
        context.log('Debug token parsing failed:', debugErr.message);
    }

    try {
        if (!admin.apps.length) {
            context.log("⚠️ AUTH BYPASS: Firebase Admin not initialized (Missing Service Account). Using insecure decoding for DEV mode.");
            // Insecurely decode token to get UID for testing
            const parts = idToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                // Firebase ID tokens use 'sub' or 'user_id' as the UID
                payload.uid = payload.uid || payload.sub || payload.user_id;
                return payload;
            }
            return { uid: "dev-user", email: "dev@example.com" };
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        context.log('Error verifying ID token:', error);
        // Return debug info with the error for troubleshooting
        return { _authError: true, debugInfo, errorMessage: error.message };
    }
}

module.exports = { validateUser };
