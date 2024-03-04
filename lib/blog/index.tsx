import { faCodeFork } from "@fortawesome/pro-solid-svg-icons";
import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";
import { Icon } from "boondoggle/icon";
import { type components as GithubOpenApiComponents } from "@octokit/openapi-types";
import clsx from "clsx";
import { formatDistance } from "date-fns";
import { blogCardCSS, blogCardLinkCSS } from "./styles.css";
import { env } from "process";
import { Octokit } from "@octokit/core";

export type Repo = GithubOpenApiComponents["schemas"]["content-file"];

const octokit = new Octokit({
    auth: env.GITHUB_PAT,
});

export const BlogCard = async ({ blog }: { blog: Repo }) => {
    return (
        <a
            href={blog.html_url}
            className={clsx(blogCardCSS, blogCardLinkCSS)}
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
                        {blog.name}
                    </h3>
                </Box>
                <p
                    className={css({
                        fontStyle: "bodySm",
                    })}
                >
                    {blog.description}
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
                {blog.language ? (
                    <>
                        <div>{blog.language}</div>
                        <div>•</div>
                    </>
                ) : null}

                {blog.created_at ? (
                    <div>
                        Created{" "}
                        {formatDistance(new Date(blog.created_at), new Date(), {
                            addSuffix: true,
                        })}
                    </div>
                ) : null}

                {blog.fork === true ? (
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
