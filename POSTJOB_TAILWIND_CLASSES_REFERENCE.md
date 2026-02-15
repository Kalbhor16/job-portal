# PostJob Page - Tailwind CSS Classes Reference

Quick lookup for all Tailwind classes used in the PostJob page.

---

## 📥 Input Fields

### Standard Text Input
```jsx
className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-600 transition-all dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}
```

**Breakdown:**
- `w-full` - Take full width
- `px-4 py-3` - Padding (left/right 16px, up/down 12px)
- `border-2` - 2px border
- `rounded-lg` - Large rounded corners (8px)
- `focus:outline-none` - Remove default focus outline
- `focus:ring-2` - 2px focus ring
- `focus:ring-primary-400` - Green ring on focus
- `focus:border-primary-600` - Green border on focus
- `transition-all` - Smooth animation on all property changes
- `dark:bg-gray-700` - Dark mode background
- `dark:text-white` - Dark mode text color
- `border-red-500` - Red border on error
- `bg-red-50` - Light red background on error
- `dark:bg-red-900/20` - Dark red with 20% opacity on error

### Textarea (Multi-line)
```jsx
className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-600 transition-all dark:bg-gray-700 dark:text-white resize-none font-medium ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}
```

**Additional:**
- `resize-none` - Prevent user from resizing
- `font-medium` - Font weight 500

### Select Dropdown
```jsx
className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-600 transition-all dark:bg-gray-700 dark:text-white font-medium"
```

### Date Input
```jsx
className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-600 transition-all dark:bg-gray-700 dark:text-white font-medium ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}
```

**Additional:**
- `flex-1` - Take available flex space

---

## 🔘 Buttons

### Primary Button (Publish)
```jsx
className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
```

**Breakdown:**
- `flex items-center gap-2` - Flexbox center items with 8px gap
- `px-6 py-3` - Padding (horizontal 24px, vertical 12px)
- `bg-primary-600` - Green background
- `hover:bg-primary-700` - Darker green on hover
- `text-white` - White text
- `rounded-lg` - Rounded corners
- `transition-colors` - Smooth color transitions
- `disabled:opacity-50` - 50% opacity when disabled
- `disabled:cursor-not-allowed` - Disable cursor
- `font-semibold` - Bold text (font-weight 600)
- `shadow-lg` - Large shadow
- `hover:shadow-xl` - Bigger shadow on hover

### Secondary Button (Save Draft)
```jsx
className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
```

**Key Differences:**
- `border-2 border-gray-300` - Gray border instead of filled
- `text-gray-700` - Gray text
- `hover:bg-gray-100` - Light gray background on hover

### Add Question Button (Dashed)
```jsx
className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-semibold"
```

**Special:**
- `border-dashed` - Dashed border
- `border-primary-300` - Light green border
- `justify-center` - Center items horizontally
- `hover:bg-primary-50` - Very light green on hover
- `dark:hover:bg-primary-900/20` - Dark green with 20% opacity

---

## 🏷️ Badges & Tags

### Skill Badge
```jsx
className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold"
```

**Breakdown:**
- `px-3 py-1.5` - Small padding
- `bg-primary-100` - Very light green background
- `dark:bg-primary-900/40` - Dark green with 40% opacity
- `text-primary-700` - Dark green text
- `dark:text-primary-300` - Light green text in dark mode
- `rounded-full` - Fully rounded (pill shape)
- `text-xs` - Extra small text (12px)
- `font-semibold` - Bold

### Status Badge (Active)
```jsx
className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
```

### Status Badge (Draft)
```jsx
className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
```

---

## 📦 Containers & Sections

### Page Container
```jsx
className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
```

**Breakdown:**
- `min-h-screen` - Minimum height of viewport
- `bg-gray-50` - Light gray background
- `dark:bg-gray-900` - Very dark gray in dark mode
- `py-8` - Padding top/bottom (32px)
- `px-4` - Padding left/right (16px on mobile)
- `sm:px-6` - 24px on small screens
- `lg:px-8` - 32px on large screens

### Max Width Container
```jsx
className="max-w-5xl mx-auto"
```

**Breakdown:**
- `max-w-5xl` - Maximum width 64rem (1024px)
- `mx-auto` - Center horizontally

### Two-Column Grid (Form + Sidebar)
```jsx
className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32"
```

**Breakdown:**
- `grid` - Grid layout
- `grid-cols-1` - 1 column on mobile
- `lg:grid-cols-3` - 3 columns on large screens
- `gap-6` - 24px gap between items
- `pb-32` - Padding bottom 128px (for fixed footer)

