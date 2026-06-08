# ──────────────────────────────────────────────
# React Native core
# ──────────────────────────────────────────────
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.**

# ──────────────────────────────────────────────
# Kotlin
# ──────────────────────────────────────────────
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**

# ──────────────────────────────────────────────
# Firebase & Google Play Services
# ──────────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Crashlytics — wajib agar stack trace terbaca
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }
-renamesourcefileattribute SourceFile

# FCM Messaging
-keep class com.google.firebase.messaging.** { *; }

# ──────────────────────────────────────────────
# OkHttp / Okio (dipakai banyak library)
# ──────────────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# ──────────────────────────────────────────────
# Notifee
# ──────────────────────────────────────────────
-keep class io.invertase.notifee.** { *; }
-dontwarn io.invertase.notifee.**

# ──────────────────────────────────────────────
# react-native-pdf
# ──────────────────────────────────────────────
-keep class com.github.barteksc.pdfviewer.** { *; }
-dontwarn com.github.barteksc.**

# ──────────────────────────────────────────────
# react-native-blob-util
# ──────────────────────────────────────────────
-keep class com.RNFetchBlob.** { *; }
-keep class com.ReactNativeBlobUtil.** { *; }
-dontwarn com.RNFetchBlob.**

# ──────────────────────────────────────────────
# AsyncStorage
# ──────────────────────────────────────────────
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ──────────────────────────────────────────────
# Annotations & Reflection (umum)
# ──────────────────────────────────────────────
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
