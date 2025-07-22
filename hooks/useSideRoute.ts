import { usePathname } from "next/navigation";

const useSideRoute = () => {
  const pathname = usePathname();

  const getStrippedPathname = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments.slice(1).join("/")}`;
    }
    return "/";
  };

  const isRouteActive = (activeRoutes: string[]) => {
    const strippedPath = getStrippedPathname(pathname);

    return activeRoutes.some(
      (route) => strippedPath === route || strippedPath.startsWith(route + "/")
    );
  };

  return { isRouteActive };
};

export default useSideRoute;
