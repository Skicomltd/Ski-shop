"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Code2Icon, GithubIcon, MailIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface DeveloperInfoProperties {
  children: React.ReactNode;
  clickCount?: number;
  className?: string;
  resetTimeout?: number;
  developer?: {
    name?: string;
    github?: string;
    email?: string;
    role?: string;
    bio?: string;
  };
}

/**
 * DeveloperInfo - A wrapper component that reveals developer information after multiple clicks
 *
 * Similar to Android's "About Phone" feature, clicking a specific number of times
 * will trigger a modal showing developer information.
 *
 * @param children - Any React node to wrap (component, image, text, etc.)
 * @param clickCount - Number of clicks required to show modal (default: 7)
 * @param resetTimeout - Time in ms before click count resets (default: 3000)
 * @param className - Additional CSS classes for the wrapper
 * @param developer - Developer information to display (falls back to package.json author)
 *
 * @example
 * <DeveloperInfo clickCount={5}>
 *   <Logo />
 * </DeveloperInfo>
 */
export function DeveloperInfo({
  children,
  clickCount = 7,
  className,
  resetTimeout = 3000,
  developer = {
    name: "Kingsley Ifijeh Solomon",
    github: "https://github.com/kinxlo",
    role: "Full Stack Developer",
    bio: "Passionate about building modern web applications with exceptional user experiences.",
  },
}: DeveloperInfoProperties) {
  const [clicks, setClicks] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setClicks((previous) => {
      const newCount = previous + 1;

      // Show progress indicator when halfway there
      if (newCount >= Math.floor(clickCount / 2)) {
        setShowProgress(true);
      }

      // Open modal when click count is reached
      if (newCount >= clickCount) {
        setIsOpen(true);
        setShowProgress(false);
        return 0;
      }

      return newCount;
    });

    // Clear existing timeout
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
    }

    // Set new timeout to reset click count
    timeoutReference.current = setTimeout(() => {
      setClicks(0);
      setShowProgress(false);
    }, resetTimeout);
  }, [clickCount, resetTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, []);

  const remainingClicks = clickCount - clicks;

  return (
    <>
      <div
        onClick={handleClick}
        className={cn("relative cursor-pointer select-none", className)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleClick();
          }
        }}
      >
        {children}

        {/* Progress indicator */}
        {showProgress && clicks > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/70 px-3 py-1 text-xs text-white">
              {remainingClicks} {remainingClicks === 1 ? "click" : "clicks"} away
            </div>
          </div>
        )}
      </div>

      {/* Developer Info Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-border/50 max-w-2xl shadow-2xl">
          <DialogHeader className="border-b pb-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
                <Code2Icon className="text-primary size-4" />
              </div>
              Developer Credentials
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs italic">
              Technical architect and principal developer of this application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-2">
            {/* Developer Name & Role */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-mid-blue text-xl font-semibold tracking-tight">{developer.name}</h3>
                </div>
                {developer.role && <p className="text-muted-foreground text-xs font-medium">{developer.role}</p>}
              </div>

              {/* Bio */}
              {developer.bio && (
                <div className="border-primary/20 bg-muted/30 border-l-2 py-3 pr-4 pl-4">
                  <p className="text-foreground/90 text-xs leading-relaxed">{developer.bio}</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <h4 className="text-primary text-sm font-semibold tracking-wider uppercase">Professional Contact</h4>
              </div>

              <div className="grid gap-3">
                {developer.github && (
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border/50 bg-card hover:border-primary/30 hover:bg-accent/5 group flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-sm"
                  >
                    <div className="bg-muted group-hover:bg-primary/10 flex size-10 items-center justify-center rounded-lg transition-colors">
                      <GithubIcon className="text-foreground/70 group-hover:text-primary size-5 transition-colors" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold">GitHub Profile</p>
                      <p className="text-muted-foreground text-xs">View repositories and open source contributions</p>
                    </div>
                  </a>
                )}

                {developer.email && (
                  <a
                    href={`mailto:${developer.email}`}
                    className="border-border/50 bg-card hover:border-primary/30 hover:bg-accent/5 group flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-sm"
                  >
                    <div className="bg-muted group-hover:bg-primary/10 flex size-10 items-center justify-center rounded-lg transition-colors">
                      <MailIcon className="text-foreground/70 group-hover:text-primary size-5 transition-colors" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold">Email Contact</p>
                      <p className="text-muted-foreground/80 text-xs">{developer.email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4">
              <p className="text-primary text-center text-xs">Application Information • Version 1.0</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
