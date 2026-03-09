# 📚 Panduan Membuat Modul CRUD

Selamat datang di tim developer **Disposisi App**! Panduan ini dirancang khusus untuk membantumu memahami alur *End-to-End* (Mulai dari Database hingga Layar Tampilan) dalam membangun fitur CRUD (Create, Read, Update, Delete).

Aplikasi kita terpisah menjadi dua repositori:
1. **DISPOSISI_BE** (Backend): Menggunakan **NestJS**, **TypeORM** (PostgreSQL), dan **GraphQL/REST API**.
2. **DISPOSISI_FE** (Frontend): Menggunakan **Nuxt 3** (Vue.js SSR), **Tailwind CSS**, dan **Pinia**.

---

## 🛠️ BAGIAN 1: BACKEND (NESTJS)

Saat kamu mendapat tugas membuat fitur CRUD baru, misalnya "Fitur FAQ" (Tanya Jawab), pastikan kamu membuatnya di Backend terlebih dahulu. Jangan langsung membuat Endpoint API; mulailah dari dasar! 

Ikuti **5 Tahap Wajib** ini secara berurutan:

### 1. Membuat Entity (Koneksi Database) - `faq.entity.ts`
Entity adalah jantung aplikasi. Ia memberitahu TypeORM bagaimana bentuk tabel di database (PostgreSQL). File ini biasanya disimpan di folder `src/entities/`.

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType() // Wajib agar Field-field ini bisa di-query oleh Frontend via GraphQL
@Entity('m_faq') // Nama tabel asli yang akan dibuat di Database PostgreSQL
export class FaqEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'pertanyaan', type: 'varchar', length: 255 })
  pertanyaan: string;

  @Field()
  @Column({ name: 'jawaban', type: 'text' })
  jawaban: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. Membuat DTO (Data Transfer Object) - `create-faq.dto.ts`
DTO ibarat "Satpam" yang memeriksa data JSON yang dikirim Frontend sebelum masuk ke Database kita. Gunakan library `class-validator` untuk validasi otomatis.

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType() // Menandakan class ini bertindak sebagai Input/Payload dari user
export class CreateFaqDto {
  @Field()
  @IsNotEmpty({ message: 'Pertanyaan tidak boleh kosong!' }) // Validasi Wajib Isi
  @IsString()
  @MaxLength(255) // Validasi panjang maksimal
  pertanyaan: string;

  @Field()
  @IsNotEmpty({ message: 'Jawaban harus diisi!' })
  @IsString()
  jawaban: string;
}
```

### 3. Membuat Service (Logika Bisnis) - `faq.service.ts`
Di sinilah logika murni seperti *Insert*, *Update*, *Delete*, *Find* bekerja. Kita menyuntikkan (Inject) `Repository` TypeORM agar bisa mengutak-atik isi database tabel `m_faq`.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqEntity } from '~/entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly repo: Repository<FaqEntity>,
  ) {}

  // Logika 1: Menampilkan seluruh data FAQ (READ)
  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  // Logika 2: Menambahkan data FAQ baru (CREATE)
  async create(payload: CreateFaqDto) {
    const newData = this.repo.create(payload); // Merangkai Entity baru
    return this.repo.save(newData); // Eksekusi Query 'INSERT INTO...'
  }
}
```

### 4. Buka Endpoint API via Resolver - `faq.resolver.ts`
*Resolver* bertugas membuka jalur Endpoint / URL GraphQL. **SANGAT PENTING**: Karena ini adalah fitur rahasia Dashboard Admin, kita *WAJIB MENGGEMBOK* rute ini agar tidak bisa diakses orang lain menggunakan Token Guard.

