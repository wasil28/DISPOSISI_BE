export class ErrorMessage {
  static EMPTY_FIELD(fieldName: string, customMsg?: string) {
    return `${fieldName} wajib diisi`;
  }

  static INVALID_FIELD(fieldName: string) {
    return `Mohon masukan format ${fieldName.toLowerCase()} yang valid`;
  }

  static MIN_CHAR(fieldName: string, minLength: number) {
    return `${fieldName} tidak boleh kurang dari ${minLength} karakter`;
  }

  static MAX_CHAR(fieldName: string, minLength: number) {
    return `${fieldName} tidak boleh lebih dari ${minLength} karakter`;
  }

  static IS_NUMBER_STRING(fieldName: string) {
    return `${fieldName} hanya boleh memuat angka`;
  }

  static NO_SPECIAL_CHARACTER(fieldName: string, specialChar: string) {
    return `${fieldName} tidak boleh memuat ${specialChar}`;
  }

  static SERVER_ERROR = 'Terjadi Masalah Pada Server. Silahkan Coba Kembali.';
}
