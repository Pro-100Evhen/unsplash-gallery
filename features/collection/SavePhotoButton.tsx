"use client";

import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { IconButton, Tooltip } from "@mui/material";
import type { MouseEvent } from "react";
import type { GalleryPhoto } from "@/domain/photo/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removePhoto,
  savePhoto,
  selectIsPhotoSaved,
  type SavedPhoto,
} from "./collectionSlice";

function toSavedPhoto(photo: GalleryPhoto): SavedPhoto {
  return {
    id: photo.id,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    altDescription: photo.altDescription,
    urls: { regular: photo.urls.regular },
    unsplashUrl: photo.unsplashUrl,
    author: {
      name: photo.author.name,
      profileImageUrl: photo.author.profileImageUrl,
      profileUrl: photo.author.profileUrl,
    },
  };
}

type SavePhotoButtonProps = Readonly<{
  photo: GalleryPhoto;
}>;

export function SavePhotoButton({ photo }: SavePhotoButtonProps) {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector((state) =>
    selectIsPhotoSaved(state, photo.id),
  );
  const label = isSaved
    ? "Remove photo from collection"
    : "Save photo to collection";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(isSaved ? removePhoto(photo.id) : savePhoto(toSavedPhoto(photo)));
  };

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={handleClick}
        size="small"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.94)",
          boxShadow: 1,
          color: "text.primary",
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        {isSaved ? (
          <BookmarkRemoveIcon fontSize="small" />
        ) : (
          <BookmarkAddOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
