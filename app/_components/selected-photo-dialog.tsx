"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PhotoFragment } from "./photo";
import { BaseHubImage } from "basehub/next-image";
import { PHOTO_ASPECT_RATIO } from "../_util/aspect";
import { IconButton } from "./icon-button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Cross1Icon,
  ZoomInIcon,
} from "@radix-ui/react-icons";

export const SelectedPhotoDialog = ({
  photos,
}: {
  photos: Array<PhotoFragment>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const selectedParam = params.get("selected");

  const hasScrolledToSelectedRef = React.useRef(false);

  const selectedPhotoIndex = photos.findIndex(
    (photo) => photo._id === selectedParam
  );
  const selectedPhoto = photos[selectedPhotoIndex];

  const controls = React.useMemo(() => {
    return {
      close: () => {
        const newParams = new URLSearchParams(params.toString());
        newParams.delete("selected");
        router.push(pathname + "?" + newParams.toString(), { scroll: false });
      },
      left: () => {
        const newParams = new URLSearchParams(params.toString());
        if (selectedPhotoIndex > 0) {
          newParams.set("selected", photos[selectedPhotoIndex - 1]._id);
        } else {
          newParams.set("selected", photos[photos.length - 1]._id);
        }
        router.push(pathname + "?" + newParams.toString(), { scroll: false });
      },
      right: () => {
        const newParams = new URLSearchParams(params.toString());
        if (selectedPhotoIndex < photos.length - 1) {
          newParams.set("selected", photos[selectedPhotoIndex + 1]._id);
        } else {
          newParams.set("selected", photos[0]._id);
        }
        router.push(pathname + "?" + newParams.toString(), { scroll: false });
      },
    };
  }, [params, pathname, photos, router, selectedPhotoIndex]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          controls.close();
          break;
        case "ArrowLeft":
          controls.left();
          break;
        case "ArrowRight":
          controls.right();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [controls]);

  React.useEffect(() => {
    if (hasScrolledToSelectedRef.current || !selectedPhoto) return;
    // scroll to selected if it's first mount
    const selectedElement = document.getElementById(selectedPhoto._id);
    if (!selectedElement) return;
    selectedElement.scrollIntoView({ block: "center" });
    hasScrolledToSelectedRef.current = true;
  }, [selectedPhoto]);

  if (!selectedPhoto) return null;
  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="bg-black absolute inset-0" onClick={controls.close} />

      <div className="flex items-center justify-center w-full h-full z-10 relative pointer-events-none">
        <div className="w-full h-full p-16 flex items-center justify-center">
          {/* we want the raw image here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedPhoto.image.url}
            alt={selectedPhoto.image.alt ?? ""}
            className="max-h-full pointer-events-auto object-cover h-full w-auto max-w-[calc(100%-80px)]"
          />
        </div>

        {/* Controls */}

        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          {/* header */}
          <div className="flex items-center justify-between p-4 text-xs text-white">
            <div aria-label="current index" className="pointer-events-auto">
              {selectedPhotoIndex + 1}/{photos.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton>
                <span className="sr-only">zoom in</span>
                <ZoomInIcon />
              </IconButton>
              <IconButton onClick={controls.close}>
                <span className="sr-only">close</span>
                <Cross1Icon />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          {/* footer */}
        </div>

        <div className="absolute top-0 bottom-0 left-0 pointer-events-none">
          {/* left */}
          <div className="flex flex-col justify-center text-white h-full">
            <button
              className="h-40 px-4 pointer-events-auto hover:bg-white/5 rounded-r-sm"
              onClick={controls.left}
            >
              <span className="sr-only">go left</span>
              <ArrowLeftIcon />
            </button>
          </div>
        </div>

        <div className="absolute top-0 bottom-0 right-0 pointer-events-none">
          {/* right */}
          <div className="flex flex-col justify-center text-white h-full">
            <button
              className="h-40 px-4 pointer-events-auto hover:bg-white/5 rounded-r-sm"
              onClick={controls.right}
            >
              <span className="sr-only">go right</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
