# Tabmark - Code Structure & File Guide

## 📁 Project Structure

```
tabmark/
├── app/
│   ├── layout.tsx                          # Root layout (dark theme setup)
│   ├── page.tsx                            # Landing page (248 lines)
│   ├── globals.css                         # Global styles & color theme
│   ├── dashboard/
│   │   ├── layout.jsx                      # Dashboard layout with sidebar
│   │   └── page.jsx                        # Kanban board with mock data (125 lines)
│   └── [other Next.js config files]
│
├── components/
│   └── dashboard/
│       ├── sidebar.jsx                     # Left sidebar navigation (82 lines)
│       ├── header.jsx                      # Top header with search & actions (41 lines)
│       ├── kanban-board.jsx                # Main board container (33 lines)
│       ├── kanban-column.jsx               # Column component (63 lines)
│       ├── kanban-card.jsx                 # Card component with AI button (80 lines)
│       └── ai-summary-modal.jsx            # AI summary modal popup (89 lines)
│
├── package.json                            # Dependencies
├── README.md                               # Project documentation
├── SETUP.md                                # Setup & installation guide
└── INDEX.md                                # This file
```

## 📄 File Descriptions

### Root Files

| File | Mô tả |
|------|-------|
| `app/layout.tsx` | Root layout với dark theme, fonts, metadata |
| `app/page.tsx` | Landing page với 6 sections (header, hero, features, tech, pricing, footer) |
| `app/globals.css` | Color theme (dark mode, purple/blue gradient), Tailwind setup |

### Dashboard Routes

| File | Mô tả |
|------|-------|
| `app/dashboard/layout.jsx` | Dashboard layout với Sidebar component |
| `app/dashboard/page.jsx` | Kanban page với drag-drop state management & mock data |

### Dashboard Components

| File | Dòng | Mô tả |
|------|------|-------|
| `sidebar.jsx` | 82 | User profile, search groups, 6 nav items, AI Chat button |
| `header.jsx` | 41 | Search box, Download/Import/Sync/Add group buttons |
| `kanban-board.jsx` | 33 | 4-column layout container |
| `kanban-column.jsx` | 63 | Column with header, cards area, drag target |
| `kanban-card.jsx` | 80 | Card with icon, title, URL, tags, time, AI button, menu |
| `ai-summary-modal.jsx` | 89 | Modal popup với AI summary, card info, footer buttons |

## 🎨 Color Theme

Dark mode with purple/blue gradient:
- **Background**: `#130F1D` (very dark)
- **Card**: `#1F1A31` (dark)
- **Primary**: Purple-blue `oklch(0.55 0.244 264.4)`
- **Accent**: Lighter purple `oklch(0.60 0.250 272.5)`
- **Sidebar**: `#191426` (darkest)

Column colors:
- **To Do**: Blue
- **In Progress**: Green
- **Review**: Amber/Orange
- **Done**: Purple

## 📊 Data Structure

```javascript
// Mock bookmark data structure
{
  id: '1',
  icon: '🐙',
  title: 'React Hooks Guide',
  url: 'github.com/facebook/react...',
  tags: ['tutorial', 'react'],
  time: '5 min'
}
```

## 🔧 Key Features

### Landing Page
- Responsive navigation header
- Hero section với call-to-action buttons
- 3 feature cards
- Tech stack section
- 2-tier pricing (Free/Pro)
- Multi-column footer

### Dashboard
- **Sidebar**: Navigation with groups
- **Header**: Search + bulk actions
- **Kanban Board**: 4 draggable columns
- **Cards**: 
  - Draggable between columns
  - Hover menu (Edit, Duplicate, Delete)
  - AI summary button
  - Tags display
  - Time estimate

### Modal
- AI Summary popup
- Card details
- Actions (Edit, Open Link)
- Click backdrop hoặc Escape để close

## 🚀 Current State

- ✅ Landing page complete
- ✅ Kanban dashboard complete
- ✅ Drag & drop functionality
- ✅ AI Summary modal
- ✅ Responsive sidebar
- ✅ Dark theme
- ❌ Database (uses mock data)
- ❌ Authentication
- ❌ Real AI integration
- ❌ Export/Import

## 📝 Dependencies

Main packages:
- `next@16.x` - React framework
- `react@19.x` - UI library
- `tailwindcss@4.x` - Styling
- `lucide-react` - Icons
- `@vercel/analytics` - Analytics

All dependencies already installed!

## 💡 How to Extend

### Add New Page
1. Create file: `app/newpage/page.jsx`
2. Export default component
3. Route automatically available at `/newpage`

### Add New Component
1. Create file: `components/my-component.jsx`
2. Import in page/layout
3. Use with `<MyComponent />`

### Modify Theme
1. Edit CSS variables in `app/globals.css`
2. Search for `--primary`, `--accent`, etc.
3. Change oklch values

### Add Mock Data
1. Edit `app/dashboard/page.jsx`
2. Modify `mockData` object
3. Add/remove cards in columns

### Connect Database
1. Install database driver
2. Create API routes in `app/api/`
3. Replace mock data with API calls
4. Add authentication layer

## 🎯 File Statistics

| Metric | Count |
|--------|-------|
| Total Components | 6 |
| Total Pages | 2 |
| Lines of JSX/Component Code | ~570 |
| Lines of Styling/Config | ~200 |
| Total Documented | ~770 |

## 🔗 Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `page.tsx` | Landing page |
| `/dashboard` | `page.jsx` | Kanban board |

## 🎓 Learning Points

This project demonstrates:
- Next.js 16 App Router
- React 19 with hooks
- Tailwind CSS 4 custom theme
- Drag & Drop API
- Component composition
- Dark mode implementation
- Responsive design
- Modal patterns
- State management with useState

Enjoy exploring and building! 🚀
