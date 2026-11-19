import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";

/** Public website chrome: preloader, smooth scrolling, custom cursor and paper grain. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Preloader />
      <SmoothScroll>{children}</SmoothScroll>
      <Cursor />
      <div aria-hidden className="grain" />
    </>
  );
}
