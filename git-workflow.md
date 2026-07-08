## Quy trình làm việc với Git & Branching (Git Branching Workflow)

Để phát triển dự án một cách chuyên nghiệp và tránh xung đột code (conflict) trên nhánh chính (`main`), chúng ta sẽ áp dụng quy trình phân nhánh như sau:

### 1. Phân loại các Nhánh (Branches) chính
* **`main`**: Nhánh chứa code chạy ổn định nhất (Production). **Tuyệt đối không push code thử nghiệm trực tiếp lên đây.**
* **`feature/tên-tính-năng`**: Nhánh dùng để phát triển các tính năng mới (ví dụ: `feature/auth-ui-redesign`).
* **`fix/tên-lỗi`**: Nhánh dùng để sửa lỗi (ví dụ: `fix/login-bug`).

### 2. Các bước làm việc chuẩn khi thêm tính năng mới
Khi bạn bắt đầu code một phần mới hoặc sửa giao diện:

1. **Cập nhật code mới nhất từ nhánh `main` về máy:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Tạo một nhánh mới từ `main` để làm việc:**
   ```bash
   git checkout -b feature/tên-tính-năng
   ```
3. **Thực hiện chỉnh sửa code, sau đó lưu trạng thái (commit):**
   ```bash
   git add .
   git commit -m "feat: mô tả ngắn về tính năng vừa làm bằng tiếng Anh"
   ```
4. **Đẩy nhánh mới này lên GitHub:**
   ```bash
   git push -u origin feature/tên-tính-năng
   ```
5. **Tạo Pull Request (PR) trên GitHub:**
   - Truy cập vào repository trên GitHub của bạn.
   - Nhấn nút **Compare & pull request**.
   - Kiểm tra lại các file thay đổi (diff) và gửi yêu cầu merge vào nhánh `main`. Sau khi kiểm tra kỹ, tiến hành Merge.

### 3. Quy chuẩn viết Commit Message (Conventional Commits)
Hãy viết commit message ngắn gọn và bắt đầu bằng các từ khóa sau:
* **`feat: `**: Thêm tính năng mới (Ví dụ: `feat: add google login button`)
* **`fix: `**: Sửa lỗi (Ví dụ: `fix: resolve crash on refresh`)
* **`style: `**: Thay đổi giao diện, CSS, format code (Ví dụ: `style: adjust login padding`)
* **`refactor: `**: Tối ưu hoặc dọn dẹp lại code mà không đổi logic (Ví dụ: `refactor: clean up supabase API functions`)