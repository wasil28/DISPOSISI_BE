# Panduan Menjalankan Aplikasi Nest.js dengan Yarn

Selamat datang di panduan ini! Panduan ini akan membantu Anda menjalankan aplikasi Nest.js menggunakan Yarn sebagai package manager.
Berikut teknologi yang dipakai :

Engine
 - NestJs
 - Nodejs : 20.11.0

 Package & Utility
 - TypeORM
 - Typescript

 API
 - Graphql
 - RESTFull

 Engine
 - yarn
 - Nodejs

Database:
- Postgres 13/14


## Langkah-langkah:

### 1. Instalasi Yarn

Pastikan Yarn sudah terinstal di sistem Anda. Jika belum, instal Yarn dengan menjalankan perintah berikut di terminal:

```bash
npm install -g yarn
```

### 2. Clone Repositori

Clone repositori Nest.js Anda atau gunakan template yang sudah ada:

```bash
git clone https://github.com/nama-user/repo-nestjs.git
cd repo-nestjs
```

### 3. Instalasi Dependensi

Masuk ke direktori proyek dan jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

```bash
yarn install
```

### 4. Konfigurasi Lingkungan

Pastikan untuk menyiapkan konfigurasi lingkungan yang diperlukan sebelum menjalankan aplikasi. Biasanya, ini melibatkan pengaturan file `.env` dengan variabel lingkungan yang sesuai. Contoh:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
```

### 5. Menjalankan Aplikasi

Setelah instalasi selesai, jalankan aplikasi dengan perintah:

```bash
yarn start
```

Anda juga bisa menggunakan perintah berikut untuk menjalankan aplikasi dalam mode pengembangan (development mode):

```bash
yarn start:dev
```

### 6. Menjalankan Test

Pastikan untuk menjalankan unit test dan/atau test integrasi secara berkala untuk memastikan kualitas kode Anda:

```bash
yarn test
```

## Peraturan Kode:

### - Kaidah Syntax

Pastikan kode Anda mengikuti standar kaidah syntax yang benar, sesuai dengan pedoman yang telah ditetapkan.

### - Komentar

Gunakan komentar untuk menjelaskan bagian-bagian penting dari kode Anda. Ini akan membantu orang lain memahami kode Anda dengan lebih baik.

### - Penggunaan Yarn

Selalu gunakan Yarn sebagai package manager dalam proyek Nest.js Anda. Ini akan memastikan konsistensi dalam manajemen dependensi.

### - Testing

Selalu pastikan untuk menyertakan unit test dan/atau test integrasi dalam proyek Anda. Gunakan framework pengujian yang sesuai seperti Jest untuk menguji komponen aplikasi Anda.


## Catatan:

- Pastikan Node.js sudah terinstal di sistem Anda sebelum menjalankan langkah-langkah di atas.
- Sesuaikan URL repositori dengan repositori Anda sendiri.
- Jika Anda mengalami masalah, cek dokumentasi resmi Nest.js dan Yarn untuk bantuan lebih lanjut.
- ❗❗❗ Untuk Push SC Wajib dibuat branch per Feature ❗❗❗

Dengan mengikuti langkah-langkah di atas dan mematuhi peraturan kode, serta melakukan pengujian secara konsisten, Anda dapat menjalankan dan mengelola aplikasi Nest.js Anda dengan lebih efisien menggunakan Yarn sebagai package manager.

Selamat mengoding! 🚀
