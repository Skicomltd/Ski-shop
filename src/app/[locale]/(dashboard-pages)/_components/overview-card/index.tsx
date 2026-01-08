import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface OverviewProperties {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconClassName: string;
}

export const OverViewCard: FC<OverviewProperties> = ({ title, value, icon, iconClassName }) => {
  return (
    <Card className="min-h-[144px] w-full border-none px-[22px] py-[33px] shadow-sm">
      <section className="flex w-full items-start justify-between self-center">
        <div className="space-y-[13px]">
          <h5 className="text-lg font-semibold">{title}</h5>
          <p className="text-2xl !font-extrabold">{value}</p>
        </div>
        <div className={cn(`flex h-[42px] w-[42px] items-center justify-center rounded`, iconClassName)}>{icon}</div>
      </section>
    </Card>
  );
};
