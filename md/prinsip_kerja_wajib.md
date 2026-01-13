ECOMERCE PART MOBILE MAIN DEALER MENARA AGUNG TO DEALER DAN CHANNEL

PRINSIP KERJA:
==============
1. **SELALU MINTA SCREENSHOT UI** sebelum implementasi atau lihat di folder di root dengan nama folder SCRENSHOT_UI
2. **ANALISIS UI** untuk identifikasi logic yang dibutuhkan
3. **JANGAN ASUMSI** - kalau tidak ada di UI, tanya dulu
4. **DOKUMENTASI JELAS** - URL lengkap, contoh request/response
5. **STRUKTUR FILE DAN FOLDER RAPI** - STRUKTUR FOLDER FILE DAN CODINGAN RAPI DENGAN STANDART INDUSTRI
6. **BUAT TANPA KOMENTAR //** - jANGAN PERNAH BERI KOMENTAR
7. **KHUSUS ANDROID** - IOS IPHONE APPLE TIDAK DI GUNAKAN
8. **REACT NATIVE CLI 0.83 TERBARU** - PROJECT INI MENGGUNAKAN REACT NATIVE 0.83 TERBARU 2026 JIKA UPDATE INFORMASI DI INTERNET

# Images Usage Documentation

Dokumentasi lengkap penggunaan images/icons untuk setiap screen dalam aplikasi.

---

## **Login Screen**

| Image Name | Usage | Required |
|------------|-------|----------|
| `bg_honda.webp` | Background image | ✅ Yes |
| `lg_honda.jpg` | Logo Honda | ✅ Yes |
| `ic_username.png` | Username input icon | ✅ Yes |
| `ic_password.png` | Password input icon | ✅ Yes |
| `ic_visible.png` | Show/hide password icon | ✅ Yes |

---

## **Home Screen**

| Image Name | Usage | Required |
|------------|-------|----------|
| `bg_honda.webp` | Background header | ✅ Yes |
| `lg_honda.jpg` | Avatar/Logo | ✅ Yes |
| `ic_notification.png` | Notification button | ✅ Yes |
| `ic_spring.png` | Search icon & Parts menu | ✅ Yes |
| `ic_catologue.png` | Catalogue menu button | ✅ Yes |
| `ic_promotion.png` | Promo menu button | ✅ Yes |
| `ic_cart_response.png` | Cart menu button | ✅ Yes |
| `ic_stock_md.png` | Stock menu button | ✅ Yes |
| `ic_wa.png` | WhatsApp/Chat menu button | ✅ Yes |
| `ic_pin_map.png` | Delivery progress icon | ✅ Yes |
| `ic_checklist_enable.png` | Monthly buy-in icon | ✅ Yes |

---

## **Home Screen**

| Image Name | Usage | Required |
|------------|-------|----------|
| None | Uses text avatar only | ❌ No |

---

## **Home Screen - OrderFragment**

COMING SOON

## **SUKU CADANG**

| Image Name | Usage | Required |
|------------|-------|----------|
| `bg_honda.webp` | Background image | ✅ Yes |
| `ic_arrow_back.png` | Back button | ✅ Yes |
| `ic_cart_response.png` | Cart button with badge | ✅ Yes |
| `ic_notification.png` | Notification button | ✅ Yes |
| `ic_search.png` | Search input icon | ✅ Yes |
| `ic_sort_by.png` | Filter/Sort button | ✅ Yes |

**Campaign Images (External URLs):**
- Campaign banners loaded from external URLs
- Part images loaded from external URLs

---

## **Cart Screen**
| Image Name | Usage | Required |
|------------|-------|----------|
| `ic_arrow_back.png` | Back button | ✅ Yes |

---

## **Tab Bar (Bottom Navigation)**

| Image Name | Usage | Required |
|------------|-------|----------|
| `ic_homepage.png` | Home tab icon | ✅ Yes |
| `ic_menu_katalog_en.png` | Order & Collection tab icon | ✅ Yes |
| `ic_profile.png` | Profile tab icon | ✅ Yes |

---

## **Components**

## **Summary - Required Images**

### **Critical (Must Have):**
1. `bg_honda.webp` - Background
2. `lg_honda.jpg` - Logo
3. `ic_arrow_back.png` - Navigation
4. `ic_username.png` - Login
5. `ic_password.png` - Login
6. `ic_visible.png` - Login
7. `ic_notification.png` - Header
8. `ic_search.png` - Search
9. `ic_sort_by.png` - Filter
10. `ic_cart_response.png` - Cart

### **Menu Icons (Important):**
11. `ic_spring.png` - Parts menu
12. `ic_catologue.png` - Catalogue menu
13. `ic_promotion.png` - Promo menu
14. `ic_stock_md.png` - Stock menu
15. `ic_wa.png` - Chat menu

### **Tab Bar Icons (Important):**
16. `ic_homepage.png` - Home tab
17. `ic_menu_katalog_en.png` - Order/Collection tab
18. `ic_profile.png` - Profile tab

### **Dashboard Icons (Optional):**
19. `ic_pin_map.png` - Delivery icon
20. `ic_checklist_enable.png` - Buy-in icon

---

## **Notes:**
- Semua images di-load melalui `getImage()` function dari `src/assets/images/index.ts`
- External images (part images, campaign banners) di-load dari URL
- Jika image tidak ditemukan, akan fallback ke `lg_honda.jpg`
