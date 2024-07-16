import { basehub } from "basehub";
import { UploadForm } from "./form";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 10;

const UploadImagesToShowPage = async ({
  params,
}: {
  params: { show: string };
}) => {
  const data = await basehub({ cache: "no-store" }).query({
    shows: {
      __args: { filter: { _sys_slug: { eq: params.show } }, first: 1 },
      items: {
        photos: {
          _id: true,
        },
      },
    },
  });

  const show = data.shows.items[0];
  if (!show) notFound();

  const showPhotosCollectionId = show.photos._id;

  const upload = async (formData: FormData) => {
    "use server";

    const images = formData.getAll("images") as File[] | null;
    if (!images) return "ok";

    const uploadPromises = images.map(async (image) => {
      const {
        getUploadSignedURL: { signedURL, uploadURL },
      } = await basehub().mutation({
        getUploadSignedURL: {
          __args: {
            fileName: image.name,
          },
          signedURL: true,
          uploadURL: true,
        },
      });

      await fetch(signedURL, {
        method: "PUT",
        body: image,
      });

      return { uploadURL, fileName: image.name };
    });

    const result = await Promise.allSettled(uploadPromises);

    const uploads = result
      .map((r) => {
        if (r.status === "rejected") {
          console.error(r.reason);
          return;
        }
        return r.value;
      })
      .filter((v) => v) as { uploadURL: string; fileName: string }[];

    await basehub().mutation({
      transaction: {
        __args: {
          data: uploads.map(({ uploadURL, fileName }) => {
            return {
              type: "create",
              parentId: showPhotosCollectionId,
              data: {
                type: "instance",
                title: null,
                value: {
                  image: {
                    type: "image",
                    value: {
                      fileName,
                      url: uploadURL,
                    },
                  },
                },
              },
            };
          }),
        },
      },
    });

    return "ok";
  };

  return <UploadForm upload={upload} />;
};

export default UploadImagesToShowPage;
