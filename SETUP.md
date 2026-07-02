# Hướng dẫn Setup Tabmark

## Bước 1: Download Code

1. Click vào **Preview** hoặc bấm **Version Box** ở góc trên phải
2. Click **...** (three dots) → **Download ZIP**
3. Giải nén file

## Bước 2: Cài đặt Dependencies

```bash
cd tabmark
pnpm install
```

Hoặc nếu bạn sử dụng npm:
```bash
npm install
```

## Bước 3: Chạy Development Server

```bash
pnpm dev
```

Mở browser và vào: http://localhost:3000

## Bước 4: Khám phá ứng dụng

### Landing Page (http://localhost:3000)
- Xem các tính năng chính
- Xem bảng giá
- Click "Dùng miễn phí" để vào dashboard

### Dashboard (http://localhost:3000/dashboard)
- Quản lý bookmark trong Kanban board
- Kéo thả bookmark giữa các cột
- Click nút "AI" trên bookmark để xem AI Summary
- Sử dụng sidebar để chuyển đổi nhóm

## Bước 5: Chỉnh sửa code (Tùy chọn)

### Cấu trúc folder chính
- `app/` - React/Next.js app routes
- `components/` - React components
- `app/globals.css` - Global styles & theme
- `README.md` - Tài liệu dự án

### Cách thêm tính năng

#### 1. Thêm page mới
Tạo file `app/newpage/page.jsx`

#### 2. Thêm component mới
Tạo file `components/my-component.jsx`

#### 3. Thay đổi theme/style
Edit `app/globals.css` - các CSS variables ở đầu file

#### 4. Thêm icon mới (từ Lucide)
```jsx
import { IconName } from 'lucide-react'
// Dùng: <IconName className="w-6 h-6" />
```

## Bước 6: Build & Deploy (Tuỳ chọn)

### Tạo production build
```bash
pnpm build
```

### Chạy production version
```bash
pnpm start
```

### Deploy lên Vercel (Khuyến nghị)
1. Đẩy code lên GitHub
2. Vào vercel.com
3. Nhấn "New Project"
4. Chọn repository
5. Deploy

## Gặp vấn đề?

### Lỗi port đã sử dụng
```bash
# Sử dụng port khác
pnpm dev -- -p 3001
```

### Xóa node_modules và cài lại
```bash
rm -rf node_modules
pnpm install
```

### Xóa cache Next.js
```bash
rm -rf .next
pnpm dev
```

## Cộng đồng & Support

- Tham khảo README.md để biết thêm chi tiết
- Xem comments trong code để hiểu cách hoạt động
- Explore từng component trong `components/`

Chúc bạn code vui!
