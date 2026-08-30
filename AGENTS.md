<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mobile UI Design Patterns

## Layout Structure

### Dashboard Shell (`src/components/dashboard-shell.tsx`)
- Uses `overflow-hidden` to prevent horizontal scroll
- Sidebar on mobile: fixed position with hamburger button at `right-3 top-3 z-50`
- Sidebar on desktop: fixed left sidebar with `md:ml-16` (collapsed) or `md:ml-64` (expanded)

### Header (`src/components/header.tsx`)
- Contains the page title (e.g., "Transacciones", "Dashboard")
- Contains action buttons (e.g., "Crear") via `useHeaderStore`
- Action buttons should be hidden on mobile with `hidden md:inline-flex`

## Button Patterns

### Desktop
- "Crear" button goes in the **header** via `useHeaderStore`
- Example: `setHeaderAction(<Button size="sm" className="hidden md:inline-flex"><Plus /> Crear</Button>)`

### Mobile
- "Crear" button goes in the **content area**, below the header
- Example: `<div className="flex md:hidden mt-6"><Button><Plus /> Crear</Button></div>`
- **Never use FAB (Floating Action Buttons)** - they overlap with the sidebar hamburger

## Content Container

### Page Container
```tsx
<div className="space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-hidden pb-20">
  {/* Content */}
</div>
```
- Use `max-w-full overflow-hidden` to prevent horizontal overflow
- Add `pb-20` for bottom padding on mobile

### Responsive Grids
- Summary cards: `grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4`
- Feature cards: `grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4`

## Mobile Sidebar

### Hamburger Button
```tsx
<button
  className="fixed right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-md md:hidden"
>
  {/* Menu/X icon based on state */}
</button>
```

### Overlay
```tsx
<div className="fixed inset-0 z-30 bg-black/40 md:hidden" />
```

## Transaction List (Mobile)

### Action Pattern
- Use `MoreHorizontal` icon as action trigger
- Tap to show action panel (Editar, Eliminar, Cerrar)
- Action panel slides in below the item

```tsx
<div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-t border-border/30">
  <Button variant="ghost" size="sm"><Pencil /> Editar</Button>
  <Button variant="ghost" size="sm" className="text-danger"><Trash2 /> Eliminar</Button>
  <Button variant="ghost" size="sm" className="ml-auto">Cerrar</Button>
</div>
```

## Font
- Use DM Sans as the primary font (configured in `layout.tsx`)

## Logo
- Use the mascot SVG from `src/app/logo.tsx`
- Import as `import { Logo } from "@/app/logo"`
- Favicon is at `public/logo.svg` (same mascot SVG)

## Animations
- Cards: `animate-fade-in-up` with stagger delays
- Hero: `animate-fade-in` for logo, `animate-fade-in-up` with delays for content

## CTA Sections
- Use gradient: `bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500`
- Add decorative blur circles for depth
- Include badge "100% gratuito"
- Two buttons: primary (white bg) + secondary (border white/30)
