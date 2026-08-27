// ============ Veri katmanı — Supabase ile tüm iletişim ============
import { SUPABASE_URL, SUPABASE_ANAHTAR } from "./ayar.js";

export const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANAHTAR, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

/** Uygulamanın bellekteki durumu. */
export const D = {
  kullanici: null,
  profil: null,
  kurulum: null,
  defter: "is",
  defterler: [],
  hesaplar: [],
  kategoriler: [],
  secenekler: [],
  musteriler: [],
  cariler: [],
  organizasyonlar: [],
  hareketler: [],
  hesapBakiye: [],
  cariBakiye: [],
  orgOzet: []
};

function hataMetni(h) {
  if (!h) return "Bilinmeyen hata";
  const m = h.message || String(h);
  const eslesme = {
    "Invalid login credentials": "E-posta veya parola hatalı.",
    "Email not confirmed": "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.",
    "User already registered": "Bu e-posta zaten kayıtlı. Giriş yapmayı dene.",
    "Password should be at least 6 characters": "Parola en az 6 karakter olmalı.",
    "Failed to fetch": "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.",
    "new row violates row-level security policy": "Bu işlem için yetkin yok.",
    "duplicate key value violates unique constraint": "Bu kayıt zaten var."
  };
  for (const [k, v] of Object.entries(eslesme)) if (m.includes(k)) return v;
  return m;
}
export { hataMetni };

// ---------- Kimlik ----------
export async function oturum() {
  const { data } = await sb.auth.getSession();
  return data.session ?? null;
}
export async function girisYap(eposta, parola) {
  const { data, error } = await sb.auth.signInWithPassword({ email: eposta.trim(), password: parola });
  if (error) throw new Error(hataMetni(error));
  return data;
}
export async function kayitOl(eposta, parola, ad) {
  const { data, error } = await sb.auth.signUp({
    email: eposta.trim(), password: parola,
    options: { data: { ad: (ad || "").trim() }, emailRedirectTo: location.origin }
  });
  if (error) throw new Error(hataMetni(error));
  return data;
}
export async function cikisYap() { await sb.auth.signOut(); }
export async function parolaDegistir(yeni) {
  const { error } = await sb.auth.updateUser({ password: yeni });
  if (error) throw new Error(hataMetni(error));
}
export async function parolaSifirla(eposta) {
  const { error } = await sb.auth.resetPasswordForEmail(eposta.trim(), { redirectTo: location.origin });
  if (error) throw new Error(hataMetni(error));
}

// ---------- Yükleme ----------
async function getir(tablo, siralama) {
  let q = sb.from(tablo).select("*");
  if (siralama) q = q.order(siralama.alan, { ascending: siralama.artan !== false });
  const { data, error } = await q;
  if (error) throw new Error(`${tablo}: ${hataMetni(error)}`);
  return data ?? [];
}

export async function profilYukle(kullaniciId) {
  const { data, error } = await sb.from("profiller").select("*").eq("id", kullaniciId).maybeSingle();
  if (error) throw new Error(hataMetni(error));
  return data;
}

export async function tumunuYukle() {
  const [defterler, hesaplar, kategoriler, secenekler, kurulum] = await Promise.all([
    getir("defterler", { alan: "sira" }),
    getir("hesaplar", { alan: "sira" }),
    getir("kategoriler", { alan: "sira" }),
    getir("secenekler", { alan: "sira" }),
    sb.from("kurulum").select("*").maybeSingle().then(r => r.data)
  ]);
  D.defterler = defterler; D.hesaplar = hesaplar; D.kategoriler = kategoriler;
  D.secenekler = secenekler; D.kurulum = kurulum;
  if (!defterler.some(d => d.kod === D.defter)) D.defter = defterler[0]?.kod ?? "is";
  await defterVerisiYukle();
}

export async function defterVerisiYukle() {
  const isDefteri = D.defter === "is";
  // Ayarlarda değişmiş olabilecek başvuru tabloları da tazelenir
  const [defterler, hesaplar, kategoriler] = await Promise.all([
    getir("defterler", { alan: "sira" }),
    getir("hesaplar", { alan: "sira" }),
    getir("kategoriler", { alan: "sira" })
  ]);
  D.defterler = defterler; D.hesaplar = hesaplar; D.kategoriler = kategoriler;

  const gorevler = [
    sb.from("hareketler").select("*").eq("defter", D.defter).order("tarih", { ascending: false }).then(r => r.data ?? []),
    sb.from("v_hesap_bakiye").select("*").eq("defter", D.defter).order("sira").then(r => r.data ?? [])
  ];
  if (isDefteri) {
    gorevler.push(
      getir("musteriler", { alan: "ad" }),
      getir("cariler", { alan: "ad" }),
      sb.from("organizasyonlar").select("*").order("tarih", { ascending: false }).then(r => r.data ?? []),
      sb.from("v_organizasyon_ozet").select("*").order("tarih", { ascending: false }).then(r => r.data ?? []),
      sb.from("v_cari_bakiye").select("*").order("ad").then(r => r.data ?? [])
    );
  }
  const s = await Promise.all(gorevler);
  D.hareketler = s[0]; D.hesapBakiye = s[1];
  if (isDefteri) {
    D.musteriler = s[2]; D.cariler = s[3];
    D.organizasyonlar = s[4]; D.orgOzet = s[5]; D.cariBakiye = s[6];
  } else {
    D.musteriler = []; D.cariler = []; D.organizasyonlar = []; D.orgOzet = []; D.cariBakiye = [];
  }
}

