import { z } from "zod";

const server = z.object({
    GITHUB_PAT: z.string(),
});

const client = z.object({
    NEXT_PUBLIC_GITHUB_USERNAME: z.string(),
});

/**
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
    GITHUB_PAT: process.env.GITHUB_PAT,
    NEXT_PUBLIC_GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
};

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

const SKIP =
    !!process.env.SKIP_ENV_VALIDATION &&
    process.env.SKIP_ENV_VALIDATION !== "false" &&
    process.env.SKIP_ENV_VALIDATION !== "0";

if (!SKIP) {
    const is_server = typeof window === "undefined";

    const parsed = /** @type {MergedSafeParseReturn} */ (
        is_server ? merged.safeParse(processEnv) : client.safeParse(processEnv)
    );

    if (parsed.success === false) {
        console.error(
            "❌ Invalid environment variables:",
            parsed.error.flatten().fieldErrors,
        );
        throw new Error("Invalid environment variables");
    }

    env = new Proxy(parsed.data, {
        get(target, prop) {
            if (typeof prop !== "string") {
                return undefined;
            }

            if (!is_server && !prop.startsWith("NEXT_PUBLIC_")) {
                throw new Error(
                    process.env.NODE_ENV === "production"
                        ? "❌ Attempted to access a server-side environment variable on the client"
                        : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
                );
            }
            return target[/** @type {keyof typeof target} */ (prop)];
        },
    });
}

export { env };
