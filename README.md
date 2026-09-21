# TabMark - AI-Powered Bookmark Manager with Kanban



TabMark là nền tảng quản lý bookmark thông minh thế hệ mới, kết hợp bảng Kanban trực quan và sức mạnh của Google Gemini AI, giúp bạn lưu trữ, phân loại và tra cứu liên kết theo tốc độ tư duy.

---

## 🚀 Tính năng nổi bật

- **Quản lý Bookmark Kanban trực quan:**
  - Tổ chức bookmark theo các nhóm và danh mục linh hoạt.
  - Kéo thả mượt mà để sắp xếp vị trí tab lên/xuống ngay trong cùng một nhóm hoặc chuyển giữa các nhóm khác nhau.
  - Hỗ trợ nút mũi tên di chuyển nhanh (Lên/Xuống) thuận tiện trên cả điện thoại và máy tính.

- **Tích hợp Trợ lý AI (Google Gemini):**
  - Tự động tóm tắt nhanh nội dung của liên kết bất kỳ chỉ với 1 click.
  - Hộp thoại AI Assistant hỗ trợ trò chuyện, gợi ý và tìm kiếm bookmark ngữ nghĩa.

- **Chia sẻ đa dạng (Advanced Sharing):**
  - Chia sẻ toàn bộ kho bookmark, theo từng nhóm hoặc tự do tick chọn các bookmark mong muốn.
  - Kiểm soát quyền truy cập: **Riêng tư (Private)**, **Chỉ xem (View Only)**, hoặc **Cùng chỉnh sửa (Can Edit)**.
  - Liên kết xem trực tiếp tức thì trên web không cần người nhận phải đăng nhập.

- **Tài khoản & Xác thực linh hoạt:**
  - Đăng nhập an toàn qua **Google OAuth** hoặc **Email & Mật khẩu**.
  - Cho phép tài khoản Google tự thiết lập thêm mật khẩu để đăng nhập song song bằng cả 2 hình thức.
  - Tải ảnh đại diện (Avatar) trực tiếp từ thiết bị, tự động cắt vuông và lưu trữ an toàn trên cơ sở dữ liệu.

- **Sao lưu & Đồng bộ:**
  - Sao lưu và khôi phục dữ liệu qua file JSON (Export & Import) dễ dàng.
  - Tự động đồng bộ thời gian thực với cơ sở dữ liệu đám mây Supabase và lưu trữ dự phòng ngoại tuyến (LocalStorage).

- **Tiện ích Chrome Extension:**
  - Thư mục `extension/` hỗ trợ cài đặt extension vào trình duyệt để lưu nhanh các trang web đang xem vào TabMark.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **AI Engine:** Google Gemini API
- **Triển khai (Deployment):** Vercel

---

## 💻 Hướng dẫn chạy dự án

### 1. Cài đặt thư viện
```bash
pnpm install
# hoặc npm install / yarn install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc với các thông tin:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 3. Khởi chạy ở môi trường phát triển
```bash
pnpm dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:5173`

### 4. Build sản phẩm
```bash
pnpm build
```

---

## 👥 Đội ngũ & Đóng góp

- **Dự án:** TabMark (EXE201 Startup Project)
- **GitHub Repository:** [https://github.com/QuangTuan30009/TabMark](https://github.com/QuangTuan30009/TabMark)
- **Website:** [https://tab-mark-cyan.vercel.app/](https://tab-mark-cyan.vercel.app/)

---

## 📄 Bản quyền

Dự án được phát hành theo giấy phép [MIT License](LICENSE).
