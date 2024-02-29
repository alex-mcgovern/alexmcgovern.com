import { Main } from "boondoggle/main";
import { Box } from "boondoggle/box";
import { css } from "boondoggle/css";

export default function Page() {
    return (
        <Main size="sm">
            <Box
                className={css({
                    marginX: "auto",

                    height: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                })}
            >
                Hello
            </Box>
        </Main>
    );
}
