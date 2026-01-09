import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface OverviewProperties {
  title: string;
  value: number | string;
  icon: ReactNode;
  /**
   * Optional classes for the icon container. When omitted, a complementary
   * style is applied (glass/soft white over primary) so it looks good on dark cards.
   */
  iconClassName?: string;
  /**
   * Optional classes to customize the card itself (e.g., background).
   */
  cardClassName?: string;
}

export const OverViewCard: FC<OverviewProperties> = ({ title, value, icon, cardClassName }) => {
  const complementedIconContainer = cn(
    "flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 shadow-inner backdrop-blur-sm",
    // iconClassName,
  );

  // Wrap icon to apply white tint via currentColor without mutating icon element
  const renderedIcon = <span className="text-lg text-white">{icon}</span>;

  return (
    <Card className={cn("bg-primary min-h-[144px] w-full border-none px-[22px] py-[33px] shadow-sm", cardClassName)}>
      <section className="flex w-full items-start justify-between self-center">
        <div className="space-y-[13px]">
          <h5 className="text-lg font-semibold !text-white">{title}</h5>
          <p className="text-2xl !font-extrabold !text-white">{value}</p>
        </div>
        <div className={complementedIconContainer}>{renderedIcon}</div>
      </section>
    </Card>
  );
};
