import { Toaster } from "sonner";

export const Toast = () => {
  return <Toaster closeButton position="bottom-center" expand={false} duration={5000} />;
};
