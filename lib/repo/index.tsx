import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";
import { Icon } from "boondoggle/icon";
import { faCodeFork } from "@fortawesome/pro-solid-svg-icons/faCodeFork";
import { type components as GithubOpenApiComponents } from "@octokit/openapi-types";
import { repoCardCSS, repoCardLinkCSS } from "./styles.css";
import { formatDistance } from "date-fns";
import clsx from "clsx";
import { Skeleton } from "boondoggle/skeleton";

export type Repo = GithubOpenApiComponents["schemas"]["repository"];

export const RepoCard = async ({ repo }: { repo: Repo }) => {
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

export const LoadingCard = () => {
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
