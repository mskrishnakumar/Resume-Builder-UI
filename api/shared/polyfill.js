// Comprehensive polyfill for crypto in Azure Functions / Node environment
const crypto = require('crypto');

// Ensure crypto is available globally as both 'crypto' and 'globalThis.crypto'
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = crypto.webcrypto || crypto;
}

if (typeof global === 'object' && typeof global.crypto === 'undefined') {
    global.crypto = globalThis.crypto;
}

// Some libraries check for specific methods on the crypto object
if (globalThis.crypto && !globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = crypto.randomUUID;
}

console.log(`[Polyfill] Crypto initialized. Node version: ${process.version}`);
