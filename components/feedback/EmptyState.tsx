import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = Readonly<{
  title: string;
  description: string;
  action?: ReactNode;
}>;

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box
      role="status"
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography component="h2" variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action ? <Box sx={{ mt: 3 }}>{action}</Box> : null}
    </Box>
  );
}
