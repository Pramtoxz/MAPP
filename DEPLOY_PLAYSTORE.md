# Panduan Deploy React Native ke Google Play Store

Panduan ini dibuat berdasarkan pengalaman deploy app **PMO** (com.menaraagung.mapp) ke Play Store.
Cocok untuk referensi deploy berikutnya maupun pembelajaran dari awal.

---

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Buat Keystore Production](#2-buat-keystore-production)
3. [Konfigurasi Signing di Project](#3-konfigurasi-signing-di-project)
4. [Build AAB](#4-build-aab)
5. [Google Play Console — Buat App Baru](#5-google-play-console--buat-app-baru)
6. [Upload AAB ke Internal Testing](#6-upload-aab-ke-internal-testing)
7. [Menyiapkan Aplikasi — Konten & Metadata](#7-menyiapkan-aplikasi--konten--metadata)
8. [Listingan Play Store](#8-listingan-play-store)
9. [Rilis ke Produksi](#9-rilis-ke-produksi)
10. [Ringkasan Publikasi & Kirim untuk Ditinjau](#10-ringkasan-publikasi--kirim-untuk-ditinjau)
11. [Update Berikutnya](#11-update-berikutnya)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prasyarat

- Akun Google Play Console (atau sudah diundang sebagai admin ke organisasi)
- Java JDK 17+ terinstall
- Android SDK terinstall
- Node.js 20+
- Project React Native sudah berjalan dan ditest via APK

---

## 2. Buat Keystore Production

Keystore adalah file identitas digital app kamu. **Hanya dibuat sekali seumur hidup app.**
Kalau hilang, kamu tidak bisa update app di Play Store.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

Isi pertanyaan yang muncul:
- First and last name → nama developer
- Organizational unit → nama divisi/perusahaan
- Organization → nama perusahaan
- City → kota
- State → provinsi
- Country code → `ID`

Konfirmasi dengan mengetik `yes`.

**Simpan file `.keystore` dan catat password-nya di tempat aman.**
File ini di-exclude dari Git via `.gitignore` (`*.keystore` kecuali `debug.keystore`).

---

## 3. Konfigurasi Signing di Project

### android/gradle.properties

Tambahkan di bagian bawah file `android/gradle.properties` (bukan `~/.gradle/gradle.properties`):

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=password_keystore_kamu
MYAPP_UPLOAD_KEY_PASSWORD=password_key_kamu
```

> **Catatan:** Nama variabel harus `MYAPP_UPLOAD_*` sesuai template resmi React Native.
> File ini tidak di-commit ke Git jika sudah ada di `.gitignore`.

### android/app/build.gradle

Pastikan blok `signingConfigs` dan `buildTypes` seperti ini:

```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}

buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
    }
}
```

### android/build.gradle

Pastikan versi AGP (Android Gradle Plugin) di-pin secara eksplisit:

```groovy
dependencies {
    classpath("com.android.tools.build:gradle:8.12.0")
    // ... plugin lainnya
}
```

> **Penting:** Jangan biarkan versi AGP kosong/tidak di-pin. Versi yang resolve otomatis bisa
> menyebabkan error `BundleConfig$BundleType not present`.

---

## 4. Build AAB

AAB (Android App Bundle) adalah format wajib untuk upload ke Play Store (bukan APK).

```bash
# Dari root project
npx react-native build-android --mode=release
```

Output:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Jika build gagal: bersihkan cache

```bash
# Windows PowerShell
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\daemon"
Remove-Item -Recurse -Force "android\.gradle"
Remove-Item -Recurse -Force "android\app\.cxx"
```

Lalu build ulang.

---

## 5. Google Play Console — Buat App Baru

1. Buka [play.google.com/console](https://play.google.com/console)
2. Pilih organisasi → klik **"Buat aplikasi"**
3. Isi:
   - **Nama aplikasi** — nama yang tampil di Play Store (max 30 karakter)
   - **Nama paket** — applicationId dari `build.gradle` (misal: `com.menaraagung.mapp`)
   - **Bahasa default** — Indonesia – id
   - **Aplikasi atau game** — Aplikasi
   - **Gratis atau berbayar** — sesuai kebutuhan
4. Centang dua pernyataan di bawah
5. Klik **"Buat aplikasi"**

Saat ditanya **"Perlindungan otomatis"** → pilih **Aktifkan** (mendorong user APK lama ke Play Store).

---

## 6. Upload AAB ke Internal Testing

1. **Uji dan rilis** → **Pengujian internal** → **Buat rilis baru**
2. Upload file `app-release.aab`
3. Aktifkan **Google Play App Signing** saat ditawarkan (sangat direkomendasikan)
4. Isi **Nama rilis**: format `versionName (versionCode)` → contoh: `1.1.0 (2)`
5. Isi **Catatan rilis** dalam tag `<id>`:
   ```
   Rilis pertama via Google Play. Fitur lengkap sesuai versi APK sebelumnya.
   ```
6. Klik **Simpan** → **Tinjau rilis** → **Publikasikan ke pengujian internal**

---

## 7. Menyiapkan Aplikasi — Konten & Metadata

Semua item ini wajib diselesaikan sebelum bisa publish ke Produksi.

### Kebijakan Privasi
- Masukkan URL halaman kebijakan privasi yang dapat diakses publik
- Contoh: `https://domainmu.com/kebijakan-privasi`

### Detail Login
- Pilih **Ya** (app memerlukan login)
- Isi **dalam bahasa Inggris**:
  - Name: `Demo Account`
  - Username: email akun demo yang benar-benar bisa login
  - Password: password akun demo tersebut
- Centang: *"Detail login memberikan akses penuh ke semua fitur"*
- **Pastikan akun demo ini aktif dan tidak ada 2FA**

### Iklan
- Pilih **Tidak mengandung iklan**

### Rating Konten
1. Pilih email kontak
2. Kategori: **Semua Jenis Aplikasi Lainnya**
3. Centang persetujuan IARC
4. Jawab semua pertanyaan kuesioner → **Tidak** semua (untuk app B2B tanpa konten sensitif)
5. Klik **Simpan** di setiap bagian sebelum klik **Berikutnya**
6. Simpan rating yang muncul

### Audiens Target
- Pilih **18 tahun ke atas**
- Opsional: centang pembatasan pengguna di bawah umur

### Keamanan Data (5 langkah)
Isi sesuai library yang dipakai app:

**Langkah 2 — Pengumpulan & keamanan:**
- Mengumpulkan data? → **Ya**
- Data dienkripsi saat pengiriman? → **Ya** (HTTPS)
- Metode buat akun? → **Aplikasi saya tidak mengizinkan pengguna membuat akun**
- Login dengan akun dari luar? → **Ya** → **Melalui akun perusahaan atau tempat kerja**
- Cara hapus data? → **Tidak**

**Langkah 3 — Jenis data yang dikumpulkan:**

| Kategori | Sub-item | Alasan |
|---|---|---|
| Lokasi | Perkiraan lokasi | Firebase Analytics (IP-based) |
| Info pribadi | Alamat email | Login akun |
| Info & performa app | Log error, Diagnostik | Firebase Crashlytics |
| Aktivitas aplikasi | Interaksi aplikasi | Firebase Analytics |
| Perangkat atau ID lainnya | Device or other IDs | FCM token notifikasi |

**Langkah 4 — Penggunaan data:**

| Data | Dikumpulkan | Sementara | Wajib | Tujuan |
|---|---|---|---|---|
| Perkiraan lokasi | ✅ | Ya | Opsional | Analytics |
| Email | ✅ | Tidak | Wajib | Pengelolaan akun |
| Log error | ✅ | Tidak | Wajib | Analytics |
| Diagnostik | ✅ | Tidak | Wajib | Analytics |
| Interaksi app | ✅ | Tidak | Wajib | Analytics |
| Device ID | ✅ | Tidak | Wajib | Fungsi aplikasi |

### ID Iklan (Advertising ID)

Wajib diisi — akan jadi **blocker saat rilis ke Produksi** kalau belum diisi.

Lokasi: sidebar kiri → **Pantau dan tingkatkan** → **Kebijakan dan program** → **Konten aplikasi** → **ID Iklan**

- **Apakah app menggunakan ID Iklan?** → **Ya**
  (Firebase Analytics otomatis menyertakan izin `AD_ID` di manifes)
- **Mengapa?** → centang:
  - **Analytics** (Firebase Analytics)
  - **Komunikasi developer** (FCM push notification)
- Klik **Simpan**

### Aplikasi Pemerintah
- Pilih **Tidak**

### Fitur Keuangan & Kesehatan
- Semua pilih **Tidak**

### Setelan Store (Kategori & Kontak)
- **Kategori**: Bisnis
- **Email kontak**: email developer/perusahaan
- **Situs web**: website perusahaan (opsional)
- **Pemasaran eksternal**: aktifkan

---

## 8. Listingan Play Store

### Teks

**Nama aplikasi** (max 30 karakter): nama resmi app

**Deskripsi singkat** (max 80 karakter): ringkasan 1 kalimat fungsi utama app

**Deskripsi lengkap** (max 4000 karakter): jelaskan fitur-fitur lengkap app

### Visual yang Diperlukan

| Aset | Spesifikasi | Keterangan |
|---|---|---|
| **Ikon aplikasi** | PNG/JPEG, 512×512 px, max 1 MB | Wajib |
| **Gambar fitur** | PNG/JPEG, 1024×500 px, max 15 MB | Wajib |
| **Screenshot ponsel** | PNG/JPEG, rasio 9:16, min 320px, max 3840px, 2–8 buah | Wajib |
| **Screenshot tablet 7"** | PNG/JPEG, rasio 9:16 | Wajib |
| **Screenshot tablet 10"** | PNG/JPEG, rasio 9:16, min 1080px | Wajib |

**Tips screenshot:**
- Ambil langsung dari HP (portrait)
- Gunakan emulator Android Studio untuk tablet jika tidak punya tablet fisik
- Minimal 2 screenshot ponsel agar bisa submit

---

## 9. Rilis ke Produksi

Setelah semua setup selesai:

1. Di Dashboard → klik **"Buat dan publikasikan rilis"**
   (atau sidebar: **Uji dan rilis** → **Produksi** → **Buat rilis baru**)
2. **Pilih negara dan wilayah** → pilih Indonesia (atau semua negara)
3. Di form rilis: AAB akan otomatis tersedia dari library — tidak perlu upload ulang
4. Isi **Catatan rilis** dalam tag `<id>`
5. Klik **Berikutnya** → **Simpan**

> Jika muncul error **"Aplikasi tidak mendukung ukuran halaman memori 16 KB"**:
> Klik **"Tetap lanjutkan"** di bawah pesan error → tombol Simpan akan aktif.

---

## 10. Ringkasan Publikasi & Kirim untuk Ditinjau

Setelah rilis produksi disimpan, kamu akan diarahkan ke halaman **Ringkasan Publikasi**.

1. Google menjalankan **pemeriksaan cepat** (~14 menit) — tunggu sampai selesai
2. Jika ada error yang muncul (contoh: "Pernyataan ID Iklan tidak lengkap") — selesaikan dulu
3. Setelah pemeriksaan selesai dan tidak ada error, tombol **"Kirim N perubahan untuk ditinjau"** akan aktif
4. Klik tombol → konfirmasi → selesai

Status akan berubah ke **"Sedang ditinjau"**. Review Google biasanya **1–7 hari** untuk app baru.

### Notifikasi ke User Lama (jika distribusi sebelumnya via APK)

Broadcast ke grup WhatsApp:
> "Halo semua, [nama app] sekarang sudah tersedia di Play Store!
> Mohon **uninstall APK lama** dulu, lalu install dari Play Store via link ini: [link].
> Login ulang menggunakan akun yang sama ya."

---

## 11. Update Berikutnya

Setiap kali ada update app:

1. Naikkan `versionCode` dan `versionName` di `android/app/build.gradle`:
   ```groovy
   versionCode 3        // naik 1 dari sebelumnya
   versionName "1.2.0"  // sesuai semantic versioning
   ```
2. Build AAB baru:
   ```bash
   npx react-native build-android --mode=release
   ```
3. Play Console → **Produksi** → **Buat rilis baru** → upload AAB baru
4. Isi catatan rilis → publish

---

## 11. Troubleshooting

### Error: `BundleConfig$BundleType not present`
**Penyebab:** Konflik versi antara plugin (biasanya `firebase-appdistribution-gradle`) dan AGP.
**Fix:**
- Hapus `classpath("com.google.firebase:firebase-appdistribution-gradle:x.x.x")` dari `android/build.gradle`
- Hapus `apply plugin: "com.google.firebase.appdistribution"` dari `android/app/build.gradle`
- Pin versi AGP secara eksplisit: `classpath("com.android.tools.build:gradle:8.12.0")`

### Error: `Could not read workspace metadata .../metadata.bin`
**Penyebab:** Gradle cache corrupt.
**Fix:**
```powershell
# Windows PowerShell
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\daemon"
Remove-Item -Recurse -Force "android\.gradle"
```
Lalu build ulang.

### Error: `keystore password was incorrect`
**Penyebab:** Password di `gradle.properties` tidak sesuai dengan password keystore.
**Fix:** Cek `android/gradle.properties` — pastikan `MYAPP_UPLOAD_STORE_PASSWORD` dan `MYAPP_UPLOAD_KEY_PASSWORD` benar.

### Build lambat / Daemon expired (JVM Metaspace)
**Penyebab:** JVM heap terlalu kecil untuk project besar.
**Fix:** Tambahkan di `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

### Tombol "Berikutnya" tidak aktif di Play Console
**Penyebab:** Ada pertanyaan yang belum dijawab, atau belum klik **Simpan** di bagian tersebut.
**Fix:** Klik **Simpan** terlebih dahulu sebelum klik **Berikutnya**.

---

## Referensi

- [React Native — Publishing to Google Play](https://reactnative.dev/docs/signed-apk-android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Gradle Plugin Releases](https://developer.android.com/build/releases/gradle-plugin)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)

---

*Dibuat berdasarkan deploy PMO app — PT. Menara Agung, Juni 2026*
