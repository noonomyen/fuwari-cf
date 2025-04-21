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
export default async function HMACStringSignature(text, key, subtle, encoder) {
	const ckey = await subtle.importKey(
		"raw",
		encoder.encode(key),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);

	const sigBuffer = await subtle.sign("HMAC", ckey, encoder.encode(text));
	const signature = Array.from(new Uint8Array(sigBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return signature;
}
