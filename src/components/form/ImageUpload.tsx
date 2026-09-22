"use client";

import Upload from "./Upload";

interface Props {
  value?: File | string | null;
  existingImageUrl?: string;
  onChange?: (file: File | null) => void;
  onExistingImageClear?: () => void;
  maxSize?: number;
}

export default function ImageUpload({
  value,
  existingImageUrl,
  onChange,
  onExistingImageClear,
  maxSize,
}: Props) {
  const uploadValue = value ?? existingImageUrl ?? null;

  return (
    <Upload
      preview
      value={uploadValue}
      onChange={onChange}
      maxSize={maxSize}
      accept={{
        "image/*": [],
      }}
    />
  );
}
