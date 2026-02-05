# API Documentation - Order Management
**Base URL:** `https://pmo.menara-agung.com/api`  
**Version:** 1.0  
**Date:** 2026-02-03

---

## 🔐 Authentication

Semua endpoint memerlukan authentication token di header:

```
Authorization: Bearer {token}
Accept: application/json
```

---

## 📋 Endpoints

### 1. Get Order History

**Endpoint:** `GET /orders`

**Description:** Mendapatkan list order history user dengan filter

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dari | string | No | Tanggal awal (format: YYYY-MM-DD) |
| sampai | string | No | Tanggal akhir (format: YYYY-MM-DD) |
| filter | string | No | Filter status: `pending`, `completed`, `back_order` |
| limit | integer | No | Jumlah data (default: 20) |

**Filter Values:**
- `pending` - Order yang belum di-approve (status: Waiting For Approval)
- `completed` - Order yang sudah approve DAN sudah selesai semua (back order = 0)
- `back_order` - Order yang sudah approve TAPI masih ada back order (back order > 0)
- Kosongkan untuk tampilkan semua

**Example Requests:**
```
GET /orders                           # Semua order
GET /orders?filter=pending            # Belum di-approve
GET /orders?filter=completed          # Sudah selesai semua
GET /orders?filter=back_order         # Masih ada back order
GET /orders?dari=2026-01-01&sampai=2026-02-05
GET /orders?filter=completed&limit=50
```

**Response Success (200):**
```json
{
  "success": true,
  "message": null,
  "data": {
    "items": [
      {
        "id": "2026/003395/POD-PD",
        "orderNumber": "2026/003395/POD-PD",
        "orderType": "Other",
        "orderDate": "2026-02-03 12:41:56",
        "grandTotal": 8780000,
        "status": "Approve",
        "fulfillment": {
          "totalQtyOrder": 40,
          "totalQtyDelivered": 0,
          "totalQtyBackOrder": 40,
          "isCompleted": false
        }
      },
      {
        "id": "2025/023311/POD-PD",
        "orderNumber": "2025/023311/POD-PD",
        "orderType": "Other",
        "orderDate": "2025-09-03 09:01:50",
        "grandTotal": 145776000,
        "status": "Approve",
        "fulfillment": {
          "totalQtyOrder": 2225,
          "totalQtyDelivered": 2225,
          "totalQtyBackOrder": 0,
          "isCompleted": true
        }
      }
    ]
  }
}
```

**Status Values:**
- `Waiting For Approval` - Order baru, menunggu approve admin
- `Approve` - Order sudah diapprove
- `Reject` - Order ditolak

**Fulfillment Object:**
- `totalQtyOrder` - Total quantity yang di-order
- `totalQtyDelivered` - Total quantity yang sudah dikirim
- `totalQtyBackOrder` - Total quantity yang masih pending
- `isCompleted` - `true` jika semua sudah dikirim, `false` jika masih ada back order

---

### 2. Get Order Detail

**Endpoint:** `GET /orders/{noSo}`

**Description:** Mendapatkan detail order dengan informasi fulfillment (delivery & back order)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| noSo | string | Yes | Nomor SO (contoh: 2026/003395/POD-PD) |

**Note:** Gunakan slash `/` di URL, bukan encode `%2F`

**Example Request:**
```
GET /orders/2026/003395/POD-PD
```

**Response Success (200):**
```json
{
  "success": true,
  "message": null,
  "data": {
    "orderNumber": "2026/003395/POD-PD",
    "orderType": "Other",
    "orderDate": "2026-02-03 12:41:56",
    "grandTotal": 8780000,
    "status": "Approve",
    "summary": {
      "totalItems": 2,
      "totalQtyOrder": 40,
      "totalQtyDelivered": 0,
      "totalQtyBackOrder": 40
    },
    "items": [
      {
        "partNumber": "44711KVB931",
        "partName": "TIRE FR TT (80/90-14)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 20,
        "deliveryQty": 0,
        "backOrderQty": 20,
        "price": 196000,
        "subtotal": 3920000
      },
      {
        "partNumber": "42711KVB931",
        "partName": "TIRE RR TT (90/90-14)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 20,
        "deliveryQty": 0,
        "backOrderQty": 20,
        "price": 243000,
        "subtotal": 4860000
      }
    ],
    "deliveryOrders": []
  }
}
```

