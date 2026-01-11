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

    try {
        if (!admin.apps.length) {
            context.log("⚠️ AUTH BYPASS: Firebase Admin not initialized (Missing Service Account). Using insecure decoding for DEV mode.");
            // Insecurely decode token to get UID for testing
            const parts = idToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                payload.uid = payload.uid || payload.sub || payload.user_id;
                return payload;
            }
            return { uid: "dev-user", email: "dev@example.com" };
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        context.log('Error verifying ID token:', error);
        return null;
    }
}

module.exports = { validateUser };
