"use client";

import { useTheme } from "next-themes";
import { BiSolidErrorAlt, BiSolidInfoCircle, BiSolidMessageSquareCheck } from "react-icons/bi";
import { PiWarningFill } from "react-icons/pi";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...properties }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      richColors
      icons={{
        error: <BiSolidErrorAlt size={24} />,
        success: <BiSolidMessageSquareCheck size={24} />,
        warning: <PiWarningFill size={24} />,
        info: <BiSolidInfoCircle size={24} />,
      }}
      toastOptions={{
        classNames: {
          toast: "!gap-4 !shadow-5xl !min-w-md !border-none",
          title: "!font-bold",
          description: "!font-medium",
          actionButton: "",
          cancelButton: "",
          closeButton: "!absolute !-right-4 !-top-1 !relative-auto !ml-auto",
          error: "!text-white !bg-destructive",
          success: "!text-white !bg-success",
          warning: "!text-white !bg-warning",
          info: "!text-white !bg-primary",
        },
      }}
      {...properties}
    />
  );
};

export { Toaster };
