"use client";

import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutDemoUser, selectDemoUser } from "./authSlice";

export function ProfileIdentity() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectDemoUser);

  const logout = () => {
    dispatch(logoutDemoUser());
  };

  if (!user) {
    return (
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography component="h2" variant="h6">
            Demo profile
          </Typography>
          <Typography color="text.secondary">
            Create an optional local profile. Your photo collection works
            without one.
          </Typography>
          <Button component={Link} href="/register" variant="outlined">
            Register demo profile
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
        <Typography variant="overline" color="text.secondary">
          Local demo profile
        </Typography>
        <Typography variant="h5" component="h2">
          {user.name}
        </Typography>
        <Typography color="text.secondary">{user.email}</Typography>
        <Button
          component={Link}
          href="/register"
          variant="outlined"
          onClick={logout}
        >
          Log out
        </Button>
      </Stack>
    </Paper>
  );
}
