-- Seed Users for All UPBJJ
-- Password for all users: "Password123!" (hashed with bcrypt)
-- Run this after add_upbjj_table_and_relation.sql

-- Insert 2-3 users per UPBJJ (total ~80-100 users)
INSERT INTO m_users (email, nama_user, id_upbjj, password, status, created_at, updated_at)
VALUES 
-- Malang (id=20)
('user_malang_1@malang.ut.ac.id', 'User Malang 1', 20, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_malang_2@malang.ut.ac.id', 'User Malang 2', 20, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Palu (id=31)
('user_palu_1@palu.ut.ac.id', 'User Palu 1', 31, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_palu_2@palu.ut.ac.id', 'User Palu 2', 31, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Manado (id=33)
('user_manado_1@manado.ut.ac.id', 'User Manado 1', 33, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_manado_2@manado.ut.ac.id', 'User Manado 2', 33, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Jambi (id=7)
('user_jambi_1@jambi.ut.ac.id', 'User Jambi 1', 7, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_jambi_2@jambi.ut.ac.id', 'User Jambi 2', 7, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Banda Aceh (id=1)
('user_aceh_1@aceh.ut.ac.id', 'User Banda Aceh 1', 1, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_aceh_2@aceh.ut.ac.id', 'User Banda Aceh 2', 1, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Batam (id=3)
('user_batam_1@batam.ut.ac.id', 'User Batam 1', 3, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_batam_2@batam.ut.ac.id', 'User Batam 2', 3, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Serang (id=12)
('user_serang_1@serang.ut.ac.id', 'User Serang 1', 12, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_serang_2@serang.ut.ac.id', 'User Serang 2', 12, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Bandung (id=14)
('user_bandung_1@bandung.ut.ac.id', 'User Bandung 1', 14, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_bandung_2@bandung.ut.ac.id', 'User Bandung 2', 14, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_bandung_3@bandung.ut.ac.id', 'User Bandung 3', 14, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Purwokerto (id=15)
('user_purwokerto_1@purwokerto.ut.ac.id', 'User Purwokerto 1', 15, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_purwokerto_2@purwokerto.ut.ac.id', 'User Purwokerto 2', 15, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Semarang (id=16)
('user_semarang_1@semarang.ut.ac.id', 'User Semarang 1', 16, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_semarang_2@semarang.ut.ac.id', 'User Semarang 2', 16, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_semarang_3@semarang.ut.ac.id', 'User Semarang 3', 16, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Banjarmasin (id=27)
('user_banjarmasin_1@banjarmasin.ut.ac.id', 'User Banjarmasin 1', 27, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_banjarmasin_2@banjarmasin.ut.ac.id', 'User Banjarmasin 2', 27, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Surakarta (id=17)
('user_solo_1@solo.ut.ac.id', 'User Surakarta 1', 17, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_solo_2@solo.ut.ac.id', 'User Surakarta 2', 17, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Yogyakarta (id=18)
('user_yogya_1@yogya.ut.ac.id', 'User Yogyakarta 1', 18, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_yogya_2@yogya.ut.ac.id', 'User Yogyakarta 2', 18, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_yogya_3@yogya.ut.ac.id', 'User Yogyakarta 3', 18, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Pontianak (id=25)
('user_pontianak_1@pontianak.ut.ac.id', 'User Pontianak 1', 25, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_pontianak_2@pontianak.ut.ac.id', 'User Pontianak 2', 25, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Surabaya (id=19)
('user_surabaya_1@surabaya.ut.ac.id', 'User Surabaya 1', 19, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_surabaya_2@surabaya.ut.ac.id', 'User Surabaya 2', 19, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_surabaya_3@surabaya.ut.ac.id', 'User Surabaya 3', 19, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Jember (id=21)
('user_jember_1@jember.ut.ac.id', 'User Jember 1', 21, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_jember_2@jember.ut.ac.id', 'User Jember 2', 21, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Denpasar (id=22)
('user_denpasar_1@denpasar.ut.ac.id', 'User Denpasar 1', 22, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_denpasar_2@denpasar.ut.ac.id', 'User Denpasar 2', 22, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Makassar (id=29)
('user_makassar_1@makassar.ut.ac.id', 'User Makassar 1', 29, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_makassar_2@makassar.ut.ac.id', 'User Makassar 2', 29, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_makassar_3@makassar.ut.ac.id', 'User Makassar 3', 29, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Medan (id=2)
('user_medan_1@medan.ut.ac.id', 'User Medan 1', 2, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_medan_2@medan.ut.ac.id', 'User Medan 2', 2, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Jakarta (id=11)
('user_jakarta_1@jakarta.ut.ac.id', 'User Jakarta 1', 11, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_jakarta_2@jakarta.ut.ac.id', 'User Jakarta 2', 11, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_jakarta_3@jakarta.ut.ac.id', 'User Jakarta 3', 11, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Padang (id=4)
('user_padang_1@padang.ut.ac.id', 'User Padang 1', 4, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_padang_2@padang.ut.ac.id', 'User Padang 2', 4, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Bandar Lampung (id=10)
('user_lampung_1@lampung.ut.ac.id', 'User Bandar Lampung 1', 10, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_lampung_2@lampung.ut.ac.id', 'User Bandar Lampung 2', 10, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Bengkulu (id=9)
('user_bengkulu_1@bengkulu.ut.ac.id', 'User Bengkulu 1', 9, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_bengkulu_2@bengkulu.ut.ac.id', 'User Bengkulu 2', 9, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Palembang (id=8)
('user_palembang_1@palembang.ut.ac.id', 'User Palembang 1', 8, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_palembang_2@palembang.ut.ac.id', 'User Palembang 2', 8, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Pangkal Pinang (id=5)
('user_pangkalpinang_1@pangkalpinang.ut.ac.id', 'User Pangkal Pinang 1', 5, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_pangkalpinang_2@pangkalpinang.ut.ac.id', 'User Pangkal Pinang 2', 5, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Pekanbaru (id=6)
('user_pekanbaru_1@pekanbaru.ut.ac.id', 'User Pekanbaru 1', 6, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_pekanbaru_2@pekanbaru.ut.ac.id', 'User Pekanbaru 2', 6, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Bogor (id=13)
('user_bogor_1@bogor.ut.ac.id', 'User Bogor 1', 13, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_bogor_2@bogor.ut.ac.id', 'User Bogor 2', 13, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Palangka Raya (id=26)
('user_palangkaraya_1@palangkaraya.ut.ac.id', 'User Palangka Raya 1', 26, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_palangkaraya_2@palangkaraya.ut.ac.id', 'User Palangka Raya 2', 26, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Kupang (id=24)
('user_kupang_1@kupang.ut.ac.id', 'User Kupang 1', 24, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_kupang_2@kupang.ut.ac.id', 'User Kupang 2', 24, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Samarinda (id=28)
('user_samarinda_1@samarinda.ut.ac.id', 'User Samarinda 1', 28, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_samarinda_2@samarinda.ut.ac.id', 'User Samarinda 2', 28, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Sorong (id=38)
('user_sorong_1@sorong.ut.ac.id', 'User Sorong 1', 38, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_sorong_2@sorong.ut.ac.id', 'User Sorong 2', 38, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Mataram (id=23)
('user_mataram_1@mataram.ut.ac.id', 'User Mataram 1', 23, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_mataram_2@mataram.ut.ac.id', 'User Mataram 2', 23, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Majene (id=30)
('user_majene_1@majene.ut.ac.id', 'User Majene 1', 30, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_majene_2@majene.ut.ac.id', 'User Majene 2', 30, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Kendari (id=32)
('user_kendari_1@kendari.ut.ac.id', 'User Kendari 1', 32, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_kendari_2@kendari.ut.ac.id', 'User Kendari 2', 32, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Ambon (id=35)
('user_ambon_1@ambon.ut.ac.id', 'User Ambon 1', 35, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_ambon_2@ambon.ut.ac.id', 'User Ambon 2', 35, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Jayapura (id=36)
('user_jayapura_1@jayapura.ut.ac.id', 'User Jayapura 1', 36, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_jayapura_2@jayapura.ut.ac.id', 'User Jayapura 2', 36, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Tarakan (id=39)
('user_tarakan_1@tarakan.ut.ac.id', 'User Tarakan 1', 39, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_tarakan_2@tarakan.ut.ac.id', 'User Tarakan 2', 39, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Gorontalo (id=34)
('user_gorontalo_1@gorontalo.ut.ac.id', 'User Gorontalo 1', 34, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_gorontalo_2@gorontalo.ut.ac.id', 'User Gorontalo 2', 34, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),

-- Ternate (id=37)
('user_ternate_1@ternate.ut.ac.id', 'User Ternate 1', 37, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW()),
('user_ternate_2@ternate.ut.ac.id', 'User Ternate 2', 37, '$2a$10$NC0FFN2Ee3PsFs9YL.IpM.9wzqVzPJwN5TSHF7l8cosbbGEY.XU2q', 1, NOW(), NOW())

ON CONFLICT (email) DO NOTHING;

-- Verify insertion
SELECT 
    u.nama_upbjj,
    COUNT(m.id) as total_users
FROM m_upbjj u
LEFT JOIN m_users m ON m.id_upbjj = u.id
WHERE u.status_aktif = 1
GROUP BY u.id, u.nama_upbjj
ORDER BY total_users DESC, u.nama_upbjj;
