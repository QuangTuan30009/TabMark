# Tabmark - AI-Powered Bookmark Manager with Kanban

Một ứng dụng quản lý bookmark thông minh bằng AI với giao diện Kanban board trực quan, được xây dựng bằng React, Vite và Tailwind CSS.

## Tính năng chính

- **Landing Page**: Trang giới thiệu với hero section, tính năng, tech stack, bảng giá
- **Kanban Dashboard**: Giao diện quản lý bookmark với 4 cột (To Do, In Progress, Review, Done)
- **Kéo và thả**: Drag-and-drop tích hợp để di chuyển bookmark giữa các cột
- **AI Summary Modal**: Xem tóm tắt AI cho từng bookmark
- **Sidebar Navigation**: Quản lý nhóm (Work, Tools, Dev-Tools, Design Res., Personal, Reading List)
- **Dark Theme**: Giao diện tối hiện đại với màu chủ đạo xanh

## Cấu trúc dự án

```
src/
├── main.jsx             # React entry point
├── App.jsx              # Landing page + dashboard SPA
├── lib/
│   ├── supabaseClient.js # Supabase client
│   └── bookmarksApi.js   # Bookmark CRUD API
└── styles.css           # Global styles & theme

components/
├── dashboard/
│   ├── sidebar.jsx           # Navigation sidebar
│   ├── header.jsx            # Dashboard header
│   ├── kanban-board.jsx      # Kanban board container
│   ├── kanban-column.jsx     # Column component
│   ├── kanban-card.jsx       # Card component
│   └── ai-summary-modal.jsx  # AI summary modal
```

## Công nghệ sử dụng

- **React 19** - Frontend framework
- **Vite** - Frontend build tool
- **Supabase** - Backend as a Service + PostgreSQL database
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **JavaScript (ES6+)** - No TypeScript

## Cách chạy

1. **Cài đặt dependencies** (nếu chưa có):
   ```bash
   pnpm install
   # hoặc
   npm install
   # hoặc
   yarn install
   ```

2. **Chạy dev server**:
   ```bash
   pnpm dev
   ```

3. **Truy cập ứng dụng**:
   - Landing page: http://localhost:5173
   - Dashboard: http://localhost:5173/#dashboard

## Cấu hình Supabase

1. Tạo project Supabase mới.
2. Vào SQL Editor và chạy nội dung trong `supabase-schema.sql`.
3. Tạo file `.env` từ `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Restart dev server.

## Hướng dẫn sử dụng

### Landing Page
- Xem chi tiết về tính năng
- Kiểm tra bảng giá
- Click "Dùng miễn phí" hoặc "Xem demo" để vào dashboard

### Dashboard
- **Sidebar**: Chọn nhóm (Work, Tools, etc.)
- **Kanban Board**: Kéo thả bookmark giữa các cột
- **AI Summary**: Click nút "AI" trên mỗi card để xem tóm tắt
- **Header**: Tìm kiếm, import/export, sync, thêm bookmark

## Dữ liệu

Dự án đã có CRUD bookmark với hai chế độ:

- Có cấu hình Supabase: dữ liệu lưu vào bảng `bookmarks`.
- Chưa cấu hình Supabase: dữ liệu tạm lưu bằng `localStorage`.

Schema Supabase hiện mở public CRUD để demo nhanh cho môn học. Khi thêm đăng nhập, nên bổ sung `user_id` và siết Row Level Security theo từng user.

## Tính năng tiếp theo

- [x] Database integration với Supabase
- [x] CRUD bookmark
- [x] localStorage fallback
- [ ] User authentication
- [ ] Real AI summaries từ Gemini/OpenAI
- [x] Search functionality
- [ ] Export/Import bookmarks
- [ ] Collaborative sharing
- [ ] Browser extension
- [ ] Mobile app

## Build untuk production

```bash
pnpm build
pnpm start
```

## Deploy

Ứng dụng có thể deploy trên Vercel, Netlify, Cloudflare Pages, AWS hoặc Docker như một React static app.



## License

MIT

## Support

Nếu bạn gặp vấn đề, vui lòng tạo issue trong repository hoặc liên hệ support.

