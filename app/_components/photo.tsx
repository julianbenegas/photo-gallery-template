import { fragmentOn } from "basehub";
import Link from "next/link";
import { imageURLToBase64 } from "../_util/base64";
import { BaseHubImage } from "basehub/next-image";

export const PhotoFragment = fragmentOn("PhotosItem", {
  _id: true,
  image: { url: true, alt: true },
});

const aspectRatio = 900 / 1600;

export const Photo = async ({
  _id,
  image,
  priority,
}: fragmentOn.infer<typeof PhotoFragment> & { priority: boolean }) => {
  return (
    <Link href={`?selected=${_id}`}>
      <BaseHubImage
        key={_id}
        src={image.url}
        width={800}
        height={800 * aspectRatio}
        alt={image.alt ?? ""}
        blurDataURL={await imageURLToBase64(image.url + "?blur=75&w=100&h=100")}
        placeholder="blur"
        priority={priority}
      />
    </Link>
  );
};
