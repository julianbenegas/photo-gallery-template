import { basehub } from "basehub";
import { Pump } from "basehub/react-pump";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Photo, PhotoFragment } from "../_components/photo";
import { SelectedPhotoDialog } from "../_components/selected-photo-dialog";

export const dynamic = "force-static";
export const revalidate = 10;

export const generateStaticParams = async (): Promise<
  Array<{ show: string }>
> => {
  const { shows } = await basehub({ cache: "no-store" }).query({
    shows: { items: { _slug: true } },
  });
  return shows.items.map((show) => ({ show: show._slug }));
};

type Props = { params: { show: string } };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const data = await basehub({ cache: "no-store" }).query({
    shows: {
      __args: { filter: { _sys_slug: { eq: params.show } }, first: 1 },
      items: { _title: true },
    },
  });

  const show = data.shows.items[0];
  if (!show) notFound();

  return {
    title: show._title,
  };
};

const Page = ({ params }: Props) => {
  return (
    <Pump
      queries={[
        {
          shows: {
            __args: { filter: { _sys_slug: { eq: params.show } }, first: 1 },
            items: {
              _title: true,
              photos: { items: PhotoFragment },
            },
          },
        },
      ]}
    >
      {async ([data]) => {
        "use server";

        const show = data.shows.items[0];
        if (!show) notFound();

        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {show.photos.items.map(async (photo, i) => {
              const priority = i < 10;
              return <Photo key={photo._id} {...photo} priority={priority} />;
            })}

            <SelectedPhotoDialog photos={show.photos.items} />
          </div>
        );
      }}
    </Pump>
  );
};

export default Page;
