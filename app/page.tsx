import { Main } from "boondoggle/main";
import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";
import { env } from "@/env.mjs";
import { Octokit } from "@octokit/core";
import { Suspense } from "react";
import { LoadingCard, Repo, RepoCard } from "@/lib/repo/index";
import { BlogCard } from "@/lib/blog";

export const runtime = "edge";

const octokit = new Octokit({
    auth: env.GITHUB_PAT,
});

export default async function Page() {
    const repos = await octokit.request("GET /users/{username}/repos", {
        username: env.NEXT_PUBLIC_GITHUB_USERNAME,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
        sort: "created",
        type: "all",
    });

    const blogPosts = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
            owner: env.NEXT_PUBLIC_GITHUB_USERNAME,
            repo: "blog-posts",
            path: "md",
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        },
    );

    return (
        <>
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

            <h3 className={css({ fontStyle: "h5" })}>Blog posts</h3>

            <Box
                display="grid"
                gridTemplateColumns={{
                    desktop: "3x",
                    tablet: "2x",
                    mobile: "1x",
                }}
                gap="space_2"
            >
                {Array.isArray(blogPosts.data) &&
                    blogPosts.data.every((blog) => blog.type === "file") &&
                    blogPosts.data.map((blog) => (
                        <Suspense
                            key={blog.name}
                            fallback={<LoadingCard key={blog.name} />}
                        >
                            <a href={`blog/${blog.name}`}>
                                <div>{blog.name}</div>
                                <div>{blog.download_url}</div>
                            </a>
                            {/* <BlogCard
                                repo={blog as Repo}
                                key={blog.id}
                            /> */}
                        </Suspense>
                    ))}
            </Box>

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
                {repos.data.map((repo) => (
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
        </>
    );
}
