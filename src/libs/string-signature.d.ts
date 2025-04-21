/**
 * Generates an HMAC (Hash-based Message Authentication Code) signature for a given text using a specified key.
 *
 * @async
 * @param {string} text - The input text to be signed.
 * @param {string} key - The secret key used to generate the HMAC signature.
 * @param {SubtleCrypto} subtle - The SubtleCrypto interface for performing cryptographic operations.
 * @param {TextEncoder} encoder - The TextEncoder instance for encoding the text and key into Uint8Array.
 * @returns {Promise<string>} A promise that resolves to the hexadecimal string representation of the HMAC signature.
 */
export default function HMACStringSignature(
	text: string,
	key: string,
	subtle: SubtleCrypto,
	encoder: TextEncoder,
): Promise<string>;
