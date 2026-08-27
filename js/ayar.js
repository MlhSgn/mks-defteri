// Supabase bağlantı bilgileri. Bu anahtar herkese açık olabilir —
// verinin güvenliği sunucudaki satır-düzeyi yetki kurallarıyla sağlanır.
export const SUPABASE_URL = "https://jrxwzybkeibzxkvcnrbg.supabase.co";
export const SUPABASE_ANAHTAR = "sb_publishable_RHIcNpoHGcFklrFg4FE3Lw_ZUsaEoCs";

export const SEKMELER = [
  { kod: "panel",           ad: "Panel",      kisa: "Panel",  ikon: "◎" },
  { kod: "organizasyonlar", ad: "İşler",      kisa: "İşler",  ikon: "▤" },
  { kod: "kasa",            ad: "Kasa",       kisa: "Kasa",   ikon: "₺" },
  { kod: "cariler",         ad: "Cariler",    kisa: "Cari",   ikon: "◍" },
  { kod: "musteriler",      ad: "Müşteriler", kisa: "Müşt.",  ikon: "☺" },
  { kod: "raporlar",        ad: "Raporlar",   kisa: "Rapor",  ikon: "◫" },
  { kod: "ayarlar",         ad: "Ayarlar",    kisa: "Ayar",   ikon: "⚙" }
];

// Kişisel defterde kapalı olan modüller
export const KISISEL_KAPALI = ["organizasyonlar", "cariler", "musteriler"];
