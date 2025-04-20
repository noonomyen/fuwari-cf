/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type CFResponse = import("@cloudflare/workers-types").Response;

declare namespace App {
	interface Locals extends Runtime {}
}
