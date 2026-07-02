# 📥 Hướng Dẫn Download Code Tabmark

## Cách 1: Download từ v0 (Dễ Nhất)

### Bước 1: Download ZIP
1. Nhìn vào **top-right corner** của v0
2. Tìm **Version Box** (nơi hiển thị code/preview)
3. Click vào **"..."** (three dots)
4. Chọn **"Download ZIP"**
5. File sẽ tải xuống máy

### Bước 2: Giải nén
- Windows: Chuột phải → "Extract All"
- Mac/Linux: Double-click hoặc `unzip tabmark.zip`

### Bước 3: Chạy
```bash
cd tabmark
pnpm install
pnpm dev
```

Xong! Truy cập http://localhost:3000

---

## Cách 2: Copy Code Manual

Nếu bạn muốn copy từng file:

### Landing Page
**File**: `app/page.tsx`
- 248 dòng code React
- Header, hero, features, pricing, footer
- Tailwind styled

### Dashboard Layout
**File**: `app/dashboard/layout.jsx`
- Layout wrapper với sidebar
- Flex layout

### Dashboard Page
**File**: `app/dashboard/page.jsx`
- Kanban board logic
- Mock data (9 bookmarks)
- Drag-drop state

### Components (6 files trong `components/dashboard/`)

1. **sidebar.jsx** - Navigation sidebar
2. **header.jsx** - Top header bar
3. **kanban-board.jsx** - Board container
4. **kanban-column.jsx** - Column
5. **kanban-card.jsx** - Card
6. **ai-summary-modal.jsx** - Modal popup

### Styling
**File**: `app/globals.css`
- Dark theme variables
- Color scheme
- Tailwind setup

---

## Cách 3: Use GitHub (Nếu v0 push lên GitHub)

```bash
git clone [repository-url]
cd tabmark
pnpm install
pnpm dev
```

---

## ⚡ Quick Start Checklist

- [ ] Download hoặc clone code
- [ ] Chạy `pnpm install` (hoặc `npm install`)
- [ ] Chạy `pnpm dev`
- [ ] Mở http://localhost:3000
- [ ] Click "Dùng miễn phí" để vào dashboard
- [ ] Kéo thả bookmark giữa các cột
- [ ] Click "AI" trên card để xem summary

---

## 📦 File Structure Sau Khi Download

```
tabmark/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Styling
│   └── dashboard/
│       ├── page.jsx          ← Dashboard
│       └── layout.jsx        ← Dashboard layout
├── components/
│   └── dashboard/
│       ├── sidebar.jsx
│       ├── header.jsx
│       ├── kanban-board.jsx
│       ├── kanban-column.jsx
│       ├── kanban-card.jsx
│       └── ai-summary-modal.jsx
├── package.json
├── README.md                 ← Read this first!
├── SETUP.md                  ← Setup guide
├── INDEX.md                  ← File structure
├── DELIVERY.md               ← What's included
└── DOWNLOAD.md               ← This file
```

---

## 🆘 Gặp Vấn Đề?

### Port 3000 đã sử dụng?
```bash
pnpm dev -- -p 3001
# Truy cập http://localhost:3001
```

### Module not found?
```bash
rm -rf node_modules
pnpm install
```

### Next.js build error?
```bash
rm -rf .next
pnpm dev
```

---

## 📚 Tài Liệu

Sau khi download, đọc:
1. **README.md** - Project overview
2. **SETUP.md** - Installation guide
3. **INDEX.md** - Code structure
4. **DELIVERY.md** - What's included

---

## 🚀 Deploy (Optional)

### Deploy to Vercel (1 Click)
1. Push code to GitHub
2. Vào vercel.com
3. Click "New Project"
4. Select repository
5. Deploy!

### Deploy to Netlify
```bash
pnpm build
# Deploy the 'out' folder
```

---

## ✨ After Download

You can now:
- ✅ Run locally
- ✅ Modify code
- ✅ Add features
- ✅ Deploy online
- ✅ Share with team

---

## 💡 Tips

- Dùng VS Code để edit code
- Tailwind CSS IntelliSense extension recommended
- Check `app/globals.css` để thay đổi màu sắc
- Mock data trong `app/dashboard/page.jsx`

---

## 🎉 Ready?

Download code và chạy `pnpm dev`!

Questions? Check README.md hoặc SETUP.md.

Happy coding! 🚀
