"use client";

import SkiButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/inputs/FormFields";
import { usePromotionService } from "@/services/dashboard/vendor/promotions/use-promotion-service";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type PromotionFormValues = {
  name: string;
  type: string;
  amount: number;
  duration: number;
};

interface PromotionFormModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPromotion?: Promotion | null;
}

export const PromotionFormModal: React.FC<PromotionFormModalProperties> = ({
  open,
  onOpenChange,
  initialPromotion,
}) => {
  const isEditMode = Boolean(initialPromotion?.id);

  const { useCreatePromotion, useUpdatePromotion } = usePromotionService();

  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();

  const methods = useForm<PromotionFormValues>({
    defaultValues: {
      name: initialPromotion?.name ?? "",
      type: initialPromotion?.type ?? "",
      amount: initialPromotion?.amount ?? 0,
      duration: initialPromotion?.duration ?? 1,
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset({
      name: initialPromotion?.name ?? "",
      type: initialPromotion?.type ?? "",
      amount: initialPromotion?.amount ?? 0,
      duration: initialPromotion?.duration ?? 1,
    });
  }, [initialPromotion, reset]);

  const onSubmit = async (values: PromotionFormValues) => {
    try {
      if (isEditMode && initialPromotion) {
        await updateMutation.mutateAsync({
          id: initialPromotion.id,
          data: {
            name: values.name.trim(),
            type: values.type.trim(),
            amount: Number(values.amount),
            duration: Number(values.duration),
          },
        });
        toast.success("Promotion updated successfully");
      } else {
        const payload: Omit<Promotion, "id" | "createdAt"> = {
          name: values.name.trim(),
          type: values.type.trim(),
          amount: Number(values.amount),
          duration: Number(values.duration),
        } as unknown as Omit<Promotion, "id" | "createdAt">;

        await createMutation.mutateAsync(payload as unknown as Omit<Promotion, "id" | "createdAt">);
        toast.success("Promotion created successfully");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(isEditMode ? "Failed to update promotion" : "Failed to create promotion", {
        description: (error as Error)?.message ?? "Unknown error",
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Promotion" : "Create Promotion"}
      description={
        isEditMode ? "Update the details of this promotion package." : "Configure a new promotion package for vendors."
      }
      className="sm:max-w-md"
      headerClassName="!text-xl font-semibold"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full space-y-4">
          <FormField
            label="Promotion Name"
            name="name"
            type="text"
            placeholder="e.g. Homepage Banner"
            className="h-11"
          />

          <FormField label="Type" name="type" type="text" placeholder="e.g. banner, featured" className="h-11" />

          <FormField label="Amount (₦)" name="amount" type="number" placeholder="0" className="h-11" />

          <FormField label="Duration (days)" name="duration" type="number" placeholder="7" className="h-11" />

          <div className="flex justify-end gap-3 pt-2">
            <SkiButton type="button" variant="outline" isDisabled={isSubmitting} onClick={() => onOpenChange(false)}>
              Cancel
            </SkiButton>
            <SkiButton type="submit" isDisabled={isSubmitting} isLoading={isSubmitting} variant="primary">
              {isEditMode ? "Save Changes" : "Create"}
            </SkiButton>
          </div>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
};
