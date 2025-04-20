/**
 * Generates an HMAC (Hash-based Message Authentication Code) signature for a given text using a specified key.
 *
 * @async
 * @param {string} text - The input text to be signed.
 * @param {string} key - The secret key used to generate the HMAC signature.
 * @returns {Promise<string>} A promise that resolves to the hexadecimal string representation of the HMAC signature.
 */
export default function HMACStringSignature(
	text: string,
	key: string,
): Promise<string>;
