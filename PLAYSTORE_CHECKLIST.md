# Checklist Deploy Play Store — MAPP

## 1. Keystore Production

- [ ] Buat production keystore
  ```
  keytool -genkeypair -v -storetype PKCS12 -keystore mapp-upload-key.keystore -alias mapp-key-alias -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Simpan file `.keystore` + password di tempat aman (jangan di dalam repo)
- [ ] Tambahkan variabel di `~/.gradle/gradle.properties`
  ```
  MAPP_UPLOAD_STORE_FILE=mapp-upload-key.keystore
  MAPP_UPLOAD_KEY_ALIAS=mapp-key-alias
  MAPP_UPLOAD_STORE_PASSWORD=xxxxxx
  MAPP_UPLOAD_KEY_PASSWORD=xxxxxx
  ```
- [ ] Update `signingConfigs.release` di `android/app/build.gradle`
  ```groovy
  release {
      storeFile file(MAPP_UPLOAD_STORE_FILE)
      storePassword MAPP_UPLOAD_STORE_PASSWORD
      keyAlias MAPP_UPLOAD_KEY_ALIAS
      keyPassword MAPP_UPLOAD_KEY_PASSWORD
  }
  ```

---

## 2. Build Release

- [ ] Jalankan `./gradlew bundleRelease` (bukan assembleRelease)
- [ ] Pastikan build sukses tanpa error Proguard
- [ ] Install AAB ke device fisik dan test login + fitur utama
- [ ] Tidak ada crash baru akibat Proguard (cek Crashlytics)

---

## 3. Firebase — Daftar App Baru (applicationId sudah diganti)

- [ ] Buka Firebase Console → Project Settings → Add App → Android
- [ ] Package name: `com.menaraagung.mapp`
- [ ] Download `google-services.json` baru
- [ ] Replace file `android/app/google-services.json` dengan yang baru
- [ ] Hapus app lama `com.mapp` dari Firebase Console (opsional, setelah yakin berfungsi)

---

## 4. Google Play Console

- [ ] Buka [play.google.com/console](https://play.google.com/console)
- [ ] Buat app baru dengan applicationId `com.menaraagung.mapp`
- [ ] Aktifkan **Google Play App Signing** (direkomendasikan)
- [ ] Upload AAB ke track **Internal Testing** dulu
- [ ] Test install dari Play Store Internal Testing di device fisik

---

## 4. Metadata Play Store

- [ ] App name: tulis nama resmi
- [ ] Short description (max 80 karakter)
- [ ] Full description
- [ ] Screenshot minimal 2 untuk Phone
- [ ] Feature graphic (1024 x 500 px)
- [ ] App icon hi-res (512 x 512 px)
- [ ] Kategori app
- [ ] Privacy Policy URL (wajib karena app meminta data login & notifikasi)

---

## 5. Konfigurasi App (wajib diisi di Play Console)

- [ ] Content rating — isi kuesioner
- [ ] Target audience — pilih 18+ (app B2B)
- [ ] Data safety form — isi sesuai data yang dikumpulkan:
  - [x] Email/akun login
  - [x] FCM token (Device ID)
  - [x] Nama & info dealer
  - [ ] Centang "Data tidak dijual ke pihak ketiga"

---

## 6. Notifikasi ke User Lama (100+ user WA)

- [ ] Broadcast WA: minta user **uninstall APK lama** sebelum install dari Play Store
- [ ] Ingatkan bahwa mereka perlu **login ulang** (data lokal terhapus saat uninstall)
- [ ] Bagikan link Play Store setelah app live

---

## 7. Setelah Live

- [ ] Pantau **Crashlytics** 24 jam pertama setelah release
- [ ] Pantau **ANR & Crash rate** di Play Console
- [ ] Setiap update berikutnya: naikkan `versionCode` di `android/app/build.gradle`
  - Saat ini: `versionCode 2` — update berikutnya jadi `3`, dst.
