"use client";

import { Alert, AlertTitle, Button } from "@mui/material";

type RouteErrorStateProps = Readonly<{
  title: string;
  description: string;
  onRetry: () => void;
}>;

export function RouteErrorState({
  title,
  description,
  onRetry,
}: RouteErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Try again
        </Button>
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {description}
    </Alert>
  );
}
