---
description: Scaffold a new React + Vite + TailwindCSS project from scratch
---

## New Project Setup

Use this workflow to spin up a new project. Ask the user for:
1. **Project name** (used as directory name and package name)
2. **Location** (default: `~/CascadeProjects/<project-name>`)
3. **Extras** — which optional pieces to include:
   - Supabase (`@supabase/supabase-js`)
   - React Router (`react-router-dom`)
   - dnd-kit (`@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`)
   - shadcn/ui (requires additional setup)

---

### Step 1 — Scaffold with Vite

```bash
npm create vite@latest <project-name> -- --template react
```

### Step 2 — Install core dependencies

```bash
cd <project-name> && npm install
```

### Step 3 — Install TailwindCSS v4 (Vite plugin)

```bash
npm install tailwindcss @tailwindcss/vite
```

Add to `vite.config.js`:
```js
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [react(), tailwindcss()],
}
```

Add to the top of `src/index.css`:
```css
@import "tailwindcss";
```

### Step 4 — Install Lucide icons

```bash
npm install lucide-react
```

### Step 5 — Install optional extras (if requested)

**Supabase:**
```bash
npm install @supabase/supabase-js
```
Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```
Create `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**React Router:**
```bash
npm install react-router-dom
```

**dnd-kit:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Step 6 — Clean up Vite boilerplate

- Delete `src/assets/react.svg` and `public/vite.svg`
- Replace `src/App.jsx` with a minimal starter:
```jsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-900">Hello World</h1>
    </div>
  )
}
```
- Replace `src/index.css` content with just `@import "tailwindcss";`
- Remove unused imports from `src/main.jsx`

### Step 7 — Add .gitignore and .env.example

```bash
git init
```

Create `.env.example` from `.env.local` with values blanked out.

### Step 8 — Start dev server

```bash
npm run dev
```

Open the browser preview to confirm everything works.
