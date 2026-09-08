# 💰 OPEX TabMark – 2 Kịch Bản: Free Tier vs Paid Tier

> Kết nối với **CAPEX 16.000.000đ** (khuyến nghị điều chỉnh còn ~12.500.000đ)

---

## 🗺️ Timeline Triển Khai & Liên Kết CAPEX → OPEX

```
  CAPEX (Chi một lần)               OPEX bắt đầu chạy
  ─────────────────────             ──────────────────────────────────────────────────
  Tháng 0                           Tháng 1–3          Tháng 4–6+
  ──────────                        ──────────────     ─────────────────────
  ✅ Domain mua 1 năm               🟢 OPEX FREE       🟡 OPEX PAID
  ✅ Server/DB setup                  (beta + MVP)       (khi có doanh thu)
  ✅ AI dev                           Dùng free tiers    Upgrade lên paid
  ✅ Beta Testing                     ~45K–145K/tháng    ~1.3M–2.5M/tháng
  ✅ Product Launch
  ✅ Công cụ dev
  ─────────────────────────────────────────────────────────────────────────────────
  💸 16.000.000đ                    💸 ~435K–870K      💸 ~7.8M–15M
                                      (6 tháng)          (6 tháng)
```

---

## 🟢 Kịch Bản 1: OPEX FREE TIER
**Dành cho giai đoạn Beta → MVP (Tháng 1 đến ~Tháng 3–4)**
Tối đa hoá free tier, phù hợp khi chưa có doanh thu ổn định

| # | Hạng mục | Tool / Dịch vụ | Chi phí/tháng | Ghi chú |
|---|---|---|---|---|
| 1 | 🖥️ Frontend Hosting | Cloudflare Pages | **0đ** | Unlimited bandwidth, CDN toàn cầu |
| 2 | 🗄️ Database + Auth | Supabase Free | **0đ** | 500MB DB, 50K users ⚠️ pause 7 ngày |
| 3 | 🌐 Domain | .com (đã trả CAPEX) | **0đ** | Năm đầu đã tính vào CAPEX 500K |
| 4 | 🤖 AI API | Gemini 2.5 Flash | **~50.000đ** | Pay-as-you-go, ~50K lượt nhỏ |
| 5 | 🗃️ Cloud Storage | Supabase (1GB included) | **0đ** | Đủ dùng cho MVP |
| 6 | 📊 Monitoring | Sentry Free + UptimeRobot Free | **0đ** | 5K errors/tháng, 50 monitors |
| 7 | 💾 Backup | Supabase Auto Backup | **0đ** | 7 ngày giữ, 1 lần/ngày |
| 8 | 📧 Email | Brevo Free / Resend Free | **0đ** | 300 email/ngày, 3K/tháng |
| 9 | 🔐 SSL | Let's Encrypt (tự động) | **0đ** | Cloudflare/Vercel tự cấp |
| 10 | 🌍 CDN | Cloudflare Free | **0đ** | DDoS protection, DNS |
| 11 | 🛠️ Dev Tools | GitHub Free, Figma Free | **0đ** | Dùng free tier trong giai đoạn này |

| | **TỔNG FREE TIER** | | **~50.000 đ/tháng** | |

> 💡 **Lưu ý quan trọng:** Domain năm đầu đã tính trong CAPEX → OPEX tháng 1–12 **không cần tính domain**. Từ tháng 13 mới tính thêm ~45.000đ/tháng.

---

## 🟡 Kịch Bản 2: OPEX PAID TIER
**Dành cho giai đoạn Production (Tháng 4+ trở đi, khi có doanh thu)**
Upgrade lên paid services để đảm bảo SLA, không bị pause, scale được

| # | Hạng mục | Tool / Dịch vụ | Chi phí/tháng | Ghi chú |
|---|---|---|---|---|
| 1 | 🖥️ Frontend Hosting | Cloudflare Pages (vẫn free) | **0đ** | Đủ dùng, không cần upgrade |
| 2 | 🗄️ Database + Auth | **Supabase Pro** | **~600.000đ** | SLA 99.9%, không pause, 8GB DB |
| 3 | 🌐 Domain | .com gia hạn (từ năm 2) | **~45.000đ** | Hoặc 0đ nếu vẫn trong năm đầu |
| 4 | 🤖 AI API | Gemini 2.5 Flash | **~200.000–500.000đ** | Tăng theo số user trả phí |
| 5 | 🗃️ Cloud Storage | Supabase Pro (100GB included) | **0đ** | Đã bao gồm trong Pro plan |
| 6 | 📊 Monitoring | Sentry Team + UptimeRobot | **~500.000đ** | Error tracking đầy đủ, alert SMS |
| 7 | 💾 Backup | Supabase Pro (Point-in-time 30 ngày) | **0đ** | Đã bao gồm trong Pro plan |
| 8 | 📧 Email | Brevo Starter (20K email/tháng) | **~250.000đ** | Custom SMTP, transactional + notify |
| 9 | 🔐 SSL | Let's Encrypt (tự động) | **0đ** | Vẫn miễn phí |
| 10 | 🌍 CDN | Cloudflare Free | **0đ** | Vẫn đủ dùng |
| 11 | 🛠️ Dev Tools | GitHub Team (3 devs) | **~300.000đ** | $4/user/tháng, CI/CD, Actions |

