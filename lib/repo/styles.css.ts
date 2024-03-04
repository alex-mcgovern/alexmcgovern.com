import { style } from "@vanilla-extract/css";
import { css } from "boondoggle/css";
import { vars } from "boondoggle/styles";

export const repoCardCSS = style([
    css({
        border: "border_rule",
        display: "flex",
        flexDirection: "column",
        borderRadius: "md",
        aspectRatio: "wide",
        color: "text_high_contrast",
        textDecoration: "none",
        transition: "short",
    }),
]);

export const repoCardLinkCSS = style([
    {
        selectors: {
            "&:hover": {
                boxShadow: vars.boxShadow.sm,
            },
        },
    },
]);
