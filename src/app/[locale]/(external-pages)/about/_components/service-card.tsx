import Image from "next/image";

interface StrengthProperties {
  title: string;
  description: string;
  image: string;
}

export const ServiceCard = ({ strength }: { strength: StrengthProperties }) => {
  return (
    <section className={`bg-background dark:bg-muted flex flex-col items-center justify-center gap-4 rounded-xl p-9`}>
      <div className={`relative`}>
        <Image priority src={strength.image} alt={strength.title} className={``} width={62} height={62} />
      </div>
      <div className={`space-y-4 text-center`}>
        <h5 className={`font-bold`}>{strength.title}</h5>
        <p className={``}>{strength.description}</p>
      </div>
    </section>
  );
};
