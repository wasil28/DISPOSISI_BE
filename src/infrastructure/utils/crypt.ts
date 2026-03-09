import * as CryptoJS from 'crypto-js';

// Secret key untuk enkripsi/dekripsi
const secretKey = process.env.CRYPTY_SECRET; // Pastikan secretKey ada di environment variable

// Fungsi untuk encode Base64 URL-safe
function toUrlSafeBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Fungsi untuk decode Base64 URL-safe
function fromUrlSafeBase64(urlSafeBase64: string): string {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '='; // Perbaiki padding
  }
  return base64;
}

// Fungsi untuk enkripsi menggunakan CryptoJS
export function encrypt(text: string): string {
  // Enkripsi menggunakan AES dan secretKey
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  // Kembalikan hasil enkripsi dalam bentuk base64 URL-safe
  return toUrlSafeBase64(encrypted);
}

// Fungsi untuk dekripsi menggunakan CryptoJS
export function decrypt(urlSafeCipherText: string): string | null {
  try {
    // Decode base64 URL-safe kembali ke base64 standar
    const cipherText = fromUrlSafeBase64(urlSafeCipherText);

    // Dekripsi menggunakan AES dan secretKey
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // Jika berhasil didekripsi, kembalikan teks yang sudah didekripsi
    return decrypted || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
