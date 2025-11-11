"use client";

import Image from "next/image";

import { DeveloperInfo } from "./developer-info";

/**
 * Examples of how to use the DeveloperInfo component
 */

// Example 1: Wrap a logo
export function LogoWithDeveloperInfo() {
  return (
    <DeveloperInfo clickCount={7}>
      <div className="bg-primary/10 rounded-lg p-2">
        <span className="text-xl font-bold">MyApp Logo</span>
      </div>
    </DeveloperInfo>
  );
}

// Example 2: Wrap an image
export function ImageWithDeveloperInfo() {
  return (
    <DeveloperInfo clickCount={5} resetTimeout={2000}>
      <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
    </DeveloperInfo>
  );
}

// Example 3: Wrap text with custom developer info
export function TextWithDeveloperInfo() {
  return (
    <DeveloperInfo
      clickCount={10}
      developer={{
        name: "John Doe",
        github: "https://github.com/johndoe",
        email: "john@example.com",
        role: "Senior Software Engineer",
        bio: "Building amazing things with React and TypeScript.",
      }}
    >
      <p className="text-muted-foreground text-sm">v1.0.0</p>
    </DeveloperInfo>
  );
}

// Example 4: In a footer
export function FooterWithDeveloperInfo() {
  return (
    <footer className="border-t p-4">
      <DeveloperInfo clickCount={7}>
        <p className="text-muted-foreground text-center text-xs">© 2025 My Company. All rights reserved.</p>
      </DeveloperInfo>
    </footer>
  );
}

// Example 5: With custom styling
export function CustomStyledDeveloperInfo() {
  return (
    <DeveloperInfo
      clickCount={3}
      className="inline-block rounded-md bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white"
    >
      <span>Secret Developer Mode</span>
    </DeveloperInfo>
  );
}
