# DevCom Design Guidelines

## Design Approach: Reference-Based (dev.to + GitHub + Medium Hybrid)

Taking inspiration from developer-focused platforms while creating a unique, polished identity:
- **dev.to**: Community engagement patterns, tag systems, clean reading experience
- **GitHub**: Code presentation, collaboration UI, dark theme excellence
- **Medium**: Article reading experience, typography hierarchy
- **Linear**: Modern minimalism, refined interactions

**Core Principle**: Developer-first aesthetics with productivity-focused clarity and visual breathing room.

---

## Color Palette

### Dark Mode (Primary)
- **Background Primary**: 220 20% 9% (deep charcoal)
- **Background Secondary**: 220 18% 12% (elevated surfaces)
- **Background Tertiary**: 220 16% 16% (cards, modals)
- **Brand Primary**: 262 80% 65% (vivid purple - CTA, links, active states)
- **Brand Secondary**: 262 60% 55% (hover states)
- **Accent**: 173 70% 50% (teal - success, verified badges, code highlights)
- **Text Primary**: 220 15% 95% (primary content)
- **Text Secondary**: 220 12% 70% (metadata, descriptions)
- **Text Tertiary**: 220 10% 50% (placeholders, disabled)
- **Border**: 220 15% 20% (dividers, subtle separators)
- **Code Background**: 220 22% 7% (syntax highlighting container)

### Light Mode
- **Background Primary**: 220 20% 98%
- **Background Secondary**: 220 15% 95%
- **Background Tertiary**: 0 0% 100%
- **Brand Primary**: 262 85% 58%
- **Text Primary**: 220 20% 15%
- **Text Secondary**: 220 15% 40%
- **Border**: 220 12% 88%

---

## Typography

### Font Families
- **Primary (UI)**: Inter (Google Fonts) - clean, professional, excellent readability
- **Monospace (Code)**: JetBrains Mono (Google Fonts) - developer favorite, ligatures support
- **Headings**: Inter with tighter letter-spacing (-0.02em for large sizes)

### Hierarchy
- **Hero/Display**: text-5xl to text-6xl, font-bold, leading-tight
- **Page Titles**: text-3xl to text-4xl, font-bold, tracking-tight
- **Section Headers**: text-2xl, font-semibold
- **Card Titles**: text-xl, font-semibold
- **Body**: text-base (16px), leading-relaxed (1.75)
- **Metadata**: text-sm, text-secondary
- **Code Inline**: text-sm, font-mono, px-1.5 py-0.5, bg-code

---

## Layout System

### Spacing Primitives
Primary units: **2, 4, 6, 8, 12, 16, 24** (e.g., p-2, gap-4, m-8, py-12)
- **Micro spacing**: 2, 4 (tight elements, badges)
- **Standard spacing**: 6, 8 (cards, component padding)
- **Section spacing**: 12, 16, 24 (page sections, generous breathing room)

### Container Strategy
- **Max widths**: max-w-7xl (main content), max-w-4xl (articles), max-w-2xl (forms)
- **Page padding**: px-4 md:px-6 lg:px-8
- **Section vertical**: py-12 md:py-16 lg:py-24

---

## Component Library

### Navigation
- **Top Bar**: Sticky, backdrop-blur-xl, bg-background/80, border-b
- **Logo + Search + Profile**: Horizontal flex, search expands to max-w-md on focus
- **Nav Items**: Subtle hover (bg-tertiary), active state (brand primary text + underline)

### Feed & Cards
- **Post Cards**: bg-secondary, rounded-xl, p-6, border border-border, hover:border-accent transition
- **Article Cards**: Larger padding (p-8), featured image (rounded-t-xl), gradient overlay on images
- **Code Snippet Cards**: bg-code, syntax highlighting with Prism.js or highlight.js, copy button (top-right)
- **Grid Layout**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6

### Content Display
- **Article Reader**: max-w-3xl mx-auto, generous line-height, large font (text-lg)
- **Code Blocks**: Full-width within article container, line numbers, language badge (top-right)
- **Syntax Highlighting**: VS Code Dark+ theme colors for consistency

### Interactive Elements
- **Primary Buttons**: bg-brand-primary, rounded-lg, px-6 py-3, font-medium, hover:bg-brand-secondary
- **Secondary Buttons**: border border-brand-primary, text-brand-primary, hover:bg-brand-primary/10
- **Icon Buttons**: p-2, rounded-md, hover:bg-tertiary
- **Like/Reaction**: Heart icon, scale animation on click, counter beside
- **Comment Input**: bg-tertiary, rounded-lg, focus ring (ring-brand-primary)

### User Profiles
- **Avatar**: Rounded-full, ring-2 ring-accent (verified), sizes: w-8 (sm), w-12 (md), w-24 (lg)
- **Profile Header**: Cover pattern/gradient, avatar overlap, bio max-w-2xl
- **Stats Bar**: Flex row, gap-8, each stat (value + label vertical stack)
- **Content Tabs**: border-b, active tab (border-b-2 border-brand-primary)

### Messaging/Forums
- **Thread List**: Divide-y divider, each thread (py-4, hover:bg-secondary)
- **Message Bubbles**: Self (ml-auto, bg-brand-primary, text-white), Others (bg-tertiary)
- **Typing Indicator**: Animated dots, text-secondary

---

## Images

### Hero Section
**Large Hero Image**: YES - Full-width background showcasing developer collaboration
- **Placement**: Top of homepage, h-screen or min-h-[600px]
- **Image Description**: Abstract developer workspace with code editors, terminals, collaborative coding scene, or geometric pattern representing connectivity
- **Treatment**: Gradient overlay (from transparent to bg-primary), centered content (title + CTA)
- **CTA Buttons**: variant="outline" with backdrop-blur-md bg-white/10

### Content Images
- **Profile Headers**: Abstract patterns or developer workspace photos (16:9 aspect)
- **Article Featured**: Full-width responsive images, rounded corners, lazy loading
- **Project Thumbnails**: Screenshot or custom graphic (4:3 aspect), max-h-48, object-cover

---

## Key Interactions

### Micro-interactions (Minimal)
- **Card Hover**: Subtle lift (translate-y-[-2px]), border color shift
- **Button Press**: Scale 98% on active state (built-in)
- **Like Animation**: Heart scale-in + color fill (one-time)
- **Code Copy**: Tooltip "Copied!" fade-in/out (2s)

### Transitions
- All transitions: duration-200 ease-out
- Page navigation: Instant (no route transitions)
- Modal/Dialog: Fade + scale from 95% to 100%

---

## Dark Mode Excellence
- Consistent implementation across ALL components including inputs, textareas, select dropdowns
- Form elements: bg-tertiary, border-border, focus:ring-brand-primary
- Syntax highlighting maintains vibrant colors even in dark mode
- Sufficient contrast ratios (WCAG AA minimum)

---

This design creates a visually striking, professional developer community that balances aesthetic appeal with functional clarity—optimized for long reading sessions, code sharing, and community engagement.