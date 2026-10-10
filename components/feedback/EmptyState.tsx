import { Box, Typography } from "@mui/material";

type EmptyStateProps = Readonly<{
  title: string;
  description: string;
}>;

export function EmptyState({ title, description }: EmptyStateProps) {
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
    </Box>
  );
}