### Section Grid (2 columns)
```jsx
className="grid grid-cols-2 gap-4"
```

### Section Grid (3 columns)
```jsx
className="grid grid-cols-3 gap-4"
```

### Section Card Container
```jsx
className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
```

**Breakdown:**
- `bg-white` - White background
- `dark:bg-gray-800` - Dark gray background
- `rounded-lg` - Rounded corners
- `shadow-lg` - Large shadow
- `p-6` - Padding 24px all around
- `border border-gray-200` - Light gray border
- `dark:border-gray-700` - Dark gray border

### Sticky Sidebar
```jsx
className="lg:col-span-1 lg:sticky lg:top-8 h-fit"
```

**Breakdown:**
- `lg:col-span-1` - Take 1 column on large screens
- `lg:sticky` - Sticky positioning on large screens
- `lg:top-8` - Stick 32px from top
- `h-fit` - Height fits content

---

## ⚙️ Flex & Layout Utilities

### Flex Center with Gap
```jsx
className="flex items-center gap-2"
```

### Flex Column with Gap
```jsx
className="space-y-4"
```

**Alternative (using flex):**
```jsx
className="flex flex-col gap-4"
```

### Label + Input Group
```jsx
className="flex items-center gap-2"
```

### Icon Styling
```jsx
className="text-gray-400"
```

---

## 📏 Spacing Reference

### Padding
```
p-2    = 8px
p-3    = 12px
p-4    = 16px
p-6    = 24px
```

### Gap
```
gap-1  = 4px
gap-2  = 8px
gap-4  = 16px
gap-6  = 24px
```

### Margin
```
mt-1   = 4px (top)
mt-2   = 8px
mb-4   = 16px (bottom)
mx-auto = center
```

---

## 🎨 Color Utilities

### Text Colors
```
text-primary-600     Green text
text-primary-400     Light green text
text-gray-700        Dark gray text
text-gray-500        Medium gray text (muted)
text-gray-400        Light gray text
text-white           White text
text-red-500         Red text (error)
text-yellow-700      Yellow text (warning)
```

### Background Colors
```
bg-white             White
bg-gray-50           Very light gray
bg-gray-100          Light gray
bg-gray-700          Dark gray
bg-primary-50        Very light green
bg-primary-100       Light green
bg-primary-600       Green
bg-red-50            Very light red
bg-yellow-100        Very light yellow
```

### Borders
```
border-2             2px border
border-gray-300      Light gray border
border-gray-600      Dark gray border
border-primary-300   Light green border
border-red-500       Red border
border-dashed        Dashed style
border-solid         Solid style
```

---

## 🌙 Dark Mode Pattern

All dark mode classes use `dark:` prefix:

```jsx
// Light mode (default)
className="bg-white text-gray-900"

// Dark mode (when 'dark' class on <html>)
className="dark:bg-gray-800 dark:text-white"

// Combined
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

---

## ✅ Form Validation States

### Valid State
```jsx
className="border-green-500 border-2"
```

### Error State
```jsx
className="border-red-500 bg-red-50 dark:bg-red-900/20"
```

### Focus State
```jsx
className="focus:ring-2 focus:ring-primary-400 focus:border-primary-600"
```

### Disabled State
```jsx
className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
```

---

## 🔄 Responsive Design

### Mobile First
```jsx
// Mobile (default)
className="grid-cols-1"

// Tablet (768px)
className="md:grid-cols-2"

// Desktop (1024px)
className="lg:grid-cols-3"

// Large Desktop (1280px)
className="xl:grid-cols-4"
```

### Hiding/Showing
```jsx
className="hidden lg:block"  // Hide on mobile, show on desktop
className="flex lg:hidden"   // Show on mobile, hide on desktop
```

---

## 🎯 Copy-Paste Snippets

### Input Field Template
```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Label Text
  </label>
  <input
    type="text"
    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-600 transition-all dark:bg-gray-700 dark:text-white ${
      error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
    }`}
  />
  {error && (
    <p className="text-red-500 text-sm mt-1">Error message</p>
  )}
</div>
```

### Button Template
```jsx
<button
  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
>
  <IconComponent size={18} />
  Button Text
</button>
```

### Card Template
```jsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Card Title
  </h3>
  {/* Content */}
</div>
```

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Color Reference](#-color-palette-used)

---

**Last Updated:** February 14, 2026
**Tailwind Version:** 4.1.18+
**Status:** Production Ready ✅
