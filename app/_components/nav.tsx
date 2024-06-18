import Link from "next/link";
import { clsx } from "clsx";

type NavLinkProps = React.ComponentProps<typeof Link>;

export const NavLink = (props: NavLinkProps) => {
  return (
    <Link
      {...props}
      className={clsx(props.className, "text-accent underline")}
    />
  );
};

export const Divider = () => {
  return <span className="mx-2">\</span>;
};

export const Nav = ({
  links,
  className,
}: {
  links: Array<NavLinkProps>;
  className?: string;
}) => {
  return (
    <nav className={clsx(className, "flex justify-center mt-1 text-sm")}>
      {links.map((link, i, { length }) => {
        return (
          <div key={i}>
            <NavLink {...link} />
            {i < length - 1 && <Divider />}
          </div>
        );
      })}
    </nav>
  );
};
