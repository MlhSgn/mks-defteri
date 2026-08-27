// ============ Ekranlar ============
import * as V from "./veri.js";
import { D } from "./veri.js";
import { SEKMELER } from "./ayar.js";
import {
  $, el, kacis, para, paraTam, paraKisa, sayi, bugun, isoTarih, trTarih, trTarihUzun,
  gunFarki, ayAnahtar, ayAdi, AY_KISA, AY_UZUN, bildir, modalAc, onayla, ozetSerit, bosDurum,
  ipucuGoster, ipucuGizle
} from "./ui.js";

export const U = { donem: "buAy", tur: "tumu", arama: "", katTur: "gider", kapali: false, orgFiltre: "aktif" };

let yenile = () => {};
export function yenilemeyiAyarla(fn) { yenile = fn; }

// ---------- dönem ----------
function aralik() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth();
  const i = (dt) => isoTarih(dt);
  switch (U.donem) {
    case "buAy":    return [i(new Date(y, m, 1)), i(new Date(y, m + 1, 0))];
    case "gecenAy": return [i(new Date(y, m - 1, 1)), i(new Date(y, m, 0))];
    case "son3":    return [i(new Date(y, m - 2, 1)), i(new Date(y, m + 1, 0))];
    case "buYil":   return [`${y}-01-01`, `${y}-12-31`];
    default:        return ["0000-01-01", "9999-12-31"];
  }
}
function donemAdi() {
  const d = new Date();
  switch (U.donem) {
    case "buAy":    return `${AY_UZUN[d.getMonth()]} ${d.getFullYear()}`;
    case "gecenAy": { const g = new Date(d.getFullYear(), d.getMonth() - 1, 1); return `${AY_UZUN[g.getMonth()]} ${g.getFullYear()}`; }
    case "son3":    return "Son 3 ay";
    case "buYil":   return `${d.getFullYear()} yılı`;
    default:        return "Tüm zamanlar";
  }
}
function donemSecici(deg) {
  const s = el("select");
  s.setAttribute("aria-label", "Dönem");
  [["buAy","Bu ay"],["gecenAy","Geçen ay"],["son3","Son 3 ay"],["buYil","Bu yıl"],["tumu","Tüm zamanlar"]]
    .forEach(([k, a]) => { const o = el("option", "", a); o.value = k; s.appendChild(o); });
  s.value = U.donem;
  s.onchange = () => { U.donem = s.value; deg(); };
  return s;
}
const donemHareketleri = () => {
  const [b, s] = aralik();
  return D.hareketler.filter(h => h.tarih >= b && h.tarih <= s);
};
const topla = (liste) => liste.reduce((t, h) => t + (h.tur === "gelir" ? sayi(h.tutar) : -sayi(h.tutar)), 0);
const toplaTur = (liste, tur) => liste.filter(h => h.tur === tur).reduce((t, h) => t + sayi(h.tutar), 0);

