# 🚀 CHIẾN LƯỢC SẢN PHẨM & TRIỂN KHAI ĐA NỀN TẢNG (OC1 - TABMARK)

---

## 🎯 1. Chiến Lược Sản Phẩm: Desktop-First & Chrome Extension

### 💡 Luận điểm bảo vệ trước Hội đồng chấm thi EXE101:
> *"Vì sao TabMark tập trung mạnh vào Web Application và Chrome Web Store thay vì chỉ làm App điện thoại thuần túy?"*

1. **Phù hợp hành vi người dùng thực tế (Product-Market Fit):**
   - 90% các tác vụ nghiên cứu tài liệu, lưu trữ liên kết học tập, tra cứu code và làm việc nhóm diễn ra trên **Máy tính / Laptop**.
   - Không người dùng nào quản lý hàng trăm tab công việc phức tạp trên màn hình điện thoại bé.
2. **Minh chứng từ các sản phẩm thành công trên thế giới:**
   - **Toby for Chrome:** $3M+ doanh thu ARR nhờ mô hình Chrome Extension + Web.
   - **Raindrop.io:** Hơn 1 triệu người dùng trả phí trên nền tảng Web & Extension.
   - **Pocket / Notion Web Clipper:** Cốt lõi thành công bắt nguồn từ tiện ích trình duyệt máy tính.
3. **Chiến lược Store của Google:**
   - **Chrome Web Store** là Store chính thức của hệ sinh thái Google (tương đương CH Play nhưng dành cho máy tính). Đưa sản phẩm lên Chrome Web Store hoàn toàn đáp ứng tiêu chí **"Store Deployed - 10 điểm"**.

---

## 📱 2. Vai Trò Của Mobile App (`TabMark.apk`): "Companion App"

TabMark không bỏ rơi Mobile mà định vị Mobile App làm **Ứng dụng đồng hành (Companion App)**:
- **Use Case thực tế:** Khi người dùng đọc báo, lướt tin tức trên điện thoại thấy tài liệu hay ➔ Bấm nút lưu vào TabMark trên điện thoại ➔ Dữ liệu tự động đồng bộ lên Supabase Cloud ➔ Khi mở Laptop làm việc, liên kết đã nằm sẵn trên bảng Kanban.
- **Hình thức nộp bài:** Cung cấp file **`TabMark.apk`** đóng gói hoàn chỉnh để đáp ứng tiêu chuẩn nộp bài của môn học.

---

## 🛠️ 3. Hướng Dẫn Triển Khai 3 Kênh Nộp Bài

### Kênh 1: Web App Live (Vercel)
- **Công cụ:** Vercel (kết nối trực tiếp từ repo GitHub `QuangTuan30009/TabMark`).
- **Thời gian deploy:** 2 phút.
- **Đầu ra:** Đường link thật `https://tabmark.vercel.app` (hoặc custom domain) hoạt động 24/7.

### Kênh 2: Chrome Extension Package
- **Cấu trúc:** Thư mục tiện ích chứa `manifest.json` (Manifest V3), icon TabMark, popup 1-click lưu nhanh link và chuyển hướng vào Dashboard.
- **Đầu ra:** File `TabMark-Extension.zip` nộp lên Chrome Web Store hoặc link tải về cài đặt trực tiếp.

### Kênh 3: Android Mobile App (`TabMark.apk`)
- **Công nghệ:** Đóng gói bằng **Capacitor Android** từ mã nguồn React hiện tại.
- **Đầu ra:** File `TabMark-release.apk` tải lên Google Drive nộp kèm video quay màn hình điện thoại thật.
