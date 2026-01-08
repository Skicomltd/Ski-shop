"use client";

import SkiButton from "@/components/shared/button";
import { ConfirmationDialog } from "@/components/shared/dialog/confirmation-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserService } from "@/services/externals/user/use-user-service";
import { AlertCircle, Trash2 } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { VendorBusinessForm } from "./_components/vendor-business-form";
import { VendorProfileForm } from "./_components/vendor-profile-form";
import { VendorStoreForm } from "./_components/vendor-store-form";

export default function ProfilePage() {
  const { data: session } = useSession();
  const userId = (session?.user as User)?.id as string | undefined;

  const { useDeleteUser } = useUserService();
  const { mutate: deleteUser, isPending } = useDeleteUser({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut({ redirect: true, callbackUrl: "/login" });
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  const handleDeleteAccount = () => {
    if (!userId) {
      toast.error("Unable to identify user account");
      return;
    }
    deleteUser(userId);
  };

  return (
    <section className="space-y-8">
      <VendorStoreForm />
      <VendorProfileForm />
      <VendorBusinessForm />

      <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2 text-sm font-semibold">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-sm text-black">
            This is a danger zone. Deleting your account is permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-4">
          <Alert className="border-destructive/30 bg-destructive/10 text-destructive-foreground">
            <AlertTitle className="font-semibold text-black">Irreversible action</AlertTitle>
            <AlertDescription className="text-black">
              Deleting your account will remove your data, cancel active services, and sign you out immediately.
            </AlertDescription>
          </Alert>

          <ConfirmationDialog
            action={{
              title: "Delete Account",
              description: "",
              buttonName: "Confirm and Continue",
              showCancelButton: false,
              buttonVariant: "primary",
              pending: isPending,
              onConfirm: handleDeleteAccount,
              headerClassName: `!text-center !text-xl`,
              icon: (
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-white">
                  <AlertCircle className="h-8 w-8" />
                </div>
              ),
              content: (
                <div className="space-y-4">
                  <p className="text-destructive text-center text-sm font-semibold">
                    After Successfully Account Delete:
                  </p>
                  <div className="border-destructive/30 bg-destructive/5 text-muted-foreground rounded-lg border p-4 text-sm">
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Permanently Unable to Access Account</li>
                      <li>All Transactions will be cleared</li>
                      <li>All Auto-pay will be canceled</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground text-center text-xs">
                    For more details on Account Delete, please contact us on
                    <a href="mailto:support@skicom.com" className="text-primary ml-1 underline underline-offset-2">
                      support@skicom.com
                    </a>
                  </p>
                </div>
              ),
            }}
          >
            <SkiButton variant="destructive" size="lg" className="w-full sm:w-auto" isDisabled={!userId || isPending}>
              Delete Account
            </SkiButton>
          </ConfirmationDialog>
        </CardContent>
      </Card>
    </section>
  );
}
