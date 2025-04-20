/*
  This is the file that is invoked by `src/plugins/rehype-component-github-card.mjs`
  via `spawnSync` during the build process. The reason for this approach is explained in that file.
*/

import { argv, exit, stdout } from "node:process";
import { config } from "dotenv";

import HMACStringSignature from "../src/libs/string-signature.mjs";

if (config().error) {
  config({ path: ".dev.vars" });
}

const text = argv[2];
const key = process.env.SECRET_GITHUB_API_CACHE_SIG_KEY;

if (!key || !text) {
  console.error("Usage: node string-sign.js <text>");
  console.error(
    "Ensure SECRET_GITHUB_API_CACHE_SIG_KEY is set in your .env or .dev.vars file."
  );
  exit(1);
}

const signature = await HMACStringSignature(text, key);
stdout.write(signature);
