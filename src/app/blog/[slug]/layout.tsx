import { PageMarketing } from "@/components/marketing/page-marketing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

/** Every current and future blog slug gets views + last-touch attribution. */
export default async function BlogSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  return (
    <>
      <PageMarketing slug={slug} kind="blog" path={`/blog/${slug}`} />
      {children}
    </>
  );
}