```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '~/guards/jwt-auth.guard'; // 🛡️ PENJAGA TOKEN (SECURITY)
import { FaqEntity } from '~/entities/faq.entity';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';

@Resolver(() => FaqEntity)
export class FaqResolver {
  constructor(private readonly svc: FaqService) {}

  // Membuka Akses Query (Sama seperti HTTP GET)
  @Query(() => [FaqEntity])
  @UseGuards(JwtAuthGuard) // ⚠️ HANYA user yang sudah login (punya Token JWT) yang bisa akses
  async getAllFaq() {
    return this.svc.findAll();
  }

  // Membuka Akses Mutation (Sama seperti HTTP POST/PUT/DELETE)
  @Mutation(() => FaqEntity)
  @UseGuards(JwtAuthGuard) // ⚠️ Wajib pasang gembok di mutasi agar tidak sembarang orang bisa create data
  async p_createFaq(@Args('input') input: CreateFaqDto) {
    return this.svc.create(input);
  }
}
```

### 5. Registrasikan ke Module - `faq.module.ts`
Langkah Backend terakhir! NestJS tidak akan tahu kalau file-file ajaib ini eksis jika kamu tidak mendaftarkannya ke modul dan mengimport modulnya ke `app.module.ts`.

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqEntity } from '~/entities/faq.entity';
import { FaqResolver } from './faq.resolver';
import { FaqService } from './faq.service';

@Module({
  // TypeOrmModule.forFeature MEMBERIKAN Repostiory Entity ke dalam Service FaqService
  imports: [TypeOrmModule.forFeature([FaqEntity])],
  providers: [FaqResolver, FaqService],
})
export class FaqModule {}
```

> **🎉 SELAMAT! BACKEND FAQ TELAH SELESAI.**  
> Kamu bisa mengeksekusi endpoint ini dari *Apollo Studio* atau *Postman* untuk mencoba Query `getAllFaq` dan Mutation `p_createFaq`.

---

## 🎨 BAGIAN 2: FRONTEND (NUXT 3 & VUE)

Sekarang, asumsikan kamu harus menyambungkan backend FAQ tadi ke sebuah tampilan layar baru di Dashboard `DISPOSISI_FE`.

### Konsep Dasar
Semua fitur yang berada di dalam lingkup Admin Panel ditempatkan di folder `src/pages/adminpanel/`. Buatlah folder baru bernama `faq` dan buat file `index.vue` di dalamnya.

```text
DISPOSISI_FE/
  ├─ package.json          <-- Konfigurasi versi library (npm/yarn)
  ├─ nuxt.config.ts        <-- Konfigurasi utama Nuxt (Modul, SSR, Tailwind)
  ├─ tailwind.config.js    <-- Aturan kustomisasi gaya Tailwind
  ├─ tsconfig.json         <-- Aturan ketat TypeScript
  └─ src/
     ├─ apis/              <-- Fungsi pemanggilan API ke Backend (Axios)
     ├─ composables/       <-- Logika helper seperti useSession()
     ├─ middleware/        <-- Proteksi rute (seperti otorisasi.ts)
     ├─ stores/            <-- Penyimpanan State Global (Pinia)
     └─ pages/
        └─ adminpanel/
           └─ faq/
              ├─ index.vue      <-- Layar List Tabel Utama
              └─ FormFaq.vue    <-- Tampilan Form (dipanggil di index.vue lewat Modal/Slideover)
```

### 1. Menentukan State, Guard, dan Pemanggilan API - `index.vue`
Nuxt menggunakan komposisi `<script setup lang="ts">`. Kamu harus paham kegunaan *Middleware* dan bagaimana cara menarik data User yang sedang Login.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 1. DAFTARKAN MIDDLEWARE OTORISASI & LAYOUT
// Middleware ini WAJIB DIPASANG pada setiap halaman admin, jika user belum login akan ditendang bouncer ke halaman '/'
definePageMeta({
  middleware: 'otorisasi',
  layout: 'module',
})

// 2. AMBIL SESI USER SAAT INI
// useSession memanggil Local Cookie dan Pinia untuk mendapatkan Data Otorisasi.
const { session } = await useSession()

// Kenapa ambil session?
// - Ambil Token JWT: `session.value.token` -> Digunakan untuk Header Axios supaya API tembus JwtAuthGuard
// - Ambil Kode Role: `session.value.activeRole?.role?.kode` -> Buat validasi level akses.
// - Menarik Hak Akses UI Lokal -> 'Tampilkan tombol Tambah jika Boolean allow_new True'
const allow_new = true; // Hardcode contoh
const allow_edit = true;
const allow_delete = true;

// 3. SIAPKAN STATE DAN FUNGSI PEMANGGILAN
const dataTable = ref([]) // Wadah untuk simpan data dari Backend
const isFormModalOpen = ref(false) // Tombol on/off slideover/modal

const panggilBackendDapatkanData = async () => {
   // Biasanya pemanggilan ini dilempar ke service file `src/apis/faq.api.ts`
   // Namun sebagai gambaran, kamu akan memanggil GQL Server seperti ini:
   // const hasil = await apiCall(session.value.token, queryGetFaq)
   // dataTable.value = hasil.data
}

onMounted(() => {
   // Panggil data Backend segera saat halaman terbuka!
   panggilBackendDapatkanData()
})
</script>
```