**Response Fields:**

**Summary:**
- `totalItems` - Jumlah jenis part yang di-order
- `totalQtyOrder` - Total quantity yang di-order
- `totalQtyDelivered` - Total quantity yang sudah dikirim
- `totalQtyBackOrder` - Total quantity yang masih pending

**Items:**
- `orderQty` - Quantity yang di-order
- `deliveryQty` - Quantity yang sudah dikirim (orderQty - backOrderQty)
- `backOrderQty` - Quantity yang masih pending/belum dikirim

**Delivery Orders:**
- Array kosong `[]` jika belum ada pengiriman
- Berisi list DO jika sudah ada pengiriman (lihat contoh di bawah)

---

### 3. Get Order Detail (With Delivery Orders)

**Example Response dengan DO:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "orderNumber": "2025/023311/POD-PD",
    "orderType": "Other",
    "orderDate": "2025-09-03 09:01:50",
    "grandTotal": 145776000,
    "status": "Approve",
    "summary": {
      "totalItems": 51,
      "totalQtyOrder": 2225,
      "totalQtyDelivered": 1469,
      "totalQtyBackOrder": 756
    },
    "items": [
      {
        "partNumber": "16450K25901",
        "partName": "TIRE FR (120/70-14)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 30,
        "deliveryQty": 5,
        "backOrderQty": 25,
        "price": 258000,
        "subtotal": 7740000
      },
      {
        "partNumber": "16111KVB903",
        "partName": "TIRE RR (130/70-13)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 50,
        "deliveryQty": 50,
        "backOrderQty": 0,
        "price": 142500,
        "subtotal": 7125000
      }
    ],
    "deliveryOrders": [
      {
        "noDo": "2025/017024/DO-OTHER",
        "tanggal": "2025-09-03 09:22:38",
        "status": "Approve",
        "grandTotal": 30968245,
        "items": [
          {
            "partNumber": "16450K25901",
            "partName": "TIRE FR (120/70-14)",
            "qtyDo": 5,
            "price": 258000,
            "diskon": 0,
            "subtotal": 1290000
          }
        ]
      },
      {
        "noDo": "2025/017145/DO-OTHER",
        "tanggal": "2025-09-04 17:06:24",
        "status": "Approve",
        "grandTotal": 1039500,
        "items": [
          {
            "partNumber": "16111KVB903",
            "partName": "TIRE RR (130/70-13)",
            "qtyDo": 50,
            "price": 142500,
            "diskon": 0,
            "subtotal": 7125000
          }
        ]
      }
    ]
  }
}
```

**Delivery Orders Fields:**
- `noDo` - Nomor surat jalan
- `tanggal` - Tanggal pengiriman
- `status` - Status DO (biasanya "Approve")
- `grandTotal` - Total nilai DO
- `items` - List part yang dikirim di DO ini
  - `qtyDo` - Quantity yang dikirim

---

### 4. Get Back Order List

**Endpoint:** `GET /orders/{noSo}/back-order`

**Description:** Mendapatkan list items yang masih pending (belum dikirim)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| noSo | string | Yes | Nomor SO |

**Example Request:**
```
GET /orders/2026/003395/POD-PD/back-order
```

**Response Success (200):**
```json
{
  "success": true,
  "message": null,
  "data": {
    "orderNumber": "2026/003395/POD-PD",
    "orderDate": "2026-02-03 12:41:56",
    "totalBackOrderQty": 40,
    "backOrderItems": [
      {
        "partNumber": "44711KVB931",
        "partName": "TIRE FR TT (80/90-14)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 20,
        "deliveryQty": 0,
        "backOrderQty": 20,
        "price": 196000
      },
      {
        "partNumber": "42711KVB931",
        "partName": "TIRE RR TT (90/90-14)",
        "image": "https://pmo.menara-agung.com/images/category/TIRE_1770019876.jpg",
        "orderQty": 20,
        "deliveryQty": 0,
        "backOrderQty": 20,
        "price": 243000
      }
    ]
  }
}
```

**Note:** 
- Hanya menampilkan items dengan `backOrderQty > 0`
- Jika semua items sudah dikirim, `backOrderItems` akan array kosong `[]`

---

## 📊 Use Cases

### Use Case 1: Tampilkan Order History dengan Filter
```
1. Default: Call GET /orders (tampilkan semua)
2. User tap tab "Pending": Call GET /orders?filter=pending
3. User tap tab "Back Order": Call GET /orders?filter=back_order
4. User tap tab "Selesai": Call GET /orders?filter=completed
5. Tampilkan list order dengan badge status dan fulfillment
6. User tap order → navigate ke detail
```

### Use Case 2: Tampilkan Order Detail dengan Fulfillment Info
```
1. Call GET /orders/{noSo}
2. Tampilkan summary:
   - Total yang di-order
   - Total yang sudah dikirim
   - Total yang masih pending
