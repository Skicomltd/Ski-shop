# DeveloperInfo Component

A wrapper component that reveals developer information after multiple clicks, similar to Android's "About Phone" hidden developer mode feature.

## Features

- 🎯 **Multi-click activation** - Shows modal after a configurable number of clicks
- ⏱️ **Auto-reset** - Click counter resets after inactivity
- 📊 **Progress indicator** - Shows remaining clicks when halfway there
- 🎨 **Fully customizable** - Pass custom developer info and styling
- ♿ **Accessible** - Keyboard navigation support
- 🎉 **Easter egg style** - Fun way to share developer info

## Installation

The component is already installed in your project at:
```
src/components/core/miscellaneous/developer-info.tsx
```

## Basic Usage

```tsx
import { DeveloperInfo } from "@/components/core/miscellaneous/developer-info";

function App() {
  return (
    <DeveloperInfo clickCount={7}>
      <Logo />
    </DeveloperInfo>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | The content to wrap (can be any component, image, or text) |
| `clickCount` | `number` | `7` | Number of clicks required to show the modal |
| `resetTimeout` | `number` | `3000` | Time in milliseconds before click count resets |
| `className` | `string` | `undefined` | Additional CSS classes for the wrapper |
| `developer` | `object` | See below | Developer information to display |

### Developer Object

```typescript
interface Developer {
  name?: string;      // Developer name
  github?: string;    // GitHub profile URL
  email?: string;     // Contact email
  role?: string;      // Job title or role
  bio?: string;       // Short biography
}
```

## Examples

### 1. Wrap Logo (Default Developer Info)

```tsx
<DeveloperInfo clickCount={7}>
  <Logo width={100} height={40} />
</DeveloperInfo>
```

### 2. Wrap Footer Text

```tsx
<footer>
  <DeveloperInfo clickCount={5}>
    <p>© 2025 My Company. All rights reserved.</p>
  </DeveloperInfo>
</footer>
```

### 3. Custom Developer Info

```tsx
<DeveloperInfo
  clickCount={10}
  developer={{
    name: "Jane Smith",
    github: "https://github.com/janesmith",
    email: "jane@example.com",
    role: "Lead Frontend Developer",
    bio: "Passionate about creating beautiful user experiences with React and TypeScript."
  }}
>
  <div>Version 2.0.0</div>
</DeveloperInfo>
```

### 4. Quick Activation (3 clicks)

```tsx
<DeveloperInfo clickCount={3} resetTimeout={2000}>
  <span className="text-sm">App Info</span>
</DeveloperInfo>
```

### 5. Wrap Any Component

```tsx
<DeveloperInfo clickCount={7}>
  <Image 
    src="/logo.png" 
    alt="Company Logo" 
    width={200} 
    height={50} 
  />
</DeveloperInfo>
```

## How It Works

1. **Click Detection**: The component tracks clicks on the wrapped element
2. **Progress Feedback**: When you're halfway to the target, a progress indicator appears
3. **Modal Trigger**: After reaching the click count, a modal opens with developer info
4. **Auto Reset**: If you stop clicking, the counter resets after `resetTimeout` milliseconds

## Styling

The component is fully styled using Tailwind CSS and integrates with your design system. You can add custom classes via the `className` prop:

```tsx
<DeveloperInfo className="opacity-50 hover:opacity-100">
  <Logo />
</DeveloperInfo>
```

## Accessibility

- ✅ Keyboard accessible (Enter and Space keys work)
- ✅ Proper ARIA roles
- ✅ Screen reader friendly
- ✅ Focus management

## Use Cases

- **Footer Credits**: Add to copyright text
- **Logo Easter Egg**: Hidden developer info in your logo
- **About Section**: Version numbers or app info
- **Team Page**: Fun way to reveal contact info
- **Debug Mode**: Hidden developer tools access

## Tips

- Use 7-10 clicks for a good balance between discovery and accessibility
- Place on elements users naturally click (logos, version numbers)
- Keep developer info concise and professional
- Test the click timing with your `resetTimeout` value

## Dependencies

- React 18+
- Radix UI Dialog
- Lucide React Icons
- Tailwind CSS

## License

Part of the Ski Shop project.