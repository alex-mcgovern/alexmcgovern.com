import { Main } from "boondoggle/main";
import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";
import { Icon } from "boondoggle/icon";
import { env } from "@/env.mjs";
import { Octokit } from "@octokit/core";
import { faCodeFork } from "@fortawesome/pro-solid-svg-icons/faCodeFork";
import { type components as GithubOpenApiComponents } from "@octokit/openapi-types";
import { repoCardCSS, repoCardLinkCSS } from "./styles.css";
import { formatDistance } from "date-fns";
import clsx from "clsx";
import { Loader } from "boondoggle/loader";
import { Suspense } from "react";
import { Skeleton } from "boondoggle/skeleton";

type Repo = GithubOpenApiComponents["schemas"]["repository"];
type Commit = GithubOpenApiComponents["schemas"]["commit"];

const PER_PAGE = 100;

const fetchCommits = async (
    repo: Repo,
    page: number = 1,
    allCommits: Commit[] = [],
): Promise<any[]> => {
    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: env.NEXT_PUBLIC_GITHUB_USERNAME,
        repo: repo.name,
        page: page,
        per_page: PER_PAGE,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    allCommits = [...allCommits, ...commits.data];

    // If the length of commits is equal to PER_PAGE, there might be more commits
    if (commits.data.length === PER_PAGE) {
        return fetchCommits(repo, page + 1, allCommits);
    }

    return allCommits;
};

const RepoCard = async ({ repo }: { repo: Repo }) => {
    const commits = await fetchCommits(repo);

    return (
        <a
            href={repo.html_url}
            className={clsx(repoCardCSS, repoCardLinkCSS)}
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

                {commits ? (
                    <>
                        <div>
                            {commits.length}{" "}
                            {commits.length > 1 ? "commits" : "commit"}
                        </div>
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

const LoadingCard = () => {
    return (
        <div className={clsx(repoCardCSS)}>
            <div
                className={css({
                    padding: "space_4",
                })}
            >
                <Skeleton
                    marginBottom="space_3"
                    height="space_4"
                    width="50%"
                />
                <Skeleton
                    marginBottom="space_1"
                    height="space_3"
                />
                <Skeleton
                    marginBottom="space_1"
                    height="space_3"
                />
                <Skeleton
                    marginBottom="space_1"
                    height="space_3"
                    __width="30%"
                />
            </div>

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
                <Skeleton
                    height="space_3"
                    __width="20%"
                />
                <div>•</div>
                <Skeleton
                    height="space_3"
                    __width="20%"
                />{" "}
                <div>•</div>
                <Skeleton
                    height="space_3"
                    __width="20%"
                />
            </Box>
        </div>
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
                    <Suspense
                        key={repo.id}
                        fallback={<LoadingCard key={repo.id} />}
                    >
                        <RepoCard
                            repo={repo as Repo}
                            key={repo.id}
                        />
                    </Suspense>
                ))}
            </Box>
        </Main>
    );
}
