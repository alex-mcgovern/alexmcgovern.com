import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import "./env.mjs";

const withVanillaExtract = createVanillaExtractPlugin({
    identifiers: "short",
    outputCss: true,
});

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withVanillaExtract(nextConfig);
