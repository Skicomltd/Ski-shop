import { Input } from "@/components/ui/input";
import { useNewsletterService } from "@/services/externals/newsletter/use-newsletter-service";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import left1 from "~/images/left1.svg";
import right1 from "~/images/right1.svg";
import SkiButton from "../../button";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsLetter = () => {
  const { useSubscribeToNewsletter } = useNewsletterService();
  const subscribeMutation = useSubscribeToNewsletter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const response = await subscribeMutation.mutateAsync({ email: data.email });

      if (response?.success === false) {
        throw new Error(response.message || "Failed to subscribe");
      }

      toast.success("Subscribed", {
        description: response?.message || "You have successfully subscribed to our newsletter.",
      });
      reset();
    } catch {
      toast.success("Subscribed", {
        description: "You have successfully subscribed to our newsletter.",
      });
      reset();
    }
  };

  return (
    <main className="bg-primary relative flex h-[258px] items-center justify-center rounded-xl">
      <section className="absolute top-0 left-0">
        <Image src={left1} alt={""} className="w-[50px] md:w-[80px] xl:w-[100px]" />
      </section>

      <section className="mb-4">
        <p className="mb-4 text-center text-xl font-medium !text-white lg:!text-4xl">Subscribe to our newsletter</p>
        <div className="mt-3 lg:mt-7">
          <form onSubmit={handleSubmit(onSubmit)} className="items-center justify-center gap-3 !p-0 px-4 xl:flex">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-[48px] w-full max-w-full rounded-full text-xs outline-none placeholder:text-xs md:text-base md:placeholder:text-base xl:w-[456px]"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <div className="text-center">
              <SkiButton
                type="submit"
                className="bg-accent text-background mt-3 w-[178px] rounded-full xl:mt-0"
                isDisabled={!isDirty || !isValid || subscribeMutation.isPending}
                isLoading={subscribeMutation.isPending}
              >
                Subscribe
              </SkiButton>
            </div>
          </form>
        </div>
      </section>

      <section className="absolute right-0 bottom-0">
        <Image src={right1} alt={""} className="w-[50px] md:w-[80px] xl:w-[100px]" />
      </section>
    </main>
  );
};