// ============================================================
//  PANEL
// ============================================================
export function panel() {
  const k = el("div", "yigin");
  const dh = donemHareketleri();
  const gelir = toplaTur(dh, "gelir"), gider = toplaTur(dh, "gider");

  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", donemAdi()));
  const sag = el("div", "sag");
  sag.appendChild(donemSecici(yenile));
  bas.appendChild(sag);
  k.appendChild(bas);

  k.appendChild(ozetSerit([
    { etiket: "Gelir", deger: paraTam(gelir), renk: "g" },
    { etiket: "Gider", deger: paraTam(gider), renk: "k" },
    { etiket: "Net", deger: paraTam(gelir - gider), renk: gelir - gider < 0 ? "k" : "g",
      alt: gelir - gider < 0 ? "Zarar" : (gelir - gider > 0 ? "Kâr" : "Başabaş") },
    { etiket: "Kayıt", deger: String(dh.length), alt: "bu dönemde" }
  ]));

  // Kasa bakiyeleri
  const kasa = el("section", "panel");
  const kb = el("div", "grafik-basi");
  kb.style.padding = "14px 14px 0";
  kb.appendChild(el("h3", "", "Kasa"));
  const toplamB = D.hesapBakiye.filter(h => h.aktif).reduce((t, h) => t + sayi(h.bakiye), 0);
  const tt = el("div", "para"); tt.style.fontWeight = "600";
  tt.textContent = para(toplamB);
  kb.appendChild(tt);
  kasa.appendChild(kb);
  const kl = el("div", "liste");
  D.hesapBakiye.filter(h => h.aktif).forEach(h => {
    const r = el("div", "satir"); r.style.cursor = "default";
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.ad));
    sol.appendChild(el("div", "alt", h.tur === "nakit" ? "Nakit kasa" : "Banka hesabı"));
    const t = el("div", "tutar " + (sayi(h.bakiye) < 0 ? "k" : ""), para(h.bakiye));
    r.append(sol, t);
    kl.appendChild(r);
  });
  kasa.appendChild(kl);
  k.appendChild(kasa);

  if (D.defter === "is") {
    // Yaklaşan işler
    const bugunIso = bugun();
    const yaklasan = D.orgOzet
      .filter(o => o.tarih && o.tarih >= bugunIso && o.durum !== "İptal")
      .sort((a, b) => a.tarih < b.tarih ? -1 : 1).slice(0, 5);
    k.appendChild(bolum("Yaklaşan işler", yaklasan.length ? yaklasan.map(o => {
      const r = butonSatir(() => orgDetay(o.organizasyon_id));
      const sol = el("div");
      sol.appendChild(el("div", "baslik", o.ad));
      const alt = el("div", "alt");
      alt.appendChild(el("span", "", trTarihUzun(o.tarih)));
      alt.appendChild(el("span", "rozet", o.durum));
      sol.appendChild(alt);
      const sagK = el("div");
      sagK.appendChild(el("div", "tutar", paraTam(o.toplam_ucret)));
      if (sayi(o.kalan_odeme) > 0) {
        const kalanE = el("div", "tarih"); kalanE.textContent = paraTam(o.kalan_odeme) + " kalan";
        kalanE.style.color = "var(--uyari-ink)";
        sagK.appendChild(kalanE);
      }
      r.append(sol, sagK);
      return r;
    }) : [bosDurum("Yaklaşan iş yok")], V.sekmeVar("organizasyonlar") ? { ad: "Tümü", git: () => git("organizasyonlar") } : null));

    // Bekleyen tahsilat
    const bekleyen = D.orgOzet.filter(o => sayi(o.kalan_odeme) > 0)
      .sort((a, b) => sayi(b.kalan_odeme) - sayi(a.kalan_odeme));
    if (bekleyen.length) {
      const toplamKalan = bekleyen.reduce((t, o) => t + sayi(o.kalan_odeme), 0);
      k.appendChild(bolum(`Bekleyen tahsilat · ${paraTam(toplamKalan)}`, bekleyen.slice(0, 5).map(o => {
        const r = butonSatir(() => orgDetay(o.organizasyon_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", V.musteriAdi(o.musteri_id)));
        sol.appendChild(el("div", "alt", o.ad + " · " + trTarih(o.tarih)));
        r.append(sol, el("div", "tutar k", paraTam(o.kalan_odeme)));
        return r;
      })));
    }

    // Cari borçlar
    const borclu = D.cariBakiye.filter(c => sayi(c.bakiye) > 0.004)
      .sort((a, b) => sayi(b.bakiye) - sayi(a.bakiye));
    if (borclu.length && V.sekmeVar("cariler")) {
      const t = borclu.reduce((s, c) => s + sayi(c.bakiye), 0);
      k.appendChild(bolum(`Cari borç · ${paraTam(t)}`, borclu.slice(0, 5).map(c => {
        const r = butonSatir(() => cariDetay(c.cari_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", c.ad));
        sol.appendChild(el("div", "alt", c.tur));
        r.append(sol, el("div", "tutar k", paraTam(c.bakiye)));
        return r;
      }), { ad: "Tümü", git: () => git("cariler") }));
    }
  }

  // Son hareketler
  k.appendChild(bolum("Son hareketler", D.hareketler.slice(0, 6).map(hareketSatiri),
    V.sekmeVar("kasa") ? { ad: "Tümü", git: () => git("kasa") } : null));
  return k;
}

function bolum(baslik, cocuklar, baglanti) {
  const s = el("section", "panel");
  const b = el("div", "grafik-basi");
  b.style.padding = "14px 14px 4px";
  b.appendChild(el("h3", "", baslik));
  if (baglanti) {
    const a = el("button", "btn sade kucuk", baglanti.ad);
    a.onclick = baglanti.git;
    b.appendChild(a);
  }
  s.appendChild(b);
  const l = el("div", "liste");
  cocuklar.forEach(c => l.appendChild(c));
  s.appendChild(l);
  return s;
}
function butonSatir(tikla) {
  const r = el("button", "satir");
  r.type = "button";
  r.onclick = tikla;
  return r;
}
let git = () => {};
export function gitAyarla(fn) { git = fn; }

// ============================================================
//  KASA
// ============================================================
function hareketSatiri(h) {
  const r = butonSatir(() => hareketFormu(h));
  const sol = el("div");
  sol.appendChild(el("div", "baslik", h.baslik || h.aciklama || h.kategori));
  const alt = el("div", "alt");
  alt.appendChild(el("span", "", h.kategori));
  const on = V.orgAdi(h.organizasyon_id);
  if (on) alt.appendChild(el("span", "rozet vurgu", on));
  const cn = V.cariAdi(h.cari_id);
  if (cn) alt.appendChild(el("span", "", "· " + cn));
  sol.appendChild(alt);
  const sag = el("div");
  sag.appendChild(el("div", "tutar " + (h.tur === "gelir" ? "g" : "k"),
    (h.tur === "gelir" ? "+" : "−") + para(h.tutar)));
  sag.appendChild(el("div", "tarih", trTarih(h.tarih) + " · " + V.hesapAdi(h.hesap_id)));
  r.append(sol, sag);
  return r;
}

export function kasa() {
  const k = el("div", "yigin");
  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", "Kasa"));
  const sag = el("div", "sag");
  const ekle = el("button", "btn ana kucuk", "+ Kayıt");
  ekle.onclick = () => hareketFormu(null);
  sag.appendChild(ekle);
  bas.appendChild(sag);
  k.appendChild(bas);

  const f = el("div", "filtreler");
  f.appendChild(donemSecici(yenile));
  const seg = el("div", "segment");
  [["tumu", "Hepsi", ""], ["gelir", "Gelir", "g"], ["gider", "Gider", "k"]].forEach(([kod, ad, sn]) => {
    const b = el("button", sn, ad);
    b.type = "button";
    b.setAttribute("aria-pressed", String(U.tur === kod));
    b.onclick = () => { U.tur = kod; yenile(); };
    seg.appendChild(b);
  });
  f.appendChild(seg);
  const ara = el("div", "ara");
  const ai = el("input"); ai.type = "search"; ai.placeholder = "Ara…"; ai.value = U.arama;
  ai.setAttribute("aria-label", "Kayıtlarda ara");
  ai.oninput = () => { U.arama = ai.value; listeCiz(); };
  ara.appendChild(ai);
  f.appendChild(ara);
  k.appendChild(f);

  const ozet = el("div");
  k.appendChild(ozet);
  const kutu = el("section", "panel liste");
  k.appendChild(kutu);

  function listeCiz() {
    const [b, s] = aralik();
    const q = U.arama.toLocaleLowerCase("tr");
    const liste = D.hareketler.filter(h => {
      if (h.tarih < b || h.tarih > s) return false;
      if (U.tur !== "tumu" && h.tur !== U.tur) return false;
      if (q) {
        const metin = [h.baslik, h.aciklama, h.kategori, V.orgAdi(h.organizasyon_id), V.cariAdi(h.cari_id)]
          .filter(Boolean).join(" ").toLocaleLowerCase("tr");
        if (!metin.includes(q)) return false;
      }
      return true;
    });
    ozet.innerHTML = "";
    ozet.appendChild(ozetSerit([
      { etiket: "Gelir", deger: paraTam(toplaTur(liste, "gelir")), renk: "g" },
      { etiket: "Gider", deger: paraTam(toplaTur(liste, "gider")), renk: "k" },
      { etiket: "Net", deger: paraTam(topla(liste)), renk: topla(liste) < 0 ? "k" : "g" },
      { etiket: "Kayıt", deger: String(liste.length) }
    ]));
    kutu.innerHTML = "";
    if (!liste.length) {
      kutu.appendChild(bosDurum(D.hareketler.length ? "Bu filtreye uyan kayıt yok" : "Henüz kayıt yok",
        D.hareketler.length ? "Dönemi veya filtreyi değiştir." : "Sağ alttaki + ile ilk kaydını ekle."));
      return;
    }
    let sonAy = null;
    liste.forEach(h => {
      const a = ayAnahtar(h.tarih);
      if (a !== sonAy) { sonAy = a; kutu.appendChild(el("div", "grup-basi", ayAdi(a))); }
      kutu.appendChild(hareketSatiri(h));
    });
  }
  listeCiz();
  return k;
}

// ---------- hareket formu ----------
export function hareketFormu(mevcut, onAyar = {}) {
  const yeni = !mevcut;
  let tur = mevcut?.tur ?? onAyar.tur ?? "gider";
  const bas = el("div");

  const segT = el("div", "segment");
  [["gider", "Gider", "k"], ["gelir", "Gelir", "g"]].forEach(([kod, ad, sn]) => {
    const b = el("button", sn, ad); b.type = "button";
    b.setAttribute("aria-pressed", String(tur === kod));
    b.onclick = () => {
      tur = kod;
      Array.from(segT.children).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
      katDoldur();
    };
    segT.appendChild(b);
  });
  bas.appendChild(segT);

  const ikili = el("div", "ikili");
  const tutarL = el("label", "alan", "TUTAR (₺)");
  const tutar = el("input"); tutar.type = "number"; tutar.step = "0.01"; tutar.min = "0";
  tutar.inputMode = "decimal"; tutar.required = true; tutar.placeholder = "0,00";
  tutar.value = mevcut ? mevcut.tutar : "";
  tutarL.appendChild(tutar);
  const tarihL = el("label", "alan", "TARİH");
  const tarih = el("input"); tarih.type = "date"; tarih.required = true;
  tarih.value = mevcut?.tarih ?? onAyar.tarih ?? bugun();
  tarihL.appendChild(tarih);
  ikili.append(tutarL, tarihL);
  bas.appendChild(ikili);

  const ikili2 = el("div", "ikili");
  const katL = el("label", "alan", "KATEGORİ");
  const kat = el("select"); katL.appendChild(kat);
  const hesapL = el("label", "alan", "HESAP");
  const hesap = el("select");
  V.aktifHesaplar().forEach(h => { const o = el("option", "", h.ad); o.value = h.id; hesap.appendChild(o); });
  hesap.value = mevcut?.hesap_id ?? V.aktifHesaplar()[0]?.id ?? "";
  hesapL.appendChild(hesap);
  ikili2.append(katL, hesapL);
  bas.appendChild(ikili2);

  function katDoldur() {
    kat.innerHTML = "";
    const liste = V.kategorilerListesi(tur);
    if (mevcut?.kategori && !liste.includes(mevcut.kategori)) liste.push(mevcut.kategori);
    liste.forEach(a => { const o = el("option", "", a); o.value = a; kat.appendChild(o); });
    if (mevcut?.kategori) kat.value = mevcut.kategori;
    else if (tur === "gelir" && liste.includes("Organizasyon geliri")) kat.value = "Organizasyon geliri";
  }
  katDoldur();

  const baslikL = el("label", "alan", "BAŞLIK");
  const baslik = el("input"); baslik.type = "text"; baslik.placeholder = "Kısa ad";
  baslik.value = mevcut?.baslik ?? onAyar.baslik ?? "";
  baslikL.appendChild(baslik);
  bas.appendChild(baslikL);

  let org = null, cari = null;
  if (D.defter === "is") {
    const orgL = el("label", "alan", "ORGANİZASYON (isteğe bağlı)");
    org = el("select");
    org.appendChild(Object.assign(el("option", "", "— yok —"), { value: "" }));
    D.organizasyonlar.forEach(o => {
      const op = el("option", "", `${o.ad} · ${trTarih(o.tarih)}`); op.value = o.id; org.appendChild(op);
    });
    org.value = mevcut?.organizasyon_id ?? onAyar.organizasyon_id ?? "";
    orgL.appendChild(org);
    bas.appendChild(orgL);

    const cariL = el("label", "alan", "CARİ (isteğe bağlı)");
    cari = el("select");
    cari.appendChild(Object.assign(el("option", "", "— yok —"), { value: "" }));
    D.cariler.filter(c => c.aktif).forEach(c => {
      const op = el("option", "", c.ad); op.value = c.id; cari.appendChild(op);
    });
    cari.value = mevcut?.cari_id ?? onAyar.cari_id ?? "";
    cariL.appendChild(cari);
    bas.appendChild(cariL);
  }

  const aciklamaL = el("label", "alan", "AÇIKLAMA");
  const aciklama = el("textarea"); aciklama.placeholder = "İsteğe bağlı not";
  aciklama.value = mevcut?.aciklama ?? "";
  aciklamaL.appendChild(aciklama);
  bas.appendChild(aciklamaL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
  ayak.append(iptal, kaydet);
  if (!yeni && (V.yetkili() || D.profil?.silebilir)) {
    const silB = el("button", "btn tehlike", "Sil");
    silB.style.flex = "0 0 auto";
    ayak.insertBefore(silB, iptal);
    silB.onclick = async () => {
      if (!await onayla("Kayıt silinsin mi?", `${mevcut.baslik || mevcut.kategori} · ${para(mevcut.tutar)}`, "Sil")) return;
      try { await V.hareketSil(mevcut.id); m.kapat(); bildir("Kayıt silindi"); yenile(true); }
      catch (e) { bildir(e.message, "kotu"); }
    };
  }

  const m = modalAc({ baslik: yeni ? "Yeni kayıt" : "Kaydı düzenle", govde: bas, ayak });
  iptal.onclick = () => m.kapat();
  setTimeout(() => tutar.focus(), 60);

  kaydet.onclick = async () => {
    const t = parseFloat(String(tutar.value).replace(",", "."));
    if (!(t > 0)) { bildir("Tutar girmelisin", "kotu"); tutar.focus(); return; }
    if (!hesap.value) { bildir("Hesap seçmelisin", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.hareketYaz({
        defter: D.defter, tarih: tarih.value || bugun(), tur, tutar: t,
        hesap_id: hesap.value, kategori: kat.value,
        baslik: baslik.value.trim() || null, aciklama: aciklama.value.trim() || null,
        organizasyon_id: org?.value || null, cari_id: cari?.value || null
      }, mevcut?.id);
      m.kapat();
      bildir(yeni ? "Kayıt eklendi" : "Kaydedildi", "iyi");
      yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ============================================================
//  ORGANİZASYONLAR
// ============================================================
export function organizasyonlar() {
  const k = el("div", "yigin");
  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", "İşler"));
  const sag = el("div", "sag");
  const ekle = el("button", "btn ana kucuk", "+ İş");
  ekle.onclick = () => orgFormu(null);
  sag.appendChild(ekle);
  bas.appendChild(sag);
  k.appendChild(bas);

  const f = el("div", "filtreler");
  const seg = el("div", "segment");
  [["aktif", "Aktif"], ["tamam", "Tamamlanan"], ["tumu", "Tümü"]].forEach(([kod, ad]) => {
    const b = el("button", "", ad); b.type = "button";
    b.setAttribute("aria-pressed", String(U.orgFiltre === kod));
    b.onclick = () => { U.orgFiltre = kod; yenile(); };
    seg.appendChild(b);
  });
  f.appendChild(seg);
  const ara = el("div", "ara");
  const ai = el("input"); ai.type = "search"; ai.placeholder = "İş veya müşteri ara…";
  ai.setAttribute("aria-label", "Ara");
  ara.appendChild(ai);
  f.appendChild(ara);
  k.appendChild(f);

  const ozet = el("div"); k.appendChild(ozet);
  const kutu = el("section", "panel liste"); k.appendChild(kutu);

  function ciz() {
    const q = ai.value.toLocaleLowerCase("tr");
    let liste = D.orgOzet.slice();
    if (U.orgFiltre === "aktif") liste = liste.filter(o => !["Tamamlandı", "İptal"].includes(o.durum));
    if (U.orgFiltre === "tamam") liste = liste.filter(o => o.durum === "Tamamlandı");
    if (q) liste = liste.filter(o => (o.ad + " " + V.musteriAdi(o.musteri_id)).toLocaleLowerCase("tr").includes(q));

    const ciro = liste.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
    const kalan = liste.reduce((t, o) => t + Math.max(0, sayi(o.kalan_odeme)), 0);
    const kar = liste.reduce((t, o) => t + sayi(o.kar), 0);
    ozet.innerHTML = "";
    ozet.appendChild(ozetSerit([
      { etiket: "İş", deger: String(liste.length) },
      { etiket: "Ciro", deger: paraTam(ciro) },
      { etiket: "Kalan", deger: paraTam(kalan), renk: kalan > 0 ? "k" : "" },
      { etiket: "Kâr", deger: paraTam(kar), renk: kar < 0 ? "k" : "g" }
    ]));

    kutu.innerHTML = "";
    if (!liste.length) { kutu.appendChild(bosDurum("İş bulunamadı")); return; }
    liste.forEach(o => {
      const r = butonSatir(() => orgDetay(o.organizasyon_id));
      const sol = el("div");
      sol.appendChild(el("div", "baslik", o.ad));
      const alt = el("div", "alt");
      alt.appendChild(el("span", "", V.musteriAdi(o.musteri_id)));
      if (o.tur) alt.appendChild(el("span", "rozet", o.tur));
      alt.appendChild(el("span", "rozet " + durumSinifi(o.durum), o.durum));
      sol.appendChild(alt);
      const sag2 = el("div");
      sag2.appendChild(el("div", "tutar", paraTam(o.toplam_ucret)));
      const alt2 = el("div", "tarih");
      alt2.textContent = trTarih(o.tarih) + (sayi(o.kalan_odeme) > 0 ? ` · ${paraTam(o.kalan_odeme)} kalan` : "");
      if (sayi(o.kalan_odeme) > 0) alt2.style.color = "var(--uyari-ink)";
      sag2.appendChild(alt2);
      r.append(sol, sag2);
      kutu.appendChild(r);
    });
  }
  ai.oninput = ciz;
  ciz();
  return k;
}
function durumSinifi(d) {
  if (d === "Tamamlandı") return "iyi";
  if (d === "İptal") return "kotu";
  if (d === "💰 Ödeme Bekleniyor") return "uyari";
  return "";
}

export function orgDetay(id) {
  const o = D.orgOzet.find(x => x.organizasyon_id === id);
  const ham = D.organizasyonlar.find(x => x.id === id);
  if (!o || !ham) return;
  const g = el("div", "yigin");

  const kart = el("div", "panel");
  const sat = (e, d, renk) => {
    const r = el("div", "detay-satir");
    r.appendChild(el("div", "e", e));
    const dd = el("div", "d", d);
    if (renk) dd.style.color = renk;
    r.appendChild(dd);
    return r;
  };
  kart.append(
    sat("Müşteri", V.musteriAdi(ham.musteri_id)),
    sat("Tarih", trTarihUzun(ham.tarih) + (ham.saat ? " · " + ham.saat : "")),
    sat("Mekan", ham.mekan || "—"),
    sat("Tür", ham.tur || "—"),
    sat("Durum", ham.durum),
    sat("Ses sistemi", ham.ses_sistemi ? "Var" : "Yok")
  );
  g.appendChild(kart);

  const para2 = el("div", "panel");
  para2.append(
    sat("Toplam ücret", para(o.toplam_ucret)),
    sat("Tahsil edilen", para(o.tahsil_edilen), "var(--gelir-ink)"),
    sat("Kalan", para(o.kalan_odeme), sayi(o.kalan_odeme) > 0 ? "var(--uyari-ink)" : "var(--ink3)"),
    sat("Gerçek maliyet", para(o.gercek_maliyet), "var(--gider-ink)"),
    sat("Kâr", para(o.kar), sayi(o.kar) < 0 ? "var(--gider-ink)" : "var(--gelir-ink)")
  );
  const oran = sayi(o.toplam_ucret) > 0 ? Math.min(100, sayi(o.tahsil_edilen) / sayi(o.toplam_ucret) * 100) : 0;
  const il = el("div", "ilerle"); const ii = el("i"); ii.style.width = oran + "%"; il.appendChild(ii);
  para2.appendChild(il);
  g.appendChild(para2);

  const bagli = D.hareketler.filter(h => h.organizasyon_id === id);
  if (bagli.length) {
    const s = el("section", "panel");
    const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
    b.appendChild(el("h3", "", `Bağlı hareketler (${bagli.length})`));
    s.appendChild(b);
    const l = el("div", "liste");
    bagli.forEach(h => l.appendChild(hareketSatiri(h)));
    s.appendChild(l);
    g.appendChild(s);
  }

  const ayak = el("div");
  const tahsil = el("button", "btn ana", "Tahsilat ekle");
  const duzen = el("button", "btn", "Düzenle");
  ayak.append(duzen, tahsil);
  const m = modalAc({ baslik: ham.ad, govde: g, ayak });
  duzen.onclick = () => { m.kapat(); orgFormu(ham); };
  tahsil.onclick = () => {
    m.kapat();
    hareketFormu(null, {
      tur: "gelir", organizasyon_id: id, baslik: V.musteriAdi(ham.musteri_id),
      tarih: bugun()
    });
  };
}

export function orgFormu(mevcut) {
  const yeni = !mevcut;
  const g = el("div");
  const adL = el("label", "alan", "İŞİN ADI");
  const ad = el("input"); ad.type = "text"; ad.required = true; ad.value = mevcut?.ad ?? "";
  ad.placeholder = "Örn. Ayşe & Mehmet Nişan";
  adL.appendChild(ad); g.appendChild(adL);

  const musL = el("label", "alan", "MÜŞTERİ");
  const mus = el("select");
  mus.appendChild(Object.assign(el("option", "", "— seç —"), { value: "" }));
  D.musteriler.forEach(x => { const o = el("option", "", x.ad); o.value = x.id; mus.appendChild(o); });
  const yeniMus = el("option", "", "+ Yeni müşteri…"); yeniMus.value = "__yeni"; mus.appendChild(yeniMus);
  mus.value = mevcut?.musteri_id ?? "";
  musL.appendChild(mus); g.appendChild(musL);
  const yeniMusL = el("label", "alan gizli", "YENİ MÜŞTERİ ADI");
  const yeniMusI = el("input"); yeniMusI.type = "text"; yeniMusL.appendChild(yeniMusI);
  g.appendChild(yeniMusL);
  mus.onchange = () => yeniMusL.classList.toggle("gizli", mus.value !== "__yeni");

  const i1 = el("div", "ikili");
  const turL = el("label", "alan", "TÜR");
  const tur = el("select");
  V.seceneklerGrubu("organizasyon_turu").forEach(a => { const o = el("option", "", a); o.value = a; tur.appendChild(o); });
  tur.value = mevcut?.tur ?? V.seceneklerGrubu("organizasyon_turu")[0] ?? "";
  turL.appendChild(tur);
  const durL = el("label", "alan", "DURUM");
  const dur = el("select");
  V.seceneklerGrubu("durum").forEach(a => { const o = el("option", "", a); o.value = a; dur.appendChild(o); });
  dur.value = mevcut?.durum ?? "🆕 Yeni Talep";
  durL.appendChild(dur);
  i1.append(turL, durL); g.appendChild(i1);

  const i2 = el("div", "ikili");
  const tarL = el("label", "alan", "TARİH");
  const tar = el("input"); tar.type = "date"; tar.value = mevcut?.tarih ?? bugun(); tarL.appendChild(tar);
  const saaL = el("label", "alan", "SAAT");
  const saa = el("input"); saa.type = "text"; saa.placeholder = "20:00"; saa.value = mevcut?.saat ?? ""; saaL.appendChild(saa);
  i2.append(tarL, saaL); g.appendChild(i2);

  const mekL = el("label", "alan", "MEKAN");
  const mek = el("input"); mek.type = "text"; mek.value = mevcut?.mekan ?? ""; mekL.appendChild(mek);
  g.appendChild(mekL);

  const i3 = el("div", "ikili");
  const ucrL = el("label", "alan", "TOPLAM ÜCRET (₺)");
  const ucr = el("input"); ucr.type = "number"; ucr.step = "0.01"; ucr.inputMode = "decimal";
  ucr.value = mevcut?.toplam_ucret ?? ""; ucrL.appendChild(ucr);
  const kapL = el("label", "alan", "KAPORA (₺)");
  const kap = el("input"); kap.type = "number"; kap.step = "0.01"; kap.inputMode = "decimal";
  kap.value = mevcut?.kapora ?? ""; kapL.appendChild(kap);
  i3.append(ucrL, kapL); g.appendChild(i3);

  const sesL = el("label", "onay-kutu");
  const ses = el("input"); ses.type = "checkbox"; ses.checked = !!mevcut?.ses_sistemi;
  sesL.append(ses, document.createTextNode("Ses sistemi dahil"));
  g.appendChild(sesL);

  const notL = el("label", "alan", "NOTLAR");
  const not = el("textarea"); not.value = mevcut?.notlar ?? ""; notL.appendChild(not);
  g.appendChild(notL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: yeni ? "Yeni iş" : "İşi düzenle", govde: g, ayak });
  iptal.onclick = () => m.kapat();

  kaydet.onclick = async () => {
    if (!ad.value.trim()) { bildir("İşin adını gir", "kotu"); return; }
    kaydet.disabled = true;
    try {
      let musteriId = mus.value;
      if (musteriId === "__yeni") {
        const yeniAd = yeniMusI.value.trim();
        if (!yeniAd) { bildir("Müşteri adını gir", "kotu"); kaydet.disabled = false; return; }
        const yeniK = await V.musteriYaz({ ad: yeniAd });
        musteriId = yeniK.id;
      }
      await V.orgYaz({
        ad: ad.value.trim(), tur: tur.value, tarih: tar.value || null, saat: saa.value.trim() || null,
        mekan: mek.value.trim() || null, musteri_id: musteriId || null, durum: dur.value,
        toplam_ucret: sayi(ucr.value), kapora: sayi(kap.value),
        ses_sistemi: ses.checked, notlar: not.value.trim() || null
      }, mevcut?.id);
      m.kapat(); bildir(yeni ? "İş eklendi" : "Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ============================================================
//  CARİLER
// ============================================================
export function cariler() {
  const k = el("div", "yigin");
  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", "Cariler"));
  const sag = el("div", "sag");
  const ekle = el("button", "btn ana kucuk", "+ Cari");
  ekle.onclick = () => cariFormu(null);
  sag.appendChild(ekle);
  bas.appendChild(sag);
  k.appendChild(bas);

  const borclu = D.cariBakiye.filter(c => sayi(c.bakiye) > 0.004);
  const toplamBorc = borclu.reduce((t, c) => t + sayi(c.bakiye), 0);
  k.appendChild(ozetSerit([
    { etiket: "Cari", deger: String(D.cariBakiye.length) },
    { etiket: "Borçlu olduğun", deger: String(borclu.length) },
    { etiket: "Toplam borç", deger: paraTam(toplamBorc), renk: toplamBorc > 0 ? "k" : "" },
    { etiket: "Bu yıl ödenen", deger: paraTam(D.cariBakiye.reduce((t, c) => t + sayi(c.toplam_odeme), 0)) }
  ]));

  const f = el("div", "filtreler");
  const ara = el("div", "ara");
  const ai = el("input"); ai.type = "search"; ai.placeholder = "Cari ara…";
  ai.setAttribute("aria-label", "Cari ara"); ara.appendChild(ai);
  f.appendChild(ara);
  k.appendChild(f);

  const kutu = el("section", "panel liste"); k.appendChild(kutu);
  function ciz() {
    const q = ai.value.toLocaleLowerCase("tr");
    const liste = D.cariBakiye
      .filter(c => !q || (c.ad + " " + (c.tur || "")).toLocaleLowerCase("tr").includes(q))
      .sort((a, b) => sayi(b.bakiye) - sayi(a.bakiye) || a.ad.localeCompare(b.ad, "tr"));
    kutu.innerHTML = "";
    if (!liste.length) { kutu.appendChild(bosDurum("Cari bulunamadı")); return; }
    liste.forEach(c => {
      const r = butonSatir(() => cariDetay(c.cari_id));
      const sol = el("div");
      sol.appendChild(el("div", "baslik", c.ad));
      const alt = el("div", "alt");
      alt.appendChild(el("span", "rozet", c.tur || "Diğer"));
      if (c.son_islem) alt.appendChild(el("span", "", "son: " + trTarih(c.son_islem)));
      sol.appendChild(alt);
      const sag2 = el("div");
      const b = sayi(c.bakiye);
      sag2.appendChild(el("div", "tutar " + (b > 0.004 ? "k" : ""), b > 0.004 ? paraTam(b) : "—"));
      sag2.appendChild(el("div", "tarih", b > 0.004 ? "borç" : "kapalı"));
      r.append(sol, sag2);
      kutu.appendChild(r);
    });
  }
  ai.oninput = ciz;
  ciz();
  return k;
}

export async function cariDetay(id) {
  const c = D.cariBakiye.find(x => x.cari_id === id);
  const ham = D.cariler.find(x => x.id === id);
  if (!c || !ham) return;
  const g = el("div", "yigin");

  const kart = el("div", "panel");
  const sat = (e, d, renk) => {
    const r = el("div", "detay-satir");
    r.appendChild(el("div", "e", e));
    const dd = el("div", "d", d); if (renk) dd.style.color = renk;
    r.appendChild(dd); return r;
  };
  kart.append(
    sat("Tür", ham.tur || "—"),
    sat("Telefon", ham.telefon || "—"),
    sat("Açılış bakiyesi", para(ham.acilis_bakiye)),
    sat("Toplam borçlanma", para(c.toplam_borclanma)),
    sat("Toplam ödeme", para(c.toplam_odeme), "var(--gelir-ink)"),
    sat("KALAN BORÇ", para(c.bakiye), sayi(c.bakiye) > 0.004 ? "var(--gider-ink)" : "var(--ink3)")
  );
  if (ham.notlar) kart.appendChild(sat("Not", ham.notlar));
  g.appendChild(kart);

  const yukleniyor = el("div", "bos", "Hareketler yükleniyor…");
  g.appendChild(yukleniyor);

  const ayak = el("div");
  const borcB = el("button", "btn", "Borçlandım");
  const odeB = el("button", "btn ana", "Ödeme yap");
  ayak.append(borcB, odeB);
  const m = modalAc({ baslik: ham.ad, govde: g, ayak });

  borcB.onclick = () => { m.kapat(); borcFormu(null, id); };
  odeB.onclick = () => {
    m.kapat();
    hareketFormu(null, { tur: "gider", cari_id: id, baslik: "Ödeme: " + ham.ad, tarih: bugun() });
  };

  try {
    const borclar = await V.borclanmalar(id);
    yukleniyor.remove();
    if (borclar.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", "Borçlanmalar"));
      s.appendChild(b);
      const l = el("div", "liste");
      borclar.forEach(x => {
        const r = butonSatir(() => { m.kapat(); borcFormu(x, id); });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", x.aciklama || "Borçlanma"));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "", trTarihUzun(x.tarih)));
        if (x.vade) {
          const f = gunFarki(x.vade);
          alt.appendChild(el("span", "rozet " + (f < 0 ? "kotu" : f <= 7 ? "uyari" : ""),
            f < 0 ? `${-f} gün gecikti` : `vade ${trTarih(x.vade)}`));
        }
        sol.appendChild(alt);
        r.append(sol, el("div", "tutar k", para(x.tutar)));
        l.appendChild(r);
      });
      s.appendChild(l);
      g.appendChild(s);
    }
    const odemeler = D.hareketler.filter(h => h.cari_id === id);
    if (odemeler.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", `Kasa hareketleri (${odemeler.length})`));
      s.appendChild(b);
      const l = el("div", "liste");
      odemeler.slice(0, 20).forEach(h => l.appendChild(hareketSatiri(h)));
      s.appendChild(l);
      g.appendChild(s);
    }
    if (!borclar.length && !odemeler.length) g.appendChild(bosDurum("Bu cariye ait hareket yok"));
  } catch (e) {
    yukleniyor.textContent = e.message;
  }
}

export function cariFormu(mevcut) {
  const yeni = !mevcut;
  const g = el("div");
  const adL = el("label", "alan", "CARİ ADI");
  const ad = el("input"); ad.type = "text"; ad.value = mevcut?.ad ?? ""; adL.appendChild(ad); g.appendChild(adL);
  const turL = el("label", "alan", "TÜR");
  const tur = el("select");
  V.seceneklerGrubu("cari_turu").forEach(a => { const o = el("option", "", a); o.value = a; tur.appendChild(o); });
  tur.value = mevcut?.tur ?? "Tedarikçi"; turL.appendChild(tur); g.appendChild(turL);
  const i = el("div", "ikili");
  const telL = el("label", "alan", "TELEFON");
  const tel = el("input"); tel.type = "tel"; tel.inputMode = "tel"; tel.value = mevcut?.telefon ?? ""; telL.appendChild(tel);
  const acL = el("label", "alan", "AÇILIŞ BAKİYESİ (₺)");
  const ac = el("input"); ac.type = "number"; ac.step = "0.01"; ac.inputMode = "decimal";
  ac.value = mevcut?.acilis_bakiye ?? 0; acL.appendChild(ac);
  i.append(telL, acL); g.appendChild(i);
  const notL = el("label", "alan", "NOTLAR");
  const not = el("textarea"); not.value = mevcut?.notlar ?? ""; notL.appendChild(not); g.appendChild(notL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: yeni ? "Yeni cari" : "Cariyi düzenle", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    if (!ad.value.trim()) { bildir("Cari adını gir", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.cariYaz({
        ad: ad.value.trim(), tur: tur.value, telefon: tel.value.trim() || null,
        acilis_bakiye: sayi(ac.value), notlar: not.value.trim() || null
      }, mevcut?.id);
      m.kapat(); bildir("Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

export function borcFormu(mevcut, cariId) {
  const yeni = !mevcut;
  const g = el("div");
  const i = el("div", "ikili");
  const tutL = el("label", "alan", "TUTAR (₺)");
  const tut = el("input"); tut.type = "number"; tut.step = "0.01"; tut.min = "0"; tut.inputMode = "decimal";
  tut.value = mevcut?.tutar ?? ""; tutL.appendChild(tut);
  const tarL = el("label", "alan", "TARİH");
  const tar = el("input"); tar.type = "date"; tar.value = mevcut?.tarih ?? bugun(); tarL.appendChild(tar);
  i.append(tutL, tarL); g.appendChild(i);
  const vadL = el("label", "alan", "VADE (isteğe bağlı)");
  const vad = el("input"); vad.type = "date"; vad.value = mevcut?.vade ?? ""; vadL.appendChild(vad); g.appendChild(vadL);
  const acL = el("label", "alan", "AÇIKLAMA");
  const ac = el("input"); ac.type = "text"; ac.placeholder = "Örn. 2 çuval un";
  ac.value = mevcut?.aciklama ?? ""; acL.appendChild(ac); g.appendChild(acL);
  g.appendChild(Object.assign(el("p", "altbilgi", "Borçlanma kasadan para çıkarmaz — sadece bu cariye olan borcunu artırır. Parayı ödediğinde “Ödeme yap” de."), { style: "margin:0" }));

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
  ayak.append(iptal, kaydet);
  if (!yeni) {
    const silB = el("button", "btn tehlike", "Sil"); silB.style.flex = "0 0 auto";
    ayak.insertBefore(silB, iptal);
    silB.onclick = async () => {
      if (!await onayla("Borçlanma silinsin mi?", para(mevcut.tutar), "Sil")) return;
      try { await V.borcSil(mevcut.id); m.kapat(); bildir("Silindi"); yenile(true); }
      catch (e) { bildir(e.message, "kotu"); }
    };
  }
  const m = modalAc({ baslik: yeni ? "Borçlanma ekle" : "Borçlanmayı düzenle", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    const t = parseFloat(String(tut.value).replace(",", "."));
    if (!(t > 0)) { bildir("Tutar girmelisin", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.borcYaz({
        cari_id: cariId, tarih: tar.value || bugun(), tutar: t,
        vade: vad.value || null, aciklama: ac.value.trim() || null
      }, mevcut?.id);
      m.kapat(); bildir("Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ============================================================
//  MÜŞTERİLER
// ============================================================
export function musteriler() {
  const k = el("div", "yigin");
  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", "Müşteriler"));
  const sag = el("div", "sag");
  const ekle = el("button", "btn ana kucuk", "+ Müşteri");
  ekle.onclick = () => musteriFormu(null);
  sag.appendChild(ekle);
  bas.appendChild(sag);
  k.appendChild(bas);

  const f = el("div", "filtreler");
  const ara = el("div", "ara");
  const ai = el("input"); ai.type = "search"; ai.placeholder = "Müşteri ara…";
  ai.setAttribute("aria-label", "Müşteri ara"); ara.appendChild(ai);
  f.appendChild(ara); k.appendChild(f);

  const kutu = el("section", "panel liste"); k.appendChild(kutu);
  function ciz() {
    const q = ai.value.toLocaleLowerCase("tr");
    const liste = D.musteriler.filter(m => !q || m.ad.toLocaleLowerCase("tr").includes(q));
    kutu.innerHTML = "";
    if (!liste.length) { kutu.appendChild(bosDurum("Müşteri bulunamadı")); return; }
    liste.forEach(mu => {
      const isler = D.orgOzet.filter(o => o.musteri_id === mu.id);
      const ciro = isler.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
      const r = butonSatir(() => musteriDetay(mu.id));
      const sol = el("div");
      sol.appendChild(el("div", "baslik", mu.ad));
      const alt = el("div", "alt");
      alt.appendChild(el("span", "", `${isler.length} iş`));
      if (mu.telefon) alt.appendChild(el("span", "", "· " + mu.telefon));
      sol.appendChild(alt);
      r.append(sol, el("div", "tutar", paraTam(ciro)));
      kutu.appendChild(r);
    });
  }
  ai.oninput = ciz; ciz();
  return k;
}

export function musteriDetay(id) {
  const mu = D.musteriler.find(x => x.id === id);
  if (!mu) return;
  const g = el("div", "yigin");
  const isler = D.orgOzet.filter(o => o.musteri_id === id);
  const ciro = isler.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
  const kalan = isler.reduce((t, o) => t + Math.max(0, sayi(o.kalan_odeme)), 0);

  const kart = el("div", "panel");
  const sat = (e, d) => {
    const r = el("div", "detay-satir");
    r.appendChild(el("div", "e", e)); r.appendChild(el("div", "d", d)); return r;
  };
  kart.append(
    sat("Telefon", mu.telefon || "—"),
    sat("Instagram", mu.instagram || "—"),
    sat("Toplam iş", String(isler.length)),
    sat("Toplam ciro", para(ciro)),
    sat("Kalan alacak", para(kalan))
  );
  if (mu.notlar) kart.appendChild(sat("Not", mu.notlar));
  g.appendChild(kart);

  if (isler.length) {
    const s = el("section", "panel");
    const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
    b.appendChild(el("h3", "", "İşleri")); s.appendChild(b);
    const l = el("div", "liste");
    isler.forEach(o => {
      const r = butonSatir(() => { m.kapat(); orgDetay(o.organizasyon_id); });
      const sol = el("div");
      sol.appendChild(el("div", "baslik", o.ad));
      sol.appendChild(el("div", "alt", trTarihUzun(o.tarih) + " · " + o.durum));
      r.append(sol, el("div", "tutar", paraTam(o.toplam_ucret)));
      l.appendChild(r);
    });
    s.appendChild(l); g.appendChild(s);
  }

  const ayak = el("div");
  const duzen = el("button", "btn", "Düzenle");
  const kapat = el("button", "btn ana", "Kapat");
  ayak.append(duzen, kapat);
  const m = modalAc({ baslik: mu.ad, govde: g, ayak });
  duzen.onclick = () => { m.kapat(); musteriFormu(mu); };
  kapat.onclick = () => m.kapat();
}

export function musteriFormu(mevcut) {
  const yeni = !mevcut;
  const g = el("div");
  const adL = el("label", "alan", "AD SOYAD");
  const ad = el("input"); ad.type = "text"; ad.value = mevcut?.ad ?? ""; adL.appendChild(ad); g.appendChild(adL);
  const i = el("div", "ikili");
  const telL = el("label", "alan", "TELEFON");
  const tel = el("input"); tel.type = "tel"; tel.inputMode = "tel"; tel.value = mevcut?.telefon ?? ""; telL.appendChild(tel);
  const insL = el("label", "alan", "INSTAGRAM");
  const ins = el("input"); ins.type = "text"; ins.value = mevcut?.instagram ?? ""; insL.appendChild(ins);
  i.append(telL, insL); g.appendChild(i);
  const notL = el("label", "alan", "NOTLAR");
  const not = el("textarea"); not.value = mevcut?.notlar ?? ""; notL.appendChild(not); g.appendChild(notL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: yeni ? "Yeni müşteri" : "Müşteriyi düzenle", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    if (!ad.value.trim()) { bildir("Ad gir", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.musteriYaz({
        ad: ad.value.trim(), telefon: tel.value.trim() || null,
        instagram: ins.value.trim() || null, notlar: not.value.trim() || null
      }, mevcut?.id);
      m.kapat(); bildir("Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ============================================================
//  RAPORLAR
// ============================================================
export function raporlar() {
  const k = el("div", "yigin");
  const bas = el("div", "ekran-basi");
  bas.appendChild(el("h2", "", "Raporlar"));
  const sag = el("div", "sag");
  sag.appendChild(donemSecici(yenile));
  bas.appendChild(sag);
  k.appendChild(bas);

  // Son 12 ay
  const aylar = son12Ay();
  const enb = Math.max(1, ...aylar.map(a => Math.max(a.gelir, a.gider)));
  const tavan = enb * 1.12;
  const g1 = el("section", "panel grafik-kutu");
  const gb = el("div", "grafik-basi");
  gb.appendChild(el("h3", "", "Son 12 ay"));
  const ef = el("div", "efsane");
  ef.innerHTML = `<span><i style="background:var(--gelir)"></i>Gelir</span><span><i style="background:var(--gider)"></i>Gider</span>`;
  gb.appendChild(ef);
  g1.appendChild(gb);
  const su = el("div", "sutunlar");
  const izg = el("div", "izgaralar");
  [0, .5, 1].forEach(fr => {
    const l = el("div", "cizgi"); l.style.top = ((1 - fr) * 100) + "%";
    const y = el("div", "yazi", paraKisa(tavan * fr)); y.style.top = ((1 - fr) * 100) + "%";
    izg.append(l, y);
  });
  su.appendChild(izg);
  const aylarE = el("div", "aylar");
  aylar.forEach(a => {
    const m = el("div", "ay");
    const b1 = el("div", "cubuk g"); b1.style.height = Math.max(2, a.gelir / tavan * 100) + "%";
    const b2 = el("div", "cubuk k"); b2.style.height = Math.max(2, a.gider / tavan * 100) + "%";
    m.append(b1, b2);
    const goster = (ev) => ipucuGoster(ev, `${AY_UZUN[a.ay]} ${a.yil}`, [
      ["Gelir", para(a.gelir), "var(--gelir-ink)"],
      ["Gider", para(a.gider), "var(--gider-ink)"],
      ["Net", para(a.gelir - a.gider), ""]
    ]);
    m.addEventListener("mousemove", goster);
    m.addEventListener("touchstart", (e) => goster(e.touches[0]), { passive: true });
    m.addEventListener("mouseleave", ipucuGizle);
    m.addEventListener("touchend", ipucuGizle);
    aylarE.appendChild(m);
  });
  su.appendChild(aylarE);
  const adlar = el("div", "adlar");
  aylar.forEach(a => adlar.appendChild(el("span", "", AY_KISA[a.ay])));
  su.appendChild(adlar);
  g1.appendChild(su);
  k.appendChild(g1);

  // Kategori dağılımı
  const g2 = el("section", "panel grafik-kutu");
  const gb2 = el("div", "grafik-basi");
  gb2.appendChild(el("h3", "", "Kategori dağılımı"));
  const seg = el("div", "segment");
  [["gider", "Gider", "k"], ["gelir", "Gelir", "g"]].forEach(([kod, ad, sn]) => {
    const b = el("button", sn, ad); b.type = "button";
    b.setAttribute("aria-pressed", String(U.katTur === kod));
    b.onclick = () => { U.katTur = kod; yenile(); };
    seg.appendChild(b);
  });
  gb2.appendChild(seg);
  g2.appendChild(gb2);
  const dh = donemHareketleri().filter(h => h.tur === U.katTur);
  const gruplar = {};
  dh.forEach(h => { gruplar[h.kategori] = (gruplar[h.kategori] || 0) + sayi(h.tutar); });
  const sirali = Object.entries(gruplar).map(([ad, deg]) => ({ ad, deg })).sort((a, b) => b.deg - a.deg);
  const toplamK = sirali.reduce((t, x) => t + x.deg, 0);
  if (!sirali.length) g2.appendChild(bosDurum("Bu dönemde kayıt yok"));
  else {
    const kl = el("div", "kat-liste");
    const enB = sirali[0].deg || 1;
    const renk = U.katTur === "gider" ? "var(--gider)" : "var(--gelir)";
    sirali.slice(0, 10).forEach(x => {
      const r = el("div", "kat");
      r.appendChild(el("div", "ad", x.ad));
      r.appendChild(el("div", "deg", `${paraTam(x.deg)} · %${toplamK ? Math.round(x.deg / toplamK * 100) : 0}`));
      const yol = el("div", "yol"); const i = el("i");
      i.style.width = Math.max(1.5, x.deg / enB * 100) + "%"; i.style.background = renk;
      yol.appendChild(i); r.appendChild(yol);
      kl.appendChild(r);
    });
    g2.appendChild(kl);
  }
  k.appendChild(g2);

  if (D.defter === "is") {
    // Kârlılık
    const karli = D.orgOzet.filter(o => sayi(o.toplam_ucret) > 0)
      .sort((a, b) => sayi(b.kar) - sayi(a.kar)).slice(0, 10);
    if (karli.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", "En kârlı işler")); s.appendChild(b);
      const t = el("div", "tablo-sar");
      let h = `<table class="veri"><thead><tr><th>İş</th><th>Ücret</th><th>Maliyet</th><th>Kâr</th></tr></thead><tbody>`;
      karli.forEach(o => {
        h += `<tr><td>${kacis(o.ad)}</td><td class="para">${paraTam(o.toplam_ucret)}</td>` +
             `<td class="para">${paraTam(o.gercek_maliyet)}</td>` +
             `<td class="para" style="font-weight:600;color:${sayi(o.kar) < 0 ? "var(--gider-ink)" : "var(--gelir-ink)"}">${paraTam(o.kar)}</td></tr>`;
      });
      h += `</tbody></table>`;
      t.innerHTML = h; s.appendChild(t); k.appendChild(s);
    }

    // Tür bazında
    const turler = {};
    D.orgOzet.forEach(o => {
      if (!o.tur) return;
      const t = turler[o.tur] || (turler[o.tur] = { adet: 0, ciro: 0, kar: 0 });
      t.adet++; t.ciro += sayi(o.toplam_ucret); t.kar += sayi(o.kar);
    });
    const tl = Object.entries(turler).sort((a, b) => b[1].ciro - a[1].ciro);
    if (tl.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi"); b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", "Etkinlik türüne göre")); s.appendChild(b);
      const t = el("div", "tablo-sar");
      let h = `<table class="veri"><thead><tr><th>Tür</th><th>Adet</th><th>Ciro</th><th>Ort. ücret</th></tr></thead><tbody>`;
      tl.forEach(([ad, v]) => {
        h += `<tr><td>${kacis(ad)}</td><td class="para">${v.adet}</td>` +
             `<td class="para">${paraTam(v.ciro)}</td><td class="para">${paraTam(v.ciro / v.adet)}</td></tr>`;
      });
      h += `</tbody></table>`;
      t.innerHTML = h; s.appendChild(t); k.appendChild(s);
    }
  }

  // Aylık döküm
  const s3 = el("section", "panel");
  const b3 = el("div", "grafik-basi"); b3.style.padding = "14px 14px 4px";
  b3.appendChild(el("h3", "", "Aylık döküm")); s3.appendChild(b3);
  const t3 = el("div", "tablo-sar");
  let h3 = `<table class="veri"><thead><tr><th>Ay</th><th>Gelir</th><th>Gider</th><th>Net</th></tr></thead><tbody>`;
  let tg = 0, tk = 0;
  aylar.slice().reverse().forEach(a => {
    tg += a.gelir; tk += a.gider;
    const n = a.gelir - a.gider;
    h3 += `<tr><td>${AY_UZUN[a.ay]} ${a.yil}</td><td class="para">${paraTam(a.gelir)}</td>` +
          `<td class="para">${paraTam(a.gider)}</td>` +
          `<td class="para" style="font-weight:600;color:${n < 0 ? "var(--gider-ink)" : "var(--gelir-ink)"}">${paraTam(n)}</td></tr>`;
  });
  h3 += `</tbody><tfoot><tr><th>12 ay</th><th>${paraTam(tg)}</th><th>${paraTam(tk)}</th><th>${paraTam(tg - tk)}</th></tr></tfoot></table>`;
  t3.innerHTML = h3; s3.appendChild(t3); k.appendChild(s3);

  return k;
}

function son12Ay() {
  const d = new Date(), out = [];
  for (let i = 11; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push({
      yil: m.getFullYear(), ay: m.getMonth(),
      bas: isoTarih(m), son: isoTarih(new Date(m.getFullYear(), m.getMonth() + 1, 0)),
      gelir: 0, gider: 0
    });
  }
  D.hareketler.forEach(h => {
    for (const a of out) {
      if (h.tarih >= a.bas && h.tarih <= a.son) {
        if (h.tur === "gelir") a.gelir += sayi(h.tutar); else a.gider += sayi(h.tutar);
        break;
      }
    }
  });
  return out;
}

// ============================================================
//  AYARLAR
// ============================================================
export function ayarlar() {
  const k = el("div", "yigin");
  k.appendChild(Object.assign(el("div", "ekran-basi"), { innerHTML: "<h2>Ayarlar</h2>" }));

  // Hesaplar
  const s1 = el("section", "panel");
  s1.appendChild(bolumBasi("Hesaplar", V.yetkili() ? { ad: "+ Hesap", tikla: () => hesapFormu(null) } : null));
  const l1 = el("div", "liste");
  D.hesaplar.filter(h => h.defter === D.defter).forEach(h => {
    const r = V.yetkili() ? butonSatir(() => hesapFormu(h)) : el("div", "satir");
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.ad));
    const alt = el("div", "alt");
    alt.appendChild(el("span", "", h.tur === "nakit" ? "Nakit" : "Banka"));
    if (!h.aktif) alt.appendChild(el("span", "rozet", "kapalı"));
    sol.appendChild(alt);
    r.append(sol, el("div", "tutar", para(h.acilis_bakiye)));
    l1.appendChild(r);
  });
  s1.appendChild(l1);
  s1.appendChild(Object.assign(el("p", "altbilgi", "Tutarlar açılış bakiyesidir; güncel bakiye Panel'de görünür."), { style: "padding:0 14px 14px;margin:0" }));
  k.appendChild(s1);

  // Kategoriler
  const s2 = el("section", "panel");
  s2.appendChild(bolumBasi("Kategoriler", V.yetkili() ? { ad: "+ Kategori", tikla: () => kategoriFormu() } : null));
  ["gelir", "gider"].forEach(tur => {
    s2.appendChild(el("div", "grup-basi", tur === "gelir" ? "Gelir" : "Gider"));
    const sar = el("div"); sar.style.cssText = "display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px";
    D.kategoriler.filter(c => c.defter === D.defter && c.tur === tur).forEach(c => {
      const cip = el("span", "rozet", c.ad);
      if (V.sahip()) {
        cip.style.cursor = "pointer";
        cip.title = "Kaldır";
        cip.onclick = async () => {
          if (!await onayla("Kategori kaldırılsın mı?", `${c.ad} — eski kayıtlar silinmez.`, "Kaldır")) return;
          try { await V.kategoriSil(c.id); bildir("Kaldırıldı"); yenile(true); }
          catch (e) { bildir(e.message, "kotu"); }
        };
      }
      sar.appendChild(cip);
    });
    s2.appendChild(sar);
  });
  k.appendChild(s2);

  // Kullanıcılar
  if (V.sahip()) {
    const s3 = el("section", "panel");
    s3.appendChild(bolumBasi("Kullanıcılar", null));
    const l3 = el("div", "liste");
    l3.appendChild(el("div", "bos", "Yükleniyor…"));
    s3.appendChild(l3);
    k.appendChild(s3);
    V.profiller().then(liste => {
      l3.innerHTML = "";
      liste.forEach(p => {
        const r = butonSatir(() => kullaniciFormu(p));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", p.ad || p.eposta));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "rozet " + (p.rol === "sahip" ? "vurgu" : ""), p.rol));
        if (!p.aktif) alt.appendChild(el("span", "rozet kotu", "pasif"));
        alt.appendChild(el("span", "", p.eposta || ""));
        sol.appendChild(alt);
        r.append(sol, el("div", "tarih", `${(p.izinli_sekmeler || []).length} sekme`));
        l3.appendChild(r);
      });
      if (!liste.length) l3.appendChild(bosDurum("Kullanıcı yok"));
    }).catch(e => { l3.innerHTML = ""; l3.appendChild(bosDurum("Yüklenemedi", e.message)); });

    const s4 = el("section", "panel");
    s4.appendChild(bolumBasi("Personel davet et", null));
    const p = el("p", "altbilgi");
    p.style.cssText = "padding:0 14px 14px;margin:0";
    p.textContent = "Personelin bu adrese girip kendi e-postasıyla kayıt olması yeterli. Kayıt olduktan sonra buradaki listede görünür; sekme ve kategori izinlerini sen verirsin. Yeni kullanıcılar varsayılan olarak sadece Panel ve Kasa görür.";
    s4.appendChild(p);
    k.appendChild(s4);
  }

  // Kişisel defter PIN'i
  if (V.sahip()) {
    const kisisel = D.defterler.find(d => d.tur === "kisisel");
    if (kisisel) {
      const sp = el("section", "panel");
      sp.appendChild(bolumBasi("Kişisel defter kilidi", null));
      const pv = el("div"); pv.style.cssText = "padding:0 14px 14px";
      const durum = el("p", "altbilgi",
        kisisel.pin_hash
          ? "PIN açık. Kişisel deftere geçerken PIN sorulur."
          : "PIN yok. Kişisel defter yalnızca senin hesabında görünür, ama açarken ek kilit sorulmaz.");
      durum.style.margin = "0 0 10px";
      pv.appendChild(durum);
      const dv2 = el("div"); dv2.style.cssText = "display:flex;gap:10px;flex-wrap:wrap";
      const kur = el("button", "btn", kisisel.pin_hash ? "PIN'i değiştir" : "PIN koy");
      kur.onclick = () => pinFormu(kisisel);
      dv2.appendChild(kur);
      if (kisisel.pin_hash) {
        const kaldir = el("button", "btn tehlike", "PIN'i kaldır");
        kaldir.onclick = async () => {
          if (!await onayla("PIN kaldırılsın mı?", "Kişisel defter yine sadece sana görünür, sadece ek kilit kalkar.", "Kaldır")) return;
          try { await V.defterYaz(kisisel.kod, { pin_hash: null }); bildir("PIN kaldırıldı"); yenile(true); }
          catch (e) { bildir(e.message, "kotu"); }
        };
        dv2.appendChild(kaldir);
      }
      pv.appendChild(dv2);
      sp.appendChild(pv);
      k.appendChild(sp);
    }
  }

  // Veri
  const s5 = el("section", "panel");
  s5.appendChild(bolumBasi("Veri", null));
  const dv = el("div"); dv.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;padding:0 14px 14px";
  const disa = el("button", "btn", "Yedek indir (JSON)");
  disa.onclick = () => yedekIndir();
  const csv = el("button", "btn", "Kasa dökümü (CSV)");
  csv.onclick = () => csvIndir();
  dv.append(disa, csv);
  s5.appendChild(dv);
  k.appendChild(s5);

  // Hesabım
  const s6 = el("section", "panel");
  s6.appendChild(bolumBasi("Hesabım", null));
  const hv = el("div"); hv.style.cssText = "padding:0 14px 14px";
  hv.appendChild(Object.assign(el("p", "altbilgi", `${D.profil?.ad ?? ""} · ${D.kullanici?.email ?? ""} · ${D.profil?.rol ?? ""}`), { style: "margin:0 0 10px" }));
  const cikis = el("button", "btn tehlike", "Çıkış yap");
  cikis.onclick = async () => { await V.cikisYap(); location.reload(); };
  hv.appendChild(cikis);
  s6.appendChild(hv);
  k.appendChild(s6);

  return k;
}

function bolumBasi(baslik, eylem) {
  const b = el("div", "grafik-basi");
  b.style.padding = "14px 14px 4px";
  b.appendChild(el("h3", "", baslik));
  if (eylem) {
    const a = el("button", "btn sade kucuk", eylem.ad);
    a.onclick = eylem.tikla;
    b.appendChild(a);
  }
  return b;
}

function hesapFormu(mevcut) {
  const yeni = !mevcut;
  const g = el("div");
  const adL = el("label", "alan", "HESAP ADI");
  const ad = el("input"); ad.type = "text"; ad.value = mevcut?.ad ?? ""; adL.appendChild(ad); g.appendChild(adL);
  const turL = el("label", "alan", "TÜR");
  const tur = el("select");
  [["nakit", "Nakit kasa"], ["banka", "Banka hesabı"]].forEach(([k2, a]) => {
    const o = el("option", "", a); o.value = k2; tur.appendChild(o);
  });
  tur.value = mevcut?.tur ?? "banka"; turL.appendChild(tur); g.appendChild(turL);
  const acL = el("label", "alan", "AÇILIŞ BAKİYESİ (₺)");
  const ac = el("input"); ac.type = "number"; ac.step = "0.01"; ac.inputMode = "decimal";
  ac.value = mevcut?.acilis_bakiye ?? 0; acL.appendChild(ac); g.appendChild(acL);
  const aktL = el("label", "onay-kutu");
  const akt = el("input"); akt.type = "checkbox"; akt.checked = mevcut ? mevcut.aktif : true;
  aktL.append(akt, document.createTextNode("Kullanımda"));
  g.appendChild(aktL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: yeni ? "Yeni hesap" : "Hesabı düzenle", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    if (!ad.value.trim()) { bildir("Ad gir", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.hesapYaz({
        defter: D.defter, ad: ad.value.trim(), tur: tur.value,
        acilis_bakiye: sayi(ac.value), aktif: akt.checked,
        sira: mevcut?.sira ?? (D.hesaplar.length + 1)
      }, mevcut?.id);
      m.kapat(); bildir("Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

function pinFormu(defter) {
  const g = el("div");
  const l1 = el("label", "alan", "YENİ PIN (en az 4 hane)");
  const p1 = el("input"); p1.type = "password"; p1.inputMode = "numeric"; p1.autocomplete = "off";
  l1.appendChild(p1);
  const l2 = el("label", "alan", "PIN TEKRAR");
  const p2 = el("input"); p2.type = "password"; p2.inputMode = "numeric"; p2.autocomplete = "off";
  l2.appendChild(p2);
  g.append(l1, l2);
  const not = el("p", "altbilgi", "PIN bu cihazda saklanmaz, sunucuda özeti tutulur. Unutursan buradan yenisini koyabilirsin — verine bir şey olmaz.");
  not.style.margin = "0";
  g.appendChild(not);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: "Kişisel defter PIN'i", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  setTimeout(() => p1.focus(), 60);
  kaydet.onclick = async () => {
    if (p1.value.length < 4) { bildir("PIN en az 4 hane olmalı", "kotu"); return; }
    if (p1.value !== p2.value) { bildir("PIN'ler aynı değil", "kotu"); return; }
    kaydet.disabled = true;
    try {
      const ozet = await window.mksPinOzet(p1.value);
      await V.defterYaz(defter.kod, { pin_hash: ozet });
      m.kapat(); bildir("PIN kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

function kategoriFormu() {
  const g = el("div");
  const turL = el("label", "alan", "TÜR");
  const tur = el("select");
  [["gider", "Gider"], ["gelir", "Gelir"]].forEach(([k2, a]) => { const o = el("option", "", a); o.value = k2; tur.appendChild(o); });
  turL.appendChild(tur); g.appendChild(turL);
  const adL = el("label", "alan", "KATEGORİ ADI");
  const ad = el("input"); ad.type = "text"; adL.appendChild(ad); g.appendChild(adL);
  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", "Ekle");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: "Yeni kategori", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    if (!ad.value.trim()) { bildir("Ad gir", "kotu"); return; }
    kaydet.disabled = true;
    try {
      await V.kategoriYaz({
        defter: D.defter, tur: tur.value, ad: ad.value.trim(),
        sira: D.kategoriler.length + 1, aktif: true
      });
      m.kapat(); bildir("Eklendi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

function kullaniciFormu(p) {
  const g = el("div", "yigin");
  const kendisi = p.id === D.kullanici.id;

  const adL = el("label", "alan", "AD");
  const ad = el("input"); ad.type = "text"; ad.value = p.ad ?? ""; adL.appendChild(ad); g.appendChild(adL);

  const rolL = el("label", "alan", "ROL");
  const rol = el("select");
  [["personel", "Personel"], ["yonetici", "Yönetici"], ["sahip", "Sahip"]].forEach(([k2, a]) => {
    const o = el("option", "", a); o.value = k2; rol.appendChild(o);
  });
  rol.value = p.rol; rol.disabled = kendisi;
  rolL.appendChild(rol); g.appendChild(rolL);

  const sekLabel = el("div", "etiket", "GÖREBİLECEĞİ SEKMELER");
  g.appendChild(sekLabel);
  const sekKutu = el("div"); sekKutu.style.cssText = "display:flex;flex-direction:column;gap:2px";
  const sekmeKutulari = {};
  SEKMELER.forEach(s => {
    const l = el("label", "onay-kutu");
    const c = el("input"); c.type = "checkbox";
    c.checked = (p.izinli_sekmeler || []).includes(s.kod);
    sekmeKutulari[s.kod] = c;
    l.append(c, document.createTextNode(s.ad));
    sekKutu.appendChild(l);
  });
  g.appendChild(sekKutu);

  const katLabel = el("div", "etiket", "GÖREBİLECEĞİ VE GİREBİLECEĞİ KATEGORİLER");
  g.appendChild(katLabel);
  const hepsi = el("label", "onay-kutu");
  const hepsiC = el("input"); hepsiC.type = "checkbox";
  hepsiC.checked = p.izinli_kategoriler == null;
  hepsi.append(hepsiC, document.createTextNode("Hepsi serbest"));
  g.appendChild(hepsi);
  const katKutu = el("div"); katKutu.style.cssText = "display:flex;flex-wrap:wrap;gap:7px";
  const katKutulari = {};
  D.kategoriler.filter(c => c.defter === "is").forEach(c => {
    const l = el("label", "onay-kutu"); l.style.cssText = "min-height:34px;font-size:13px";
    const cb = el("input"); cb.type = "checkbox";
    cb.checked = p.izinli_kategoriler ? p.izinli_kategoriler.includes(c.ad) : true;
    katKutulari[c.ad] = cb;
    l.append(cb, document.createTextNode(c.ad));
    katKutu.appendChild(l);
  });
  g.appendChild(katKutu);
  const katGuncelle = () => { katKutu.style.opacity = hepsiC.checked ? ".45" : "1"; katKutu.style.pointerEvents = hepsiC.checked ? "none" : "auto"; };
  hepsiC.onchange = katGuncelle; katGuncelle();

  const silL = el("label", "onay-kutu");
  const silC = el("input"); silC.type = "checkbox"; silC.checked = !!p.silebilir;
  silL.append(silC, document.createTextNode("Kayıt silebilir"));
  g.appendChild(silL);

  const aktL = el("label", "onay-kutu");
  const aktC = el("input"); aktC.type = "checkbox"; aktC.checked = !!p.aktif; aktC.disabled = kendisi;
  aktL.append(aktC, document.createTextNode("Girişi açık"));
  g.appendChild(aktL);

  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", "Kaydet");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: p.ad || p.eposta, govde: g, ayak });
  iptal.onclick = () => m.kapat();
  kaydet.onclick = async () => {
    kaydet.disabled = true;
    try {
      const sekmeler = Object.entries(sekmeKutulari).filter(([, c]) => c.checked).map(([k2]) => k2);
      const kategoriler = hepsiC.checked ? null
        : Object.entries(katKutulari).filter(([, c]) => c.checked).map(([k2]) => k2);
      await V.profilYaz({
        ad: ad.value.trim(), rol: rol.value, aktif: aktC.checked,
        izinli_sekmeler: sekmeler, izinli_kategoriler: kategoriler, silebilir: silC.checked
      }, p.id);
      m.kapat(); bildir("Kaydedildi", "iyi"); yenile(true);
    } catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ---------- dışa aktarma ----------
function indir(adi, icerik, tip) {
  const blob = new Blob([icerik], { type: tip });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = adi;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function yedekIndir() {
  const y = {
    tarih: new Date().toISOString(), defter: D.defter,
    hesaplar: D.hesaplar, kategoriler: D.kategoriler, secenekler: D.secenekler,
    musteriler: D.musteriler, cariler: D.cariler,
    organizasyonlar: D.organizasyonlar, hareketler: D.hareketler
  };
  indir(`mks-defteri-${bugun()}.json`, JSON.stringify(y, null, 2), "application/json");
  bildir("Yedek indirildi", "iyi");
}
function csvIndir() {
  const s = ["Tarih;Tur;Kategori;Baslik;Aciklama;Hesap;Organizasyon;Cari;Tutar"];
  D.hareketler.slice().sort((a, b) => a.tarih < b.tarih ? -1 : 1).forEach(h => {
    s.push([
      h.tarih, h.tur === "gelir" ? "Gelir" : "Gider", h.kategori || "",
      (h.baslik || "").replace(/;/g, ","), (h.aciklama || "").replace(/;/g, ","),
      V.hesapAdi(h.hesap_id), V.orgAdi(h.organizasyon_id) || "", V.cariAdi(h.cari_id) || "",
      sayi(h.tutar).toFixed(2).replace(".", ",")
    ].join(";"));
  });
  indir(`mks-kasa-${bugun()}.csv`, "﻿" + s.join("\r\n"), "text/csv");
  bildir("CSV indirildi", "iyi");
}
