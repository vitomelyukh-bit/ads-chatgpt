import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} target="_blank" rel="noopener" {...props} />,
};

// Testo lungo (guide, settori) con gli stili di testo del design system.
export function Mdx({ source }: { source: string }) {
  return (
    <div className="tt-prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
