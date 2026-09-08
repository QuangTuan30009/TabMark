# 💰 OPEX – Chi Phí Vận Hành Hằng Tháng · TabMark

> **Ngữ cảnh kỹ thuật**: React 19 + Vite (SPA) · Supabase (PostgreSQL + Auth + Storage) · Gemini AI API · Deploy tĩnh (Vercel/Netlify/Cloudflare Pages) · Không có backend server riêng

---

## 🎯 Tóm Tắt Nhanh

| Giai đoạn | Tổng chi phí ước tính |
|---|---|
| **MVP / Early Stage** (0–200 users) | **~350.000 – 570.000 đ/tháng** |
| **Growth Stage** (200–2.000 users) | **~1.200.000 – 2.500.000 đ/tháng** |
| **Scale Stage** (2.000+ users) | **~5.000.000 – 12.000.000 đ/tháng** |

---

## 📋 Chi Tiết Từng Hạng Mục

### 1. 🖥️ Server / Hosting Frontend

TabMark là **SPA tĩnh (static app)**, không cần VPS riêng. Deploy trên CDN.

| Lựa chọn | Chi phí/tháng | Ghi chú |
|---|---|---|
| **Vercel (Free)** | **0 đ** | ✅ Đủ dùng giai đoạn MVP, 100GB bandwidth |
| Vercel Pro | ~550.000 đ | Cần khi traffic lớn, custom domain HTTPS |
| Netlify Free | 0 đ | Tương đương Vercel Free |
| Cloudflare Pages | 0 đ | Không giới hạn bandwidth, rất nhanh ở VN |

> **Khuyến nghị MVP**: Cloudflare Pages (free, nhanh nhất ở VN)
> **Chi phí ước tính MVP**: **0 đ/tháng**

---

### 2. 🗄️ Database & Backend (Supabase)

Dự án đang dùng **Supabase** (PostgreSQL + Auth + Realtime).

| Plan | Chi phí/tháng | Database | Auth Users | Storage | Ghi chú |
|---|---|---|---|---|---|
| **Free** | **0 đ** | 500MB | 50.000 users | 1GB | Pause sau 7 ngày inactive ⚠️ |
| **Pro** | ~600.000 đ | 8GB | Không giới hạn | 100GB | SLA 99.9%, không bị pause |
| Pro + Add-on | ~1.200.000 đ | Custom | Custom | Custom | Khi cần scale |

> ⚠️ **Rủi ro Free Plan**: Supabase **tắt project sau 7 ngày không có request** → production KHÔNG NÊN dùng free plan
> **Chi phí ước tính MVP**: **0–600.000 đ/tháng** (tùy chọn Pro sớm)

---

### 3. 🌐 Domain Name

| Lựa chọn | Chi phí/tháng | Năm | Ghi chú |
|---|---|---|---|
| `.com` (tabmark.com) | ~45.000 đ | ~540.000 đ | Namecheap / GoDaddy |
| `.io` (tabmark.io) | ~110.000 đ | ~1.320.000 đ | Thường dùng cho SaaS |
| `.vn` (tabmark.vn) | ~25.000 đ | ~300.000 đ | Phổ biến thị trường VN |
| `.app` (tabmark.app) | ~70.000 đ | ~840.000 đ | HTTPS bắt buộc, uy tín |

