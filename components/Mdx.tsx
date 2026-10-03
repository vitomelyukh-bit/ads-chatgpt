import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { proseClass } from "./Prose";

const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener" {...props} />
    ),
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className={proseClass}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
