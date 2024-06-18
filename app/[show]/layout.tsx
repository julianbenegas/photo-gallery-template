import { Pump } from "basehub/react-pump";
import { Nav } from "../_components/nav";
import { draftMode } from "next/headers";

const ShowLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <Pump
        queries={[
          { shows: { items: { _slug: true, _id: true, _title: true } } },
        ]}
        draft={draftMode().isEnabled}
        next={{ revalidate: 10 }}
      >
        {async ([{ shows }]) => {
          "use server";
          return (
            <footer className="sticky bottom-0 p-2 bg-bg">
              <Nav
                links={[
                  { href: "/", children: "HOME" },
                  ...[...shows.items].reverse().map((show) => ({
                    href: `/${show._slug}`,
                    children: show._title,
                  })),
                ]}
              />
            </footer>
          );
        }}
      </Pump>
    </div>
  );
};

export default ShowLayout;