### 2. Membuat Desain Antarmuka Tabel - `<template>`
Nuxt UI menyediakan komponen berkelas bawaan Tailwind seperti `<UButton>`, `<UTable>`, dan `<UModal>` / `<USlideover>`. 

Hindari berpindah antar *Pages* jika formnya kecil. Manfaatkan `<USlideover>` (Panel Laci di samping layar) untuk memunculkan Form Input tanpa mereload/mereplace halaman.

```vue
<template>
  <div class="p-6 max-w-7xl mx-auto">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
       <h1 class="text-2xl font-extrabold text-slate-800">Manajemen FAQ (Tanya Jawab)</h1>
       
       <!-- 🛡️ HANYA MUNCUL JIKA PUNYA HAK AKSES 'CREATE' -->
       <UButton 
          v-if="allow_new" 
          color="blue" 
          icon="i-mdi-plus" 
          @click="isFormModalOpen = true"
       >
         Tambah Bantuan Baru
       </UButton>
    </div>

    <!-- TABEL DATA -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
       <!-- Data table akan meloop data berdasarkan variabel 'dataTable' yang kita set dari Backend! -->
       <UTable :rows="dataTable" />
    </div>

    <!-- FORM INPUT SLIDEOVER -->
    <!-- Jika tombol ditekan, v-model ini diubah menjadi 'true', layar akan terdorong dari panel kanan -->
    <USlideover v-model="isFormModalOpen">
       <div class="p-8">
          <h2 class="text-xl font-bold border-b pb-4 mb-4">Input Data FAQ</h2>
          
          <!-- Di titik ini, kamu panggil <FormFaq /> component di file sebelahnya -->
          <p class="text-slate-500 text-sm">Form input (Pertanyaan & Jawaban) dirender di sini.</p>
          
          <div class="mt-8 flex justify-end gap-3">
             <UButton color="gray" variant="ghost" @click="isFormModalOpen = false">Batal</UButton>
             <UButton color="blue">Simpan Data</UButton>
          </div>
       </div>
    </USlideover>
    
  </div>
</template>
```

---

## 🎯 RINGKASAN (CHEAT SHEET) INTERN

- **Jangan pernah merubah isi file `.vue` tanpa `definePageMeta({ middleware: 'otorisasi' })` di folder `adminpanel/`!** Kalau lupa, file itu bisa dikunjungi bocah asing tanpa login.
- **Setiap kali bikin API GraphQL Mutation (Create/Update/Delete) di NestJS, jangan lupa gembok dengan `@UseGuards(JwtAuthGuard)`!** Kalau tidak, siapa pun bisa injeksi data palsu ke DB.
- Selalu gunakan `handleApiError()` saat membungkus Try-Catch di Frontend untuk melempar SweetAlert2 notifikasi Error Merah jika REST/GQL Backendnya mati.
- Simpan komponen Modal/Slideover Form sejajar dengan file `index.vue` untuk mempermudah perawatan kode (misal `FormRole.vue`, `FormFaq.vue`).

*Semangat Berkarya! Jika kamu bingung, tanyakan mentor teknikal di tim.*
