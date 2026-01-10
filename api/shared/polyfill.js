// Polyfill for Node.js environments where globalThis.crypto is not defined
// Required for @azure/data-tables in Node.js 18
if (typeof globalThis.crypto === 'undefined') {
    const crypto = require('crypto');
    // Use webcrypto if available (Node 15+), otherwise fallback to crypto
    globalThis.crypto = crypto.webcrypto || crypto;
}
