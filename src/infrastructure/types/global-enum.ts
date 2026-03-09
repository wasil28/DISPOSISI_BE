// GLOBAL PAYLOAD ENUM
import { registerEnumType } from '@nestjs/graphql';
export enum IdStatusAktifEnum {
  AKTIF = 1,
  TIDAK_AKTIF = 0,
}

registerEnumType(IdStatusAktifEnum, {
  name: 'IdStatusAktifEnum',
});

export enum KodeKegiatanAkademik {
  /** Validasi DP  */
  VLDP = 'VLDP',

  /** BATAS PENDAFTARAN MAHASISWA BARU */
  APBR = 'APBR',

  /** BATAS REGISTRASI MATAKULIAH MAHASISWA BARU */
  AKRB = 'AKRB',
}
