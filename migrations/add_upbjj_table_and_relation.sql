-- Migration: Add m_upbjj table and id_upbjj to users table

-- Create m_upbjj table
CREATE TABLE IF NOT EXISTS m_upbjj (
    id SERIAL PRIMARY KEY,
    kode_upbjj VARCHAR(10) NOT NULL,
    id_upbjj_sentra INTEGER,
    id_zona_waktu INTEGER,
    nama_upbjj VARCHAR(100) NOT NULL,
    alamat_upbjj TEXT,
    nomor_telepon_upbjj VARCHAR(50),
    nomor_fax_upbjj VARCHAR(50),
    email_upbjj VARCHAR(100),
    status_aktif INTEGER DEFAULT 1,
    web_upbjj VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Add id_upbjj column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_upbjj INTEGER;

-- Add foreign key constraint
ALTER TABLE users 
ADD CONSTRAINT fk_users_upbjj 
FOREIGN KEY (id_upbjj) 
REFERENCES m_upbjj(id) 
ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_id_upbjj ON users(id_upbjj);
CREATE INDEX IF NOT EXISTS idx_upbjj_status_aktif ON m_upbjj(status_aktif);
CREATE INDEX IF NOT EXISTS idx_upbjj_kode ON m_upbjj(kode_upbjj);

-- Insert sample UPBJJ data with coordinates
INSERT INTO m_upbjj (kode_upbjj, id_upbjj_sentra, id_zona_waktu, nama_upbjj, alamat_upbjj, nomor_telepon_upbjj, nomor_fax_upbjj, email_upbjj, status_aktif, latitude, longitude, created_by) VALUES
('74', 74, 1, 'Malang', 'Jl. Mayjen, Sungkono No. 9, Malang 65135', '0341-751600, 751608', '0341-751717', 'malang@ecampus.ut.ac.id', 1, -7.9797, 112.6304, 'SYSTEM'),
('75', 75, 1, 'Palu', 'Jl. Untad II Bumi Roviga, Palu', '0451-421907', '0451-421907', 'palu@ecampus.ut.ac.id', 1, -0.8999, 119.8707, 'SYSTEM'),
('76', 76, 1, 'Manado', 'Jl. 17 Agustus, Manado', '0431-862489', '0431-862489', 'manado@ecampus.ut.ac.id', 1, 1.4748, 124.8421, 'SYSTEM'),
('15', 15, 1, 'Jambi', 'Jl. Arif Rahman Hakim, Jambi', '0741-61684', '0741-61684', 'jambi@ecampus.ut.ac.id', 1, -1.6101, 103.6131, 'SYSTEM'),
('11', 11, 1, 'Banda Aceh', 'Jl. Syiah Kuala, Banda Aceh', '0651-7551234', '0651-7551234', 'aceh@ecampus.ut.ac.id', 1, 5.5483, 95.3238, 'SYSTEM'),
('77', 77, 1, 'Batam', 'Jl. Gajah Mada, Batam', '0778-460711', '0778-460711', 'batam@ecampus.ut.ac.id', 1, 1.0456, 104.0305, 'SYSTEM'),
('17', 17, 1, 'Serang', 'Jl. Raya Jakarta, Serang', '0254-200277', '0254-200277', 'serang@ecampus.ut.ac.id', 1, -6.1204, 106.1640, 'SYSTEM'),
('16', 16, 1, 'Bandung', 'Jl. Cihampelas, Bandung', '022-2011363', '022-2011363', 'bandung@ecampus.ut.ac.id', 1, -6.9175, 107.6191, 'SYSTEM'),
('34', 34, 1, 'Purwokerto', 'Jl. Jenderal Sudirman, Purwokerto', '0281-635624', '0281-635624', 'purwokerto@ecampus.ut.ac.id', 1, -7.4197, 109.2394, 'SYSTEM'),
('33', 33, 1, 'Semarang', 'Jl. Pemuda, Semarang', '024-8316653', '024-8316653', 'semarang@ecampus.ut.ac.id', 1, -6.9667, 110.4167, 'SYSTEM'),
('78', 78, 1, 'Banjarmasin', 'Jl. Sultan Adam, Banjarmasin', '0511-3304706', '0511-3304706', 'banjarmasin@ecampus.ut.ac.id', 1, -3.3194, 114.5906, 'SYSTEM'),
('35', 35, 1, 'Surakarta', 'Jl. Adi Sucipto, Surakarta', '0271-715152', '0271-715152', 'solo@ecampus.ut.ac.id', 1, -7.5755, 110.8243, 'SYSTEM'),
('36', 36, 1, 'Yogyakarta', 'Jl. Bantul, Yogyakarta', '0274-586303', '0274-586303', 'yogyakarta@ecampus.ut.ac.id', 1, -7.7956, 110.3695, 'SYSTEM'),
('79', 79, 1, 'Pontianak', 'Jl. Karya Bhakti, Pontianak', '0561-765534', '0561-765534', 'pontianak@ecampus.ut.ac.id', 1, -0.0263, 109.3425, 'SYSTEM'),
('37', 37, 1, 'Surabaya', 'Jl. Raya Juanda, Surabaya', '031-8672216', '031-8672216', 'surabaya@ecampus.ut.ac.id', 1, -7.2575, 112.7521, 'SYSTEM'),
('80', 80, 1, 'Kupang', 'Jl. Eltari, Kupang', '0380-881711', '0380-881711', 'kupang@ecampus.ut.ac.id', 1, -10.1718, 123.6075, 'SYSTEM'),
('81', 81, 1, 'Samarinda', 'Jl. Juanda, Samarinda', '0541-260588', '0541-260588', 'samarinda@ecampus.ut.ac.id', 1, -0.5022, 117.1536, 'SYSTEM'),
('82', 82, 1, 'Sorong', 'Jl. Basuki Rahmat, Sorong', '0951-321945', '0951-321945', 'sorong@ecampus.ut.ac.id', 1, -0.8667, 131.2500, 'SYSTEM'),
('38', 38, 1, 'Jember', 'Jl. Gajah Mada, Jember', '0331-330118', '0331-330118', 'jember@ecampus.ut.ac.id', 1, -8.1722, 113.6994, 'SYSTEM'),
('83', 83, 1, 'Denpasar', 'Jl. Udayana, Denpasar', '0361-223958', '0361-223958', 'denpasar@ecampus.ut.ac.id', 1, -8.6705, 115.2126, 'SYSTEM'),
('84', 84, 1, 'Mataram', 'Jl. Pendidikan, Mataram', '0370-671689', '0370-671689', 'mataram@ecampus.ut.ac.id', 1, -8.5833, 116.1167, 'SYSTEM'),
('85', 85, 1, 'Makassar', 'Jl. Perintis Kemerdekaan, Makassar', '0411-510676', '0411-510676', 'makassar@ecampus.ut.ac.id', 1, -5.1477, 119.4327, 'SYSTEM'),
('86', 86, 1, 'Majene', 'Jl. Poros Majene, Majene', '0422-22077', '0422-22077', 'majene@ecampus.ut.ac.id', 1, -3.5403, 118.9707, 'SYSTEM'),
('87', 87, 1, 'Kendari', 'Jl. Mayjen Sutoyo, Kendari', '0401-3193710', '0401-3193710', 'kendari@ecampus.ut.ac.id', 1, -3.9450, 122.5989, 'SYSTEM'),
('88', 88, 1, 'Ambon', 'Jl. Dr. Sitanala, Ambon', '0911-344683', '0911-344683', 'ambon@ecampus.ut.ac.id', 1, -3.6954, 128.1814, 'SYSTEM'),
('89', 89, 1, 'Jayapura', 'Jl. Raya Abepura, Jayapura', '0967-584346', '0967-584346', 'jayapura@ecampus.ut.ac.id', 1, -2.5333, 140.7167, 'SYSTEM'),
('12', 12, 1, 'Medan', 'Jl. Setia Budi, Medan', '061-8211488', '061-8211488', 'medan@ecampus.ut.ac.id', 1, 3.5952, 98.6722, 'SYSTEM'),
('13', 13, 1, 'Padang', 'Jl. Perintis Kemerdekaan, Padang', '0751-40020', '0751-40020', 'padang@ecampus.ut.ac.id', 1, -0.9471, 100.4172, 'SYSTEM'),
('18', 18, 1, 'Bandar Lampung', 'Jl. ZA Pagar Alam, Bandar Lampung', '0721-700357', '0721-700357', 'lampung@ecampus.ut.ac.id', 1, -5.4292, 105.2625, 'SYSTEM'),
('19', 19, 1, 'Jakarta', 'Jl. Cabe Raya, Jakarta', '021-7490941', '021-7490941', 'jakarta@ecampus.ut.ac.id', 1, -6.2088, 106.8456, 'SYSTEM'),
('90', 90, 1, 'Bengkulu', 'Jl. Salak Raya, Bengkulu', '0736-22287', '0736-22287', 'bengkulu@ecampus.ut.ac.id', 1, -3.7928, 102.2608, 'SYSTEM'),
('14', 14, 1, 'Palembang', 'Jl. Abikusno Cokrosuyoso, Palembang', '0711-354455', '0711-354455', 'palembang@ecampus.ut.ac.id', 1, -2.9761, 104.7754, 'SYSTEM'),
('91', 91, 1, 'Pangkal Pinang', 'Jl. Depati Amir, Pangkal Pinang', '0717-422145', '0717-422145', 'pangkalpinang@ecampus.ut.ac.id', 1, -2.1316, 106.1169, 'SYSTEM'),
('92', 92, 1, 'Pekanbaru', 'Jl. Diponegoro, Pekanbaru', '0761-23522', '0761-23522', 'pekanbaru@ecampus.ut.ac.id', 1, 0.5071, 101.4478, 'SYSTEM'),
('93', 93, 1, 'Bogor', 'Jl. Pajajaran, Bogor', '0251-8312206', '0251-8312206', 'bogor@ecampus.ut.ac.id', 1, -6.5950, 106.8169, 'SYSTEM'),
('94', 94, 1, 'Palangka Raya', 'Jl. G. Obos, Palangka Raya', '0536-3221427', '0536-3221427', 'palangkaraya@ecampus.ut.ac.id', 1, -2.2136, 113.9177, 'SYSTEM'),
('95', 95, 1, 'Tarakan', 'Jl. Yos Sudarso, Tarakan', '0551-21514', '0551-21514', 'tarakan@ecampus.ut.ac.id', 1, 3.3000, 117.6333, 'SYSTEM'),
('96', 96, 1, 'Gorontalo', 'Jl. Jenderal Sudirman, Gorontalo', '0435-821121', '0435-821121', 'gorontalo@ecampus.ut.ac.id', 1, 0.5435, 123.0585, 'SYSTEM'),
('97', 97, 1, 'Ternate', 'Jl. Cempaka, Ternate', '0921-3121900', '0921-3121900', 'ternate@ecampus.ut.ac.id', 1, 0.7874, 127.3742, 'SYSTEM');

-- Add special entries
INSERT INTO m_upbjj (kode_upbjj, nama_upbjj, status_aktif, latitude, longitude, created_by) VALUES
('00', 'ACP UNIT', 1, -6.2088, 106.8456, 'SYSTEM'),
('99', 'LAYANAN LUAR NEGERI', 1, -6.2088, 106.8456, 'SYSTEM'),
('98', 'PMKM MITRA', 1, -6.2088, 106.8456, 'SYSTEM'),
('XX', 'Lain lain', 1, -6.2088, 106.8456, 'SYSTEM');
