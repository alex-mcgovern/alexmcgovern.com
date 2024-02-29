import { Main } from "boondoggle/main";
import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";
import { Icon } from "boondoggle/icon";
import { env } from "@/env.mjs";
import { Octokit } from "@octokit/core";
import { faCodeFork } from "@fortawesome/pro-solid-svg-icons/faCodeFork";
import { type components as GithubOpenApiComponents } from "@octokit/openapi-types";
import { repoCardCSS } from "./styles.css";
import { formatDistance } from "date-fns";

type Repo = GithubOpenApiComponents["schemas"]["repository"];

const RepoCard = async ({ repo }: { repo: Repo }) => {
    return (
        <a
            href={repo.html_url}
            className={repoCardCSS}
            key={repo.id}
        >
            <div
                className={css({
                    padding: "space_4",
                })}
            >
                <Box
                    className={css({
                        alignItems: "center",
                        display: "flex",
                        gap: "space_1",
                        fontStyle: "bodyMd",
                    })}
                >
                    <h3
                        className={css({
                            fontStyle: "bodyMd",
                        })}
                    >
                        {repo.name}
                    </h3>
                </Box>
                <p
                    className={css({
                        fontStyle: "bodySm",
                    })}
                >
                    {repo.description}
                </p>
            </div>

            {/* Card footer */}

            <Box
                className={css({
                    borderTop: "border_rule",
                    color: "text_low_contrast",
                    fontStyle: "bodySm",
                    padding: "space_4",
                    marginTop: "auto",
                    alignItems: "center",
                    display: "flex",
                    gap: "space_1",
                })}
            >
                {repo.language ? (
                    <>
                        <div>{repo.language}</div>
                        <div>•</div>
                    </>
                ) : null}

                {repo.created_at ? (
                    <div>
                        Created{" "}
                        {formatDistance(new Date(repo.created_at), new Date(), {
                            addSuffix: true,
                        })}
                    </div>
                ) : null}

                {repo.fork === true ? (
                    <Icon
                        className={css({
                            color: "text_low_contrast",
                            marginLeft: "auto",
                        })}
                        icon={faCodeFork}
                    />
                ) : null}
            </Box>
        </a>
    );
};

const octokit = new Octokit({
    auth: env.GITHUB_PAT,
});

export default async function Page() {
    const data = await octokit.request("GET /users/{username}/repos", {
        username: env.NEXT_PUBLIC_GITHUB_USERNAME,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
        sort: "created",
        type: "all",
    });

    return (
        <Main
            size="md"
            className={css({
                marginX: "auto",
                paddingY: "space_8",
            })}
        >
            <h1 className={css({ fontStyle: "h3" })}>Alex McGovern</h1>
            <h2 className={css({ fontStyle: "bodyMd", fontWeight: "normal" })}>
                {"Coder / software engineer based in London."}
            </h2>
            <p>
                {
                    "I've been working with JavaScript, TypeScript, and React for the past few years, focusing mainly on frontend."
                }
            </p>
            <p>
                {
                    "Since 2024, I've been learning Rust and been assisting with backend in my role at Fuse Financial Technologies."
                }
            </p>
            <p>
                {
                    "I've also tried my hand at a few other callings, including graphic design and music production."
                }
            </p>

            <hr />

            <h3 className={css({ fontStyle: "h5" })}>Github repos</h3>
            <p>{"See what I've been working on."}</p>

            <Box
                display="grid"
                gridTemplateColumns={{
                    desktop: "3x",
                    tablet: "2x",
                    mobile: "1x",
                }}
                gap="space_2"
            >
                {data.data.map((repo) => (
                    <RepoCard
                        repo={repo as Repo}
                        key={repo.id}
                    />
                ))}
            </Box>
        </Main>
    );
}
