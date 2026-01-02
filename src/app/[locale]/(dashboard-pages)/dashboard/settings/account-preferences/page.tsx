"use client";

import { LanguageToggle } from "@/components/shared/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

export default function AccountPreferencesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <section className="space-y-8">
      <div>
        <h4 className="">{t("settings.accountPreferences.title", { defaultValue: "Account & Preferences" })}</h4>
        <p className="text-mid-grey-II">
          {t("settings.accountPreferences.subtitle", {
            defaultValue: "Manage your language and account preferences.",
          })}
        </p>
      </div>
      <Card className="mt-6 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              {t("settings.language.title", { defaultValue: "Language" })}
            </CardTitle>
            <CardDescription>
              {t("settings.language.description", { defaultValue: "Choose your preferred language." })}
            </CardDescription>
          </div>
          <LanguageToggle />
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-mid-grey-II">
              {t("settings.language.current", { defaultValue: "Current language" })}:
            </span>
            <Badge variant={`default`} className="rounded-full px-3 py-1 uppercase">
              {locale}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
