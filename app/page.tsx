import { Pump } from "basehub/react-pump";
import { Nav } from "./_components/nav";
import { draftMode } from "next/headers";

export const dynamic = "force-static";
export const revalidate = 10;

export default function Home() {
  return (
    <Pump
      queries={[
        {
          index: { title: true },
          shows: { items: { _slug: true, _id: true, _title: true } },
        },
      ]}
      draft={draftMode().isEnabled}
      next={{ revalidate: 10 }}
    >
      {async ([{ index, shows }]) => {
        "use server";
        return (
          <main className="h-screen flex items-center justify-center p-8">
            <div className="w-full">
              <h1 className="font-medium text-xs text-center">{index.title}</h1>

              <Nav
                className="mt-1"
                links={[...shows.items].reverse().map((show) => ({
                  href: `/${show._slug}`,
                  children: show._title,
                }))}
              />
            </div>
          </main>
        );
      }}
    </Pump>
  );
}
