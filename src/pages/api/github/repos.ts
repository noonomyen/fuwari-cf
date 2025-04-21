export const prerender = false;

import type { APIRoute } from "astro";

import isGithubRepo from "@/libs/is-github-repo";
import HMACStringSignature from "@/libs/string-signature";

const encoder = new TextEncoder();

export const GET: APIRoute = async (context) => {
	const runtime = context.locals.runtime;

	if (
		!runtime.env.SECRET_GITHUB_API_CACHE_PAT ||
		!runtime.env.SECRET_GITHUB_API_CACHE_SIG_KEY ||
		!runtime.env.KV_GITHUB_API_CACHE
	) {
		return new Response(null, { status: 503 });
	}

	const url = new URL(context.request.url);
	const repository = url.searchParams.get("repo");
	const signature = url.searchParams.get("sig");

	if (
		!repository ||
		!signature ||
		url.searchParams.size !== 2 ||
		!isGithubRepo(repository)
	) {
		return new Response(null, { status: 400 });
	}

	if (
		(await HMACStringSignature(
			repository,
			runtime.env.SECRET_GITHUB_API_CACHE_SIG_KEY,
			crypto.subtle,
			encoder,
		)) !== signature
	) {
		return new Response(null, { status: 403 });
	}

	const endpoint = `https://api.github.com/repos/${repository}`;

	const cacheResponse = await runtime.caches.default.match(endpoint);

	if (cacheResponse) {
		console.info("[/api/github/repos] Found in Cache");

		return cacheResponse as unknown as Response;
	}

	console.info("[/api/github/repos] Not in Cache, trying to fetch from KV");

	const kvCacheResponse = await runtime.env.KV_GITHUB_API_CACHE.get(
		repository,
		"text",
	);

	if (kvCacheResponse) {
		console.info("[/api/github/repos] Found in KV");
		console.info("[/api/github/repos] Caching response from KV");

		const response = new Response(kvCacheResponse, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
				"Access-Control-Max-Age": "3600",
			},
		});

		runtime.ctx.waitUntil(
			runtime.caches.default.put(
				endpoint,
				response.clone() as unknown as CFResponse,
			),
		);

		return response as unknown as Response;
	}

	console.info("[/api/github/repos] Not in KV, fetching from origin");

	const githubResponse = await fetch(endpoint, {
		headers: {
			Authorization: `Bearer ${runtime.env.SECRET_GITHUB_API_CACHE_PAT}`,
			Accept: "application/vnd.github+json",
			"User-Agent": "fetch",
		},
	});

	if (!githubResponse.ok) {
		console.error(
			`[/api/github/repos] Failed to fetch from origin, Status: ${githubResponse.status}`,
		);

		return new Response(null, { status: 503 });
	}

	const timestamp = (new Date().getTime() / 1000) | 0;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const obj_data: { [key: string]: any } = await githubResponse.json();
	const { permissions, ...filteredData } = obj_data;

	filteredData._fetched_at = timestamp;
	const str_data = JSON.stringify(filteredData);

	console.info("[/api/github/repos] Storing response from origin into KV");

	runtime.env.KV_GITHUB_API_CACHE.put(repository, str_data, {
		expiration: timestamp + 3600,
	});

	console.info("[/api/github/repos] Caching response from origin");

	const response = new Response(str_data, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
			"Access-Control-Max-Age": "3600",
		},
	});

	runtime.ctx.waitUntil(
		runtime.caches.default.put(
			endpoint,
			response.clone() as unknown as CFResponse,
		),
	);

	return response as unknown as Response;
};
