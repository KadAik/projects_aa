import { Stack, Typography } from "@mui/material";
import { memo } from "react";
import { SortIcon } from "./SortIcon";

const RenderHeader = memo(({ headerName, field, sortable = false }) => (
    <Stack direction="row">
        <Typography variant="body1" fontWeight="bold">
            {headerName} &nbsp;
        </Typography>
        {sortable && <SortIcon field={field} />}
    </Stack>
));

export default RenderHeader;
