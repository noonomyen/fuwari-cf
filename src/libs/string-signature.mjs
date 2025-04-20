import { subtle } from "node:crypto";
import { TextEncoder } from "node:util";

const encoder = new TextEncoder();

/**
 * Generates an HMAC (Hash-based Message Authentication Code) signature for a given text using a specified key.
 *
 * @async
 * @param {string} text - The input text to be signed.
 * @param {string} key - The secret key used to generate the HMAC signature.
 * @returns {Promise<string>} A promise that resolves to the hexadecimal string representation of the HMAC signature.
 */
export default async function HMACStringSignature(text, key) {
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
