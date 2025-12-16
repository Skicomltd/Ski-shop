import { BlurImage } from "@/components/core/miscellaneous/blur-image";

interface StrengthProperties {
  title: string;
  description: string;
  image: string;
}

export const AboutCard = ({ strength }: { strength: StrengthProperties }) => {
  return (
    <section className={`bg-mid-grey-I dark:bg-muted rounded-md text-center lg:text-left`}>
      <div className={`space-y-4 p-9`}>
        <h3 className={`text-xl`}>{strength.title}</h3>
        <p className={`lg:text-lg`}>{strength.description}</p>
      </div>
      <div className={`relative`}>
        <BlurImage priority src={strength.image} alt={strength.title} className={`w-full`} width={532} height={213} />
      </div>
    </section>
  );
};