3. Tampilkan list items dengan progress bar:
   - Order Qty: 30
   - Delivered: 5 (hijau)
   - Back Order: 25 (kuning/merah)
4. Tampilkan list DO (jika ada)
```

### Use Case 3: Tampilkan Back Order
```
1. Call GET /orders/{noSo}/back-order
2. Tampilkan hanya items yang masih pending
3. Tampilkan pesan: "Barang sedang dalam proses pengiriman"
```

---

## 🎨 UI Recommendations

### Order List Tabs/Filter:
```
[Semua] [Pending] [Back Order] [Selesai]
```

### Order Status Badge:
- `Waiting For Approval` → Badge kuning/orange
- `Approve` → Badge hijau
- `Reject` → Badge merah

### Fulfillment Badge (untuk order yang Approve):
- `isCompleted: true` → Badge hijau "Selesai"
- `isCompleted: false` → Badge kuning "Back Order"

### Order Card Example:
```
┌─────────────────────────────────────┐
│ 2026/003395/POD-PD                  │
│ 03 Feb 2026, 12:41                  │
│                                     │
│ Rp 8.780.000                        │
│ [Approve] [Back Order]              │
│                                     │
│ Order: 40 | Kirim: 0 | Sisa: 40    │
│ ▓▓▓░░░░░░░ 0%                       │
└─────────────────────────────────────┘
```

### Fulfillment Progress:
```
Order Qty: 30 pcs
├─ Delivered: 5 pcs (16.7%) [Progress bar hijau]
└─ Back Order: 25 pcs (83.3%) [Progress bar kuning]
```

### Back Order Message:
```
⏳ Back Order: 25 pcs
"Barang sedang dalam proses pengiriman. 
Silahkan hubungi sales untuk informasi lebih lanjut."
```

---

## ❌ Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\DataPart\\SalesOrder]."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": 500,
    "message": "Error message here",
    "errors": null
  }
}
```

---

## 📝 Notes

1. **Back Order bukan action!** User tidak perlu order ulang. Warehouse akan kirim otomatis kalau stock ready.

2. **Partial Delivery:** 1 SO bisa punya banyak DO (dikirim bertahap). Check array `deliveryOrders` untuk lihat history pengiriman.

3. **Status Complete:** Cek `summary.totalQtyBackOrder`:
   - Jika `0` → Order complete (semua sudah dikirim)
   - Jika `> 0` → Masih ada yang pending

4. **Image Fallback:** Jika `image` null atau error load, gunakan default image dari response atau placeholder.

5. **Number Format:** 
   - `orderQty`, `deliveryQty`, `backOrderQty` → bisa string atau integer
   - `price`, `subtotal`, `grandTotal` → float/number
   - Pastikan handle kedua tipe data

6. **Date Format:** `YYYY-MM-DD HH:mm:ss` (24 hour format)

---

## 🔄 Data Flow

```
User Submit Order (POST /cart/checkout)
  ↓
SO Created (status: Waiting For Approval)
  ↓
Admin Approve di DMS
  ↓
Status berubah: Approve
  ↓
Admin Create DO (partial/full)
  ↓
deliveryOrders array terisi
  ↓
backOrderQty berkurang
  ↓
Repeat sampai backOrderQty = 0
```

---

## 🧪 Test Data

**SO dengan Back Order (belum ada DO):**
- SO: `2026/003395/POD-PD`
- Status: Approve
- Total Items: 2
- Back Order: 40 pcs (100%)

**SO dengan Partial Delivery:**
- SO: `2025/023311/POD-PD`
- Status: Approve
- Total Items: 51
- Delivered: 1,469 pcs (66%)
- Back Order: 756 pcs (34%)
- Total DO: 18

---

## 📞 Support

Jika ada pertanyaan atau issue, hubungi backend team.
