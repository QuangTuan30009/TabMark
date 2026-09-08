# 🔍 Review CAPEX vs OPEX – TabMark

> Đối chiếu CAPEX (16.000.000 đ một lần) với OPEX hằng tháng để tìm điểm mâu thuẫn, thiếu sót và không hợp lý.

---

## ✅ Những điểm CAPEX & OPEX khớp nhau

| Hạng mục CAPEX | Liên kết OPEX | Đánh giá |
|---|---|---|
| Phát triển nền tảng Web MVP | FE deploy = 0đ/tháng (Cloudflare Pages) | ✅ Khớp |
| Thiết lập cơ sở dữ liệu (Supabase) | OPEX: Supabase Free → Pro | ✅ Khớp, logic liền mạch |
| Phát triển chức năng AI (Gemini) | OPEX: AI API ~50K–200K đ/tháng | ✅ Khớp |
| Domain 1 năm – 500.000đ | OPEX: ~45.000đ/tháng = ~540.000đ/năm | ✅ Khớp (sai lệch nhỏ 40K) |

---

## 🔴 Vấn Đề & Mâu Thuẫn Nghiêm Trọng

### 1. SSL Security – 500.000đ trong CAPEX là SAI

> **CAPEX ghi:** SSL Certificate = 500.000đ (chi phí một lần)
> **Thực tế & OPEX ghi:** SSL = **0đ** (Let's Encrypt miễn phí qua Vercel/Cloudflare/Netlify)

- Tất cả các nền tảng deploy hiện đại (Vercel, Netlify, Cloudflare Pages) đều **tự động cấp SSL miễn phí**
- Khoản 500.000đ này **không có cơ sở**, nên loại bỏ hoặc ghi rõ dùng chứng chỉ trả phí (Comodo, DigiCert) — nhưng không cần thiết
- → **Đề xuất: Xóa hoặc đặt = 0đ, tiết kiệm 500.000đ**

---

### 2. Thiết lập Server & Cloud – 2.000.000đ mơ hồ và không nhất quán

> **CAPEX ghi:** VPS/Cloud Server – 2.000.000đ (chi phí khởi tạo hạ tầng ban đầu)
> **OPEX & thực tế dự án:** TabMark là **SPA tĩnh**, KHÔNG có VPS/server riêng. Deploy trên CDN (Cloudflare Pages/Vercel) = **0đ**

**Mâu thuẫn:**
- Nếu không có server thì "khởi tạo hạ tầng" này là gì? Dự án Supabase (database) không tốn phí setup
- 2.000.000đ không giải thích được chi cái gì cụ thể
- Không có OPEX tương ứng (server hằng tháng = 0đ) → CAPEX và OPEX **nghịch nhau**

**Nếu muốn giữ khoản này:** Cần đổi tên thành "Chi phí cấu hình Supabase + thiết lập CI/CD + cấu hình môi trường deploy" và giải thích rõ hơn

---

### 3. Thiết lập cơ sở dữ liệu – 2.000.000đ bị tính 2 lần

> **CAPEX ghi:** PostgreSQL/Supabase – 2.000.000đ riêng, tách với "Thiết lập Server & Cloud"

- Supabase đã **bao gồm luôn PostgreSQL** — không có "chi phí cấu hình riêng" cho database
- Khoản này gần như **trùng với hạng mục Server & Cloud** ở trên
- → Hai khoản 2M + 2M = **4.000.000đ** đang mô tả cùng một thứ

**Đề xuất:** Gộp 2 hạng mục thành một: "Thiết lập hạ tầng kỹ thuật (Supabase + Cloudflare + CI/CD)" = 2.000.000đ

---

### 4. Công cụ hỗ trợ phát triển – 1.000.000đ không khớp với OPEX

> **CAPEX ghi:** GitHub Team, Figma Professional, Notion, Postman – 1.000.000đ (một lần)
> **OPEX:** Không có hạng mục "công cụ dev" hằng tháng

**Vấn đề:**
- **GitHub Team**: $4/user/tháng → không phải trả một lần, là **subscription hằng tháng**
- **Figma Professional**: $15/user/tháng → cũng là subscription, không phải CAPEX
- → Những khoản này thuộc **OPEX**, không phải CAPEX, trừ khi bạn mua license vĩnh viễn

**Thực tế**: Nếu dùng GitHub Free + Figma Free (đủ cho MVP) → chi phí = 0đ

**Đề xuất:** Hoặc chuyển sang OPEX, hoặc dùng free tiers và xóa khoản này

---

### 5. Domain 500.000đ trong CAPEX vs OPEX ~540.000đ/năm

> **CAPEX ghi:** Domain .com = 500.000đ/năm
> **OPEX tính:** ~45.000đ/tháng × 12 = ~540.000đ/năm

- Sai lệch nhỏ ~40.000đ — tương đối ổn, có thể do làm tròn
- ⚠️ Nếu domain đã trả trong CAPEX năm đầu → OPEX năm đầu **không cần tính domain nữa**, chỉ tính từ năm thứ 2
- → Nên ghi rõ trong OPEX: "Domain gia hạn từ tháng 13" hoặc chia đều 12 tháng

---

### 6. Beta Testing 2.000.000đ – Không có chi phí AI tương ứng

> **CAPEX ghi:** Beta testing ~100 users – 2.000.000đ

- Nếu 100 user beta dùng AI trong 1 tháng test → tốn ~50.000–200.000đ AI API (Gemini)
- Chi phí này **nên được tính vào Beta Testing budget**, không phải để trống
- Ngân sách 2.000.000đ cho 100 users test là hợp lý (quà, incentive, infra)

---

## 📊 So Sánh Tổng Quan CAPEX vs OPEX

```
CAPEX Total: 16.000.000đ (một lần)
OPEX MVP:    ~75.000 – 145.000đ/tháng
OPEX Growth: ~1.600.000 – 2.750.000đ/tháng

Năm 1 tổng chi phí = CAPEX + (OPEX × 12)
  → MVP scenario:    16M + (145K × 12) = ~17.740.000đ
  → Growth scenario: 16M + (2.75M × 12) = ~49.000.000đ
```

---

## 🛠️ CAPEX Sau Khi Điều Chỉnh (Khuyến Nghị)

| Hạng mục | Cũ | Mới | Ghi chú |
|---|---|---|---|
| Thiết kế Logo & Brand | 0đ | 0đ | ✅ Giữ nguyên |
| Thiết kế UI/UX (Figma) | 0đ | 0đ | ✅ Giữ nguyên |
| Phát triển Web MVP | 0đ | 0đ | ✅ Giữ nguyên |
| **Thiết lập hạ tầng kỹ thuật** *(gộp Server + DB)* | 4.000.000đ | **2.000.000đ** | 🔴 Gộp 2 hạng mục trùng nhau |
| Phát triển chức năng AI | 3.000.000đ | 3.000.000đ | ✅ Giữ nguyên |
| Domain (.com, 1 năm) | 500.000đ | 500.000đ | ✅ Giữ nguyên |
| **SSL Certificate** | 500.000đ | **0đ** | 🔴 Xóa — miễn phí qua Cloudflare/Vercel |
| Beta Testing | 2.000.000đ | 2.000.000đ | ✅ Giữ nguyên |
| Product Launch | 5.000.000đ | 5.000.000đ | ✅ Giữ nguyên |
| **Công cụ dev** *(chuyển sang OPEX)* | 1.000.000đ | **0đ** | 🔴 Dùng free tiers (GitHub Free, Figma Free) |
| **TỔNG MỚI** | **16.000.000đ** | **~12.500.000đ** | Tiết kiệm ~3.500.000đ |

---

## 💡 Thêm Vào OPEX (từ CAPEX chuyển sang)

Nếu bạn giữ các công cụ trả phí, chuyển sang OPEX:

| Hạng mục | Chi phí/tháng | Ghi chú |
|---|---|---|
| GitHub Team (3 members) | ~300.000đ | $4/user/tháng |
| Figma Professional (1 designer) | ~380.000đ | $15/user/tháng |
| **Cộng thêm vào OPEX** | **~680.000đ** | Nếu không dùng free tier |

---

## ✅ Tóm Tắt Nhanh

| | Vấn đề | Mức độ |
|---|---|---|
| SSL 500K trong CAPEX | Không cần thiết, miễn phí | 🔴 Sửa ngay |
| Server 2M + DB 2M trùng nhau | Gộp thành 1 khoản | 🔴 Sửa ngay |
| Công cụ dev là OPEX không phải CAPEX | Chuyển hoặc xóa | 🟡 Nên sửa |
| Domain tính 2 lần (CAPEX + OPEX năm 1) | Làm rõ timeline | 🟡 Nên ghi chú |
| Beta Testing thiếu chi phí AI | Thêm ~100K vào budget | 🟢 Nhỏ |

---

*Review tạo lúc 2026-07-16 | Đối chiếu với OPEX TabMark đã phân tích*
