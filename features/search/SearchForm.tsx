"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  SEARCH_QUERY_MAX_LENGTH,
  searchSchema,
  type SearchFormValues,
} from "./searchSchema";
import {
  createSearchHref,
  getSearchNavigationDelay,
  shouldAutoSearch,
} from "./searchNavigation";
import styles from "./SearchForm.module.scss";

type SearchFormProps = Readonly<{
  initialQuery?: string;
}>;

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query")?.trim() ?? initialQuery.trim();
  const navigationStartedRef = useRef(false);
  const submittedQueryRef = useRef<string | null>(null);
  const [lastNavigationAt, setLastNavigationAt] = useState(0);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: urlQuery },
    mode: "onSubmit",
  });
  const query = useWatch({ control, name: "query" });
  const isNavigationPending =
    submittedQuery !== null && submittedQuery !== urlQuery;

  const navigateToQuery = useCallback(
    (nextQuery: string) => {
      setLastNavigationAt(Date.now());

      startTransition(() => {
        router.replace(createSearchHref(nextQuery));
      });
    },
    [router],
  );

  useEffect(() => {
    const currentQuery = getValues("query").trim();
    const shouldSyncFromUrl =
      submittedQueryRef.current === null ||
      currentQuery === submittedQueryRef.current;

    if (shouldSyncFromUrl) {
      reset({ query: urlQuery });
    }
  }, [getValues, reset, urlQuery]);

  useEffect(() => {
    if (isNavigationPending) {
      return;
    }

    const nextQuery = query.trim();

    if (nextQuery === urlQuery) {
      return;
    }

    if (!shouldAutoSearch(nextQuery)) {
      return;
    }

    if (nextQuery && !searchSchema.safeParse({ query: nextQuery }).success) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        submittedQueryRef.current = nextQuery;
        setSubmittedQuery(nextQuery);
        navigateToQuery(nextQuery);
      },
      getSearchNavigationDelay(lastNavigationAt, Date.now()),
    );

    return () => window.clearTimeout(timeoutId);
  }, [isNavigationPending, lastNavigationAt, navigateToQuery, query, urlQuery]);

  const submitValidForm = handleSubmit(({ query }) => {
    setSubmittedQuery(query);
    navigateToQuery(query);
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (navigationStartedRef.current) {
      event.preventDefault();
      return;
    }

    const parsedQuery = searchSchema.safeParse({ query: getValues("query") });

    if (parsedQuery.success) {
      submittedQueryRef.current = parsedQuery.data.query;
    }

    navigationStartedRef.current = true;
    void submitValidForm(event).finally(() => {
      navigationStartedRef.current = false;
    });
  };

  const submitDisabled = isSubmitting || isNavigationPending || isPending;

  return (
    <form
      className={styles.form}
      role="search"
      aria-label="Photo search"
      noValidate
      onSubmit={onSubmit}
    >
      <Controller
        name="query"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            id="photo-search-query"
            className={styles.field}
            type="search"
            placeholder="Search photos…"
            size="small"
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                backgroundColor: "background.paper",
              },
            }}
            slotProps={{
              htmlInput: {
                "aria-label": "Search photos",
                autoComplete: "off",
                maxLength: SEARCH_QUERY_MAX_LENGTH,
                "aria-invalid": fieldState.invalid,
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      edge="end"
                      aria-label="Search"
                      disabled={submitDisabled}
                    >
                      {submitDisabled ? (
                        <CircularProgress size={20} aria-hidden="true" />
                      ) : (
                        <SearchRounded aria-hidden="true" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
      {submitDisabled ? (
        <LinearProgress
          className={styles.loader}
          aria-label="Loading search results"
        />
      ) : null}
    </form>
  );
}
