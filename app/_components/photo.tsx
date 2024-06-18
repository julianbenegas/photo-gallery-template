import { fragmentOn } from "basehub";
import Link from "next/link";
import { imageURLToBase64 } from "../_util/base64";
import { BaseHubImage } from "basehub/next-image";
import { PHOTO_ASPECT_RATIO } from "../_util/aspect";

export const PhotoFragment = fragmentOn("PhotosItem", {
  _id: true,
  image: { url: true, alt: true },
});

export type PhotoFragment = fragmentOn.infer<typeof PhotoFragment>;

export const Photo = async ({
  _id,
  image,
  priority,
}: PhotoFragment & { priority: boolean }) => {
  return (
    <Link href={`?selected=${_id}`} id={_id} scroll={false}>
      <BaseHubImage
        key={_id}
        src={image.url}
        width={800}
        height={800 * PHOTO_ASPECT_RATIO}
        alt={image.alt ?? ""}
        blurDataURL={await imageURLToBase64(image.url + "?blur=75&w=100&h=100")}
        placeholder="blur"
        priority={priority}
      />
    </Link>
  );
};
