import { createClient } from "@/prismicio";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import * as prismic from "@prismicio/client";
import { Navigation } from "@/components/Navigation";
import { RichTextFormatter } from "@/components/RichText";
import { PrismicNextImage } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { PostCard } from "@/components/PostCard";

type Params = { uid: string };

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("blog_post", params.uid)
    .catch(() => notFound());

  return {
    title: prismic.asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [
        {
          url: page.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();

  const page = await client
    .getByUID("blog_post", params.uid)
    .catch(() => notFound());
  const recommendedPosts = await client.getAllByType("blog_post", {
    predicates: [prismic.filter.not("my.blog_post.uid", params.uid)],
    orderings: [
      { field: "my.blog_post.publication_date", direction: "desc" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
    limit: 2,
  });

  const { slices, title, publication_date, description, featured_image } =
    page.data;

  return (
    <section className="flex flex-col gap-12 w-full max-w-3xl">
      <Navigation client={client} />
      {/* Hero section */}
      <aside className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex flex-col gap-6 items-center">
            <p className="opacity-75 border-b-2 w-min pb-1">
              {new Date(publication_date || "").toLocaleDateString()}
            </p>
            <div className="text-center">
              <RichTextFormatter field={title} />
            </div>
          </div>
          <div className="text-center">
            <RichTextFormatter field={description} />
          </div>
        </div>
        <PrismicNextImage
          field={featured_image}
          sizes="100vw"
          className="w-full max-w-3xl  max-h-96 rounded-xl object-cover"
        />
      </aside>
      {/* Content of blog post */}
      <SliceZone slices={slices} components={components} />
      {/* Recommended posts */}
      <h2 className="font-bold text-3xl">Recommended Posts</h2>
      <section className="grid grid-cols-1 gap-8 max-w-3xl w-full">
        {recommendedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <Navigation client={client} />
    </section>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  /**
   * Query all Documents from the API, except the homepage.
   */
  const pages = await client.getAllByType("blog_post");

  /**
   * Define a path for every Document.
   */
  return pages.map((page) => {
    return { uid: page.uid };
  });
}
