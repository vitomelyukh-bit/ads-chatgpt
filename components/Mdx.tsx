import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

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
    <div className="prose prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink-soft prose-li:text-ink-soft prose-a:text-accent prose-a:underline-offset-2 prose-strong:text-ink">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
