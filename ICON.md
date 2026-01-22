# AeIcon Component

[English](./ICON.md) | [简体中文](./ICON.zh.md)

The `AeIcon` component is a dynamic icon component based on [Iconify](https://iconify.design/), supporting 100,000+ icons from various icon libraries.

## Basic Usage

```vue
<template>
  <!-- Iconify online icons -->
  <AeIcon icon="ep:user" />
  <AeIcon icon="mdi:home" :size="24" color="#409eff" />
  
  <!-- Local SVG icons (requires svg-icon plugin) -->
  <AeIcon icon="svg-icon:logo" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | `string` | - | Icon name (required). Supports Iconify format `prefix:icon-name` or local svg `svg-icon:name` |
| size | `string \| number` | `16` | Icon size |
| color | `string` | - | Icon color |

---

## Custom Icon Collections

The component supports registering custom icon collections, allowing you to use local SVG icons with the same `prefix:icon-name` format.

### Method 1: Register During Installation (Recommended)

Register custom icon collections when installing the component library:

```typescript
// main.ts
import { createApp } from 'vue'
import AdvancedEleUI from 'advanced-ele-ui'
import 'advanced-ele-ui/dist/style.css'

const app = createApp(App)

app.use(AdvancedEleUI, {
  iconCollections: [
    {
      prefix: 'my-icons',
      width: 24,
      height: 24,
      icons: {
        'home': {
          body: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>'
        },
        'user': {
          body: '<circle cx="12" cy="8" r="4"/><path d="M12 14c-6.63 0-12 2.69-12 6v2h24v-2c0-3.31-5.37-6-12-6z"/>'
        },
        'settings': {
          body: '<path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>'
        }
      }
    }
  ]
})

app.mount('#app')
```

Then use in your components:

```vue
<template>
  <AeIcon icon="my-icons:home" :size="24" />
  <AeIcon icon="my-icons:user" :size="24" color="#409eff" />
  <AeIcon icon="my-icons:settings" :size="24" />
</template>
```

### Method 2: Dynamic Registration

Register icons dynamically at runtime:

```typescript
import { addIcon, addIconCollection } from 'advanced-ele-ui'

// Add a single icon
addIcon('my-icons:custom', {
  body: '<path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>',
  width: 24,
  height: 24
})

// Add an icon collection
addIconCollection({
  prefix: 'brand',
  width: 24,
  height: 24,
  icons: {
    'logo': { body: '<rect width="24" height="24" rx="4"/>' },
    'icon-a': { body: '<circle cx="12" cy="12" r="10"/>' }
  }
})
```

### Method 3: Load from JSON File

You can define icon collections as JSON files:

```json
// src/icons/my-icons.json
{
  "prefix": "my-icons",
  "width": 24,
  "height": 24,
  "icons": {
    "home": { "body": "<path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/>" },
    "user": { "body": "<circle cx=\"12\" cy=\"8\" r=\"4\"/>" }
  }
}
```

Then import and register:

```typescript
// main.ts
import { addIconCollection } from 'advanced-ele-ui'
import myIcons from './icons/my-icons.json'

addIconCollection(myIcons)
```

---

## API Reference

### Types

```typescript
/**
 * Icon data interface
 * Conforms to Iconify icon format specification
 */
interface IconData {
  /** SVG body (without <svg> tag) */
  body: string
  /** Icon width (default 16) */
  width?: number
  /** Icon height (default 16) */
  height?: number
  /** Left offset */
  left?: number
  /** Top offset */
  top?: number
  /** Rotation (0-3, each value represents 90 degrees) */
  rotate?: number
  /** Horizontal flip */
  hFlip?: boolean
  /** Vertical flip */
  vFlip?: boolean
}

/**
 * Icon collection interface
 * For batch registering icons
 */
interface IconCollection {
  /** Collection prefix, usage format: prefix:icon-name */
  prefix: string
  /** Icon set */
  icons: Record<string, IconData>
  /** Default width (all icons) */
  width?: number
  /** Default height (all icons) */
  height?: number
  /** Last modified timestamp */
  lastModified?: number
}
```

### Functions

| Function | Description |
|----------|-------------|
| `addIcon(name: string, data: IconData): void` | Add a single custom icon |
| `addIconCollection(collection: IconCollection): boolean` | Add an icon collection |
| `addIconCollections(collections: IconCollection[]): void` | Add multiple icon collections at once |

---

## Converting SVG Files to Icon Collection

Here's a simple Node.js script to convert local SVG files into an icon collection:

```typescript
// scripts/generate-icons.ts
import fs from 'fs'
import path from 'path'

const iconsDir = './src/icons'
const outputFile = './src/icons/collection.json'

const icons: Record<string, { body: string }> = {}

fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('.svg'))
  .forEach(file => {
    const content = fs.readFileSync(path.join(iconsDir, file), 'utf-8')
    // Extract content inside <svg> tag
    const match = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
    if (match) {
      const name = file.replace('.svg', '')
      icons[name] = { body: match[1].trim() }
    }
  })

const collection = {
  prefix: 'local',
  width: 24,
  height: 24,
  icons
}

fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2))
console.log(`Generated ${Object.keys(icons).length} icons`)
```

Run with:

```bash
npx ts-node scripts/generate-icons.ts
```

---

## Best Practices

1. **Use descriptive prefixes**: Choose unique prefixes that describe the icon set (e.g., `brand`, `custom`, `app`)

2. **Consistent sizing**: Set default `width` and `height` at the collection level for consistent icon sizes

3. **Optimize SVG paths**: Remove unnecessary attributes and optimize paths before adding to the collection

4. **Lazy loading**: For large icon sets, consider registering icons on-demand rather than all at once

5. **Type safety**: Import types for better TypeScript support:

```typescript
import type { IconData, IconCollection } from 'advanced-ele-ui'

const myIcon: IconData = {
  body: '<path d="..."/>',
  width: 24,
  height: 24
}
```

---

## Related Resources

- [Iconify Icon Sets](https://icon-sets.iconify.design/) - Browse 100,000+ icons
- [Iconify Documentation](https://iconify.design/docs/) - Official Iconify docs
- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/) - Online SVG path editor
