import { RichTextFormatter } from "@/components/RichText";
import { Content } from "@prismicio/client";
import { PrismicText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  return (
    <section
      className="flex flex-col gap-4 max-w-3xl w-full"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">
          <PrismicText field={slice.primary.title} />
        </h1>
        <RichTextFormatter field={slice.primary.description} />
      </div>
    </section>
  );
};

export default Hero;
