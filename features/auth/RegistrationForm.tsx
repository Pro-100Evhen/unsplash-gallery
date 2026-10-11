"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { registerDemoUser } from "./authSlice";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "./registrationSchema";
import styles from "./RegistrationForm.module.scss";

const defaultValues: RegistrationFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export function RegistrationForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegistrationFormValues>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(registrationSchema),
    shouldFocusError: true,
  });

  const submitRegistration = handleSubmit(async ({ fullName, email }) => {
    dispatch(
      registerDemoUser({
        id: crypto.randomUUID(),
        name: fullName,
        email,
      }),
    );
    router.push("/profile");
  });

  const passwordAdornment = (
    visible: boolean,
    toggle: () => void,
    label: string,
  ) => (
    <InputAdornment position="end">
      <IconButton type="button" edge="end" aria-label={label} onClick={toggle}>
        {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <form className={styles.form} noValidate onSubmit={submitRegistration}>
      <Alert severity="info">
        Demo registration is stored only in this browser. It does not create a
        real account or server session.
      </Alert>
      <Controller
        name="fullName"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            id="registration-name"
            label="Full name"
            autoComplete="name"
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            fullWidth
            slotProps={{ htmlInput: { ref } }}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            id="registration-email"
            type="email"
            label="Email"
            autoComplete="email"
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            fullWidth
            slotProps={{ htmlInput: { ref } }}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            id="registration-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            autoComplete="new-password"
            error={fieldState.invalid}
            helperText={
              fieldState.error?.message ??
              "At least 8 characters with a letter and number"
            }
            fullWidth
            slotProps={{
              htmlInput: { ref },
              input: {
                endAdornment: passwordAdornment(
                  showPassword,
                  () => setShowPassword((value) => !value),
                  showPassword ? "Hide password" : "Show password",
                ),
              },
            }}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            id="registration-confirm-password"
            type={showConfirmation ? "text" : "password"}
            label="Confirm password"
            autoComplete="new-password"
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            fullWidth
            slotProps={{
              htmlInput: { ref },
              input: {
                endAdornment: passwordAdornment(
                  showConfirmation,
                  () => setShowConfirmation((value) => !value),
                  showConfirmation
                    ? "Hide password confirmation"
                    : "Show password confirmation",
                ),
              },
            }}
          />
        )}
      />
      <Controller
        name="terms"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.invalid}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(_, checked) => field.onChange(checked)}
                  slotProps={{ input: { ref: field.ref } }}
                />
              }
              label="I understand this is a local demo account"
            />
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        )}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating demo profile…" : "Create demo profile"}
      </Button>
    </form>
  );
}
