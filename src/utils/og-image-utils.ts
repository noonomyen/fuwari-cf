import { getImage } from "astro:assets";
import path from "node:path";
import { url } from "./url-utils";

const files = import.meta.glob<ImageMetadata>("../**", {
	import: "default",
});

function isLocalImage(src: string): boolean {
	return !(
		src.startsWith("/") ||
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("data:")
	);
}

export async function getOgImageUrl(
	src?: string,
	basePath = "",
): Promise<string | undefined> {
	if (!src || src.trim() === "") {
		return undefined;
	}

	if (
		src.startsWith("http://") ||
		src.startsWith("https://") ||
		src.startsWith("data:")
	) {
		return src;
	}

	if (src.startsWith("/")) {
		return url(src);
	}

	if (!isLocalImage(src)) {
		return undefined;
	}

	const normalizedPath = path
		.normalize(path.join("..", basePath, src))
		.replace(/\\/g, "/");
	const file = files[normalizedPath];

	if (!file) {
		console.error(
			`\n[ERROR] OG image file not found: ${normalizedPath.replace("../", "src/")}`,
		);
		return undefined;
	}

	const image = await file();
	const optimized = await getImage({
		src: image,
		format: "webp",
	});

	return optimized.src;
}
