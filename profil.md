# API Profile Endpoints

## GET /api/auth/profile
Get user profile data

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "1",
        "name": "TOKO MAJU JAYA",
        "email": "toko@pmo.com",
        "role": "dealer",
        "dealerCode": "TMJ001",
        "dealerName": "TOKO MAJU JAYA",
        "salesName": "BUDI SANTOSO",
        "phone": "081234567890",
        "address": "Jl. Raya No. 123",
        "npwp": "12.345.678.9-012.000",
        "city": null,
        "province": null
    }
}
```

**Read-only fields:** dealerCode, dealerName, salesName, name, role

---

## PUT /api/auth/profile
Update user profile

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (all optional):**
```json
{
    "email": "newemail@example.com",
    "phone": "081234567890",
    "address": "Jl. Baru No. 456",
    "npwp": "98.765.432.1-098.000",
    "password": "newpass123",
    "password_confirmation": "newpass123"
}
```

**Validation:**
- email: valid email, unique
- phone: max 20 chars
- npwp: max 20 chars
- password: min 6 chars, must match confirmation

**Response:**
```json
{
    "success": true,
    "data": { /* same as GET profile */ },
    "message": "Profil berhasil diupdate"
}
```

**Error (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```
