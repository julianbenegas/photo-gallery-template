"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

export const UploadForm = ({
  upload,
}: {
  upload: (formData: FormData) => Promise<string>;
}) => {
  return (
    <form
      className="w-screen h-screen relative flex items-center justify-center"
      action={upload}
    >
      <input
        className="w-full h-full absolute opacity-0"
        type="file"
        name="images"
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
        accept="image/*"
        multiple
      />
      <div className="text-xs">
        <p>CLICK OR DROP ANYWHERE TO UPLOAD</p>
        <div className="text-center">
          &nbsp;
          <FormStatusFragment />
        </div>
      </div>
    </form>
  );
};

const FormStatusFragment = () => {
  const status = useFormStatus();
  const images = status.data?.getAll("images") ?? [];
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (status.pending) {
      setShowSuccess(true);
      return;
    }
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 5_000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSuccess, status.pending]);

  return (
    <>
      {status.pending
        ? `UPLOADING ${images.length} IMAGES...`
        : showSuccess
        ? "DONE. MAKE SURE YOU COMMIT YOUR CHANGES IN BASEHUB.COM!"
        : ""}
    </>
  );
};