// ---------- Yazma ----------
async function yaz(tablo, kayit, id) {
  const q = id
    ? sb.from(tablo).update(kayit).eq("id", id).select().maybeSingle()
    : sb.from(tablo).insert(kayit).select().maybeSingle();
  const { data, error } = await q;
  if (error) throw new Error(hataMetni(error));
  return data;
}
async function sil(tablo, id) {
  const { error } = await sb.from(tablo).delete().eq("id", id);
  if (error) throw new Error(hataMetni(error));
}

// Yeni kayıtta "giren" alanı doldurulur; düzenlemede kaydı ilk girenin adı korunur.
const imzala = (k, id) => (id ? k : { ...k, giren: D.kullanici.id });

export const hareketYaz   = (k, id) => yaz("hareketler", imzala(k, id), id);
export const hareketSil   = (id) => sil("hareketler", id);
export const orgYaz       = (k, id) => yaz("organizasyonlar", imzala(k, id), id);
export const orgSil       = (id) => sil("organizasyonlar", id);
export const musteriYaz   = (k, id) => yaz("musteriler", imzala(k, id), id);
export const musteriSil   = (id) => sil("musteriler", id);
export const cariYaz      = (k, id) => yaz("cariler", imzala(k, id), id);
export const cariSil      = (id) => sil("cariler", id);
export const borcYaz      = (k, id) => yaz("borclanmalar", imzala(k, id), id);
export const borcSil      = (id) => sil("borclanmalar", id);
export const hesapYaz     = (k, id) => yaz("hesaplar", k, id);
export const kategoriYaz  = (k, id) => yaz("kategoriler", k, id);
export const kategoriSil  = (id) => sil("kategoriler", id);
export const profilYaz    = (k, id) => yaz("profiller", k, id);

export async function borclanmalar(cariId) {
  const { data, error } = await sb.from("borclanmalar").select("*").eq("cari_id", cariId).order("tarih", { ascending: false });
  if (error) throw new Error(hataMetni(error));
  return data ?? [];
}
export async function profiller() {
  const { data, error } = await sb.from("profiller").select("*").order("olusturuldu");
  if (error) throw new Error(hataMetni(error));
  return data ?? [];
}
export async function defterYaz(kod, k) {
  const { error } = await sb.from("defterler").update(k).eq("kod", kod);
  if (error) throw new Error(hataMetni(error));
}

export async function kurulumYaz(k) {
  const { error } = await sb.from("kurulum").update({ ...k, guncellendi: new Date().toISOString() }).eq("id", true);
  if (error) throw new Error(hataMetni(error));
}

// ---------- Yardımcı erişimciler ----------
export const hesapAdi   = (id) => D.hesaplar.find(h => h.id === id)?.ad ?? "—";
export const musteriAdi = (id) => D.musteriler.find(m => m.id === id)?.ad ?? "—";
export const cariAdi    = (id) => D.cariler.find(c => c.id === id)?.ad ?? null;
export const orgAdi     = (id) => D.organizasyonlar.find(o => o.id === id)?.ad ?? null;
export const seceneklerGrubu = (g) => D.secenekler.filter(s => s.grup === g).map(s => s.ad);
export const kategorilerListesi = (tur) =>
  D.kategoriler.filter(k => k.defter === D.defter && k.tur === tur && k.aktif).map(k => k.ad);
export const aktifHesaplar = () => D.hesaplar.filter(h => h.defter === D.defter && h.aktif);
export const sekmeVar = (kod) => {
  if (!D.profil) return false;
  if (D.profil.rol === "sahip" || D.profil.rol === "yonetici") return true;
  return (D.profil.izinli_sekmeler || []).includes(kod);
};
export const yetkili = () => D.profil && (D.profil.rol === "sahip" || D.profil.rol === "yonetici");
export const sahip = () => D.profil && D.profil.rol === "sahip";