| | **TỔNG PAID TIER** | | **~1.895.000 – 2.195.000 đ/tháng** | |

---

## 📊 Bảng So Sánh Trực Tiếp

| Hạng mục | 🟢 Free Tier | 🟡 Paid Tier | Lý do upgrade |
|---|---|---|---|
| Frontend Hosting | 0đ | 0đ | Cloudflare Pages vẫn đủ |
| Database (Supabase) | 0đ | 600.000đ | Không bị pause, SLA, PITR backup |
| Domain | 0đ (CAPEX đã trả) | 45.000đ (từ năm 2) | Gia hạn hằng năm |
| AI API (Gemini) | 50.000đ | 200.000–500.000đ | Nhiều user trả phí hơn |
| Cloud Storage | 0đ | 0đ | Included trong Supabase Pro |
| Monitoring | 0đ | 500.000đ | Cần alert production 24/7 |
| Backup | 0đ | 0đ | Included trong Supabase Pro |
| Email | 0đ | 250.000đ | Cần custom SMTP cho production |
| SSL | 0đ | 0đ | Luôn miễn phí |
| CDN | 0đ | 0đ | Cloudflare Free đủ dùng lâu dài |
| Dev Tools | 0đ | 300.000đ | GitHub Team CI/CD |
| **TỔNG** | **~50.000đ** | **~1.895.000–2.195.000đ** | |

---

## 💼 Kết Nối CAPEX → OPEX – Dòng Tiền Năm Đầu

### Giả định: Chạy Free Tier 3 tháng, chuyển Paid Tier từ tháng 4

| Giai đoạn | Thời gian | Chi phí | Loại |
|---|---|---|---|
| Setup & Development | Tháng 0 (một lần) | **16.000.000đ** | CAPEX |
| Beta + Early MVP | Tháng 1–3 (×3) | **~150.000đ** | OPEX Free |
| Production | Tháng 4–12 (×9) | **~17.055.000đ** | OPEX Paid |
| **TỔNG NĂM 1** | | **~33.205.000đ** | |

> ⚠️ Nếu dùng CAPEX điều chỉnh (~12.500.000đ) → **Tổng năm 1 ≈ 29.705.000đ**

---

## 📈 Điểm Hoà Vốn (Break-even)

Với CAPEX 16M + OPEX Paid ~2M/tháng:

| Số user trả phí | Doanh thu/tháng (ước tính) | Có thể cover OPEX từ tháng nào |
|---|---|---|
| 20 user Mid-tier | 20 × 80K = **1.600.000đ** | Gần đủ OPEX |
| 30 user Mid-tier | 30 × 80K = **2.400.000đ** | ✅ Cover OPEX Paid |
| 15 user Premium | 15 × 150K = **2.250.000đ** | ✅ Cover OPEX Paid |
| Mix (10 Mid + 8 Premium) | 800K + 1.200K = **2.000.000đ** | ✅ Vừa đủ |
| **Hoà vốn CAPEX** (16M) | Cần ~8 tháng sau launch | Với ~30 user/tháng paying |

---

## ✅ Tại Sao 2 Kịch Bản Này Khớp Với CAPEX

| CAPEX Hạng mục | Liên kết với OPEX |
|---|---|
| Domain 500K (1 năm) | → OPEX Free: 0đ/tháng (năm 1). OPEX Paid: 45K/tháng (từ năm 2) |
| Server + DB Setup 2–4M | → Chi phí khởi tạo một lần. OPEX tiếp quản từ tháng 1 |
| AI Development 3M | → CAPEX trả công xây dựng. AI API cost là OPEX biến phí (50K→500K) |
| Beta Testing 2M | → Tương ứng 3 tháng OPEX Free (~150K) + chi phí tổ chức |
| Product Launch 5M | → Sau launch, OPEX Paid bắt đầu chạy |
| Dev Tools 1M | → Nếu giữ, chuyển thành OPEX Paid: ~300K/tháng (GitHub Team) |

---

## 🚦 Khuyến Nghị Chuyển Giai Đoạn

```
[CAPEX Setup] ──► [OPEX FREE 1–3 tháng] ──► [OPEX PAID từ tháng 4+]
     16M                  ~50K/tháng               ~2M/tháng
                    (Beta, test thực tế)       (Khi đạt 20+ paying users)

Trigger để upgrade: Đạt ≥ 20 paying users HOẶC 200+ active users
```

---

*Tài liệu tạo lúc 2026-07-16 | Tỷ giá: 1 USD ≈ 25.500 VNĐ | Gemini 2.5 Flash pricing Q3/2026*