> **Khuyến nghị**: `.vn` hoặc `.com` → **~25.000–45.000 đ/tháng**
> SSL/TLS: **miễn phí** (Let's Encrypt qua Vercel/Cloudflare)

---

### 4. 🤖 AI API – Google Gemini

Dự án đang dùng `@google/generative-ai` với model `gemini-2.5-flash`.

**Bảng giá Gemini 2.5 Flash** (tính theo lượt request của bạn):

| Loại | Input | Output | Chi phí ~1 request (tóm tắt bookmark) |
|---|---|---|---|
| Input token | $0.075/1M token | — | ~500 tokens input |
| Output token | — | $0.30/1M token | ~200 tokens output |
| **1 request AI** | — | — | **~$0.000038 ≈ ~1 đồng/lượt** |

**Ước tính theo gói bạn đang bán:**

| Gói | Lượt AI/tháng | Chi phí Gemini/tháng | Tỷ giá ~25.500đ/$ |
|---|---|---|---|
| Mid-tier (2.000 lượt) | 2.000 | ~$0.076 ≈ **~1.940 đ** | |
| Premium (5.000 lượt) | 5.000 | ~$0.19 ≈ **~4.845 đ** | |
| Basic AI Credit (3.000 lượt) | 3.000 | ~$0.114 ≈ **~2.907 đ** | |
| Advanced AI Credit (3.500 lượt) | 3.500 | ~$0.133 ≈ **~3.391 đ** | |

> **Tổng AI cost nếu có 100 user Premium**: 500.000 lượt → ~$19 ≈ **~484.000 đ/tháng**
> **Chi phí AI/tháng MVP (50 users mix)**: **~50.000 – 200.000 đ/tháng**

---

### 5. 🗃️ Cloud Storage

Supabase Storage đã bao gồm trong plan (1GB free, 100GB với Pro).
Bookmark chủ yếu là text/URL → **dung lượng rất thấp**.

| Mục đích | Dung lượng ước tính | Chi phí |
|---|---|---|
| Avatar user, file export | < 1GB / 1.000 users | **0 đ (trong Supabase Free)** |
| Nếu cần thêm | $0.021/GB/tháng | ~500 đ/GB |

> **Chi phí ước tính MVP**: **0 đ/tháng**

---

### 6. 📊 Monitoring & Logging

| Tool | Free Tier | Chi phí Paid | Ghi chú |
|---|---|---|---|
| **Sentry** (error tracking) | 5.000 errors/tháng | ~500.000 đ | Bắt lỗi FE/BE |
| **Vercel Analytics** | Có | ~260.000 đ/tháng | Traffic, performance |
| **Supabase Dashboard** | Có sẵn | 0 đ | Query logs, DB metrics |
| **Uptime Robot** | 50 monitors free | 0 đ | Cảnh báo downtime |
| **LogRocket** | 1.000 sessions/tháng | ~1.000.000 đ | Session replay |

> **Khuyến nghị MVP**: Sentry Free + UptimeRobot Free
> **Chi phí ước tính MVP**: **0 đ/tháng** (dùng free tiers)

---

### 7. 💾 Backup

| Phương án | Chi phí/tháng | Ghi chú |
|---|---|---|
| **Supabase Auto Backup** (Free) | 0 đ | Backup 1 ngày 1 lần, giữ 7 ngày |
| Supabase Pro Backup | Trong Pro Plan | Point-in-time recovery, 30 ngày |
| Manual pg_dump → Cloud Storage | ~5.000–20.000 đ | Tự script, lưu S3/GCS |

> **Chi phí ước tính MVP**: **0 đ** (Supabase Free tự backup)
> **Khi lên Pro**: Đã bao gồm trong plan Supabase $25/tháng

---

### 8. 📧 Email Service

Supabase Auth đã có sẵn email xác thực (OTP, magic link).

| Mục đích | Tool | Free Tier | Chi phí Paid |
|---|---|---|---|
| **Auth email** (OTP, verify) | **Supabase built-in** | 2 email/giờ ⚠️ | Cần custom SMTP |
| **Custom SMTP** | Brevo (Sendinblue) | 300 email/ngày | ~250.000 đ/100K email |
| **Transactional email** | Resend | 3.000 email/tháng free | ~250.000 đ/100K |
| **Marketing email** | Mailchimp | 500 contacts free | ~400.000 đ/5K contacts |

> ⚠️ **Quan trọng**: Supabase Free giới hạn 2 email/giờ → production cần SMTP riêng
> **Khuyến nghị**: Brevo Free (300/ngày) hoặc Resend Free (3K/tháng)
> **Chi phí ước tính MVP**: **0 đ/tháng** (dùng Brevo/Resend free)

---

### 9. 🔐 Authentication

| Dịch vụ | Chi phí | Ghi chú |
|---|---|---|
| **Supabase Auth** (có sẵn) | **0 đ** | Đã tích hợp, Email + OAuth |
| Google OAuth | 0 đ | Miễn phí hoàn toàn |
| GitHub OAuth | 0 đ | Miễn phí hoàn toàn |

> **Chi phí**: **0 đ/tháng**

---

### 10. 🌍 CDN & Performance

| Tool | Chi phí | Ghi chú |
|---|---|---|
| **Cloudflare Free** | 0 đ | DDoS protection, Cache, DNS |
| Vercel Edge Network | 0 đ (Free plan) | Toàn cầu, rất nhanh |
| imgix / Cloudinary | 0 đ (Free tier) | Nếu cần tối ưu ảnh |

> **Chi phí MVP**: **0 đ/tháng**

---

## 📊 Tổng Hợp OPEX Theo Giai Đoạn

### 🟢 MVP Stage (0–200 users)

| # | Hạng mục | Tool | Chi phí/tháng |
|---|---|---|---|
| 1 | Frontend Hosting | Cloudflare Pages | **0 đ** |
| 2 | Database + Auth + Backend | Supabase Free | **0 đ** |
| 3 | Domain | .vn hoặc .com | **25.000–45.000 đ** |
| 4 | AI API (Gemini 2.5 Flash) | Google AI Studio | **50.000–100.000 đ** |
| 5 | Cloud Storage | Supabase (included) | **0 đ** |
| 6 | Monitoring | Sentry Free + UptimeRobot | **0 đ** |
| 7 | Backup | Supabase Auto | **0 đ** |
| 8 | Email Service | Brevo/Resend Free | **0 đ** |
| 9 | CDN | Cloudflare Free | **0 đ** |
| 10 | SSL | Let's Encrypt | **0 đ** |
| | **TỔNG MVP** | | **~75.000 – 145.000 đ/tháng** |

---

### 🟡 Growth Stage (200–2.000 users)

| # | Hạng mục | Tool | Chi phí/tháng |
|---|---|---|---|
| 1 | Frontend Hosting | Vercel Pro hoặc CF Pages | **0–550.000 đ** |
| 2 | Database + Auth + Backend | **Supabase Pro** | **~600.000 đ** |
| 3 | Domain | .com | **45.000 đ** |
| 4 | AI API (Gemini) | Google AI | **200.000–800.000 đ** |
| 5 | Cloud Storage | Supabase Pro (included) | **0 đ** |
| 6 | Monitoring | Sentry Team | **~500.000 đ** |
| 7 | Backup | Supabase Pro (included) | **0 đ** |
| 8 | Email | Brevo Starter | **~250.000 đ** |
| 9 | CDN | Cloudflare Free | **0 đ** |
| | **TỔNG GROWTH** | | **~1.600.000 – 2.750.000 đ/tháng** |

---

### 🔴 Scale Stage (2.000+ users)

| # | Hạng mục | Chi phí/tháng |
|---|---|---|
| Frontend Hosting | **0–550.000 đ** |
| Supabase Pro + Add-ons | **~1.200.000–2.000.000 đ** |
| Domain | **45.000 đ** |
| AI API (Gemini) | **800.000–5.000.000 đ** |
| Monitoring (Sentry + LogRocket) | **~1.500.000 đ** |
| Email (Brevo/Resend) | **~500.000 đ** |
| CDN / Extra bandwidth | **~500.000 đ** |
| **TỔNG SCALE** | **~4.500.000–10.000.000 đ/tháng** |

---

## ⚠️ Nhận Xét & Vấn Đề Về Revenue Hiện Tại

### 🔴 Vấn đề nghiêm trọng cần xem xét lại

#### 1. Giá vốn quá thấp / chưa tính đúng

| Gói | Giá bán | Giá vốn bạn ghi | Giá vốn thực tế (ước tính) | Vấn đề |
|---|---|---|---|---|
| Starter | 50.000đ | 5.000đ | ~3.000–5.000đ | ✅ Tạm ổn (dùng free tiers) |
| Mid-tier | 80.000đ | 20.000đ | ~15.000–25.000đ | ⚠️ Cần kiểm tra lại khi scale |
| Premium | 150.000đ | 50.000đ | ~40.000–60.000đ | ✅ Tương đối hợp lý |
| Basic AI Credit | 30.000đ | 15.000đ | ~5.000–10.000đ | 🔴 Margin thực tế cao hơn nhiều |
| Advanced AI Credit | 50.000đ | 35.000đ | ~8.000–15.000đ | 🔴 Giá vốn ghi 35.000đ là cao bất thường |

#### 2. AI Credit bị định giá sai

- **Basic AI Credit** (3.000 lượt): Gemini 2.5 Flash thực tế tốn **~2.900 đ** cho 3.000 lượt → bạn bán 30.000đ, giá vốn thực chỉ **~5.000–8.000đ** (bao gồm domain allocate), không phải 15.000đ
- **Advanced AI Credit** (3.500 lượt): Thực tế tốn **~3.400 đ** AI + overhead → giá vốn 35.000đ là **quá cao**, margin chỉ còn 15.000đ/30%
- → Bạn đang **understate margin** hoặc tính chi phí AI quá cao

#### 3. Starter plan chưa rõ giá trị

- Gói Starter chỉ "Workspace cơ bản, tìm kiếm thông tin" → **không có AI** → cần làm rõ sự khác biệt với Mid-tier rõ hơn
- Giá 50.000đ khá cao nếu không có AI → nên xem lại hoặc thêm tính năng

#### 4. Thiếu gói Free/Freemium

- Không có gói Free → **rào cản acquisition cao** cho startup giai đoạn MVP
- Khuyến nghị: Thêm **Free plan** giới hạn (50 bookmark, 10 AI lượt/tháng) để thu hút user, sau đó upsell

#### 5. Giá Premium cho R&D Team hơi thấp

- 150.000đ/tháng/người cho R&D team sử dụng AI đầy đủ + cộng tác → **quá rẻ so với thị trường** (Notion: 320.000đ, Coda: 400.000đ)
- Nếu đây là **per-seat pricing** thì ổn, nhưng cần làm rõ là per user hay per workspace

#### 6. Chưa tính chi phí cố định phân bổ

Giá vốn hiện tại chỉ tính biến phí (AI tokens + domain), chưa tính:
- **Supabase Pro fee phân bổ**: nếu 100 user → ~6.000đ/user/tháng
- **Monitoring, email, backup** phân bổ
- **Chi phí phát triển & bảo trì** (nếu tính)

---

## 💡 Đề Xuất Cấu Trúc Giá Revised

| Gói | Giá bán | Giá vốn thực | Margin | Ghi chú |
|---|---|---|---|---|
| **Free** | 0đ | ~2.000đ | âm | Acquisition, giới hạn chặt |
| **Starter** | 49.000đ | ~8.000đ | ~84% | Cơ bản + 20 AI lượt |
| **Pro** | 99.000đ | ~22.000đ | ~78% | AI đầy đủ 2.000 lượt |
| **Team** | 199.000đ/user | ~40.000đ | ~80% | 5.000 lượt + collab |
| **AI Top-up** | 29.000đ/1.000 lượt | ~2.500đ | ~91% | Add-on credit |

---

*Tài liệu tạo lúc 2026-07-16 | Tỷ giá tham chiếu: 1 USD ≈ 25.500 VNĐ*
*Giá Gemini 2.5 Flash: Input $0.075/1M tokens, Output $0.30/1M tokens (tháng 7/2026)*
