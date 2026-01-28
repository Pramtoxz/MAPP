# API Order Endpoints

## 1. Checkout / Submit Order

**Endpoint:** `POST /api/cart/checkout`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** Tidak ada

**Response Success (200):**
```json
{
  "success": true,
  "message": "Order submitted successfully",
  "data": {
    "no_so": "2026/000016/POD-PD",
    "jenis_so": "Oli Regular",
    "grand_total": 177000,
    "status": "Waiting For Approval"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Keranjang belanja kosong atau sudah di-checkout",
    "errors": null
  }
}
```

**Catatan:**
- Cart akan dihapus setelah checkout berhasil
- Nomor SO di-generate otomatis dari serial
- Jenis SO ditentukan otomatis (Oli Regular / Other) berdasarkan mayoritas item
- `fk_toko` diambil dari user yang login
- `fk_salesman` diambil dari `fk_sales` toko

---

## 2. History Order

**Endpoint:** `GET /api/orders`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
- `dari` (string): Tanggal awal filter (format: YYYY-MM-DD)
- `sampai` (string): Tanggal akhir filter (format: YYYY-MM-DD)

**Example Request:**

**Tanpa filter (10 terbaru):**
```
GET /api/orders
```

**Dengan filter tanggal:**
```
GET /api/orders?dari=2026-01-01&sampai=2026-01-31
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "2026/000016/POD-PD",
        "orderNumber": "2026/000016/POD-PD",
        "orderType": "Oli Regular",
        "orderDate": "2026-01-28 14:19:51",
        "grandTotal": 177000,
        "status": "Waiting For Approval"
      },
      {
        "id": "2026/000015/POD-PD",
        "orderNumber": "2026/000015/POD-PD",
        "orderType": "Other",
        "orderDate": "2026-01-28 13:45:20",
        "grandTotal": 500000,
        "status": "Approved"
      }
    ]
  }
}
```

**Catatan:**
- Menampilkan maksimal 10 order terbaru
- Filter berdasarkan `fk_toko` user yang login
- User dari toko yang sama akan melihat order yang sama
- Diurutkan berdasarkan tanggal order (terbaru dulu)

---

## 3. Detail Order

**Endpoint:** `GET /api/orders/{noSo}`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `noSo` (string): Nomor SO (contoh: 2026/000016/POD-PD)

**Example Request:**
```
GET /api/orders/2026/000016/POD-PD
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "orderNumber": "2026/000016/POD-PD",
    "orderType": "Oli Regular",
    "orderDate": "2026-01-28 14:19:51",
    "grandTotal": 177000,
    "status": "Waiting For Approval",
    "items": [
      {
        "partNumber": "50275K15920ZD",
        "partName": "OIL FILTER",
        "qty": 3,
        "price": 59000,
        "subtotal": 177000
      }
    ]
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "No query results for model [App\\Models\\DataPart\\SalesOrder].",
    "errors": null
  }
}
```

**Catatan:**
- Menampilkan detail lengkap order beserta items
- Nomor SO harus di-encode jika ada karakter `/` (contoh: `2026%2F000016%2FPOD-PD`)
- Atau gunakan format tanpa encode jika framework support

---

## Status Order

Kemungkinan status order:
- `Waiting For Approval` - Menunggu persetujuan
- `Approved` - Sudah disetujui
- `Rejected` - Ditolak

## Jenis Order

- `Oli Regular` - Mayoritas item adalah OIL
- `Other` - Mayoritas item bukan OIL
