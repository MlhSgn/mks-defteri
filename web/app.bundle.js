(() => {
  // js/ayar.js
  var SUPABASE_URL = "https://jrxwzybkeibzxkvcnrbg.supabase.co";
  var SUPABASE_ANAHTAR = "sb_publishable_RHIcNpoHGcFklrFg4FE3Lw_ZUsaEoCs";
  var SEKMELER = [
    { kod: "panel", ad: "Ana Sayfa", kisa: "Ana", ikon: "ev" },
    { kod: "organizasyonlar", ad: "\u0130\u015Fler", kisa: "\u0130\u015Fler", ikon: "takvim" },
    { kod: "kasa", ad: "Kasa", kisa: "Kasa", ikon: "cuzdan" },
    { kod: "cariler", ad: "Cariler", kisa: "Cari", ikon: "canta" },
    { kod: "musteriler", ad: "M\xFC\u015Fteriler", kisa: "M\xFC\u015Ft.", ikon: "kisiler" },
    { kod: "raporlar", ad: "Raporlar", kisa: "Rapor", ikon: "grafik" },
    { kod: "ayarlar", ad: "Ayarlar", kisa: "Ayar", ikon: "ayar" }
  ];
  var KISISEL_KAPALI = ["organizasyonlar", "cariler", "musteriler"];
  var SIMGELER = {
    ev: '<path d="M3 11.4 12 3.6l9 7.8V19a2 2 0 0 1-2 2h-4v-6.4H9V21H5a2 2 0 0 1-2-2z"/>',
    takvim: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10.5h18"/><circle cx="8.5" cy="15" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
    cuzdan: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v1"/><rect x="3" y="8.5" width="18" height="11.5" rx="2.5"/><path d="M16 14.2h2.6"/>',
    canta: '<rect x="2.8" y="7.5" width="18.4" height="12.5" rx="2.5"/><path d="M8.8 7.5V5.6A1.8 1.8 0 0 1 10.6 3.8h2.8a1.8 1.8 0 0 1 1.8 1.8v1.9M2.8 12.6h18.4"/>',
    kisiler: '<circle cx="9" cy="8.2" r="3.4"/><path d="M2.9 20.2a6.1 6.1 0 0 1 12.2 0M16.4 5.2a3.4 3.4 0 0 1 0 6.4M17.6 14.6a6.1 6.1 0 0 1 3.5 5.6"/>',
    grafik: '<path d="M3.5 20.4h17M7 20V12M12 20V5.4M17 20v-5.6"/>',
    ayar: '<path d="M4 7h10M18.5 7H20M4 12h2.5M11 12h9M4 17h8.5M17 17h3"/><circle cx="16" cy="7" r="2.3"/><circle cx="8.7" cy="12" r="2.3"/><circle cx="14.8" cy="17" r="2.3"/>'
  };
  function simge(kod, boyut = 22) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", boyut);
    s.setAttribute("height", boyut);
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.7");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = SIMGELER[kod] || SIMGELER.ev;
    return s;
  }
  var TUR_RENK = {
    "dugun": "#8e2a5f",
    "nisan": "#c2417f",
    "kina": "#bf8a2c",
    "kinagecesi": "#bf8a2c",
    "mevlid": "#2f7d5e",
    "mevlit": "#2f7d5e",
    "sunnet": "#2a6fb0",
    "sunnetdugunu": "#2a6fb0",
    "nikah": "#7a4ec7",
    "soz": "#d0692f",
    "dogumgunu": "#c93a34",
    "mezuniyet": "#0f8f8f",
    "acilis": "#0f8f8f",
    "toplanti": "#5f6b7a",
    "organizasyon": "#8e2a5f"
  };
  var YEDEK_RENKLER = ["#8e2a5f", "#bf8a2c", "#2a6fb0", "#2f7d5e", "#c93a34", "#7a4ec7", "#d0692f", "#0f8f8f"];
  function anahtarla(s) {
    return String(s).toLocaleLowerCase("tr").replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z]/g, "");
  }
  function turRengi(tur) {
    if (!tur) return "#8d7f86";
    const a = anahtarla(tur);
    if (!a) return "#8d7f86";
    if (TUR_RENK[a]) return TUR_RENK[a];
    let t = 0;
    for (let i = 0; i < a.length; i++) t = t * 31 + a.charCodeAt(i) >>> 0;
    return YEDEK_RENKLER[t % YEDEK_RENKLER.length];
  }
  function okunurRenk(hex) {
    const h = String(hex).replace("#", "");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const d = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const l = 0.2126 * d(r) + 0.7152 * d(g) + 0.0722 * d(b);
    return l > 0.42 ? "#1d1408" : "#ffffff";
  }

  // js/veri.js
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANAHTAR, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  var D = {
    cevrimdisi: false,
    onbellekZamani: null,
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
      "Invalid login credentials": "E-posta veya parola hatal\u0131.",
      "Email not confirmed": "E-posta adresin hen\xFCz do\u011Frulanmam\u0131\u015F. Gelen kutunu kontrol et.",
      "User already registered": "Bu e-posta zaten kay\u0131tl\u0131. Giri\u015F yapmay\u0131 dene.",
      "Password should be at least 6 characters": "Parola en az 6 karakter olmal\u0131.",
      "Failed to fetch": "Sunucuya ula\u015F\u0131lamad\u0131. \u0130nternet ba\u011Flant\u0131n\u0131 kontrol et.",
      "new row violates row-level security policy": "Bu i\u015Flem i\xE7in yetkin yok.",
      "duplicate key value violates unique constraint": "Bu kay\u0131t zaten var."
    };
    for (const [k, v] of Object.entries(eslesme)) if (m.includes(k)) return v;
    return m;
  }
  async function oturum() {
    const { data } = await sb.auth.getSession();
    return data.session ?? null;
  }
  async function girisYap(eposta, parola) {
    const { data, error } = await sb.auth.signInWithPassword({ email: eposta.trim(), password: parola });
    if (error) throw new Error(hataMetni(error));
    return data;
  }
  var gecerliAdres = () => location.protocol === "http:" || location.protocol === "https:" ? location.origin : void 0;
  async function kayitOl(eposta, parola, ad) {
    const secenekler = { data: { ad: (ad || "").trim() } };
    const adres = gecerliAdres();
    if (adres) secenekler.emailRedirectTo = adres;
    const { data, error } = await sb.auth.signUp({
      email: eposta.trim(),
      password: parola,
      options: secenekler
    });
    if (error) throw new Error(hataMetni(error));
    return data;
  }
  async function cikisYap() {
    await sb.auth.signOut();
  }
  async function parolaDegistir(yeni) {
    const { error } = await sb.auth.updateUser({ password: yeni });
    if (error) throw new Error(hataMetni(error));
  }
  async function parolaSifirla(eposta) {
    const adres = gecerliAdres();
    const { error } = await sb.auth.resetPasswordForEmail(eposta.trim(), adres ? { redirectTo: adres } : {});
    if (error) throw new Error(hataMetni(error));
  }
  async function getir(tablo, siralama) {
    let q = sb.from(tablo).select("*");
    if (siralama) q = q.order(siralama.alan, { ascending: siralama.artan !== false });
    const { data, error } = await q;
    if (error) throw new Error(`${tablo}: ${hataMetni(error)}`);
    return data ?? [];
  }
  async function profilYukle(kullaniciId) {
    const { data, error } = await sb.from("profiller").select("*").eq("id", kullaniciId).maybeSingle();
    if (error) throw new Error(hataMetni(error));
    return data;
  }
  async function tumunuYukle() {
    const [defterler, hesaplar, kategoriler, secenekler, kurulum] = await Promise.all([
      getir("defterler", { alan: "sira" }),
      getir("hesaplar", { alan: "sira" }),
      getir("kategoriler", { alan: "sira" }),
      getir("secenekler", { alan: "sira" }),
      sb.from("kurulum").select("*").maybeSingle().then((r) => r.data)
    ]);
    D.defterler = defterler;
    D.hesaplar = hesaplar;
    D.kategoriler = kategoriler;
    D.secenekler = secenekler;
    D.kurulum = kurulum;
    if (!defterler.some((d) => d.kod === D.defter)) D.defter = defterler[0]?.kod ?? "is";
    await defterVerisiYukle();
  }
  async function defterVerisiYukle() {
    const isDefteri = D.defter === "is";
    const [defterler, hesaplar, kategoriler] = await Promise.all([
      getir("defterler", { alan: "sira" }),
      getir("hesaplar", { alan: "sira" }),
      getir("kategoriler", { alan: "sira" })
    ]);
    D.defterler = defterler;
    D.hesaplar = hesaplar;
    D.kategoriler = kategoriler;
    const gorevler = [
      sb.from("hareketler").select("*").eq("defter", D.defter).order("tarih", { ascending: false }).then((r) => r.data ?? []),
      sb.from("v_hesap_bakiye").select("*").eq("defter", D.defter).order("sira").then((r) => r.data ?? [])
    ];
    if (isDefteri) {
      gorevler.push(
        getir("musteriler", { alan: "ad" }),
        getir("cariler", { alan: "ad" }),
        sb.from("organizasyonlar").select("*").order("tarih", { ascending: false }).then((r) => r.data ?? []),
        sb.from("v_organizasyon_ozet").select("*").order("tarih", { ascending: false }).then((r) => r.data ?? []),
        sb.from("v_cari_bakiye").select("*").order("ad").then((r) => r.data ?? [])
      );
    }
    const s = await Promise.all(gorevler);
    D.hareketler = s[0];
    D.hesapBakiye = s[1];
    if (isDefteri) {
      D.musteriler = s[2];
      D.cariler = s[3];
      D.organizasyonlar = s[4];
      D.orgOzet = s[5];
      D.cariBakiye = s[6];
    } else {
      D.musteriler = [];
      D.cariler = [];
      D.organizasyonlar = [];
      D.orgOzet = [];
      D.cariBakiye = [];
    }
  }
  var ONBELLEK = "mks-onbellek-v2";
  var SAKLANAN = [
    "profil",
    "kurulum",
    "defterler",
    "hesaplar",
    "kategoriler",
    "secenekler",
    "musteriler",
    "cariler",
    "organizasyonlar",
    "hareketler",
    "hesapBakiye",
    "cariBakiye",
    "orgOzet"
  ];
  function onbellegeYaz() {
    try {
      const paket = { zaman: Date.now(), defter: D.defter, kullaniciId: D.kullanici?.id, veri: {} };
      for (const a of SAKLANAN) paket.veri[a] = D[a];
      localStorage.setItem(ONBELLEK, JSON.stringify(paket));
    } catch (e) {
    }
  }
  function onbellektenYukle() {
    try {
      const ham = localStorage.getItem(ONBELLEK);
      if (!ham) return false;
      const paket = JSON.parse(ham);
      if (!paket?.veri) return false;
      if (paket.kullaniciId && D.kullanici && paket.kullaniciId !== D.kullanici.id) return false;
      for (const a of SAKLANAN) if (paket.veri[a] !== void 0) D[a] = paket.veri[a];
      if (paket.defter) D.defter = paket.defter;
      D.onbellekZamani = paket.zaman;
      return true;
    } catch (e) {
      return false;
    }
  }
  function cevrimdisiKontrol() {
    if (D.cevrimdisi) {
      throw new Error("\xC7evrimd\u0131\u015F\u0131s\u0131n \u2014 kay\u0131t yap\u0131lamaz. Ba\u011Flant\u0131 gelince tekrar dene.");
    }
  }
  async function yaz(tablo, kayit, id) {
    cevrimdisiKontrol();
    const q = id ? sb.from(tablo).update(kayit).eq("id", id).select().maybeSingle() : sb.from(tablo).insert(kayit).select().maybeSingle();
    const { data, error } = await q;
    if (error) throw new Error(hataMetni(error));
    return data;
  }
  async function sil(tablo, id) {
    cevrimdisiKontrol();
    const { error } = await sb.from(tablo).delete().eq("id", id);
    if (error) throw new Error(hataMetni(error));
  }
  var imzala = (k, id) => id ? k : { ...k, giren: D.kullanici.id };
  var hareketYaz = (k, id) => yaz("hareketler", imzala(k, id), id);
  var hareketSil = (id) => sil("hareketler", id);
  var orgYaz = (k, id) => yaz("organizasyonlar", imzala(k, id), id);
  var orgSil = (id) => sil("organizasyonlar", id);
  var musteriYaz = (k, id) => yaz("musteriler", imzala(k, id), id);
  var musteriSil = (id) => sil("musteriler", id);
  var cariYaz = (k, id) => yaz("cariler", imzala(k, id), id);
  var cariSil = (id) => sil("cariler", id);
  var borcYaz = (k, id) => yaz("borclanmalar", imzala(k, id), id);
  var borcSil = (id) => sil("borclanmalar", id);
  var hesapYaz = (k, id) => yaz("hesaplar", k, id);
  var kategoriYaz = (k, id) => yaz("kategoriler", k, id);
  var kategoriSil = (id) => sil("kategoriler", id);
  var profilYaz = (k, id) => yaz("profiller", k, id);
  function listeyeEkle(anahtar, kayit) {
    if (!kayit) return;
    const liste = D[anahtar];
    if (!Array.isArray(liste)) return;
    if (liste.some((x) => x.id === kayit.id)) return;
    liste.push(kayit);
    liste.sort((a, b) => String(a.ad ?? "").localeCompare(String(b.ad ?? ""), "tr"));
  }
  var defterHesaplari = (kod) => D.hesaplar.filter((h) => h.defter === kod && h.aktif);
  async function aktarmaYaz({
    kaynakDefter,
    kaynakHesapId,
    hedefDefter,
    hedefHesapId,
    tutar,
    tarih,
    aciklama,
    giderMi
  }) {
    cevrimdisiKontrol();
    const isten = kaynakDefter === "is";
    const etiket = giderMi ? "Yevmiye" : isten ? "K\xE2r pay\u0131" : "Sermaye";
    const kaynak = {
      defter: kaynakDefter,
      tarih,
      tutar,
      tur: isten ? giderMi ? "gider" : "cekis" : "cekis",
      hesap_id: kaynakHesapId,
      kategori: isten ? giderMi ? "Sahip yevmiyesi" : "K\xE2r pay\u0131" : "\u0130\u015Fletmeye aktar\u0131m",
      baslik: etiket,
      aciklama: aciklama || null,
      organizasyon_id: null,
      cari_id: null,
      hedef_hesap_id: null
    };
    const hedef = {
      defter: hedefDefter,
      tarih,
      tutar,
      tur: isten ? "gelir" : "giris",
      hesap_id: hedefHesapId,
      kategori: isten ? "D\xFCkkan geliri" : "Sermaye",
      baslik: etiket,
      aciklama: aciklama || null,
      organizasyon_id: null,
      cari_id: null,
      hedef_hesap_id: null
    };
    const a = await yaz("hareketler", imzala(kaynak, null), null);
    let b;
    try {
      b = await yaz("hareketler", imzala({ ...hedef, eslesen_id: a.id }, null), null);
    } catch (e) {
      try {
        await sil("hareketler", a.id);
      } catch (_) {
      }
      throw e;
    }
    await yaz("hareketler", { eslesen_id: b.id }, a.id);
    return { kaynak: a, hedef: b };
  }
  async function aktarmaSil(id, eslesenId) {
    cevrimdisiKontrol();
    if (eslesenId) {
      try {
        await sil("hareketler", eslesenId);
      } catch (_) {
      }
    }
    await sil("hareketler", id);
  }
  async function borclanmalar(cariId) {
    const { data, error } = await sb.from("borclanmalar").select("*").eq("cari_id", cariId).order("tarih", { ascending: false });
    if (error) throw new Error(hataMetni(error));
    return data ?? [];
  }
  async function profiller() {
    const { data, error } = await sb.from("profiller").select("*").order("olusturuldu");
    if (error) throw new Error(hataMetni(error));
    return data ?? [];
  }
  async function defterYaz(kod, k) {
    const { error } = await sb.from("defterler").update(k).eq("kod", kod);
    if (error) throw new Error(hataMetni(error));
  }
  var hesapAdi = (id) => D.hesaplar.find((h) => h.id === id)?.ad ?? "\u2014";
  var musteriAdi = (id) => D.musteriler.find((m) => m.id === id)?.ad ?? "\u2014";
  var cariAdi = (id) => D.cariler.find((c) => c.id === id)?.ad ?? null;
  var orgAdi = (id) => D.organizasyonlar.find((o) => o.id === id)?.ad ?? null;
  var seceneklerGrubu = (g) => D.secenekler.filter((s) => s.grup === g).map((s) => s.ad);
  var kategorilerListesi = (tur) => D.kategoriler.filter((k) => k.defter === D.defter && k.tur === tur && k.aktif).map((k) => k.ad);
  var aktifHesaplar = () => D.hesaplar.filter((h) => h.defter === D.defter && h.aktif);
  var sekmeVar = (kod) => {
    if (!D.profil) return false;
    if (D.profil.rol === "sahip" || D.profil.rol === "yonetici") return true;
    return (D.profil.izinli_sekmeler || []).includes(kod);
  };
  var yetkili = () => D.profil && (D.profil.rol === "sahip" || D.profil.rol === "yonetici");
  var sahip = () => D.profil && D.profil.rol === "sahip";

  // js/ui.js
  var AY_KISA = ["Oca", "\u015Eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011Fu", "Eyl", "Eki", "Kas", "Ara"];
  var AY_UZUN = ["Ocak", "\u015Eubat", "Mart", "Nisan", "May\u0131s", "Haziran", "Temmuz", "A\u011Fustos", "Eyl\xFCl", "Ekim", "Kas\u0131m", "Aral\u0131k"];
  var NUM = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var NUM0 = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
  var sayi = (n) => {
    const x = Number(n);
    return isFinite(x) ? x : 0;
  };
  var para = (n) => NUM.format(sayi(n)) + " \u20BA";
  var paraKisa = (n) => {
    const a = Math.abs(sayi(n));
    if (a >= 1e6) return (Math.round(n / 1e5) / 10).toLocaleString("tr-TR") + " mn";
    if (a >= 1e3) return NUM0.format(Math.round(n / 1e3)) + " bin";
    return NUM0.format(Math.round(n));
  };
  var paraTam = (n) => NUM0.format(Math.round(sayi(n))) + " \u20BA";
  var bugun = () => isoTarih(/* @__PURE__ */ new Date());
  function isoTarih(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function trTarih(iso) {
    if (!iso) return "\u2014";
    const p = String(iso).slice(0, 10).split("-");
    return `${p[2]} ${AY_KISA[Number(p[1]) - 1]}`;
  }
  function trTarihUzun(iso) {
    if (!iso) return "\u2014";
    const p = String(iso).slice(0, 10).split("-");
    return `${p[2]} ${AY_UZUN[Number(p[1]) - 1]} ${p[0]}`;
  }
  function gunFarki(iso) {
    if (!iso) return null;
    return Math.round((/* @__PURE__ */ new Date(iso + "T00:00:00") - /* @__PURE__ */ new Date(bugun() + "T00:00:00")) / 864e5);
  }
  function ayAnahtar(iso) {
    return String(iso).slice(0, 7);
  }
  var GUN_KISA = ["Pzt", "Sal", "\xC7ar", "Per", "Cum", "Cmt", "Paz"];
  var haftaGunu = (d) => (d.getDay() + 6) % 7;
  function ayAdi(anahtar) {
    const [y, m] = anahtar.split("-");
    return `${AY_UZUN[Number(m) - 1]} ${y}`;
  }
  var $ = (s, k = document) => k.querySelector(s);
  function el(etiket, sinif, metin) {
    const e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }
  function kacis(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function bildir(mesaj, tip = "") {
    const kap = $("#bildirimler");
    const b = el("div", "bildirim " + tip, mesaj);
    kap.appendChild(b);
    setTimeout(() => {
      b.style.opacity = "0";
      b.style.transition = "opacity .3s";
    }, 2600);
    setTimeout(() => b.remove(), 3e3);
  }
  var modalDerinlik = 0;
  function modalAc({ baslik, govde, ayak, genislik, kapatilabilir = true }) {
    const d = modalDerinlik === 0 ? $("#modal") : $("#modal2");
    modalDerinlik++;
    const sar = el("div", "mdl");
    if (genislik) sar.style.maxWidth = genislik;
    const basi = el("div", "mdl-basi");
    basi.appendChild(el("h3", "", baslik));
    if (kapatilabilir) {
      const x = el("button", "kapat-x", "\u2715");
      x.type = "button";
      x.setAttribute("aria-label", "Kapat");
      x.onclick = () => kapat();
      basi.appendChild(x);
    }
    sar.appendChild(basi);
    const g = el("div", "mdl-govde");
    if (typeof govde === "string") g.innerHTML = govde;
    else if (govde) g.appendChild(govde);
    sar.appendChild(g);
    if (ayak) {
      const a = el("div", "mdl-ayak");
      if (typeof ayak === "string") a.innerHTML = ayak;
      else a.appendChild(ayak);
      sar.appendChild(a);
    }
    d.innerHTML = "";
    d.appendChild(sar);
    d.showModal();
    function kapat() {
      try {
        d.close();
      } catch (_) {
      }
    }
    d.addEventListener("cancel", (e) => {
      if (!kapatilabilir) e.preventDefault();
    }, { once: true });
    d.addEventListener("close", () => {
      modalDerinlik = Math.max(0, modalDerinlik - 1);
      d.innerHTML = "";
    }, { once: true });
    return { govde: g, kapat, kok: sar };
  }
  function onayla(baslik, metin, eylemEtiketi = "Devam et", tehlikeli = true) {
    return new Promise((coz) => {
      let cevap = false;
      const ayak = el("div");
      const vazgec = el("button", "btn", "Vazge\xE7");
      const tamam = el("button", "btn " + (tehlikeli ? "tehlike" : "ana"), eylemEtiketi);
      ayak.append(vazgec, tamam);
      const govde = `<p style="margin:0;color:var(--ink2)">${kacis(metin).replace(/\n/g, "<br>")}</p>`;
      const m = modalAc({ baslik, govde, ayak });
      vazgec.onclick = () => {
        cevap = false;
        m.kapat();
        coz(false);
      };
      tamam.onclick = () => {
        cevap = true;
        m.kapat();
        coz(true);
      };
      m.kok.closest("dialog").addEventListener("close", () => {
        if (!cevap) coz(false);
      }, { once: true });
    });
  }
  var ipucuEl = null;
  function ipucuGoster(olay, baslik, satirlar) {
    if (!ipucuEl) {
      ipucuEl = el("div", "ipucu");
      document.body.appendChild(ipucuEl);
    }
    ipucuEl.innerHTML = `<div class="b">${kacis(baslik)}</div>` + satirlar.map(
      ([a, b, renk]) => `<div class="s"><span>${kacis(a)}</span><b${renk ? ` style="color:${renk}"` : ""}>${kacis(b)}</b></div>`
    ).join("");
    ipucuEl.classList.add("acik");
    const g = ipucuEl.offsetWidth || 170;
    const x = Math.min(Math.max(olay.clientX, g / 2 + 8), window.innerWidth - g / 2 - 8);
    const altta = olay.clientY < 170;
    ipucuEl.style.transform = altta ? "translate(-50%, 16px)" : "translate(-50%, calc(-100% - 14px))";
    ipucuEl.style.left = x + "px";
    ipucuEl.style.top = olay.clientY + "px";
  }
  function ipucuGizle() {
    if (ipucuEl) ipucuEl.classList.remove("acik");
  }
  function ozetSerit(kutular) {
    const s = el("div", "ozet-serit");
    for (const k of kutular) {
      const h = el("div", "ozet-h");
      h.appendChild(el("span", "etiket", k.etiket));
      h.appendChild(el("span", "s " + (k.renk || ""), k.deger));
      if (k.alt) h.appendChild(el("span", "a", k.alt));
      s.appendChild(h);
    }
    return s;
  }
  function bosDurum(baslik, aciklama) {
    const b = el("div", "bos");
    b.appendChild(el("strong", "", baslik));
    if (aciklama) b.appendChild(el("div", "", aciklama));
    return b;
  }
  function ibanBicim(s) {
    const t = String(s ?? "").replace(/\s+/g, "").toLocaleUpperCase("tr");
    return t.replace(/(.{4})/g, "$1 ").trim();
  }
  async function panoyaKopyala(metin) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(metin);
        return true;
      }
    } catch (_) {
    }
    try {
      const t = document.createElement("textarea");
      t.value = metin;
      t.setAttribute("readonly", "");
      t.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand("copy");
      t.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  // js/ekranlar.js
  var U = {
    donem: "buAy",
    tur: "tumu",
    arama: "",
    katTur: "gider",
    kapali: false,
    orgFiltre: "aktif",
    takvimAy: null
    // "YYYY-MM"; boşsa içinde bulunulan ay
  };
  var yenile = () => {
  };
  function yenilemeyiAyarla(fn) {
    yenile = fn;
  }
  var acikSayfa = null;
  var sayfaVar = () => !!acikSayfa;
  function sayfaCiz() {
    return acikSayfa ? acikSayfa() : el("div");
  }
  function sayfaAc(ciz) {
    acikSayfa = ciz;
    try {
      history.pushState({ mks: 1 }, "");
    } catch (_) {
    }
    yenile();
    window.scrollTo(0, 0);
  }
  function sayfaKapat() {
    acikSayfa = null;
    yenile();
    window.scrollTo(0, 0);
  }
  function sayfaTemizle() {
    acikSayfa = null;
  }
  function sayfaBasi(ustEtiket, baslik, eylemler) {
    const sar = el("div");
    const geri = el("button", "geri");
    geri.type = "button";
    geri.innerHTML = "<span aria-hidden='true'>\u2190</span> Geri";
    geri.onclick = () => sayfaKapat();
    sar.appendChild(geri);
    const bas = el("div", "ekran-basi");
    const sol = el("div");
    if (ustEtiket) sol.appendChild(el("span", "ust-etiket", ustEtiket));
    sol.appendChild(el("h2", "", baslik));
    bas.appendChild(sol);
    if (eylemler?.length) {
      const sag = el("div", "sag");
      eylemler.forEach((e) => sag.appendChild(e));
      bas.appendChild(sag);
    }
    sar.appendChild(bas);
    return sar;
  }
  function aralik() {
    const d = /* @__PURE__ */ new Date(), y = d.getFullYear(), m = d.getMonth();
    const i = (dt) => isoTarih(dt);
    switch (U.donem) {
      case "buAy":
        return [i(new Date(y, m, 1)), i(new Date(y, m + 1, 0))];
      case "gecenAy":
        return [i(new Date(y, m - 1, 1)), i(new Date(y, m, 0))];
      case "son3":
        return [i(new Date(y, m - 2, 1)), i(new Date(y, m + 1, 0))];
      case "buYil":
        return [`${y}-01-01`, `${y}-12-31`];
      default:
        return ["0000-01-01", "9999-12-31"];
    }
  }
  function donemAdi() {
    const d = /* @__PURE__ */ new Date();
    switch (U.donem) {
      case "buAy":
        return `${AY_UZUN[d.getMonth()]} ${d.getFullYear()}`;
      case "gecenAy": {
        const g = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        return `${AY_UZUN[g.getMonth()]} ${g.getFullYear()}`;
      }
      case "son3":
        return "Son 3 ay";
      case "buYil":
        return `${d.getFullYear()} y\u0131l\u0131`;
      default:
        return "T\xFCm zamanlar";
    }
  }
  function donemSecici(deg) {
    const s = el("select");
    s.setAttribute("aria-label", "D\xF6nem");
    [["buAy", "Bu ay"], ["gecenAy", "Ge\xE7en ay"], ["son3", "Son 3 ay"], ["buYil", "Bu y\u0131l"], ["tumu", "T\xFCm zamanlar"]].forEach(([k, a]) => {
      const o = el("option", "", a);
      o.value = k;
      s.appendChild(o);
    });
    s.value = U.donem;
    s.onchange = () => {
      U.donem = s.value;
      deg();
    };
    return s;
  }
  var donemHareketleri = () => {
    const [b, s] = aralik();
    return D.hareketler.filter((h) => h.tarih >= b && h.tarih <= s);
  };
  var toplaTur = (liste, tur) => liste.filter((h) => h.tur === tur).reduce((t, h) => t + sayi(h.tutar), 0);
  function panel() {
    const k = el("div", "yigin");
    const isDefteri = D.defter === "is";
    const bas = el("div", "ekran-basi");
    const sol = el("div");
    sol.appendChild(el("span", "ust-etiket", isDefteri ? "MKS Organizasyon" : "Ki\u015Fisel defter"));
    sol.appendChild(el("h2", "", isDefteri ? "Ana Sayfa" : "Ki\u015Fisel Ana Sayfa"));
    bas.appendChild(sol);
    const sag = el("div", "sag");
    const araB = el("button", "ara-btn");
    araB.type = "button";
    araB.title = "Ara";
    araB.setAttribute("aria-label", "Ara");
    araB.textContent = "\u{1F50D}";
    araB.onclick = () => aramaAc();
    sag.appendChild(araB);
    bas.appendChild(sag);
    k.appendChild(bas);
    k.appendChild(hizliSatir(isDefteri));
    if (isDefteri) {
      k.appendChild(takvim());
      k.appendChild(bekleyenTahsilatlar());
    } else {
      k.appendChild(bolum(
        "Son hareketler",
        D.hareketler.slice(0, 8).map(hareketSatiri),
        sekmeVar("kasa") ? { ad: "T\xFCm\xFC", git: () => git("kasa") } : null
      ));
    }
    return k;
  }
  function hizliSatir(isDefteri) {
    const s = el("div", "hizli");
    const d = (ikon, sinif, ad, alt, tikla) => {
      const b = el("button");
      b.type = "button";
      const y = el("div", "yuvarlak " + sinif, ikon);
      const m = el("div", "met");
      m.appendChild(el("b", "", ad));
      m.appendChild(el("span", "", alt));
      b.append(y, m);
      b.onclick = tikla;
      return b;
    };
    if (isDefteri && sekmeVar("organizasyonlar")) {
      s.appendChild(d("\u{1F389}", "", "Yeni Organizasyon", "D\xFC\u011F\xFCn, ni\u015Fan, k\u0131na\u2026", () => orgFormu(null)));
    }
    s.appendChild(d("\u20BA", "g", "Gelir / Gider Ekle", "Kasaya kay\u0131t gir", () => hareketFormu(null)));
    if (isDefteri && sekmeVar("cariler")) {
      s.appendChild(d("\u{1F91D}", "a", "Yeni Cari", "Tedarik\xE7i veya \xE7al\u0131\u015Fan", () => cariFormu(null)));
    }
    s.appendChild(d("\u21C4", "b", "Para Aktarma", "Hesaplar aras\u0131 transfer", () => transferFormu(null)));
    if (sahip()) {
      s.appendChild(d("\u21E2", "a", "Kendime Aktar", "D\xFCkkandan ki\u015Fisele", () => kendimeAktarFormu()));
    }
    return s;
  }
  function takvimAyi() {
    if (U.takvimAy) {
      const [y, m] = U.takvimAy.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const d = /* @__PURE__ */ new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  function takvimAyiKaydir(fark) {
    const a = takvimAyi();
    const y = new Date(a.getFullYear(), a.getMonth() + fark, 1);
    U.takvimAy = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}`;
    yenile();
  }
  function gununIsleri(iso) {
    return D.orgOzet.filter((o) => o.tarih === iso && o.durum !== "\u0130ptal").sort((a, b) => (a.ad || "").localeCompare(b.ad || "", "tr"));
  }
  function kisaAd(o) {
    const ad = String(o.ad || "").trim();
    const musteri = musteriAdi(o.musteri_id);
    const secim = ad || (musteri !== "\u2014" ? musteri : "\u0130\u015F");
    return secim.length > 16 ? secim.slice(0, 15) + "\u2026" : secim;
  }
  function takvim() {
    const ay = takvimAyi();
    const yil = ay.getFullYear(), no = ay.getMonth();
    const bugunIso = bugun();
    const s = el("section", "panel takvim");
    const b = el("div", "tk-basi");
    b.appendChild(el("h3", "", `${AY_UZUN[no]} ${yil}`));
    const oklar = el("div", "tk-oklar");
    const geri = el("button", "tk-ok", "\u2039");
    geri.type = "button";
    geri.setAttribute("aria-label", "\xD6nceki ay");
    geri.onclick = () => takvimAyiKaydir(-1);
    const buAy = el("button", "btn sade kucuk", "Bug\xFCn");
    buAy.onclick = () => {
      U.takvimAy = null;
      yenile();
    };
    const ileri = el("button", "tk-ok", "\u203A");
    ileri.type = "button";
    ileri.setAttribute("aria-label", "Sonraki ay");
    ileri.onclick = () => takvimAyiKaydir(1);
    oklar.append(geri, buAy, ileri);
    b.appendChild(oklar);
    s.appendChild(b);
    const gadlari = el("div", "tk-gunadlari");
    GUN_KISA.forEach((g) => gadlari.appendChild(el("span", "", g)));
    s.appendChild(gadlari);
    const izgara = el("div", "tk-izgara");
    const oncesi = haftaGunu(new Date(yil, no, 1));
    for (let i = 0; i < oncesi; i++) izgara.appendChild(el("div", "tk-gun bos-gun"));
    const gunSayisi = new Date(yil, no + 1, 0).getDate();
    const dar = window.matchMedia("(max-width:759px)").matches;
    const enFazla = 3;
    for (let g = 1; g <= gunSayisi; g++) {
      const iso = `${yil}-${String(no + 1).padStart(2, "0")}-${String(g).padStart(2, "0")}`;
      const isler = gununIsleri(iso);
      const hs = haftaGunu(new Date(yil, no, g)) >= 5;
      const h = el("button", "tk-gun" + (iso === bugunIso ? " bugun" : "") + (hs ? " hafta-sonu" : ""));
      h.type = "button";
      h.setAttribute("aria-label", `${g} ${AY_UZUN[no]} \u2014 ${isler.length} i\u015F`);
      h.appendChild(el("div", "n", String(g)));
      if (dar && isler.length) {
        const n = el("div", "tk-nokta");
        isler.slice(0, 6).forEach((o) => {
          const i = el("i");
          i.style.background = turRengi(o.tur);
          n.appendChild(i);
        });
        h.appendChild(n);
        h.appendChild(el("div", "tk-daha", `${isler.length} i\u015F`));
        h.title = isler.map((o) => o.ad).join(", ");
      } else {
        isler.slice(0, enFazla).forEach((o) => {
          const e = el("div", "tk-is", kisaAd(o));
          const renk = turRengi(o.tur);
          e.style.background = renk;
          e.style.color = okunurRenk(renk);
          e.title = `${o.ad} \xB7 ${o.tur || "\u2014"}`;
          h.appendChild(e);
        });
        if (isler.length > enFazla) h.appendChild(el("div", "tk-daha", `+${isler.length - enFazla} daha`));
      }
      h.onclick = () => sayfaAc(() => gunSayfasi(iso));
      izgara.appendChild(h);
    }
    s.appendChild(izgara);
    return s;
  }
  function gunSayfasi(iso) {
    const k = el("div", "yigin");
    const isler = gununIsleri(iso);
    const ekle = el("button", "btn ana kucuk", "+ Ekle");
    ekle.onclick = () => orgFormu(null, { tarih: iso });
    k.appendChild(sayfaBasi("Takvim", trTarihUzun(iso), sekmeVar("organizasyonlar") ? [ekle] : []));
    const s = el("section", "panel liste");
    if (!isler.length) {
      s.appendChild(bosDurum(
        "Bu g\xFCnde i\u015F yok",
        sekmeVar("organizasyonlar") ? "Sa\u011F \xFCstteki + Ekle ile bu g\xFCne i\u015F girebilirsin." : null
      ));
    } else {
      isler.forEach((o) => {
        const ham = D.organizasyonlar.find((x) => x.id === o.organizasyon_id);
        const r = butonSatir(() => orgDetay(o.organizasyon_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", o.ad));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "", musteriAdi(o.musteri_id)));
        if (o.tur) {
          const t = el("span", "rozet", o.tur);
          const rk = turRengi(o.tur);
          t.style.cssText = `background:${rk};color:${okunurRenk(rk)};border-color:transparent`;
          alt.appendChild(t);
        }
        if (ham?.saat) alt.appendChild(el("span", "", "\xB7 " + ham.saat));
        if (ham?.mekan) alt.appendChild(el("span", "", "\xB7 " + ham.mekan));
        alt.appendChild(el("span", "rozet " + durumSinifi(o.durum), o.durum));
        sol.appendChild(alt);
        const sag = el("div");
        sag.appendChild(el("div", "tutar", paraTam(o.toplam_ucret)));
        if (sayi(o.kalan_odeme) > 0) {
          const kal = el("div", "tarih", paraTam(o.kalan_odeme) + " kalan");
          kal.style.color = "var(--uyari-ink)";
          sag.appendChild(kal);
        }
        r.append(sol, sag);
        s.appendChild(r);
      });
    }
    k.appendChild(s);
    const gunlukH = D.hareketler.filter((h) => h.tarih === iso);
    if (gunlukH.length) {
      k.appendChild(bolum(`O g\xFCn\xFCn kasa hareketleri (${gunlukH.length})`, gunlukH.map(hareketSatiri)));
    }
    return k;
  }
  function bekleyenTahsilatlar() {
    const bekleyen = D.orgOzet.filter((o) => sayi(o.kalan_odeme) > 4e-3 && o.durum !== "\u0130ptal").sort((a, b2) => sayi(b2.kalan_odeme) - sayi(a.kalan_odeme));
    const toplam = bekleyen.reduce((t, o) => t + sayi(o.kalan_odeme), 0);
    const s = el("section", "panel");
    const b = el("div", "grafik-basi");
    b.style.padding = "14px 14px 4px";
    b.appendChild(el("h3", "", "Bekleyen tahsilatlar"));
    if (bekleyen.length) {
      const t = el("div", "bn");
      t.style.cssText = "font-size:23px;color:var(--uyari-ink)";
      t.textContent = paraTam(toplam);
      b.appendChild(t);
    }
    s.appendChild(b);
    const l = el("div", "liste");
    if (!bekleyen.length) {
      l.appendChild(bosDurum("Bekleyen tahsilat yok", "T\xFCm i\u015Flerin \xFCcreti tahsil edilmi\u015F."));
    } else {
      const bugunIso = bugun();
      bekleyen.slice(0, 12).forEach((o) => {
        const r = butonSatir(() => orgDetay(o.organizasyon_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", o.ad));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "", musteriAdi(o.musteri_id)));
        alt.appendChild(el("span", "", "\xB7 " + trTarihUzun(o.tarih)));
        if (o.tarih && o.tarih < bugunIso) alt.appendChild(el("span", "rozet kotu", "vadesi ge\xE7ti"));
        sol.appendChild(alt);
        const sag = el("div");
        sag.appendChild(el("div", "tutar k", paraTam(o.kalan_odeme)));
        sag.appendChild(el("div", "tarih", `${paraTam(o.tahsil_edilen)} / ${paraTam(o.toplam_ucret)}`));
        r.append(sol, sag);
        l.appendChild(r);
      });
      if (bekleyen.length > 12) {
        l.appendChild(el("div", "grup-basi", `ve ${bekleyen.length - 12} i\u015F daha`));
      }
    }
    s.appendChild(l);
    return s;
  }
  function aramaAc() {
    const g = el("div", "arama-kutu");
    const gir = el("input");
    gir.type = "search";
    gir.placeholder = "\u0130\u015F, m\xFC\u015Fteri, cari veya kasa kayd\u0131 ara\u2026";
    gir.setAttribute("aria-label", "Ara");
    gir.value = "";
    g.appendChild(gir);
    const sonuc = el("div", "arama-sonuc");
    g.appendChild(sonuc);
    const m = modalAc({ baslik: "Ara", govde: g });
    setTimeout(() => gir.focus(), 60);
    function grup(baslik, satirlar) {
      if (!satirlar.length) return;
      sonuc.appendChild(el("div", "grup-basi", baslik));
      const l = el("div", "liste");
      satirlar.forEach((s) => l.appendChild(s));
      sonuc.appendChild(l);
    }
    function ciz() {
      const q = gir.value.trim().toLocaleLowerCase("tr");
      sonuc.innerHTML = "";
      if (q.length < 2) {
        sonuc.appendChild(bosDurum("En az 2 harf yaz", "\u0130\u015Fler, m\xFC\u015Fteriler, cariler ve kasa kay\u0131tlar\u0131 aran\u0131r."));
        return;
      }
      const ic = (...p) => p.filter(Boolean).join(" ").toLocaleLowerCase("tr").includes(q);
      let toplam = 0;
      const isler = D.orgOzet.filter((o) => ic(o.ad, musteriAdi(o.musteri_id), o.tur, o.durum)).slice(0, 8);
      toplam += isler.length;
      grup("\u0130\u015Fler", isler.map((o) => {
        const r = butonSatir(() => {
          m.kapat();
          orgDetay(o.organizasyon_id);
        });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", o.ad));
        sol.appendChild(el("div", "alt", `${musteriAdi(o.musteri_id)} \xB7 ${trTarihUzun(o.tarih)}`));
        r.append(sol, el("div", "tutar", paraTam(o.toplam_ucret)));
        return r;
      }));
      const mus = D.musteriler.filter((x) => ic(x.ad, x.telefon)).slice(0, 6);
      toplam += mus.length;
      grup("M\xFC\u015Fteriler", mus.map((x) => {
        const adet = D.orgOzet.filter((o) => o.musteri_id === x.id).length;
        const r = butonSatir(() => {
          m.kapat();
          musteriDetay(x.id);
        });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", x.ad));
        sol.appendChild(el("div", "alt", x.telefon || `${adet} i\u015F`));
        r.append(sol, el("div", "tarih", `${adet} i\u015F`));
        return r;
      }));
      const car = D.cariBakiye.filter((c) => ic(c.ad, c.tur, c.telefon)).slice(0, 6);
      toplam += car.length;
      grup("Cariler", car.map((c) => {
        const r = butonSatir(() => {
          m.kapat();
          cariDetay(c.cari_id);
        });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", c.ad));
        sol.appendChild(el("div", "alt", c.tur || "Di\u011Fer"));
        const b = sayi(c.bakiye);
        r.append(sol, el("div", "tutar " + (b > 4e-3 ? "k" : ""), b > 4e-3 ? paraTam(b) : "\u2014"));
        return r;
      }));
      const har = D.hareketler.filter((h) => ic(
        h.baslik,
        h.aciklama,
        h.kategori,
        hesapAdi(h.hesap_id),
        orgAdi(h.organizasyon_id),
        cariAdi(h.cari_id)
      )).slice(0, 12);
      toplam += har.length;
      grup("Kasa hareketleri", har.map((h) => {
        const r = hareketSatiri(h);
        const eski = r.onclick;
        r.onclick = () => {
          m.kapat();
          eski();
        };
        return r;
      }));
      if (!toplam) sonuc.appendChild(bosDurum("Sonu\xE7 yok", `"${gir.value.trim()}" i\xE7in kay\u0131t bulunamad\u0131.`));
    }
    gir.oninput = ciz;
    ciz();
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
    cocuklar.forEach((c) => l.appendChild(c));
    s.appendChild(l);
    return s;
  }
  function butonSatir(tikla) {
    const r = el("button", "satir");
    r.type = "button";
    r.onclick = tikla;
    return r;
  }
  var git = () => {
  };
  function gitAyarla(fn) {
    git = fn;
  }
  function hareketSatiri(h) {
    if (h.tur === "transfer") return transferSatiri(h);
    if (h.tur === "cekis" || h.tur === "giris") return aktarmaSatiri(h);
    const r = butonSatir(() => hareketFormu(h));
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.baslik || h.aciklama || h.kategori));
    const alt = el("div", "alt");
    alt.appendChild(el("span", "", h.kategori));
    const on = orgAdi(h.organizasyon_id);
    if (on) alt.appendChild(el("span", "rozet vurgu", on));
    const cn = cariAdi(h.cari_id);
    if (cn) alt.appendChild(el("span", "", "\xB7 " + cn));
    sol.appendChild(alt);
    const sag = el("div");
    sag.appendChild(el(
      "div",
      "tutar " + (h.tur === "gelir" ? "g" : "k"),
      (h.tur === "gelir" ? "+" : "\u2212") + para(h.tutar)
    ));
    sag.appendChild(el("div", "tarih", trTarih(h.tarih) + " \xB7 " + hesapAdi(h.hesap_id)));
    r.append(sol, sag);
    return r;
  }
  function transferSatiri(h) {
    const r = butonSatir(() => transferFormu(h));
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.baslik || "Para aktarma"));
    const alt = el("div", "alt");
    alt.appendChild(el("span", "rozet bilgi", "Transfer"));
    alt.appendChild(el("span", "", `${hesapAdi(h.hesap_id)} \u2192 ${hesapAdi(h.hedef_hesap_id)}`));
    sol.appendChild(alt);
    const sag = el("div");
    sag.appendChild(el("div", "tutar t", para(h.tutar)));
    sag.appendChild(el("div", "tarih", trTarih(h.tarih)));
    r.append(sol, sag);
    return r;
  }
  function aktarmaSatiri(h) {
    const cikan = h.tur === "cekis";
    const r = butonSatir(() => aktarmaDetay(h));
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.baslik || (cikan ? "\xC7eki\u015F" : "Sermaye")));
    const alt = el("div", "alt");
    alt.appendChild(el("span", "rozet bilgi", cikan ? "\xC7eki\u015F" : "Sermaye"));
    alt.appendChild(el("span", "", h.kategori));
    sol.appendChild(alt);
    const sag = el("div");
    sag.appendChild(el("div", "tutar t", (cikan ? "\u2212" : "+") + para(h.tutar)));
    sag.appendChild(el("div", "tarih", trTarih(h.tarih) + " \xB7 " + hesapAdi(h.hesap_id)));
    r.append(sol, sag);
    return r;
  }
  function hesabaEtki(h, hesapId) {
    if (h.tur === "transfer") {
      if (h.hesap_id === hesapId) return -sayi(h.tutar);
      if (h.hedef_hesap_id === hesapId) return sayi(h.tutar);
      return 0;
    }
    if (h.hesap_id !== hesapId) return 0;
    return h.tur === "gelir" || h.tur === "giris" ? sayi(h.tutar) : -sayi(h.tutar);
  }
  function kasa() {
    const k = el("div", "yigin");
    const bas = el("div", "ekran-basi");
    const sol = el("div");
    sol.appendChild(el("span", "ust-etiket", "Para"));
    sol.appendChild(el("h2", "", "Kasa"));
    bas.appendChild(sol);
    const sag = el("div", "sag");
    const aktar = el("button", "btn kucuk", "\u21C4 Para Aktarma");
    aktar.onclick = () => transferFormu(null);
    sag.appendChild(aktar);
    if (sahip()) {
      const kendime = el("button", "btn kucuk", "\u21E2 Kendime aktar");
      kendime.onclick = () => kendimeAktarFormu();
      sag.appendChild(kendime);
    }
    const ekle = el("button", "btn ana kucuk", "+ Kay\u0131t");
    ekle.onclick = () => hareketFormu(null);
    sag.appendChild(ekle);
    bas.appendChild(sag);
    k.appendChild(bas);
    const donemF = el("div", "filtreler");
    donemF.appendChild(donemSecici(yenile));
    k.appendChild(donemF);
    const ozet = el("div");
    k.appendChild(ozet);
    const hb = D.hesapBakiye.filter((h) => h.aktif);
    const toplamB = hb.reduce((t, h) => t + sayi(h.bakiye), 0);
    const hbBasi = el("div", "grafik-basi");
    hbBasi.style.margin = "2px 0 0";
    hbBasi.appendChild(el("h3", "", "Hesaplar"));
    const tt = el("div", "bn");
    tt.style.cssText = "font-size:24px";
    tt.textContent = "Toplam " + paraTam(toplamB);
    hbBasi.appendChild(tt);
    k.appendChild(hbBasi);
    const kartlar = el("div", "hesap-kartlar");
    hb.forEach((h) => kartlar.appendChild(hesapKarti(h)));
    if (yetkili()) kartlar.appendChild(hesapEklemeKarti());
    if (!hb.length && !yetkili()) {
      const bk = el("section", "panel");
      bk.appendChild(bosDurum("Hesap yok", "Y\xF6neticinin hesap tan\u0131mlamas\u0131 gerekiyor."));
      k.appendChild(bk);
    } else {
      k.appendChild(kartlar);
    }
    const hBasi = el("div", "grafik-basi");
    hBasi.style.margin = "4px 0 0";
    hBasi.appendChild(el("h3", "", "Kasa hareketleri"));
    k.appendChild(hBasi);
    const f = el("div", "filtreler");
    const seg = el("div", "segment");
    [["tumu", "Hepsi", ""], ["gelir", "Gelir", "g"], ["gider", "Gider", "k"], ["transfer", "Transfer", "t"]].forEach(([kod, ad, sn]) => {
      const b = el("button", sn, ad);
      b.type = "button";
      b.setAttribute("aria-pressed", String(U.tur === kod));
      b.onclick = () => {
        U.tur = kod;
        yenile();
      };
      seg.appendChild(b);
    });
    f.appendChild(seg);
    const ara = el("div", "ara");
    const ai = el("input");
    ai.type = "search";
    ai.placeholder = "Ara\u2026";
    ai.value = U.arama;
    ai.setAttribute("aria-label", "Kay\u0131tlarda ara");
    ai.oninput = () => {
      U.arama = ai.value;
      listeCiz();
    };
    ara.appendChild(ai);
    f.appendChild(ara);
    k.appendChild(f);
    const kutu = el("section", "panel liste");
    k.appendChild(kutu);
    function listeCiz() {
      const [b, s] = aralik();
      const q = U.arama.toLocaleLowerCase("tr");
      const liste = D.hareketler.filter((h) => {
        if (h.tarih < b || h.tarih > s) return false;
        if (U.tur !== "tumu" && h.tur !== U.tur) return false;
        if (q) {
          const metin = [
            h.baslik,
            h.aciklama,
            h.kategori,
            hesapAdi(h.hesap_id),
            h.hedef_hesap_id ? hesapAdi(h.hedef_hesap_id) : null,
            orgAdi(h.organizasyon_id),
            cariAdi(h.cari_id)
          ].filter(Boolean).join(" ").toLocaleLowerCase("tr");
          if (!metin.includes(q)) return false;
        }
        return true;
      });
      const donemliste = D.hareketler.filter((h) => h.tarih >= b && h.tarih <= s);
      const gelir = toplaTur(donemliste, "gelir"), gider = toplaTur(donemliste, "gider");
      const trAdet = donemliste.filter((h) => h.tur === "transfer").length;
      ozet.innerHTML = "";
      ozet.appendChild(ozetSerit([
        { etiket: "Gelir", deger: paraTam(gelir), renk: "g", alt: donemAdi() },
        { etiket: "Gider", deger: paraTam(gider), renk: "k", alt: donemAdi() },
        {
          etiket: "Net",
          deger: paraTam(gelir - gider),
          renk: gelir - gider < 0 ? "k" : "g",
          alt: gelir - gider < 0 ? "Zarar" : gelir - gider > 0 ? "K\xE2r" : "Ba\u015Faba\u015F"
        },
        {
          etiket: "Kay\u0131t",
          deger: String(donemliste.length),
          alt: trAdet ? `${trAdet} transfer d\xE2hil` : "bu d\xF6nemde"
        }
      ]));
      kutu.innerHTML = "";
      if (!liste.length) {
        kutu.appendChild(bosDurum(
          D.hareketler.length ? "Bu filtreye uyan kay\u0131t yok" : "Hen\xFCz kay\u0131t yok",
          D.hareketler.length ? "D\xF6nemi veya filtreyi de\u011Fi\u015Ftir." : "+ Kay\u0131t ile ilk kayd\u0131n\u0131 ekle."
        ));
        return;
      }
      let sonAy = null;
      liste.forEach((h) => {
        const a = ayAnahtar(h.tarih);
        if (a !== sonAy) {
          sonAy = a;
          kutu.appendChild(el("div", "grup-basi", ayAdi(a)));
        }
        kutu.appendChild(hareketSatiri(h));
      });
    }
    listeCiz();
    return k;
  }
  function hesapEklemeKarti() {
    const kart = el("button", "hesap-k ekle");
    kart.type = "button";
    kart.setAttribute("aria-label", "Yeni hesap ekle");
    kart.appendChild(el("div", "arti", "+"));
    kart.appendChild(el("div", "yzi", "Yeni Hesap Ekle"));
    kart.onclick = () => hesapFormu(null);
    return kart;
  }
  function hesapKarti(h) {
    const kart = el("button", "hesap-k");
    kart.type = "button";
    const ust = el("div", "ust-s");
    const ad = el("div", "ad");
    const im = el("span", "im" + (h.tur === "nakit" ? " n" : ""), h.tur === "nakit" ? "\u20BA" : "\u{1F3E6}");
    ad.append(im, el("span", "", h.ad));
    const bak = el("div", "bak" + (sayi(h.bakiye) < 0 ? " k" : ""), paraTam(h.bakiye));
    ust.append(ad, bak);
    kart.appendChild(ust);
    if (h.tur !== "nakit" && h.iban) {
      const sat = el("div", "iban-satir");
      sat.appendChild(el("span", "no", ibanBicim(h.iban)));
      const kop = el("button", "kopyala", "Kopyala");
      kop.type = "button";
      kop.setAttribute("aria-label", `${h.ad} IBAN'\u0131n\u0131 kopyala`);
      kop.onclick = async (e) => {
        e.stopPropagation();
        const ok = await panoyaKopyala(ibanBicim(h.iban));
        bildir(ok ? "IBAN kopyaland\u0131" : "Kopyalanamad\u0131", ok ? "iyi" : "kotu");
      };
      sat.appendChild(kop);
      kart.appendChild(sat);
    } else {
      const alt = el("div", "iban-satir");
      const y = el(
        "span",
        "no",
        h.tur === "nakit" ? "Nakit kasa" : "IBAN girilmemi\u015F \u2014 Ayarlar'dan ekleyebilirsin"
      );
      y.style.fontFamily = "var(--f-govde)";
      alt.appendChild(y);
      kart.appendChild(alt);
    }
    kart.onclick = () => sayfaAc(() => hesapDetay(h.hesap_id));
    return kart;
  }
  function hesapDetay(hesapId) {
    const h = D.hesapBakiye.find((x) => x.hesap_id === hesapId);
    const ham = D.hesaplar.find((x) => x.id === hesapId);
    const k = el("div", "yigin");
    if (!h || !ham) {
      k.appendChild(bosDurum("Hesap bulunamad\u0131"));
      return k;
    }
    const ekle = el("button", "btn ana kucuk", "+ Kay\u0131t");
    ekle.onclick = () => hareketFormu(null, { hesap_id: hesapId });
    const aktar = el("button", "btn kucuk", "\u21C4 Aktar");
    aktar.onclick = () => transferFormu(null, { hesap_id: hesapId });
    k.appendChild(sayfaBasi(ham.tur === "nakit" ? "Nakit kasa" : "Banka hesab\u0131", ham.ad, [aktar, ekle]));
    const hepsi = D.hareketler.filter((x) => x.hesap_id === hesapId || x.hedef_hesap_id === hesapId).sort((a, b2) => a.tarih < b2.tarih ? 1 : -1);
    const giren = hepsi.reduce((t, x) => {
      const e = hesabaEtki(x, hesapId);
      return e > 0 ? t + e : t;
    }, 0);
    const cikan = hepsi.reduce((t, x) => {
      const e = hesabaEtki(x, hesapId);
      return e < 0 ? t - e : t;
    }, 0);
    k.appendChild(ozetSerit([
      { etiket: "A\xE7\u0131l\u0131\u015F", deger: paraTam(ham.acilis_bakiye) },
      { etiket: "Toplam giren", deger: paraTam(giren), renk: "g" },
      { etiket: "Toplam \xE7\u0131kan", deger: paraTam(cikan), renk: "k" },
      { etiket: "G\xFCncel bakiye", deger: paraTam(h.bakiye), renk: sayi(h.bakiye) < 0 ? "k" : "" }
    ]));
    if (ham.tur !== "nakit") {
      const ib = el("section", "panel");
      const iv = el("div", "detay-satir");
      iv.appendChild(el("div", "e", "IBAN"));
      const sagI = el("div", "d");
      if (ham.iban) {
        sagI.style.cssText = "display:flex;align-items:center;gap:9px;font-family:var(--f-sayi);font-size:13px";
        sagI.appendChild(el("span", "", ibanBicim(ham.iban)));
        const kop = el("button", "kopyala", "Kopyala");
        kop.type = "button";
        kop.onclick = async () => {
          const ok = await panoyaKopyala(ibanBicim(ham.iban));
          bildir(ok ? "IBAN kopyaland\u0131" : "Kopyalanamad\u0131", ok ? "iyi" : "kotu");
        };
        sagI.appendChild(kop);
      } else {
        sagI.style.color = "var(--ink3)";
        sagI.textContent = "girilmemi\u015F";
      }
      iv.appendChild(sagI);
      ib.appendChild(iv);
      const dv = el("div", "detay-satir");
      dv.appendChild(el("div", "e", "Durum"));
      dv.appendChild(el("div", "d", ham.aktif ? "Kullan\u0131mda" : "Kapal\u0131"));
      ib.appendChild(dv);
      k.appendChild(ib);
    }
    const s = el("section", "panel");
    const b = el("div", "grafik-basi");
    b.style.padding = "14px 14px 4px";
    b.appendChild(el("h3", "", `Hareketler (${hepsi.length})`));
    s.appendChild(b);
    const l = el("div", "liste");
    if (!hepsi.length) {
      l.appendChild(bosDurum("Bu hesapta hareket yok"));
    } else {
      let kalan = sayi(h.bakiye);
      let sonAy = null;
      hepsi.forEach((x) => {
        const a = ayAnahtar(x.tarih);
        if (a !== sonAy) {
          sonAy = a;
          l.appendChild(el("div", "grup-basi", ayAdi(a)));
        }
        const etki = hesabaEtki(x, hesapId);
        const r = hesapHareketSatiri(x, hesapId, etki, kalan);
        kalan -= etki;
        l.appendChild(r);
      });
    }
    s.appendChild(l);
    k.appendChild(s);
    return k;
  }
  function hesapHareketSatiri(h, hesapId, etki, bakiyeSonrasi) {
    const transfer = h.tur === "transfer";
    const r = butonSatir(() => transfer ? transferFormu(h) : hareketFormu(h));
    const sol = el("div");
    sol.appendChild(el("div", "baslik", h.baslik || h.aciklama || (transfer ? "Para aktarma" : h.kategori)));
    const alt = el("div", "alt");
    if (transfer) {
      alt.appendChild(el("span", "rozet bilgi", h.hesap_id === hesapId ? "Giden transfer" : "Gelen transfer"));
      alt.appendChild(el("span", "", h.hesap_id === hesapId ? "\u2192 " + hesapAdi(h.hedef_hesap_id) : "\u2190 " + hesapAdi(h.hesap_id)));
    } else {
      alt.appendChild(el("span", "", h.kategori));
      const on = orgAdi(h.organizasyon_id);
      if (on) alt.appendChild(el("span", "rozet vurgu", on));
      const cn = cariAdi(h.cari_id);
      if (cn) alt.appendChild(el("span", "", "\xB7 " + cn));
    }
    sol.appendChild(alt);
    const sag = el("div");
    sag.appendChild(el(
      "div",
      "tutar " + (transfer ? "t" : etki > 0 ? "g" : "k"),
      (etki > 0 ? "+" : "\u2212") + para(Math.abs(etki))
    ));
    sag.appendChild(el("div", "tarih", `${trTarih(h.tarih)} \xB7 kalan ${paraTam(bakiyeSonrasi)}`));
    r.append(sol, sag);
    return r;
  }
  function transferFormu(mevcut, onAyar = {}) {
    const yeni = !mevcut;
    const hesaplar = aktifHesaplar();
    if (hesaplar.length < 2) {
      bildir("Aktarma i\xE7in en az iki hesap gerekir", "kotu");
      return;
    }
    const g = el("div");
    const ikili = el("div", "ikili");
    const tutarL = el("label", "alan", "TUTAR (\u20BA)");
    const tutar = el("input");
    tutar.type = "number";
    tutar.step = "0.01";
    tutar.min = "0";
    tutar.inputMode = "decimal";
    tutar.required = true;
    tutar.placeholder = "0,00";
    tutar.value = mevcut ? mevcut.tutar : "";
    tutarL.appendChild(tutar);
    const tarihL = el("label", "alan", "TAR\u0130H");
    const tarih = el("input");
    tarih.type = "date";
    tarih.required = true;
    tarih.value = mevcut?.tarih ?? onAyar.tarih ?? bugun();
    tarihL.appendChild(tarih);
    ikili.append(tutarL, tarihL);
    g.appendChild(ikili);
    const secKur = (etiket) => {
      const l = el("label", "alan", etiket);
      const s = el("select");
      hesaplar.forEach((h) => {
        const o = el("option", "", h.ad);
        o.value = h.id;
        s.appendChild(o);
      });
      l.appendChild(s);
      return [l, s];
    };
    const ikili2 = el("div", "ikili");
    const [kaynakL, kaynak] = secKur("NEREDEN");
    const [hedefL, hedef] = secKur("NEREYE");
    kaynak.value = mevcut?.hesap_id ?? onAyar.hesap_id ?? hesaplar[0].id;
    hedef.value = mevcut?.hedef_hesap_id ?? (hesaplar.find((h) => h.id !== kaynak.value)?.id ?? hesaplar[1].id);
    ikili2.append(kaynakL, hedefL);
    g.appendChild(ikili2);
    const degis = el("button", "btn kucuk", "\u21C4 Y\xF6n\xFC \xE7evir");
    degis.type = "button";
    degis.style.alignSelf = "flex-start";
    degis.onclick = () => {
      const a = kaynak.value;
      kaynak.value = hedef.value;
      hedef.value = a;
    };
    g.appendChild(degis);
    const baslikL = el("label", "alan", "A\xC7IKLAMA");
    const baslik = el("input");
    baslik.type = "text";
    baslik.placeholder = "\u0130ste\u011Fe ba\u011Fl\u0131 \u2014 \xF6rn. nakit yat\u0131rma";
    baslik.value = mevcut?.baslik ?? "";
    baslikL.appendChild(baslik);
    g.appendChild(baslikL);
    const masrafL = el("label", "alan", "\u0130\u015ELEM MASRAFI / HAVALE \xDCCRET\u0130 (\u20BA) \u2014 iste\u011Fe ba\u011Fl\u0131");
    const masraf = el("input");
    masraf.type = "number";
    masraf.step = "0.01";
    masraf.min = "0";
    masraf.inputMode = "decimal";
    masraf.placeholder = "0,00";
    masrafL.appendChild(masraf);
    if (yeni) g.appendChild(masrafL);
    const not = el(
      "p",
      "altbilgi",
      'Aktarma gelir ya da gider say\u0131lmaz; sadece paray\u0131 bir hesaptan di\u011Ferine ta\u015F\u0131r. Masraf girersen kaynak hesaptan ayr\u0131 bir "Banka masraf\u0131" gideri yaz\u0131l\u0131r.'
    );
    not.style.margin = "0";
    g.appendChild(not);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Aktar" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni && (yetkili() || D.profil?.silebilir)) {
      const silB = el("button", "btn tehlike", "Sil");
      silB.style.flex = "0 0 auto";
      ayak.insertBefore(silB, iptal);
      silB.onclick = async () => {
        if (!await onayla(
          "Aktarma silinsin mi?",
          `${hesapAdi(mevcut.hesap_id)} \u2192 ${hesapAdi(mevcut.hedef_hesap_id)} \xB7 ${para(mevcut.tutar)}`,
          "Sil"
        )) return;
        try {
          await hareketSil(mevcut.id);
          m.kapat();
          bildir("Aktarma silindi");
          yenile(true);
        } catch (e) {
          bildir(e.message, "kotu");
        }
      };
    }
    const m = modalAc({ baslik: yeni ? "Para aktarma" : "Aktarmay\u0131 d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    setTimeout(() => tutar.focus(), 60);
    kaydet.onclick = async () => {
      const t = parseFloat(String(tutar.value).replace(",", "."));
      if (!(t > 0)) {
        bildir("Tutar girmelisin", "kotu");
        tutar.focus();
        return;
      }
      if (kaynak.value === hedef.value) {
        bildir("Kaynak ve hedef ayn\u0131 olamaz", "kotu");
        return;
      }
      const mt = parseFloat(String(masraf.value).replace(",", ".")) || 0;
      kaydet.disabled = true;
      try {
        await hareketYaz({
          defter: D.defter,
          tarih: tarih.value || bugun(),
          tur: "transfer",
          tutar: t,
          hesap_id: kaynak.value,
          hedef_hesap_id: hedef.value,
          kategori: "Transfer",
          baslik: baslik.value.trim() || null,
          aciklama: null,
          organizasyon_id: null,
          cari_id: null
        }, mevcut?.id);
        if (yeni && mt > 0) {
          const masrafKat = kategorilerListesi("gider").find((a) => /masraf|banka|komisyon/i.test(a)) || kategorilerListesi("gider")[0] || "Di\u011Fer";
          await hareketYaz({
            defter: D.defter,
            tarih: tarih.value || bugun(),
            tur: "gider",
            tutar: mt,
            hesap_id: kaynak.value,
            kategori: masrafKat,
            baslik: "Banka masraf\u0131",
            aciklama: `Aktarma masraf\u0131 \xB7 ${hesapAdi(kaynak.value)} \u2192 ${hesapAdi(hedef.value)}`,
            organizasyon_id: null,
            cari_id: null
          });
        }
        m.kapat();
        bildir(yeni ? mt > 0 ? "Aktarma ve masraf kaydedildi" : "Aktarma yap\u0131ld\u0131" : "Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  var pinGecildi = false;
  async function kisiselKilidiAc() {
    const kisisel = D.defterler.find((d) => d.tur === "kisisel");
    if (!kisisel) {
      bildir("Ki\u015Fisel defter bulunamad\u0131", "kotu");
      return null;
    }
    if (!kisisel.pin_hash || pinGecildi) return kisisel;
    const ozet = await pinSorVeOzetle(kisisel);
    if (ozet !== kisisel.pin_hash) {
      if (ozet !== null) bildir("PIN hatal\u0131", "kotu");
      return null;
    }
    pinGecildi = true;
    return kisisel;
  }
  function pinSorVeOzetle(defter) {
    return new Promise((coz) => {
      const g = el("div");
      const l = el("label", "alan", "K\u0130\u015E\u0130SEL DEFTER PIN'\u0130");
      const i = el("input");
      i.type = "password";
      i.inputMode = "numeric";
      i.autocomplete = "off";
      i.placeholder = "\u2022\u2022\u2022\u2022";
      l.appendChild(i);
      g.appendChild(l);
      const not = el(
        "p",
        "altbilgi",
        "Bu i\u015Flem ki\u015Fisel deftere kay\u0131t yazaca\u011F\u0131 i\xE7in PIN soruluyor. Bu oturumda bir kez sorulur."
      );
      not.style.margin = "0";
      g.appendChild(not);
      const ayak = el("div");
      const iptal = el("button", "btn", "Vazge\xE7");
      const ac = el("button", "btn ana", "A\xE7");
      ayak.append(iptal, ac);
      const m = modalAc({ baslik: defter.ad, govde: g, ayak });
      setTimeout(() => i.focus(), 60);
      let cevap = false;
      iptal.onclick = () => {
        m.kapat();
        coz(null);
      };
      ac.onclick = async () => {
        cevap = true;
        const ozet = await window.mksPinOzet(i.value);
        m.kapat();
        coz(ozet);
      };
      m.kok.closest("dialog").addEventListener("close", () => {
        if (!cevap) coz(null);
      }, { once: true });
    });
  }
  async function aktarmaDetay(h) {
    const cikan = h.tur === "cekis";
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
      sat("Ne", h.baslik || (cikan ? "\xC7eki\u015F" : "Sermaye")),
      sat("Tutar", para(h.tutar)),
      sat("Tarih", trTarihUzun(h.tarih)),
      sat("Hesap", hesapAdi(h.hesap_id)),
      sat("Bu defterde", cikan ? "Para \xE7\u0131k\u0131\u015F\u0131" : "Para giri\u015Fi")
    );
    if (h.tur === "cekis") {
      kart.appendChild(sat("Gelir/gidere etkisi", "yok \u2014 k\xE2r hesab\u0131na girmez", "var(--ink3)"));
    }
    if (h.aciklama) kart.appendChild(sat("A\xE7\u0131klama", h.aciklama));
    g.appendChild(kart);
    const bilgi = el("p", "altbilgi");
    bilgi.style.margin = "0";
    bilgi.textContent = h.eslesen_id ? "Bu kayd\u0131n kar\u015F\u0131 defterde e\u015Fi var. Silersen ikisi birden silinir." : "Bu kayd\u0131n kar\u015F\u0131 defterdeki e\u015Fi bulunamad\u0131 (silinmi\u015F olabilir).";
    g.appendChild(bilgi);
    const ayak = el("div");
    const kapatB = el("button", "btn", "Kapat");
    ayak.appendChild(kapatB);
    if (yetkili() || D.profil?.silebilir) {
      const silB = el("button", "btn tehlike", "Sil");
      ayak.insertBefore(silB, kapatB);
      silB.onclick = async () => {
        const uyari = h.eslesen_id ? `${para(h.tutar)} \xB7 ${trTarihUzun(h.tarih)}

Her iki defterdeki kay\u0131t da silinecek.` : `${para(h.tutar)} \xB7 ${trTarihUzun(h.tarih)}`;
        if (!await onayla("Aktarma silinsin mi?", uyari, "Sil")) return;
        try {
          await aktarmaSil(h.id, h.eslesen_id);
          m.kapat();
          bildir("Aktarma silindi");
          yenile(true);
        } catch (e) {
          bildir(e.message, "kotu");
        }
      };
    }
    const m = modalAc({ baslik: cikan ? "\xC7eki\u015F" : "Sermaye giri\u015Fi", govde: g, ayak });
    kapatB.onclick = () => m.kapat();
  }
  async function kendimeAktarFormu() {
    if (!sahip()) {
      bildir("Bu i\u015Flem yaln\u0131z hesap sahibine a\xE7\u0131k", "kotu");
      return;
    }
    const kisisel = await kisiselKilidiAc();
    if (!kisisel) return;
    const isDefteri = D.defterler.find((d) => d.tur === "is");
    if (!isDefteri) {
      bildir("\u0130\u015F defteri bulunamad\u0131", "kotu");
      return;
    }
    const isHesap = defterHesaplari(isDefteri.kod);
    const ksHesap = defterHesaplari(kisisel.kod);
    if (!isHesap.length || !ksHesap.length) {
      bildir("\u0130ki defterde de en az bir kullan\u0131mdaki hesap olmal\u0131", "kotu");
      return;
    }
    let yon = "isten";
    const g = el("div");
    const segY = el("div", "segment");
    const yonDugme = (kod, ad) => {
      const b = el("button", "", ad);
      b.type = "button";
      b.setAttribute("aria-pressed", String(yon === kod));
      b.onclick = () => {
        yon = kod;
        Array.from(segY.children).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        yonuUygula();
      };
      return b;
    };
    segY.append(yonDugme("isten", "D\xFCkkandan kendime"), yonDugme("kisiselden", "Kendimden d\xFCkkana"));
    g.appendChild(segY);
    const ikili = el("div", "ikili");
    const tutarL = el("label", "alan", "TUTAR (\u20BA)");
    const tutar = el("input");
    tutar.type = "number";
    tutar.step = "0.01";
    tutar.min = "0";
    tutar.inputMode = "decimal";
    tutar.required = true;
    tutar.placeholder = "0,00";
    tutarL.appendChild(tutar);
    const tarihL = el("label", "alan", "TAR\u0130H");
    const tarih = el("input");
    tarih.type = "date";
    tarih.required = true;
    tarih.value = bugun();
    tarihL.appendChild(tarih);
    ikili.append(tutarL, tarihL);
    g.appendChild(ikili);
    const ikili2 = el("div", "ikili");
    const kaynakL = el("label", "alan", "NEREDEN");
    const kaynak = el("select");
    kaynakL.appendChild(kaynak);
    const hedefL = el("label", "alan", "NEREYE");
    const hedef = el("select");
    hedefL.appendChild(hedef);
    ikili2.append(kaynakL, hedefL);
    g.appendChild(ikili2);
    const giderL = el("label", "onay-kutu");
    const gider = el("input");
    gider.type = "checkbox";
    giderL.append(gider, document.createTextNode("Gider olarak say (yevmiye)"));
    g.appendChild(giderL);
    const aciklamaL = el("label", "alan", "A\xC7IKLAMA");
    const aciklama = el("input");
    aciklama.type = "text";
    aciklama.placeholder = "\u0130ste\u011Fe ba\u011Fl\u0131";
    aciklamaL.appendChild(aciklama);
    g.appendChild(aciklamaL);
    const not = el("p", "altbilgi");
    not.style.margin = "0";
    g.appendChild(not);
    function doldur(sec, liste, defterAdi) {
      sec.innerHTML = "";
      liste.forEach((h) => {
        const o = el("option", "", `${defterAdi} \xB7 ${h.ad}`);
        o.value = h.id;
        sec.appendChild(o);
      });
    }
    function yonuUygula() {
      const isten = yon === "isten";
      doldur(kaynak, isten ? isHesap : ksHesap, isten ? isDefteri.ad : kisisel.ad);
      doldur(hedef, isten ? ksHesap : isHesap, isten ? kisisel.ad : isDefteri.ad);
      giderL.classList.toggle("gizli", !isten);
      if (!isten) gider.checked = false;
      notuYaz();
    }
    function notuYaz() {
      if (yon !== "isten") {
        not.textContent = "Kendi paran\u0131 d\xFCkkana koyuyorsun. D\xFCkkan\u0131n gelirine yaz\u0131lmaz, sadece hesap bakiyesi artar.";
        return;
      }
      not.textContent = gider.checked ? 'Yevmiye olarak yaz\u0131lacak: d\xFCkkan\u0131n gideri say\u0131l\u0131r ve k\xE2r\u0131 d\xFC\u015F\xFCr\xFCr. Ki\u015Fisel defterine "D\xFCkkan geliri" olarak girer.' : 'K\xE2r pay\u0131 olarak yaz\u0131lacak: d\xFCkkan\u0131n hesab\u0131ndan d\xFC\u015Fer ama gider say\u0131lmaz, k\xE2r rakam\u0131 de\u011Fi\u015Fmez. Ki\u015Fisel defterine "D\xFCkkan geliri" olarak girer.';
    }
    gider.onchange = notuYaz;
    yonuUygula();
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "Aktar");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: "Kendime aktar", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    setTimeout(() => tutar.focus(), 60);
    kaydet.onclick = async () => {
      const t = parseFloat(String(tutar.value).replace(",", "."));
      if (!(t > 0)) {
        bildir("Tutar girmelisin", "kotu");
        tutar.focus();
        return;
      }
      if (!kaynak.value || !hedef.value) {
        bildir("Hesaplar\u0131 se\xE7", "kotu");
        return;
      }
      const isten = yon === "isten";
      kaydet.disabled = true;
      try {
        await aktarmaYaz({
          kaynakDefter: isten ? isDefteri.kod : kisisel.kod,
          kaynakHesapId: kaynak.value,
          hedefDefter: isten ? kisisel.kod : isDefteri.kod,
          hedefHesapId: hedef.value,
          tutar: t,
          tarih: tarih.value || bugun(),
          aciklama: aciklama.value.trim() || null,
          giderMi: isten && gider.checked
        });
        m.kapat();
        bildir("Aktarma yap\u0131ld\u0131", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function hareketFormu(mevcut, onAyar = {}) {
    const yeni = !mevcut;
    let tur = mevcut?.tur ?? onAyar.tur ?? "gider";
    const bas = el("div");
    const segT = el("div", "segment");
    [["gider", "Gider", "k"], ["gelir", "Gelir", "g"]].forEach(([kod, ad, sn]) => {
      const b = el("button", sn, ad);
      b.type = "button";
      b.setAttribute("aria-pressed", String(tur === kod));
      b.onclick = () => {
        tur = kod;
        Array.from(segT.children).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        katDoldur();
        if (cariDoldur) cariDoldur(cari.value);
      };
      segT.appendChild(b);
    });
    bas.appendChild(segT);
    const ikili = el("div", "ikili");
    const tutarL = el("label", "alan", "TUTAR (\u20BA)");
    const tutar = el("input");
    tutar.type = "number";
    tutar.step = "0.01";
    tutar.min = "0";
    tutar.inputMode = "decimal";
    tutar.required = true;
    tutar.placeholder = "0,00";
    tutar.value = mevcut ? mevcut.tutar : "";
    tutarL.appendChild(tutar);
    const tarihL = el("label", "alan", "TAR\u0130H");
    const tarih = el("input");
    tarih.type = "date";
    tarih.required = true;
    tarih.value = mevcut?.tarih ?? onAyar.tarih ?? bugun();
    tarihL.appendChild(tarih);
    ikili.append(tutarL, tarihL);
    bas.appendChild(ikili);
    const ikili2 = el("div", "ikili");
    const katL = el("label", "alan", "KATEGOR\u0130");
    const kat = el("select");
    katL.appendChild(kat);
    const hesapL = el("label", "alan", "HESAP");
    const hesap = el("select");
    aktifHesaplar().forEach((h) => {
      const o = el("option", "", h.ad);
      o.value = h.id;
      hesap.appendChild(o);
    });
    hesap.value = mevcut?.hesap_id ?? onAyar.hesap_id ?? aktifHesaplar()[0]?.id ?? "";
    hesapL.appendChild(hesap);
    ikili2.append(katL, hesapL);
    bas.appendChild(ikili2);
    function katDoldur() {
      kat.innerHTML = "";
      const liste = kategorilerListesi(tur);
      if (mevcut?.kategori && !liste.includes(mevcut.kategori)) liste.push(mevcut.kategori);
      liste.forEach((a) => {
        const o = el("option", "", a);
        o.value = a;
        kat.appendChild(o);
      });
      if (mevcut?.kategori) kat.value = mevcut.kategori;
      else if (tur === "gelir" && liste.includes("Organizasyon geliri")) kat.value = "Organizasyon geliri";
    }
    katDoldur();
    const baslikL = el("label", "alan", "BA\u015ELIK");
    const baslik = el("input");
    baslik.type = "text";
    baslik.placeholder = "K\u0131sa ad";
    baslik.value = mevcut?.baslik ?? onAyar.baslik ?? "";
    baslikL.appendChild(baslik);
    bas.appendChild(baslikL);
    let org = null, cari = null, cariDoldur = null, cariSuzmeKapali = false;
    if (D.defter === "is") {
      const orgL = el("label", "alan", "ORGAN\u0130ZASYON (iste\u011Fe ba\u011Fl\u0131)");
      org = el("select");
      org.appendChild(Object.assign(el("option", "", "\u2014 yok \u2014"), { value: "" }));
      D.organizasyonlar.forEach((o) => {
        const op = el("option", "", `${o.ad} \xB7 ${trTarih(o.tarih)}`);
        op.value = o.id;
        org.appendChild(op);
      });
      org.value = mevcut?.organizasyon_id ?? onAyar.organizasyon_id ?? "";
      orgL.appendChild(org);
      bas.appendChild(orgL);
      const cariL = el("label", "alan", "CAR\u0130 (iste\u011Fe ba\u011Fl\u0131)");
      const cariSatir = el("div", "sec-ekle");
      cari = el("select");
      const cariEkle = el("button", "btn kucuk", "+ Ekle");
      cariEkle.type = "button";
      cariEkle.title = "Yeni cari kart\u0131 ekle";
      cariSatir.append(cari, cariEkle);
      cariL.appendChild(cariSatir);
      bas.appendChild(cariL);
      const suzmeNot = el("button", "btn baglanti", "");
      suzmeNot.type = "button";
      suzmeNot.style.cssText = "align-self:flex-start;padding:2px 0";
      bas.appendChild(suzmeNot);
      cariDoldur = (secili) => {
        const hepsi = D.cariler.filter((c) => c.aktif);
        const musteriMi = (c) => (c.tur || "").toLocaleLowerCase("tr") === "m\xFC\u015Fteri";
        const liste = cariSuzmeKapali ? hepsi : hepsi.filter((c) => tur === "gelir" === musteriMi(c));
        cari.innerHTML = "";
        cari.appendChild(Object.assign(el("option", "", "\u2014 yok \u2014"), { value: "" }));
        liste.forEach((c) => {
          const op = el("option", "", c.ad);
          op.value = c.id;
          cari.appendChild(op);
        });
        cari.value = secili && liste.some((c) => c.id === secili) ? secili : "";
        const gizlenen = hepsi.length - liste.length;
        if (cariSuzmeKapali) {
          suzmeNot.textContent = "Yaln\u0131z uygun cariler";
          suzmeNot.classList.remove("gizli");
        } else if (gizlenen > 0) {
          suzmeNot.textContent = `T\xFCm\xFCn\xFC g\xF6ster (${gizlenen} cari gizli)`;
          suzmeNot.classList.remove("gizli");
        } else {
          suzmeNot.classList.add("gizli");
        }
      };
      suzmeNot.onclick = () => {
        cariSuzmeKapali = !cariSuzmeKapali;
        cariDoldur(cari.value);
      };
      cariEkle.onclick = () => cariFormu(null, { sonra: (k) => {
        cariSuzmeKapali = true;
        cariDoldur(k.id);
      } });
      cariDoldur(mevcut?.cari_id ?? onAyar.cari_id ?? "");
    }
    const aciklamaL = el("label", "alan", "A\xC7IKLAMA");
    const aciklama = el("textarea");
    aciklama.placeholder = "\u0130ste\u011Fe ba\u011Fl\u0131 not";
    aciklama.value = mevcut?.aciklama ?? "";
    aciklamaL.appendChild(aciklama);
    bas.appendChild(aciklamaL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni && (yetkili() || D.profil?.silebilir)) {
      const silB = el("button", "btn tehlike", "Sil");
      silB.style.flex = "0 0 auto";
      ayak.insertBefore(silB, iptal);
      silB.onclick = async () => {
        if (!await onayla("Kay\u0131t silinsin mi?", `${mevcut.baslik || mevcut.kategori} \xB7 ${para(mevcut.tutar)}`, "Sil")) return;
        try {
          await hareketSil(mevcut.id);
          m.kapat();
          bildir("Kay\u0131t silindi");
          yenile(true);
        } catch (e) {
          bildir(e.message, "kotu");
        }
      };
    }
    const m = modalAc({ baslik: yeni ? "Yeni kay\u0131t" : "Kayd\u0131 d\xFCzenle", govde: bas, ayak });
    iptal.onclick = () => m.kapat();
    setTimeout(() => tutar.focus(), 60);
    kaydet.onclick = async () => {
      const t = parseFloat(String(tutar.value).replace(",", "."));
      if (!(t > 0)) {
        bildir("Tutar girmelisin", "kotu");
        tutar.focus();
        return;
      }
      if (!hesap.value) {
        bildir("Hesap se\xE7melisin", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        await hareketYaz({
          defter: D.defter,
          tarih: tarih.value || bugun(),
          tur,
          tutar: t,
          hesap_id: hesap.value,
          kategori: kat.value,
          baslik: baslik.value.trim() || null,
          aciklama: aciklama.value.trim() || null,
          organizasyon_id: org?.value || null,
          cari_id: cari?.value || null,
          hedef_hesap_id: null
        }, mevcut?.id);
        m.kapat();
        bildir(yeni ? "Kay\u0131t eklendi" : "Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function organizasyonlar() {
    const k = el("div", "yigin");
    const bas = el("div", "ekran-basi");
    bas.appendChild(el("h2", "", "\u0130\u015Fler"));
    const sag = el("div", "sag");
    const ekle = el("button", "btn ana kucuk", "+ \u0130\u015F");
    ekle.onclick = () => orgFormu(null);
    sag.appendChild(ekle);
    bas.appendChild(sag);
    k.appendChild(bas);
    const f = el("div", "filtreler");
    const seg = el("div", "segment");
    [["aktif", "Aktif"], ["tamam", "Tamamlanan"], ["tumu", "T\xFCm\xFC"]].forEach(([kod, ad]) => {
      const b = el("button", "", ad);
      b.type = "button";
      b.setAttribute("aria-pressed", String(U.orgFiltre === kod));
      b.onclick = () => {
        U.orgFiltre = kod;
        yenile();
      };
      seg.appendChild(b);
    });
    f.appendChild(seg);
    const ara = el("div", "ara");
    const ai = el("input");
    ai.type = "search";
    ai.placeholder = "\u0130\u015F veya m\xFC\u015Fteri ara\u2026";
    ai.setAttribute("aria-label", "Ara");
    ara.appendChild(ai);
    f.appendChild(ara);
    k.appendChild(f);
    const ozet = el("div");
    k.appendChild(ozet);
    const kutu = el("section", "panel liste");
    k.appendChild(kutu);
    function ciz() {
      const q = ai.value.toLocaleLowerCase("tr");
      let liste = D.orgOzet.slice();
      if (U.orgFiltre === "aktif") liste = liste.filter((o) => !["Tamamland\u0131", "\u0130ptal"].includes(o.durum));
      if (U.orgFiltre === "tamam") liste = liste.filter((o) => o.durum === "Tamamland\u0131");
      if (q) liste = liste.filter((o) => (o.ad + " " + musteriAdi(o.musteri_id)).toLocaleLowerCase("tr").includes(q));
      const ciro = liste.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
      const kalan = liste.reduce((t, o) => t + Math.max(0, sayi(o.kalan_odeme)), 0);
      const kar = liste.reduce((t, o) => t + sayi(o.kar), 0);
      ozet.innerHTML = "";
      ozet.appendChild(ozetSerit([
        { etiket: "\u0130\u015F", deger: String(liste.length) },
        { etiket: "Ciro", deger: paraTam(ciro) },
        { etiket: "Kalan", deger: paraTam(kalan), renk: kalan > 0 ? "k" : "" },
        { etiket: "K\xE2r", deger: paraTam(kar), renk: kar < 0 ? "k" : "g" }
      ]));
      kutu.innerHTML = "";
      if (!liste.length) {
        kutu.appendChild(bosDurum("\u0130\u015F bulunamad\u0131"));
        return;
      }
      liste.forEach((o) => {
        const r = butonSatir(() => orgDetay(o.organizasyon_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", o.ad));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "", musteriAdi(o.musteri_id)));
        if (o.tur) alt.appendChild(el("span", "rozet", o.tur));
        alt.appendChild(el("span", "rozet " + durumSinifi(o.durum), o.durum));
        sol.appendChild(alt);
        const sag2 = el("div");
        sag2.appendChild(el("div", "tutar", paraTam(o.toplam_ucret)));
        const alt2 = el("div", "tarih");
        alt2.textContent = trTarih(o.tarih) + (sayi(o.kalan_odeme) > 0 ? ` \xB7 ${paraTam(o.kalan_odeme)} kalan` : "");
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
    if (d === "Tamamland\u0131") return "iyi";
    if (d === "\u0130ptal") return "kotu";
    if (d === "\u{1F4B0} \xD6deme Bekleniyor") return "uyari";
    return "";
  }
  function orgDetay(id) {
    const o = D.orgOzet.find((x) => x.organizasyon_id === id);
    const ham = D.organizasyonlar.find((x) => x.id === id);
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
      sat("M\xFC\u015Fteri", musteriAdi(ham.musteri_id)),
      sat("Tarih", trTarihUzun(ham.tarih) + (ham.saat ? " \xB7 " + ham.saat : "")),
      sat("Mekan", ham.mekan || "\u2014"),
      sat("T\xFCr", ham.tur || "\u2014"),
      sat("Durum", ham.durum),
      sat("Ses sistemi", ham.ses_sistemi ? "Var" : "Yok")
    );
    g.appendChild(kart);
    const para2 = el("div", "panel");
    para2.append(
      sat("Toplam \xFCcret", para(o.toplam_ucret)),
      sat("Tahsil edilen", para(o.tahsil_edilen), "var(--gelir-ink)"),
      sat("Kalan", para(o.kalan_odeme), sayi(o.kalan_odeme) > 0 ? "var(--uyari-ink)" : "var(--ink3)"),
      sat("Ger\xE7ek maliyet", para(o.gercek_maliyet), "var(--gider-ink)"),
      sat("K\xE2r", para(o.kar), sayi(o.kar) < 0 ? "var(--gider-ink)" : "var(--gelir-ink)")
    );
    const oran = sayi(o.toplam_ucret) > 0 ? Math.min(100, sayi(o.tahsil_edilen) / sayi(o.toplam_ucret) * 100) : 0;
    const il = el("div", "ilerle");
    const ii = el("i");
    ii.style.width = oran + "%";
    il.appendChild(ii);
    para2.appendChild(il);
    g.appendChild(para2);
    const bagli = D.hareketler.filter((h) => h.organizasyon_id === id);
    if (bagli.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi");
      b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", `Ba\u011Fl\u0131 hareketler (${bagli.length})`));
      s.appendChild(b);
      const l = el("div", "liste");
      bagli.forEach((h) => l.appendChild(hareketSatiri(h)));
      s.appendChild(l);
      g.appendChild(s);
    }
    const ayak = el("div");
    const tahsil = el("button", "btn ana", "Tahsilat ekle");
    const duzen = el("button", "btn", "D\xFCzenle");
    ayak.append(duzen, tahsil);
    const m = modalAc({ baslik: ham.ad, govde: g, ayak });
    duzen.onclick = () => {
      m.kapat();
      orgFormu(ham);
    };
    tahsil.onclick = () => {
      m.kapat();
      hareketFormu(null, {
        tur: "gelir",
        organizasyon_id: id,
        baslik: musteriAdi(ham.musteri_id),
        tarih: bugun()
      });
    };
  }
  function orgFormu(mevcut, onAyar = {}) {
    const yeni = !mevcut;
    const g = el("div");
    const adL = el("label", "alan", "\u0130\u015E\u0130N ADI");
    const ad = el("input");
    ad.type = "text";
    ad.required = true;
    ad.value = mevcut?.ad ?? "";
    ad.placeholder = "\xD6rn. Ay\u015Fe & Mehmet Ni\u015Fan";
    adL.appendChild(ad);
    g.appendChild(adL);
    const musL = el("label", "alan", "M\xDC\u015ETER\u0130");
    const musSatir = el("div", "sec-ekle");
    const mus = el("select");
    const musDoldur = (secili) => {
      mus.innerHTML = "";
      mus.appendChild(Object.assign(el("option", "", "\u2014 se\xE7 \u2014"), { value: "" }));
      D.musteriler.forEach((x) => {
        const o = el("option", "", x.ad);
        o.value = x.id;
        mus.appendChild(o);
      });
      mus.value = secili ?? "";
    };
    musDoldur(mevcut?.musteri_id);
    const musEkle = el("button", "btn kucuk", "+ Ekle");
    musEkle.type = "button";
    musEkle.title = "Yeni m\xFC\u015Fteri kart\u0131 ekle";
    musEkle.onclick = () => musteriFormu(null, { sonra: (k) => musDoldur(k.id) });
    musSatir.append(mus, musEkle);
    musL.appendChild(musSatir);
    g.appendChild(musL);
    const i1 = el("div", "ikili");
    const turL = el("label", "alan", "T\xDCR");
    const tur = el("select");
    seceneklerGrubu("organizasyon_turu").forEach((a) => {
      const o = el("option", "", a);
      o.value = a;
      tur.appendChild(o);
    });
    tur.value = mevcut?.tur ?? seceneklerGrubu("organizasyon_turu")[0] ?? "";
    turL.appendChild(tur);
    const durL = el("label", "alan", "DURUM");
    const dur = el("select");
    seceneklerGrubu("durum").forEach((a) => {
      const o = el("option", "", a);
      o.value = a;
      dur.appendChild(o);
    });
    dur.value = mevcut?.durum ?? "\u{1F195} Yeni Talep";
    durL.appendChild(dur);
    i1.append(turL, durL);
    g.appendChild(i1);
    const i2 = el("div", "ikili");
    const tarL = el("label", "alan", "TAR\u0130H");
    const tar = el("input");
    tar.type = "date";
    tar.value = mevcut?.tarih ?? onAyar.tarih ?? bugun();
    tarL.appendChild(tar);
    const saaL = el("label", "alan", "SAAT");
    const saa = el("input");
    saa.type = "text";
    saa.placeholder = "20:00";
    saa.value = mevcut?.saat ?? "";
    saaL.appendChild(saa);
    i2.append(tarL, saaL);
    g.appendChild(i2);
    const mekL = el("label", "alan", "MEKAN");
    const mek = el("input");
    mek.type = "text";
    mek.value = mevcut?.mekan ?? "";
    mekL.appendChild(mek);
    g.appendChild(mekL);
    const i3 = el("div", "ikili");
    const ucrL = el("label", "alan", "TOPLAM \xDCCRET (\u20BA)");
    const ucr = el("input");
    ucr.type = "number";
    ucr.step = "0.01";
    ucr.inputMode = "decimal";
    ucr.value = mevcut?.toplam_ucret ?? "";
    ucrL.appendChild(ucr);
    const kapL = el("label", "alan", "KAPORA (\u20BA)");
    const kap = el("input");
    kap.type = "number";
    kap.step = "0.01";
    kap.inputMode = "decimal";
    kap.value = mevcut?.kapora ?? "";
    kapL.appendChild(kap);
    i3.append(ucrL, kapL);
    g.appendChild(i3);
    const sesL = el("label", "onay-kutu");
    const ses = el("input");
    ses.type = "checkbox";
    ses.checked = !!mevcut?.ses_sistemi;
    sesL.append(ses, document.createTextNode("Ses sistemi dahil"));
    g.appendChild(sesL);
    const notL = el("label", "alan", "NOTLAR");
    const not = el("textarea");
    not.value = mevcut?.notlar ?? "";
    notL.appendChild(not);
    g.appendChild(notL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni) {
      const bagliSayi = D.hareketler.filter((h) => h.organizasyon_id === mevcut.id).length;
      ayak.insertBefore(silDugmesi(
        "\u0130\u015F silinsin mi?",
        `${mevcut.ad} silinecek.` + (bagliSayi ? ` Bu i\u015Fe ba\u011Fl\u0131 ${bagliSayi} kasa hareketi var; hareketler silinmez ama i\u015Fle ba\u011Flant\u0131lar\u0131 kopar, tahsilat ve maliyet hesab\u0131ndan d\xFC\u015Fer.` : "") + `

\u0130\u015F iptal olduysa silmek yerine durumunu "\u0130ptal" yapabilirsin.`,
        () => orgSil(mevcut.id),
        () => m.kapat()
      ), iptal);
    }
    const m = modalAc({ baslik: yeni ? "Yeni i\u015F" : "\u0130\u015Fi d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      if (!ad.value.trim()) {
        bildir("\u0130\u015Fin ad\u0131n\u0131 gir", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        const musteriId = mus.value;
        await orgYaz({
          ad: ad.value.trim(),
          tur: tur.value,
          tarih: tar.value || null,
          saat: saa.value.trim() || null,
          mekan: mek.value.trim() || null,
          musteri_id: musteriId || null,
          durum: dur.value,
          toplam_ucret: sayi(ucr.value),
          kapora: sayi(kap.value),
          ses_sistemi: ses.checked,
          notlar: not.value.trim() || null
        }, mevcut?.id);
        m.kapat();
        bildir(yeni ? "\u0130\u015F eklendi" : "Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function cariler() {
    const k = el("div", "yigin");
    const bas = el("div", "ekran-basi");
    bas.appendChild(el("h2", "", "Cariler"));
    const sag = el("div", "sag");
    const ekle = el("button", "btn ana kucuk", "+ Cari");
    ekle.onclick = () => cariFormu(null);
    sag.appendChild(ekle);
    bas.appendChild(sag);
    k.appendChild(bas);
    const borclu = D.cariBakiye.filter((c) => sayi(c.bakiye) > 4e-3);
    const toplamBorc = borclu.reduce((t, c) => t + sayi(c.bakiye), 0);
    k.appendChild(ozetSerit([
      { etiket: "Cari", deger: String(D.cariBakiye.length) },
      { etiket: "Bor\xE7lu oldu\u011Fun", deger: String(borclu.length) },
      { etiket: "Toplam bor\xE7", deger: paraTam(toplamBorc), renk: toplamBorc > 0 ? "k" : "" },
      { etiket: "Bu y\u0131l \xF6denen", deger: paraTam(D.cariBakiye.reduce((t, c) => t + sayi(c.toplam_odeme), 0)) }
    ]));
    const f = el("div", "filtreler");
    const ara = el("div", "ara");
    const ai = el("input");
    ai.type = "search";
    ai.placeholder = "Cari ara\u2026";
    ai.setAttribute("aria-label", "Cari ara");
    ara.appendChild(ai);
    f.appendChild(ara);
    k.appendChild(f);
    const kutu = el("section", "panel liste");
    k.appendChild(kutu);
    function ciz() {
      const q = ai.value.toLocaleLowerCase("tr");
      const liste = D.cariBakiye.filter((c) => !q || (c.ad + " " + (c.tur || "")).toLocaleLowerCase("tr").includes(q)).sort((a, b) => sayi(b.bakiye) - sayi(a.bakiye) || a.ad.localeCompare(b.ad, "tr"));
      kutu.innerHTML = "";
      if (!liste.length) {
        kutu.appendChild(bosDurum("Cari bulunamad\u0131"));
        return;
      }
      liste.forEach((c) => {
        const r = butonSatir(() => cariDetay(c.cari_id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", c.ad));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "rozet", c.tur || "Di\u011Fer"));
        if (!c.aktif) alt.appendChild(el("span", "rozet", "pasif"));
        if (c.son_islem) alt.appendChild(el("span", "", "son: " + trTarih(c.son_islem)));
        sol.appendChild(alt);
        const sag2 = el("div");
        const b = sayi(c.bakiye);
        sag2.appendChild(el("div", "tutar " + (b > 4e-3 ? "k" : ""), b > 4e-3 ? paraTam(b) : "\u2014"));
        sag2.appendChild(el("div", "tarih", b > 4e-3 ? "bor\xE7" : "bor\xE7 yok"));
        r.append(sol, sag2);
        kutu.appendChild(r);
      });
    }
    ai.oninput = ciz;
    ciz();
    return k;
  }
  async function cariDetay(id) {
    const c = D.cariBakiye.find((x) => x.cari_id === id);
    const ham = D.cariler.find((x) => x.id === id);
    if (!c || !ham) return;
    const g = el("div", "yigin");
    const bakiye = sayi(c.bakiye);
    const borclanmaVar = sayi(c.toplam_borclanma) > 4e-3 || sayi(ham.acilis_bakiye) > 4e-3;
    const pesin = !borclanmaVar && bakiye < -4e-3;
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
      sat("T\xFCr", ham.tur || "\u2014"),
      sat("Telefon", ham.telefon || "\u2014"),
      sat("A\xE7\u0131l\u0131\u015F bakiyesi", para(ham.acilis_bakiye)),
      sat("Toplam bor\xE7lanma", para(c.toplam_borclanma)),
      sat("Toplam \xF6deme", para(c.toplam_odeme), "var(--gelir-ink)")
    );
    if (sayi(c.toplam_tahsilat) > 4e-3) {
      kart.appendChild(sat("Ondan al\u0131nan", para(c.toplam_tahsilat), "var(--uyari-ink)"));
    }
    if (pesin) {
      kart.appendChild(sat("DURUM", "Bor\xE7 yok", "var(--ink3)"));
      const n = el(
        "p",
        "altbilgi",
        `Bu cariye toplam ${paraTam(-bakiye)} \xF6denmi\u015F, \xF6nceden girilmi\u015F bir bor\xE7lanma kayd\u0131 yok \u2014 pe\u015Fin \xE7al\u0131\u015F\u0131ld\u0131\u011F\u0131 i\xE7in normal.`
      );
      n.style.cssText = "padding:0 14px 12px;margin:0";
      kart.appendChild(n);
    } else {
      kart.appendChild(sat(
        "KALAN BOR\xC7",
        para(bakiye),
        bakiye > 4e-3 ? "var(--gider-ink)" : "var(--ink3)"
      ));
    }
    if (ham.notlar) kart.appendChild(sat("Not", ham.notlar));
    g.appendChild(kart);
    const yukleniyor = el("div", "bos", "Hareketler y\xFCkleniyor\u2026");
    g.appendChild(yukleniyor);
    const ayak = el("div");
    const duzenB = el("button", "btn sade", "D\xFCzenle");
    duzenB.style.flex = "0 0 auto";
    const borcB = el("button", "btn", "Bor\xE7land\u0131m");
    const odeB = el("button", "btn ana", "\xD6deme yap");
    ayak.append(duzenB, borcB, odeB);
    const m = modalAc({ baslik: ham.ad, govde: g, ayak });
    duzenB.onclick = () => {
      m.kapat();
      cariFormu(ham);
    };
    borcB.onclick = () => {
      m.kapat();
      borcFormu(null, id);
    };
    odeB.onclick = () => {
      m.kapat();
      hareketFormu(null, { tur: "gider", cari_id: id, baslik: "\xD6deme: " + ham.ad, tarih: bugun() });
    };
    try {
      const borclar = await borclanmalar(id);
      yukleniyor.remove();
      const kayitlar = [
        ...borclar.map((b) => ({
          tip: "borc",
          tarih: b.tarih,
          tutar: sayi(b.tutar),
          etki: sayi(b.tutar),
          // borç artar
          baslik: b.aciklama || "Bor\xE7lanma",
          ham: b
        })),
        ...D.hareketler.filter((h) => h.cari_id === id).map((h) => ({
          tip: h.tur === "gelir" ? "tahsilat" : "odeme",
          tarih: h.tarih,
          tutar: sayi(h.tutar),
          etki: h.tur === "gelir" ? sayi(h.tutar) : -sayi(h.tutar),
          baslik: h.baslik || h.aciklama || h.kategori,
          ham: h
        }))
      ].sort((a, b) => a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : 0);
      if (!kayitlar.length) {
        g.appendChild(bosDurum(
          "Bu cariye ait hareket yok",
          "Bor\xE7land\u0131m ya da \xD6deme yap ile ilk kayd\u0131 gir."
        ));
        return;
      }
      const s2 = el("section", "panel");
      const b2 = el("div", "grafik-basi");
      b2.style.padding = "14px 14px 4px";
      b2.appendChild(el("h3", "", `Cari hareketleri (${kayitlar.length})`));
      s2.appendChild(b2);
      const l = el("div", "liste");
      let kalan = bakiye;
      let sonAy = null;
      const bugunIso = bugun();
      kayitlar.forEach((k2) => {
        const a = ayAnahtar(k2.tarih);
        if (a !== sonAy) {
          sonAy = a;
          l.appendChild(el("div", "grup-basi", ayAdi(a)));
        }
        const r = butonSatir(() => {
          m.kapat();
          if (k2.tip === "borc") borcFormu(k2.ham, id);
          else hareketFormu(k2.ham);
        });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", k2.baslik));
        const alt = el("div", "alt");
        const rozet = { borc: ["Bor\xE7lanma", "kotu"], odeme: ["\xD6deme", "iyi"], tahsilat: ["Tahsilat", "uyari"] }[k2.tip];
        alt.appendChild(el("span", "rozet " + rozet[1], rozet[0]));
        alt.appendChild(el("span", "", trTarihUzun(k2.tarih)));
        if (k2.tip === "borc" && k2.ham.vade) {
          const f = gunFarki(k2.ham.vade);
          alt.appendChild(el(
            "span",
            "rozet " + (f < 0 ? "kotu" : f <= 7 ? "uyari" : ""),
            f < 0 ? `${-f} g\xFCn gecikti` : `vade ${trTarih(k2.ham.vade)}`
          ));
        }
        if (k2.tip !== "borc") alt.appendChild(el("span", "", "\xB7 " + hesapAdi(k2.ham.hesap_id)));
        sol.appendChild(alt);
        const sag = el("div");
        sag.appendChild(el(
          "div",
          "tutar " + (k2.etki > 0 ? "k" : "g"),
          (k2.etki > 0 ? "+" : "\u2212") + para(k2.tutar)
        ));
        if (!pesin) {
          sag.appendChild(el("div", "tarih", "kalan " + paraTam(kalan)));
        }
        kalan -= k2.etki;
        r.append(sol, sag);
        l.appendChild(r);
      });
      s2.appendChild(l);
      if (pesin) {
        const n = el(
          "p",
          "altbilgi",
          "Bor\xE7lanma kayd\u0131 olmad\u0131\u011F\u0131 i\xE7in sat\u0131rlarda y\xFCr\xFCyen bakiye g\xF6sterilmiyor."
        );
        n.style.cssText = "padding:10px 14px 14px;margin:0";
        s2.appendChild(n);
      }
      g.appendChild(s2);
    } catch (e) {
      yukleniyor.textContent = e.message;
    }
  }
  function cariFormu(mevcut, onAyar = {}) {
    const yeni = !mevcut;
    const g = el("div");
    const adL = el("label", "alan", "CAR\u0130 ADI");
    const ad = el("input");
    ad.type = "text";
    ad.value = mevcut?.ad ?? "";
    adL.appendChild(ad);
    g.appendChild(adL);
    const turL = el("label", "alan", "T\xDCR");
    const tur = el("select");
    seceneklerGrubu("cari_turu").forEach((a) => {
      const o = el("option", "", a);
      o.value = a;
      tur.appendChild(o);
    });
    tur.value = mevcut?.tur ?? "Tedarik\xE7i";
    turL.appendChild(tur);
    g.appendChild(turL);
    const i = el("div", "ikili");
    const telL = el("label", "alan", "TELEFON");
    const tel = el("input");
    tel.type = "tel";
    tel.inputMode = "tel";
    tel.value = mevcut?.telefon ?? "";
    telL.appendChild(tel);
    const acL = el("label", "alan", "A\xC7ILI\u015E BAK\u0130YES\u0130 (\u20BA)");
    const ac = el("input");
    ac.type = "number";
    ac.step = "0.01";
    ac.inputMode = "decimal";
    ac.value = mevcut?.acilis_bakiye ?? 0;
    acL.appendChild(ac);
    i.append(telL, acL);
    g.appendChild(i);
    const notL = el("label", "alan", "NOTLAR");
    const not = el("textarea");
    not.value = mevcut?.notlar ?? "";
    notL.appendChild(not);
    g.appendChild(notL);
    const aktL = el("label", "onay-kutu");
    const akt = el("input");
    akt.type = "checkbox";
    akt.checked = mevcut ? mevcut.aktif : true;
    aktL.append(akt, document.createTextNode("Kullan\u0131mda (kapat\u0131l\u0131rsa listelerde \xE7\u0131kmaz, ge\xE7mi\u015Fi durur)"));
    g.appendChild(aktL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni) ayak.insertBefore(silDugmesi(
      "Cari silinsin mi?",
      `${mevcut.ad} silinecek. Bu cariye ait bor\xE7lanma kay\u0131tlar\u0131 da silinir; kasa hareketleri silinmez ama cari ba\u011Flant\u0131s\u0131 kopar.

Sadece listede g\xF6rmek istemiyorsan silmek yerine "Kullan\u0131mda" i\u015Faretini kald\u0131r.`,
      () => cariSil(mevcut.id),
      () => m.kapat()
    ), iptal);
    const m = modalAc({ baslik: yeni ? "Yeni cari" : "Cariyi d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      if (!ad.value.trim()) {
        bildir("Cari ad\u0131n\u0131 gir", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        const kayit = await cariYaz({
          ad: ad.value.trim(),
          tur: tur.value,
          telefon: tel.value.trim() || null,
          acilis_bakiye: sayi(ac.value),
          notlar: not.value.trim() || null,
          aktif: akt.checked
        }, mevcut?.id);
        m.kapat();
        bildir("Kaydedildi", "iyi");
        if (onAyar.sonra) {
          listeyeEkle("cariler", kayit);
          onAyar.sonra(kayit);
        } else yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function silDugmesi(baslik, uyari, silmeIslemi, kapat) {
    const b = el("button", "btn tehlike", "Sil");
    b.type = "button";
    b.style.flex = "0 0 auto";
    b.onclick = async () => {
      if (!await onayla(baslik, uyari, "Sil")) return;
      b.disabled = true;
      try {
        await silmeIslemi();
        kapat();
        bildir("Silindi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        b.disabled = false;
      }
    };
    return b;
  }
  function borcFormu(mevcut, cariId) {
    const yeni = !mevcut;
    const g = el("div");
    const i = el("div", "ikili");
    const tutL = el("label", "alan", "TUTAR (\u20BA)");
    const tut = el("input");
    tut.type = "number";
    tut.step = "0.01";
    tut.min = "0";
    tut.inputMode = "decimal";
    tut.value = mevcut?.tutar ?? "";
    tutL.appendChild(tut);
    const tarL = el("label", "alan", "TAR\u0130H");
    const tar = el("input");
    tar.type = "date";
    tar.value = mevcut?.tarih ?? bugun();
    tarL.appendChild(tar);
    i.append(tutL, tarL);
    g.appendChild(i);
    const vadL = el("label", "alan", "VADE (iste\u011Fe ba\u011Fl\u0131)");
    const vad = el("input");
    vad.type = "date";
    vad.value = mevcut?.vade ?? "";
    vadL.appendChild(vad);
    g.appendChild(vadL);
    const acL = el("label", "alan", "A\xC7IKLAMA");
    const ac = el("input");
    ac.type = "text";
    ac.placeholder = "\xD6rn. 2 \xE7uval un";
    ac.value = mevcut?.aciklama ?? "";
    acL.appendChild(ac);
    g.appendChild(acL);
    g.appendChild(Object.assign(el("p", "altbilgi", "Bor\xE7lanma kasadan para \xE7\u0131karmaz \u2014 sadece bu cariye olan borcunu art\u0131r\u0131r. Paray\u0131 \xF6dedi\u011Finde \u201C\xD6deme yap\u201D de."), { style: "margin:0" }));
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni) {
      const silB = el("button", "btn tehlike", "Sil");
      silB.style.flex = "0 0 auto";
      ayak.insertBefore(silB, iptal);
      silB.onclick = async () => {
        if (!await onayla("Bor\xE7lanma silinsin mi?", para(mevcut.tutar), "Sil")) return;
        try {
          await borcSil(mevcut.id);
          m.kapat();
          bildir("Silindi");
          yenile(true);
        } catch (e) {
          bildir(e.message, "kotu");
        }
      };
    }
    const m = modalAc({ baslik: yeni ? "Bor\xE7lanma ekle" : "Bor\xE7lanmay\u0131 d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      const t = parseFloat(String(tut.value).replace(",", "."));
      if (!(t > 0)) {
        bildir("Tutar girmelisin", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        await borcYaz({
          cari_id: cariId,
          tarih: tar.value || bugun(),
          tutar: t,
          vade: vad.value || null,
          aciklama: ac.value.trim() || null
        }, mevcut?.id);
        m.kapat();
        bildir("Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function musteriler() {
    const k = el("div", "yigin");
    const bas = el("div", "ekran-basi");
    bas.appendChild(el("h2", "", "M\xFC\u015Fteriler"));
    const sag = el("div", "sag");
    const ekle = el("button", "btn ana kucuk", "+ M\xFC\u015Fteri");
    ekle.onclick = () => musteriFormu(null);
    sag.appendChild(ekle);
    bas.appendChild(sag);
    k.appendChild(bas);
    const f = el("div", "filtreler");
    const ara = el("div", "ara");
    const ai = el("input");
    ai.type = "search";
    ai.placeholder = "M\xFC\u015Fteri ara\u2026";
    ai.setAttribute("aria-label", "M\xFC\u015Fteri ara");
    ara.appendChild(ai);
    f.appendChild(ara);
    k.appendChild(f);
    const kutu = el("section", "panel liste");
    k.appendChild(kutu);
    function ciz() {
      const q = ai.value.toLocaleLowerCase("tr");
      const liste = D.musteriler.filter((m) => !q || m.ad.toLocaleLowerCase("tr").includes(q));
      kutu.innerHTML = "";
      if (!liste.length) {
        kutu.appendChild(bosDurum("M\xFC\u015Fteri bulunamad\u0131"));
        return;
      }
      liste.forEach((mu) => {
        const isler = D.orgOzet.filter((o) => o.musteri_id === mu.id);
        const ciro = isler.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
        const r = butonSatir(() => musteriDetay(mu.id));
        const sol = el("div");
        sol.appendChild(el("div", "baslik", mu.ad));
        const alt = el("div", "alt");
        alt.appendChild(el("span", "", `${isler.length} i\u015F`));
        if (mu.telefon) alt.appendChild(el("span", "", "\xB7 " + mu.telefon));
        sol.appendChild(alt);
        r.append(sol, el("div", "tutar", paraTam(ciro)));
        kutu.appendChild(r);
      });
    }
    ai.oninput = ciz;
    ciz();
    return k;
  }
  function musteriDetay(id) {
    const mu = D.musteriler.find((x) => x.id === id);
    if (!mu) return;
    const g = el("div", "yigin");
    const isler = D.orgOzet.filter((o) => o.musteri_id === id);
    const ciro = isler.reduce((t, o) => t + sayi(o.toplam_ucret), 0);
    const kalan = isler.reduce((t, o) => t + Math.max(0, sayi(o.kalan_odeme)), 0);
    const kart = el("div", "panel");
    const sat = (e, d) => {
      const r = el("div", "detay-satir");
      r.appendChild(el("div", "e", e));
      r.appendChild(el("div", "d", d));
      return r;
    };
    kart.append(
      sat("Telefon", mu.telefon || "\u2014"),
      sat("Instagram", mu.instagram || "\u2014"),
      sat("Toplam i\u015F", String(isler.length)),
      sat("Toplam ciro", para(ciro)),
      sat("Kalan alacak", para(kalan))
    );
    if (mu.notlar) kart.appendChild(sat("Not", mu.notlar));
    g.appendChild(kart);
    if (isler.length) {
      const s = el("section", "panel");
      const b = el("div", "grafik-basi");
      b.style.padding = "14px 14px 4px";
      b.appendChild(el("h3", "", "\u0130\u015Fleri"));
      s.appendChild(b);
      const l = el("div", "liste");
      isler.forEach((o) => {
        const r = butonSatir(() => {
          m.kapat();
          orgDetay(o.organizasyon_id);
        });
        const sol = el("div");
        sol.appendChild(el("div", "baslik", o.ad));
        sol.appendChild(el("div", "alt", trTarihUzun(o.tarih) + " \xB7 " + o.durum));
        r.append(sol, el("div", "tutar", paraTam(o.toplam_ucret)));
        l.appendChild(r);
      });
      s.appendChild(l);
      g.appendChild(s);
    }
    const ayak = el("div");
    const duzen = el("button", "btn", "D\xFCzenle");
    const kapat = el("button", "btn ana", "Kapat");
    ayak.append(duzen, kapat);
    const m = modalAc({ baslik: mu.ad, govde: g, ayak });
    duzen.onclick = () => {
      m.kapat();
      musteriFormu(mu);
    };
    kapat.onclick = () => m.kapat();
  }
  function musteriFormu(mevcut, onAyar = {}) {
    const yeni = !mevcut;
    const g = el("div");
    const adL = el("label", "alan", "AD SOYAD");
    const ad = el("input");
    ad.type = "text";
    ad.value = mevcut?.ad ?? "";
    adL.appendChild(ad);
    g.appendChild(adL);
    const i = el("div", "ikili");
    const telL = el("label", "alan", "TELEFON");
    const tel = el("input");
    tel.type = "tel";
    tel.inputMode = "tel";
    tel.value = mevcut?.telefon ?? "";
    telL.appendChild(tel);
    const insL = el("label", "alan", "INSTAGRAM");
    const ins = el("input");
    ins.type = "text";
    ins.value = mevcut?.instagram ?? "";
    insL.appendChild(ins);
    i.append(telL, insL);
    g.appendChild(i);
    const notL = el("label", "alan", "NOTLAR");
    const not = el("textarea");
    not.value = mevcut?.notlar ?? "";
    notL.appendChild(not);
    g.appendChild(notL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", yeni ? "Ekle" : "Kaydet");
    ayak.append(iptal, kaydet);
    if (!yeni) {
      const isSayisi = D.orgOzet.filter((o) => o.musteri_id === mevcut.id).length;
      ayak.insertBefore(silDugmesi(
        "M\xFC\u015Fteri silinsin mi?",
        `${mevcut.ad} silinecek.` + (isSayisi ? ` Bu m\xFC\u015Fteriye ba\u011Fl\u0131 ${isSayisi} i\u015F var; i\u015Fler silinmez ama m\xFC\u015Fterisiz kal\u0131r.` : ""),
        () => musteriSil(mevcut.id),
        () => m.kapat()
      ), iptal);
    }
    const m = modalAc({ baslik: yeni ? "Yeni m\xFC\u015Fteri" : "M\xFC\u015Fteriyi d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      if (!ad.value.trim()) {
        bildir("Ad gir", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        const kayit = await musteriYaz({
          ad: ad.value.trim(),
          telefon: tel.value.trim() || null,
          instagram: ins.value.trim() || null,
          notlar: not.value.trim() || null
        }, mevcut?.id);
        m.kapat();
        bildir("Kaydedildi", "iyi");
        if (onAyar.sonra) {
          listeyeEkle("musteriler", kayit);
          onAyar.sonra(kayit);
        } else yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function raporlar() {
    const k = el("div", "yigin");
    const bas = el("div", "ekran-basi");
    bas.appendChild(el("h2", "", "Raporlar"));
    const sag = el("div", "sag");
    sag.appendChild(donemSecici(yenile));
    bas.appendChild(sag);
    k.appendChild(bas);
    const aylar = son12Ay();
    const enb = Math.max(1, ...aylar.map((a) => Math.max(a.gelir, a.gider)));
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
    [0, 0.5, 1].forEach((fr) => {
      const l = el("div", "cizgi");
      l.style.top = (1 - fr) * 100 + "%";
      const y = el("div", "yazi", paraKisa(tavan * fr));
      y.style.top = (1 - fr) * 100 + "%";
      izg.append(l, y);
    });
    su.appendChild(izg);
    const aylarE = el("div", "aylar");
    aylar.forEach((a) => {
      const m = el("div", "ay");
      const b1 = el("div", "cubuk g");
      b1.style.height = Math.max(2, a.gelir / tavan * 100) + "%";
      const b2 = el("div", "cubuk k");
      b2.style.height = Math.max(2, a.gider / tavan * 100) + "%";
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
    aylar.forEach((a) => adlar.appendChild(el("span", "", AY_KISA[a.ay])));
    su.appendChild(adlar);
    g1.appendChild(su);
    k.appendChild(g1);
    const g2 = el("section", "panel grafik-kutu");
    const gb2 = el("div", "grafik-basi");
    gb2.appendChild(el("h3", "", "Kategori da\u011F\u0131l\u0131m\u0131"));
    const seg = el("div", "segment");
    [["gider", "Gider", "k"], ["gelir", "Gelir", "g"]].forEach(([kod, ad, sn]) => {
      const b = el("button", sn, ad);
      b.type = "button";
      b.setAttribute("aria-pressed", String(U.katTur === kod));
      b.onclick = () => {
        U.katTur = kod;
        yenile();
      };
      seg.appendChild(b);
    });
    gb2.appendChild(seg);
    g2.appendChild(gb2);
    const dh = donemHareketleri().filter((h) => h.tur === U.katTur);
    const gruplar = {};
    dh.forEach((h) => {
      gruplar[h.kategori] = (gruplar[h.kategori] || 0) + sayi(h.tutar);
    });
    const sirali = Object.entries(gruplar).map(([ad, deg]) => ({ ad, deg })).sort((a, b) => b.deg - a.deg);
    const toplamK = sirali.reduce((t, x) => t + x.deg, 0);
    if (!sirali.length) g2.appendChild(bosDurum("Bu d\xF6nemde kay\u0131t yok"));
    else {
      const kl = el("div", "kat-liste");
      const enB = sirali[0].deg || 1;
      const renk = U.katTur === "gider" ? "var(--gider)" : "var(--gelir)";
      sirali.slice(0, 10).forEach((x) => {
        const r = el("div", "kat");
        r.appendChild(el("div", "ad", x.ad));
        r.appendChild(el("div", "deg", `${paraTam(x.deg)} \xB7 %${toplamK ? Math.round(x.deg / toplamK * 100) : 0}`));
        const yol = el("div", "yol");
        const i = el("i");
        i.style.width = Math.max(1.5, x.deg / enB * 100) + "%";
        i.style.background = renk;
        yol.appendChild(i);
        r.appendChild(yol);
        kl.appendChild(r);
      });
      g2.appendChild(kl);
    }
    k.appendChild(g2);
    if (D.defter === "is") {
      const karli = D.orgOzet.filter((o) => sayi(o.toplam_ucret) > 0).sort((a, b) => sayi(b.kar) - sayi(a.kar)).slice(0, 10);
      if (karli.length) {
        const s = el("section", "panel");
        const b = el("div", "grafik-basi");
        b.style.padding = "14px 14px 4px";
        b.appendChild(el("h3", "", "En k\xE2rl\u0131 i\u015Fler"));
        s.appendChild(b);
        const t = el("div", "tablo-sar");
        let h = `<table class="veri"><thead><tr><th>\u0130\u015F</th><th>\xDCcret</th><th>Maliyet</th><th>K\xE2r</th></tr></thead><tbody>`;
        karli.forEach((o) => {
          h += `<tr><td>${kacis(o.ad)}</td><td class="para">${paraTam(o.toplam_ucret)}</td><td class="para">${paraTam(o.gercek_maliyet)}</td><td class="para" style="font-weight:600;color:${sayi(o.kar) < 0 ? "var(--gider-ink)" : "var(--gelir-ink)"}">${paraTam(o.kar)}</td></tr>`;
        });
        h += `</tbody></table>`;
        t.innerHTML = h;
        s.appendChild(t);
        k.appendChild(s);
      }
      const turler = {};
      D.orgOzet.forEach((o) => {
        if (!o.tur) return;
        const t = turler[o.tur] || (turler[o.tur] = { adet: 0, ciro: 0, kar: 0 });
        t.adet++;
        t.ciro += sayi(o.toplam_ucret);
        t.kar += sayi(o.kar);
      });
      const tl = Object.entries(turler).sort((a, b) => b[1].ciro - a[1].ciro);
      if (tl.length) {
        const s = el("section", "panel");
        const b = el("div", "grafik-basi");
        b.style.padding = "14px 14px 4px";
        b.appendChild(el("h3", "", "Etkinlik t\xFCr\xFCne g\xF6re"));
        s.appendChild(b);
        const t = el("div", "tablo-sar");
        let h = `<table class="veri"><thead><tr><th>T\xFCr</th><th>Adet</th><th>Ciro</th><th>Ort. \xFCcret</th></tr></thead><tbody>`;
        tl.forEach(([ad, v]) => {
          h += `<tr><td>${kacis(ad)}</td><td class="para">${v.adet}</td><td class="para">${paraTam(v.ciro)}</td><td class="para">${paraTam(v.ciro / v.adet)}</td></tr>`;
        });
        h += `</tbody></table>`;
        t.innerHTML = h;
        s.appendChild(t);
        k.appendChild(s);
      }
    }
    if (D.defter === "is" && sahip()) {
      const [db, ds] = aralik();
      const donemli = D.hareketler.filter((h) => h.tarih >= db && h.tarih <= ds);
      const yevmiye = donemli.filter((h) => h.tur === "gider" && h.kategori === "Sahip yevmiyesi");
      const karPayi = donemli.filter((h) => h.tur === "cekis");
      const sermaye = donemli.filter((h) => h.tur === "giris");
      const tY = yevmiye.reduce((t, h) => t + sayi(h.tutar), 0);
      const tK = karPayi.reduce((t, h) => t + sayi(h.tutar), 0);
      const tS = sermaye.reduce((t, h) => t + sayi(h.tutar), 0);
      if (tY || tK || tS) {
        const sc = el("section", "panel");
        const bc = el("div", "grafik-basi");
        bc.style.padding = "14px 14px 4px";
        bc.appendChild(el("h3", "", "Sahip \xE7eki\u015Fleri"));
        const tt = el("div", "bn");
        tt.style.fontSize = "22px";
        tt.textContent = paraTam(tY + tK);
        bc.appendChild(tt);
        sc.appendChild(bc);
        const dl = el("div");
        const sat = (e, d, alt, renk) => {
          const r = el("div", "detay-satir");
          const sol = el("div");
          sol.appendChild(el("div", "e", e));
          if (alt) {
            const a = el("div", "altbilgi", alt);
            a.style.marginTop = "2px";
            sol.appendChild(a);
          }
          r.appendChild(sol);
          const dd = el("div", "d", d);
          if (renk) dd.style.color = renk;
          r.appendChild(dd);
          return r;
        };
        dl.appendChild(sat(
          `Yevmiye (${yevmiye.length})`,
          paraTam(tY),
          "Gider say\u0131l\u0131r, k\xE2r\u0131 d\xFC\u015F\xFCr\xFCr",
          "var(--gider-ink)"
        ));
        dl.appendChild(sat(
          `K\xE2r pay\u0131 (${karPayi.length})`,
          paraTam(tK),
          "Gider say\u0131lmaz, k\xE2r etkilenmez",
          "var(--bilgi-ink)"
        ));
        if (tS) {
          dl.appendChild(sat(
            `Konulan sermaye (${sermaye.length})`,
            paraTam(tS),
            "Gelir say\u0131lmaz",
            "var(--gelir-ink)"
          ));
        }
        sc.appendChild(dl);
        const nt = el(
          "p",
          "altbilgi",
          "K\xE2r pay\u0131 \xE7eki\u015Fleri kasadan \xE7\u0131kar ama k\xE2r hesab\u0131na girmez \u2014 k\xE2r ile eldeki nakit farkl\u0131 \u015Feylerdir."
        );
        nt.style.cssText = "padding:0 14px 14px;margin:6px 0 0";
        sc.appendChild(nt);
        k.appendChild(sc);
      }
    }
    const s3 = el("section", "panel");
    const b3 = el("div", "grafik-basi");
    b3.style.padding = "14px 14px 4px";
    b3.appendChild(el("h3", "", "Ayl\u0131k d\xF6k\xFCm"));
    s3.appendChild(b3);
    const t3 = el("div", "tablo-sar");
    let h3 = `<table class="veri"><thead><tr><th>Ay</th><th>Gelir</th><th>Gider</th><th>Net</th></tr></thead><tbody>`;
    let tg = 0, tk = 0;
    aylar.slice().reverse().forEach((a) => {
      tg += a.gelir;
      tk += a.gider;
      const n = a.gelir - a.gider;
      h3 += `<tr><td>${AY_UZUN[a.ay]} ${a.yil}</td><td class="para">${paraTam(a.gelir)}</td><td class="para">${paraTam(a.gider)}</td><td class="para" style="font-weight:600;color:${n < 0 ? "var(--gider-ink)" : "var(--gelir-ink)"}">${paraTam(n)}</td></tr>`;
    });
    h3 += `</tbody><tfoot><tr><th>12 ay</th><th>${paraTam(tg)}</th><th>${paraTam(tk)}</th><th>${paraTam(tg - tk)}</th></tr></tfoot></table>`;
    t3.innerHTML = h3;
    s3.appendChild(t3);
    k.appendChild(s3);
    return k;
  }
  function son12Ay() {
    const d = /* @__PURE__ */ new Date(), out = [];
    for (let i = 11; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      out.push({
        yil: m.getFullYear(),
        ay: m.getMonth(),
        bas: isoTarih(m),
        son: isoTarih(new Date(m.getFullYear(), m.getMonth() + 1, 0)),
        gelir: 0,
        gider: 0
      });
    }
    D.hareketler.forEach((h) => {
      for (const a of out) {
        if (h.tarih >= a.bas && h.tarih <= a.son) {
          if (h.tur === "gelir") a.gelir += sayi(h.tutar);
          else if (h.tur === "gider") a.gider += sayi(h.tutar);
          break;
        }
      }
    });
    return out;
  }
  function ayarlar() {
    const k = el("div", "yigin");
    k.appendChild(Object.assign(el("div", "ekran-basi"), { innerHTML: "<h2>Ayarlar</h2>" }));
    const s1 = el("section", "panel");
    s1.appendChild(bolumBasi("Hesaplar", yetkili() ? { ad: "+ Hesap", tikla: () => hesapFormu(null) } : null));
    const l1 = el("div", "liste");
    D.hesaplar.filter((h) => h.defter === D.defter).forEach((h) => {
      const r = yetkili() ? butonSatir(() => hesapFormu(h)) : el("div", "satir");
      const sol = el("div");
      sol.appendChild(el("div", "baslik", h.ad));
      const alt = el("div", "alt");
      alt.appendChild(el("span", "", h.tur === "nakit" ? "Nakit" : "Banka"));
      if (h.tur !== "nakit") {
        alt.appendChild(el(
          "span",
          h.iban ? "" : "rozet uyari",
          h.iban ? "\xB7 " + ibanBicim(h.iban) : "IBAN yok"
        ));
      }
      if (!h.aktif) alt.appendChild(el("span", "rozet", "pasif"));
      sol.appendChild(alt);
      r.append(sol, el("div", "tutar", para(h.acilis_bakiye)));
      l1.appendChild(r);
    });
    s1.appendChild(l1);
    s1.appendChild(Object.assign(el("p", "altbilgi", "Tutarlar a\xE7\u0131l\u0131\u015F bakiyesidir; g\xFCncel bakiye Panel'de g\xF6r\xFCn\xFCr."), { style: "padding:0 14px 14px;margin:0" }));
    k.appendChild(s1);
    const s2 = el("section", "panel");
    s2.appendChild(bolumBasi("Kategoriler", yetkili() ? { ad: "+ Kategori", tikla: () => kategoriFormu() } : null));
    ["gelir", "gider"].forEach((tur) => {
      s2.appendChild(el("div", "grup-basi", tur === "gelir" ? "Gelir" : "Gider"));
      const sar = el("div");
      sar.style.cssText = "display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px";
      D.kategoriler.filter((c) => c.defter === D.defter && c.tur === tur).forEach((c) => {
        const cip = el("span", "rozet", c.ad);
        if (sahip()) {
          cip.style.cursor = "pointer";
          cip.title = "Kald\u0131r";
          cip.onclick = async () => {
            if (!await onayla("Kategori kald\u0131r\u0131ls\u0131n m\u0131?", `${c.ad} \u2014 eski kay\u0131tlar silinmez.`, "Kald\u0131r")) return;
            try {
              await kategoriSil(c.id);
              bildir("Kald\u0131r\u0131ld\u0131");
              yenile(true);
            } catch (e) {
              bildir(e.message, "kotu");
            }
          };
        }
        sar.appendChild(cip);
      });
      s2.appendChild(sar);
    });
    k.appendChild(s2);
    if (sahip()) {
      const s3 = el("section", "panel");
      s3.appendChild(bolumBasi("Kullan\u0131c\u0131lar", null));
      const l3 = el("div", "liste");
      l3.appendChild(el("div", "bos", "Y\xFCkleniyor\u2026"));
      s3.appendChild(l3);
      k.appendChild(s3);
      profiller().then((liste) => {
        l3.innerHTML = "";
        liste.forEach((p2) => {
          const r = butonSatir(() => kullaniciFormu(p2));
          const sol = el("div");
          sol.appendChild(el("div", "baslik", p2.ad || p2.eposta));
          const alt = el("div", "alt");
          alt.appendChild(el("span", "rozet " + (p2.rol === "sahip" ? "vurgu" : ""), p2.rol));
          if (!p2.aktif) alt.appendChild(el("span", "rozet kotu", "pasif"));
          alt.appendChild(el("span", "", p2.eposta || ""));
          sol.appendChild(alt);
          r.append(sol, el("div", "tarih", `${(p2.izinli_sekmeler || []).length} sekme`));
          l3.appendChild(r);
        });
        if (!liste.length) l3.appendChild(bosDurum("Kullan\u0131c\u0131 yok"));
      }).catch((e) => {
        l3.innerHTML = "";
        l3.appendChild(bosDurum("Y\xFCklenemedi", e.message));
      });
      const s4 = el("section", "panel");
      s4.appendChild(bolumBasi("Personel davet et", null));
      const p = el("p", "altbilgi");
      p.style.cssText = "padding:0 14px 14px;margin:0";
      p.textContent = "Personelin bu adrese girip kendi e-postas\u0131yla kay\u0131t olmas\u0131 yeterli. Kay\u0131t olduktan sonra buradaki listede g\xF6r\xFCn\xFCr; sekme ve kategori izinlerini sen verirsin. Yeni kullan\u0131c\u0131lar varsay\u0131lan olarak sadece Panel ve Kasa g\xF6r\xFCr.";
      s4.appendChild(p);
      k.appendChild(s4);
    }
    if (sahip()) {
      const kisisel = D.defterler.find((d) => d.tur === "kisisel");
      if (kisisel) {
        const sp = el("section", "panel");
        sp.appendChild(bolumBasi("Ki\u015Fisel defter kilidi", null));
        const pv = el("div");
        pv.style.cssText = "padding:0 14px 14px";
        const durum = el(
          "p",
          "altbilgi",
          kisisel.pin_hash ? "PIN a\xE7\u0131k. Ki\u015Fisel deftere ge\xE7erken PIN sorulur." : "PIN yok. Ki\u015Fisel defter yaln\u0131zca senin hesab\u0131nda g\xF6r\xFCn\xFCr, ama a\xE7arken ek kilit sorulmaz."
        );
        durum.style.margin = "0 0 10px";
        pv.appendChild(durum);
        const dv2 = el("div");
        dv2.style.cssText = "display:flex;gap:10px;flex-wrap:wrap";
        const kur = el("button", "btn", kisisel.pin_hash ? "PIN'i de\u011Fi\u015Ftir" : "PIN koy");
        kur.onclick = () => pinFormu(kisisel);
        dv2.appendChild(kur);
        if (kisisel.pin_hash) {
          const kaldir = el("button", "btn tehlike", "PIN'i kald\u0131r");
          kaldir.onclick = async () => {
            if (!await onayla("PIN kald\u0131r\u0131ls\u0131n m\u0131?", "Ki\u015Fisel defter yine sadece sana g\xF6r\xFCn\xFCr, sadece ek kilit kalkar.", "Kald\u0131r")) return;
            try {
              await defterYaz(kisisel.kod, { pin_hash: null });
              bildir("PIN kald\u0131r\u0131ld\u0131");
              yenile(true);
            } catch (e) {
              bildir(e.message, "kotu");
            }
          };
          dv2.appendChild(kaldir);
        }
        pv.appendChild(dv2);
        sp.appendChild(pv);
        k.appendChild(sp);
      }
    }
    const s5 = el("section", "panel");
    s5.appendChild(bolumBasi("Veri", null));
    const dv = el("div");
    dv.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;padding:0 14px 14px";
    const disa = el("button", "btn", "Yedek indir (JSON)");
    disa.onclick = () => yedekIndir();
    const csv = el("button", "btn", "Kasa d\xF6k\xFCm\xFC (CSV)");
    csv.onclick = () => csvIndir();
    dv.append(disa, csv);
    s5.appendChild(dv);
    k.appendChild(s5);
    const s6 = el("section", "panel");
    s6.appendChild(bolumBasi("Hesab\u0131m", null));
    const hv = el("div");
    hv.style.cssText = "padding:0 14px 14px";
    hv.appendChild(Object.assign(el("p", "altbilgi", `${D.profil?.ad ?? ""} \xB7 ${D.kullanici?.email ?? ""} \xB7 ${D.profil?.rol ?? ""}`), { style: "margin:0 0 10px" }));
    const cikis = el("button", "btn tehlike", "\xC7\u0131k\u0131\u015F yap");
    cikis.onclick = async () => {
      await cikisYap();
      location.reload();
    };
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
    const ad = el("input");
    ad.type = "text";
    ad.value = mevcut?.ad ?? "";
    adL.appendChild(ad);
    g.appendChild(adL);
    const turL = el("label", "alan", "T\xDCR");
    const tur = el("select");
    [["nakit", "Nakit kasa"], ["banka", "Banka hesab\u0131"]].forEach(([k2, a]) => {
      const o = el("option", "", a);
      o.value = k2;
      tur.appendChild(o);
    });
    tur.value = mevcut?.tur ?? "banka";
    turL.appendChild(tur);
    g.appendChild(turL);
    const ibanL = el("label", "alan", "IBAN");
    const iban = el("input");
    iban.type = "text";
    iban.placeholder = "TR00 0000 0000 0000 0000 0000 00";
    iban.autocomplete = "off";
    iban.spellcheck = false;
    iban.value = mevcut?.iban ? ibanBicim(mevcut.iban) : "";
    iban.oninput = () => {
      const konum = iban.selectionEnd;
      const ham = iban.value.replace(/[^0-9A-Za-z]/g, "").toLocaleUpperCase("tr").slice(0, 32);
      const eski = iban.value;
      iban.value = ibanBicim(ham);
      if (konum === eski.length) iban.setSelectionRange(iban.value.length, iban.value.length);
    };
    ibanL.appendChild(iban);
    g.appendChild(ibanL);
    const ibanGoster = () => ibanL.classList.toggle("gizli", tur.value === "nakit");
    tur.addEventListener("change", ibanGoster);
    ibanGoster();
    const acL = el("label", "alan", "A\xC7ILI\u015E BAK\u0130YES\u0130 (\u20BA)");
    const ac = el("input");
    ac.type = "number";
    ac.step = "0.01";
    ac.inputMode = "decimal";
    ac.value = mevcut?.acilis_bakiye ?? 0;
    acL.appendChild(ac);
    g.appendChild(acL);
    const aktL = el("label", "onay-kutu");
    const akt = el("input");
    akt.type = "checkbox";
    akt.checked = mevcut ? mevcut.aktif : true;
    aktL.append(akt, document.createTextNode("Kullan\u0131mda"));
    g.appendChild(aktL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "Kaydet");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: yeni ? "Yeni hesap" : "Hesab\u0131 d\xFCzenle", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      if (!ad.value.trim()) {
        bildir("Ad gir", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        await hesapYaz({
          defter: D.defter,
          ad: ad.value.trim(),
          tur: tur.value,
          iban: tur.value === "nakit" ? null : iban.value.replace(/\s+/g, "") || null,
          acilis_bakiye: sayi(ac.value),
          aktif: akt.checked,
          sira: mevcut?.sira ?? D.hesaplar.length + 1
        }, mevcut?.id);
        m.kapat();
        bildir("Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function pinFormu(defter) {
    const g = el("div");
    const l1 = el("label", "alan", "YEN\u0130 PIN (en az 4 hane)");
    const p1 = el("input");
    p1.type = "password";
    p1.inputMode = "numeric";
    p1.autocomplete = "off";
    l1.appendChild(p1);
    const l2 = el("label", "alan", "PIN TEKRAR");
    const p2 = el("input");
    p2.type = "password";
    p2.inputMode = "numeric";
    p2.autocomplete = "off";
    l2.appendChild(p2);
    g.append(l1, l2);
    const not = el("p", "altbilgi", "PIN bu cihazda saklanmaz, sunucuda \xF6zeti tutulur. Unutursan buradan yenisini koyabilirsin \u2014 verine bir \u015Fey olmaz.");
    not.style.margin = "0";
    g.appendChild(not);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "Kaydet");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: "Ki\u015Fisel defter PIN'i", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    setTimeout(() => p1.focus(), 60);
    kaydet.onclick = async () => {
      if (p1.value.length < 4) {
        bildir("PIN en az 4 hane olmal\u0131", "kotu");
        return;
      }
      if (p1.value !== p2.value) {
        bildir("PIN'ler ayn\u0131 de\u011Fil", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        const ozet = await window.mksPinOzet(p1.value);
        await defterYaz(defter.kod, { pin_hash: ozet });
        m.kapat();
        bildir("PIN kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function kategoriFormu() {
    const g = el("div");
    const turL = el("label", "alan", "T\xDCR");
    const tur = el("select");
    [["gider", "Gider"], ["gelir", "Gelir"]].forEach(([k2, a]) => {
      const o = el("option", "", a);
      o.value = k2;
      tur.appendChild(o);
    });
    turL.appendChild(tur);
    g.appendChild(turL);
    const adL = el("label", "alan", "KATEGOR\u0130 ADI");
    const ad = el("input");
    ad.type = "text";
    adL.appendChild(ad);
    g.appendChild(adL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "Ekle");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: "Yeni kategori", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      if (!ad.value.trim()) {
        bildir("Ad gir", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        await kategoriYaz({
          defter: D.defter,
          tur: tur.value,
          ad: ad.value.trim(),
          sira: D.kategoriler.length + 1,
          aktif: true
        });
        m.kapat();
        bildir("Eklendi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function kullaniciFormu(p) {
    const g = el("div", "yigin");
    const kendisi = p.id === D.kullanici.id;
    const adL = el("label", "alan", "AD");
    const ad = el("input");
    ad.type = "text";
    ad.value = p.ad ?? "";
    adL.appendChild(ad);
    g.appendChild(adL);
    const rolL = el("label", "alan", "ROL");
    const rol = el("select");
    [["personel", "Personel"], ["yonetici", "Y\xF6netici"], ["sahip", "Sahip"]].forEach(([k2, a]) => {
      const o = el("option", "", a);
      o.value = k2;
      rol.appendChild(o);
    });
    rol.value = p.rol;
    rol.disabled = kendisi;
    rolL.appendChild(rol);
    g.appendChild(rolL);
    const sekLabel = el("div", "etiket", "G\xD6REB\u0130LECE\u011E\u0130 SEKMELER");
    g.appendChild(sekLabel);
    const sekKutu = el("div");
    sekKutu.style.cssText = "display:flex;flex-direction:column;gap:2px";
    const sekmeKutulari = {};
    SEKMELER.forEach((s) => {
      const l = el("label", "onay-kutu");
      const c = el("input");
      c.type = "checkbox";
      c.checked = (p.izinli_sekmeler || []).includes(s.kod);
      sekmeKutulari[s.kod] = c;
      l.append(c, document.createTextNode(s.ad));
      sekKutu.appendChild(l);
    });
    g.appendChild(sekKutu);
    const katLabel = el("div", "etiket", "G\xD6REB\u0130LECE\u011E\u0130 VE G\u0130REB\u0130LECE\u011E\u0130 KATEGOR\u0130LER");
    g.appendChild(katLabel);
    const hepsi = el("label", "onay-kutu");
    const hepsiC = el("input");
    hepsiC.type = "checkbox";
    hepsiC.checked = p.izinli_kategoriler == null;
    hepsi.append(hepsiC, document.createTextNode("Hepsi serbest"));
    g.appendChild(hepsi);
    const katKutu = el("div");
    katKutu.style.cssText = "display:flex;flex-wrap:wrap;gap:7px";
    const katKutulari = {};
    D.kategoriler.filter((c) => c.defter === "is").forEach((c) => {
      const l = el("label", "onay-kutu");
      l.style.cssText = "min-height:34px;font-size:13px";
      const cb = el("input");
      cb.type = "checkbox";
      cb.checked = p.izinli_kategoriler ? p.izinli_kategoriler.includes(c.ad) : true;
      katKutulari[c.ad] = cb;
      l.append(cb, document.createTextNode(c.ad));
      katKutu.appendChild(l);
    });
    g.appendChild(katKutu);
    const katGuncelle = () => {
      katKutu.style.opacity = hepsiC.checked ? ".45" : "1";
      katKutu.style.pointerEvents = hepsiC.checked ? "none" : "auto";
    };
    hepsiC.onchange = katGuncelle;
    katGuncelle();
    const silL = el("label", "onay-kutu");
    const silC = el("input");
    silC.type = "checkbox";
    silC.checked = !!p.silebilir;
    silL.append(silC, document.createTextNode("Kay\u0131t silebilir"));
    g.appendChild(silL);
    const aktL = el("label", "onay-kutu");
    const aktC = el("input");
    aktC.type = "checkbox";
    aktC.checked = !!p.aktif;
    aktC.disabled = kendisi;
    aktL.append(aktC, document.createTextNode("Giri\u015Fi a\xE7\u0131k"));
    g.appendChild(aktL);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "Kaydet");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: p.ad || p.eposta, govde: g, ayak });
    iptal.onclick = () => m.kapat();
    kaydet.onclick = async () => {
      kaydet.disabled = true;
      try {
        const sekmeler = Object.entries(sekmeKutulari).filter(([, c]) => c.checked).map(([k2]) => k2);
        const kategoriler = hepsiC.checked ? null : Object.entries(katKutulari).filter(([, c]) => c.checked).map(([k2]) => k2);
        await profilYaz({
          ad: ad.value.trim(),
          rol: rol.value,
          aktif: aktC.checked,
          izinli_sekmeler: sekmeler,
          izinli_kategoriler: kategoriler,
          silebilir: silC.checked
        }, p.id);
        m.kapat();
        bildir("Kaydedildi", "iyi");
        yenile(true);
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  function indir(adi, icerik, tip) {
    const blob = new Blob([icerik], { type: tip });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = adi;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }
  function yedekVerisi() {
    return {
      tarih: (/* @__PURE__ */ new Date()).toISOString(),
      defter: D.defter,
      hesaplar: D.hesaplar,
      kategoriler: D.kategoriler,
      secenekler: D.secenekler,
      musteriler: D.musteriler,
      cariler: D.cariler,
      organizasyonlar: D.organizasyonlar,
      hareketler: D.hareketler
    };
  }
  function yedekIndir() {
    const metin = JSON.stringify(yedekVerisi(), null, 2);
    if (window.masaustu) {
      window.masaustu.yedekKaydet(metin).then((yol) => bildir(yol ? "Yedek kaydedildi: " + yol : "Yedek kaydedilemedi", yol ? "iyi" : "kotu")).catch((e) => bildir(e.message, "kotu"));
      return;
    }
    indir(`mks-defteri-${bugun()}.json`, metin, "application/json");
    bildir("Yedek indirildi", "iyi");
  }
  function csvIndir() {
    const s = ["Tarih;Tur;Kategori;Baslik;Aciklama;Hesap;HedefHesap;Organizasyon;Cari;Tutar"];
    D.hareketler.slice().sort((a, b) => a.tarih < b.tarih ? -1 : 1).forEach((h) => {
      s.push([
        h.tarih,
        h.tur === "gelir" ? "Gelir" : h.tur === "transfer" ? "Transfer" : "Gider",
        h.kategori || "",
        (h.baslik || "").replace(/;/g, ","),
        (h.aciklama || "").replace(/;/g, ","),
        hesapAdi(h.hesap_id),
        h.hedef_hesap_id ? hesapAdi(h.hedef_hesap_id) : "",
        orgAdi(h.organizasyon_id) || "",
        cariAdi(h.cari_id) || "",
        sayi(h.tutar).toFixed(2).replace(".", ",")
      ].join(";"));
    });
    indir(`mks-kasa-${bugun()}.csv`, "\uFEFF" + s.join("\r\n"), "text/csv");
    bildir("CSV indirildi", "iyi");
  }

  // js/app.js
  var aktifSekme = "panel";
  function girisiGoster() {
    $("#yukleniyor").classList.add("gizli");
    $("#uygulama").classList.add("gizli");
    $("#girisEkrani").classList.remove("gizli");
  }
  var kayitModu = false;
  function girisKur() {
    const form = $("#girisForm"), hata = $("#girisHata"), btn = $("#girisBtn");
    const adAlan = $("#gAdAlan"), gecis = $("#kayitGecis");
    gecis.onclick = () => {
      kayitModu = !kayitModu;
      adAlan.classList.toggle("gizli", !kayitModu);
      btn.textContent = kayitModu ? "Kay\u0131t ol" : "Giri\u015F yap";
      gecis.textContent = kayitModu ? "Zaten hesab\u0131n var m\u0131? Giri\u015F yap" : "Hesab\u0131n yok mu? Kay\u0131t ol";
      $("#gParola").autocomplete = kayitModu ? "new-password" : "current-password";
      hata.classList.add("gizli");
    };
    $("#sifreUnuttum").onclick = async () => {
      const e = $("#gEposta").value.trim();
      if (!e) {
        hataGoster("\xD6nce e-posta adresini yaz.");
        return;
      }
      try {
        await parolaSifirla(e);
        hata.className = "basari";
        hata.textContent = "Parola s\u0131f\u0131rlama ba\u011Flant\u0131s\u0131 e-postana g\xF6nderildi.";
        hata.classList.remove("gizli");
      } catch (err) {
        hataGoster(err.message);
      }
    };
    function hataGoster(m) {
      hata.className = "hata";
      hata.textContent = m;
      hata.classList.remove("gizli");
    }
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      hata.classList.add("gizli");
      btn.disabled = true;
      const eposta = $("#gEposta").value, parola = $("#gParola").value;
      try {
        if (kayitModu) {
          const sonuc = await kayitOl(eposta, parola, $("#gAd").value);
          if (!sonuc.session) {
            hata.className = "basari";
            hata.textContent = "Kay\u0131t al\u0131nd\u0131. E-postana gelen do\u011Frulama ba\u011Flant\u0131s\u0131na t\u0131kla, sonra giri\u015F yap.";
            hata.classList.remove("gizli");
            btn.disabled = false;
            return;
          }
        } else {
          await girisYap(eposta, parola);
        }
        await baslat();
      } catch (err) {
        hataGoster(err.message);
        btn.disabled = false;
      }
    };
  }
  function gorunenSekmeler() {
    return SEKMELER.filter((s) => {
      if (D.defter !== "is" && KISISEL_KAPALI.includes(s.kod)) return false;
      if (s.kod === "ayarlar") return true;
      return sekmeVar(s.kod);
    });
  }
  function gezinmeCiz() {
    const liste = gorunenSekmeler();
    if (!liste.some((s) => s.kod === aktifSekme)) aktifSekme = liste[0]?.kod ?? "panel";
    const ray = $("#yanRay");
    ray.innerHTML = "";
    const marka = el("div", "marka", "MKS");
    marka.title = "MKS Organizasyon";
    ray.appendChild(marka);
    liste.forEach((s) => {
      if (s.kod === "ayarlar") ray.appendChild(el("div", "bosluk"));
      const b = el("button", "ray-d");
      b.type = "button";
      b.setAttribute("aria-label", s.ad);
      b.appendChild(simge(s.ikon, 22));
      b.appendChild(el("span", "ipuc", s.ad));
      if (s.kod === aktifSekme) b.setAttribute("aria-current", "page");
      b.onclick = () => git2(s.kod);
      ray.appendChild(b);
    });
    const alt = $("#altBar");
    alt.innerHTML = "";
    const gorunen = liste.slice(0, liste.length > 5 ? 4 : 5);
    const kalan = liste.slice(gorunen.length);
    gorunen.forEach((s) => alt.appendChild(altDugme(simge(s.ikon, 21), s.kisa, s.kod === aktifSekme, () => git2(s.kod))));
    if (kalan.length) {
      const aktifKalan = kalan.some((s) => s.kod === aktifSekme);
      alt.appendChild(altDugme("\xB7\xB7\xB7", "Daha", aktifKalan, () => dahaMenusu(kalan)));
    }
    $("#fabBtn").classList.toggle(
      "gizli",
      sayfaVar() || !["panel", "kasa", "organizasyonlar"].includes(aktifSekme)
    );
  }
  function altDugme(ikon, yazi, aktif, tikla) {
    const b = el("button");
    b.type = "button";
    if (aktif) b.setAttribute("aria-current", "page");
    const k = el("span", "ikon");
    if (typeof ikon === "string") k.textContent = ikon;
    else k.appendChild(ikon);
    b.appendChild(k);
    b.appendChild(el("span", "yazi", yazi));
    b.onclick = tikla;
    return b;
  }
  function dahaMenusu(kalan) {
    const g = el("div", "liste");
    kalan.forEach((s) => {
      const r = el("button", "satir");
      r.type = "button";
      const sol = el("div");
      sol.style.cssText = "display:flex;align-items:center;gap:11px";
      sol.appendChild(simge(s.ikon, 20));
      sol.appendChild(el("div", "baslik", s.ad));
      r.appendChild(sol);
      r.onclick = () => {
        m.kapat();
        git2(s.kod);
      };
      g.appendChild(r);
    });
    const m = modalAc({ baslik: "Men\xFC", govde: g });
  }
  function git2(kod) {
    sayfaTemizle();
    aktifSekme = kod;
    gezinmeCiz();
    ekranCiz();
    $("#icerik").scrollIntoView({ block: "start" });
    window.scrollTo(0, 0);
  }
  function ekranCiz() {
    const k = $("#icerik");
    k.innerHTML = "";
    let dugum;
    try {
      if (sayfaVar()) dugum = sayfaCiz();
      else switch (aktifSekme) {
        case "panel":
          dugum = panel();
          break;
        case "organizasyonlar":
          dugum = organizasyonlar();
          break;
        case "kasa":
          dugum = kasa();
          break;
        case "cariler":
          dugum = cariler();
          break;
        case "musteriler":
          dugum = musteriler();
          break;
        case "raporlar":
          dugum = raporlar();
          break;
        case "ayarlar":
          dugum = ayarlar();
          break;
        default:
          dugum = panel();
      }
    } catch (e) {
      console.error(e);
      dugum = el("div", "hata", "Ekran \xE7izilemedi: " + e.message);
    }
    k.appendChild(dugum);
  }
  async function yenile2(veriyiDeYukle = false) {
    if (veriyiDeYukle) {
      try {
        await defterVerisiYukle();
      } catch (e) {
        bildir(e.message, "kotu");
      }
    }
    gezinmeCiz();
    ekranCiz();
  }
  function defterCiz() {
    const d = D.defterler.find((x) => x.kod === D.defter);
    $("#defterAd").textContent = d?.ad ?? "Defter";
  }
  function defterMenusu() {
    const g = el("div", "liste");
    D.defterler.forEach((d) => {
      const r = el("button", "satir");
      r.type = "button";
      const sol = el("div");
      sol.appendChild(el("div", "baslik", d.ad));
      sol.appendChild(el("div", "alt", d.tur === "kisisel" ? "Ki\u015Fisel defter" : "\u0130\u015F defteri"));
      r.appendChild(sol);
      if (d.kod === D.defter) r.appendChild(el("div", "rozet vurgu", "a\xE7\u0131k"));
      r.onclick = async () => {
        m.kapat();
        if (d.kod === D.defter) return;
        if (d.pin_hash && !await pinSor(d)) return;
        D.defter = d.kod;
        localStorage.setItem("mks-defter", d.kod);
        defterCiz();
        $("#yukleniyor").classList.remove("gizli");
        try {
          await defterVerisiYukle();
        } catch (e) {
          bildir(e.message, "kotu");
        }
        $("#yukleniyor").classList.add("gizli");
        aktifSekme = "panel";
        gezinmeCiz();
        ekranCiz();
      };
      g.appendChild(r);
    });
    const m = modalAc({ baslik: "Defter se\xE7", govde: g });
  }
  async function pinSor(defter) {
    return new Promise((coz) => {
      const g = el("div");
      const l = el("label", "alan", "PIN");
      const i = el("input");
      i.type = "password";
      i.inputMode = "numeric";
      i.autocomplete = "off";
      i.placeholder = "\u2022\u2022\u2022\u2022";
      l.appendChild(i);
      g.appendChild(l);
      const ayak = el("div");
      const iptal = el("button", "btn", "Vazge\xE7");
      const ac = el("button", "btn ana", "A\xE7");
      ayak.append(iptal, ac);
      const m = modalAc({ baslik: defter.ad, govde: g, ayak });
      setTimeout(() => i.focus(), 60);
      iptal.onclick = () => {
        m.kapat();
        coz(false);
      };
      ac.onclick = async () => {
        const ozet = await pinOzet(i.value);
        if (ozet === defter.pin_hash) {
          m.kapat();
          coz(true);
        } else bildir("PIN hatal\u0131", "kotu");
      };
    });
  }
  async function pinOzet(pin) {
    const veri = new TextEncoder().encode("mks-defter:" + pin);
    const buf = await crypto.subtle.digest("SHA-256", veri);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  window.mksPinOzet = pinOzet;
  function hesapMenusu() {
    const g = el("div", "liste");
    const bilgi = el("div", "satir");
    bilgi.style.cursor = "default";
    const sol = el("div");
    sol.appendChild(el("div", "baslik", D.profil?.ad || D.kullanici?.email || ""));
    sol.appendChild(el("div", "alt", `${D.kullanici?.email ?? ""} \xB7 ${D.profil?.rol ?? ""}`));
    bilgi.appendChild(sol);
    g.appendChild(bilgi);
    const ayarB = el("button", "satir");
    ayarB.type = "button";
    ayarB.appendChild(Object.assign(el("div"), { innerHTML: '<div class="baslik">Ayarlar</div>' }));
    ayarB.onclick = () => {
      m.kapat();
      git2("ayarlar");
    };
    g.appendChild(ayarB);
    const parolaB = el("button", "satir");
    parolaB.type = "button";
    parolaB.appendChild(Object.assign(el("div"), { innerHTML: '<div class="baslik">Parolam\u0131 de\u011Fi\u015Ftir</div>' }));
    parolaB.onclick = () => {
      m.kapat();
      parolaFormu();
    };
    g.appendChild(parolaB);
    const cikisB = el("button", "satir");
    cikisB.type = "button";
    const c = el("div");
    const cb = el("div", "baslik", "\xC7\u0131k\u0131\u015F yap");
    cb.style.color = "var(--gider-ink)";
    c.appendChild(cb);
    cikisB.appendChild(c);
    cikisB.onclick = async () => {
      m.kapat();
      await cikisYap();
      location.reload();
    };
    g.appendChild(cikisB);
    const m = modalAc({ baslik: "Hesab\u0131m", govde: g });
  }
  function parolaFormu() {
    const g = el("div");
    const l1 = el("label", "alan", "YEN\u0130 PAROLA (en az 6 karakter)");
    const p1 = el("input");
    p1.type = "password";
    p1.autocomplete = "new-password";
    l1.appendChild(p1);
    const l2 = el("label", "alan", "PAROLA TEKRAR");
    const p2 = el("input");
    p2.type = "password";
    p2.autocomplete = "new-password";
    l2.appendChild(p2);
    g.append(l1, l2);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazge\xE7");
    const kaydet = el("button", "btn ana", "De\u011Fi\u015Ftir");
    ayak.append(iptal, kaydet);
    const m = modalAc({ baslik: "Parolam\u0131 de\u011Fi\u015Ftir", govde: g, ayak });
    iptal.onclick = () => m.kapat();
    setTimeout(() => p1.focus(), 60);
    kaydet.onclick = async () => {
      if (p1.value.length < 6) {
        bildir("Parola en az 6 karakter olmal\u0131", "kotu");
        return;
      }
      if (p1.value !== p2.value) {
        bildir("Parolalar ayn\u0131 de\u011Fil", "kotu");
        return;
      }
      kaydet.disabled = true;
      try {
        await parolaDegistir(p1.value);
        m.kapat();
        bildir("Parola de\u011Fi\u015Ftirildi", "iyi");
      } catch (e) {
        bildir(e.message, "kotu");
        kaydet.disabled = false;
      }
    };
  }
  async function baslat() {
    $("#yukleniyor").classList.remove("gizli");
    const oturum2 = await oturum();
    if (!oturum2) {
      girisiGoster();
      return;
    }
    D.kullanici = oturum2.user;
    let cevrimici = true;
    try {
      D.profil = await profilYukle(oturum2.user.id);
    } catch (e) {
      cevrimici = false;
      if (onbellektenYukle()) D.cevrimdisi = true;
    }
    if (!D.profil) {
      $("#yukleniyor").classList.add("gizli");
      modalAc({
        baslik: "Profil bulunamad\u0131",
        govde: `<p style="margin:0;color:var(--ink2)">Hesab\u0131n olu\u015Fturuldu ama profil kayd\u0131 yok. Bu genelde kay\u0131t s\u0131ras\u0131ndaki ge\xE7ici bir hatad\u0131r. \xC7\u0131k\u0131\u015F yap\u0131p tekrar giri\u015F yapmay\u0131 dene; sorun s\xFCrerse y\xF6neticine haber ver.</p>`,
        ayak: (() => {
          const a = el("div");
          const b = el("button", "btn ana", "\xC7\u0131k\u0131\u015F yap");
          b.onclick = async () => {
            await cikisYap();
            location.reload();
          };
          a.appendChild(b);
          return a;
        })()
      });
      return;
    }
    if (!D.profil.aktif) {
      $("#yukleniyor").classList.add("gizli");
      modalAc({
        baslik: "Giri\u015Fin kapal\u0131",
        govde: `<p style="margin:0;color:var(--ink2)">Bu hesab\u0131n giri\u015Fi y\xF6netici taraf\u0131ndan kapat\u0131lm\u0131\u015F. Eri\u015Fim i\xE7in y\xF6neticine haber ver.</p>`,
        ayak: (() => {
          const a = el("div");
          const b = el("button", "btn ana", "\xC7\u0131k\u0131\u015F yap");
          b.onclick = async () => {
            await cikisYap();
            location.reload();
          };
          a.appendChild(b);
          return a;
        })()
      });
      return;
    }
    const kayitliDefter = localStorage.getItem("mks-defter");
    if (kayitliDefter) D.defter = kayitliDefter;
    if (cevrimici) {
      try {
        await tumunuYukle();
        D.cevrimdisi = false;
        onbellegeYaz();
      } catch (e) {
        if (onbellektenYukle()) {
          D.cevrimdisi = true;
          bildir("Ba\u011Flant\u0131 yok \u2014 son bilinen veriler g\xF6steriliyor", "kotu");
        } else {
          bildir(e.message, "kotu");
        }
      }
    } else {
      bildir("Ba\u011Flant\u0131 yok \u2014 son bilinen veriler g\xF6steriliyor", "kotu");
    }
    $("#girisEkrani").classList.add("gizli");
    $("#uygulama").classList.remove("gizli");
    $("#yukleniyor").classList.add("gizli");
    $("#avatarHarf").textContent = (D.profil.ad || D.kullanici.email || "?").trim().charAt(0).toLocaleUpperCase("tr");
    defterCiz();
    gezinmeCiz();
    ekranCiz();
    cevrimDurumu();
    masaustuIslemleri();
  }
  function cevrimDurumu() {
    const kapali = !navigator.onLine || D.cevrimdisi;
    const c = $("#cevrimDisi");
    c.classList.toggle("gizli", !kapali);
    c.textContent = D.cevrimdisi ? "\xC7evrimd\u0131\u015F\u0131 \xB7 salt okunur" : "\xC7evrimd\u0131\u015F\u0131";
  }
  async function baglantiGeriGeldi() {
    cevrimDurumu();
    if (!D.cevrimdisi || !D.profil) return;
    try {
      await tumunuYukle();
      D.cevrimdisi = false;
      onbellegeYaz();
      cevrimDurumu();
      ekranCiz();
      bildir("Ba\u011Flant\u0131 geri geldi, veriler g\xFCncellendi", "iyi");
    } catch (e) {
    }
  }
  function masaustuIslemleri() {
    const m = window.masaustu;
    if (!m || D.cevrimdisi) return;
    try {
      const bugunIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const gecikmis = D.orgOzet.filter((o) => Number(o.kalan_odeme) > 0 && o.tarih && o.tarih < bugunIso);
      if (gecikmis.length) {
        const toplam = gecikmis.reduce((t, o) => t + Number(o.kalan_odeme), 0);
        m.bildir(
          "Bekleyen tahsilat",
          `${gecikmis.length} tamamlanm\u0131\u015F i\u015Fte toplam ${Math.round(toplam).toLocaleString("tr-TR")} \u20BA tahsil edilmemi\u015F.`
        );
      }
    } catch (e) {
    }
    try {
      const son = Number(localStorage.getItem("mks-son-yedek") || 0);
      if (Date.now() - son > 7 * 24 * 3600 * 1e3) {
        m.yedekKaydet(JSON.stringify(yedekVerisi(), null, 2)).then((yol) => {
          if (yol) localStorage.setItem("mks-son-yedek", String(Date.now()));
        }).catch(() => {
        });
      }
    } catch (e) {
    }
  }
  yenilemeyiAyarla(yenile2);
  gitAyarla(git2);
  girisKur();
  $("#defterBtn").onclick = defterMenusu;
  $("#hesapBtn").onclick = hesapMenusu;
  $("#fabBtn").onclick = () => {
    if (aktifSekme === "organizasyonlar") orgFormu(null);
    else hareketFormu(null);
  };
  if (window.masaustu?.menuDinle) {
    window.masaustu.menuDinle((kod) => {
      if (kod === "yedek-al") yedekIndir();
    });
  }
  window.addEventListener("popstate", () => {
    if (sayfaVar()) {
      sayfaKapat();
      gezinmeCiz();
      history.pushState({ mks: 1 }, "");
    }
  });
  try {
    history.replaceState({ mks: 1 }, "");
  } catch (_) {
  }
  window.addEventListener("online", baglantiGeriGeldi);
  window.addEventListener("offline", cevrimDurumu);
  cevrimDurumu();
  sb.auth.onAuthStateChange((olay) => {
    if (olay === "SIGNED_OUT") location.reload();
  });
  baslat().catch((e) => {
    console.error(e);
    $("#yukleniyor").classList.add("gizli");
    girisiGoster();
    bildir("Ba\u015Flat\u0131lamad\u0131: " + e.message, "kotu");
  });
})();
