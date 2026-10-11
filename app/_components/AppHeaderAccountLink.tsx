"use client";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Button } from "@mui/material";
import Link from "next/link";
import { selectDemoUser } from "@/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export function AppHeaderAccountLink() {
  const user = useAppSelector(selectDemoUser);

  return (
    <Button
      component={Link}
      href={user ? "/profile" : "/register"}
      size="small"
      startIcon={<AccountCircleOutlinedIcon />}
    >
      {user ? user.name : "Register"}
    </Button>
  );
}
