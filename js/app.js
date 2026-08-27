// ============ Uygulama çekirdeği ============
import * as V from "./veri.js";
import { D, sb } from "./veri.js";
import { SEKMELER, KISISEL_KAPALI } from "./ayar.js";
import { $, el, bildir, modalAc } from "./ui.js";
import * as E from "./ekranlar.js";

let aktifSekme = "panel";

// ---------- Giriş ekranı ----------
function girisiGoster() {
  $("#yukleniyor").classList.add("gizli");
  $("#uygulama").classList.add("gizli");
  $("#girisEkrani").classList.remove("gizli");
}

let kayitModu = false;
function girisKur() {
  const form = $("#girisForm"), hata = $("#girisHata"), btn = $("#girisBtn");
  const adAlan = $("#gAdAlan"), gecis = $("#kayitGecis");

  gecis.onclick = () => {
    kayitModu = !kayitModu;
    adAlan.classList.toggle("gizli", !kayitModu);
    btn.textContent = kayitModu ? "Kayıt ol" : "Giriş yap";
    gecis.textContent = kayitModu ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol";
    $("#gParola").autocomplete = kayitModu ? "new-password" : "current-password";
    hata.classList.add("gizli");
  };

  $("#sifreUnuttum").onclick = async () => {
    const e = $("#gEposta").value.trim();
    if (!e) { hataGoster("Önce e-posta adresini yaz."); return; }
    try {
      await V.parolaSifirla(e);
      hata.className = "basari";
      hata.textContent = "Parola sıfırlama bağlantısı e-postana gönderildi.";
      hata.classList.remove("gizli");
    } catch (err) { hataGoster(err.message); }
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
        const sonuc = await V.kayitOl(eposta, parola, $("#gAd").value);
        if (!sonuc.session) {
          hata.className = "basari";
          hata.textContent = "Kayıt alındı. E-postana gelen doğrulama bağlantısına tıkla, sonra giriş yap.";
          hata.classList.remove("gizli");
          btn.disabled = false;
          return;
        }
      } else {
        await V.girisYap(eposta, parola);
      }
      await baslat();
    } catch (err) {
      hataGoster(err.message);
      btn.disabled = false;
    }
  };
}

// ---------- Gezinme ----------
function gorunenSekmeler() {
  return SEKMELER.filter(s => {
    if (D.defter !== "is" && KISISEL_KAPALI.includes(s.kod)) return false;
    if (s.kod === "ayarlar") return true;
    return V.sekmeVar(s.kod);
  });
}

function gezinmeCiz() {
  const liste = gorunenSekmeler();
  if (!liste.some(s => s.kod === aktifSekme)) aktifSekme = liste[0]?.kod ?? "panel";

  const ust = $("#ustSekmeler");
  ust.innerHTML = "";
  liste.forEach(s => {
    const b = el("button", "", s.ad);
    b.type = "button";
    if (s.kod === aktifSekme) b.setAttribute("aria-current", "page");
    b.onclick = () => git(s.kod);
    ust.appendChild(b);
  });

  // Alt bar: en fazla 5 giriş; fazlası "Daha"
  const alt = $("#altBar");
  alt.innerHTML = "";
  const gorunen = liste.slice(0, liste.length > 5 ? 4 : 5);
  const kalan = liste.slice(gorunen.length);
  gorunen.forEach(s => alt.appendChild(altDugme(s.ikon, s.kisa, s.kod === aktifSekme, () => git(s.kod))));
  if (kalan.length) {
    const aktifKalan = kalan.some(s => s.kod === aktifSekme);
    alt.appendChild(altDugme("···", "Daha", aktifKalan, () => dahaMenusu(kalan)));
  }
  $("#fabBtn").classList.toggle("gizli", !["panel", "kasa", "organizasyonlar"].includes(aktifSekme));
}

function altDugme(ikon, yazi, aktif, tikla) {
  const b = el("button");
  b.type = "button";
  if (aktif) b.setAttribute("aria-current", "page");
  b.appendChild(el("span", "ikon", ikon));
  b.appendChild(el("span", "yazi", yazi));
  b.onclick = tikla;
  return b;
}

function dahaMenusu(kalan) {
  const g = el("div", "liste");
  kalan.forEach(s => {
    const r = el("button", "satir");
    r.type = "button";
    const sol = el("div");
    sol.appendChild(el("div", "baslik", `${s.ikon}  ${s.ad}`));
    r.appendChild(sol);
    r.onclick = () => { m.kapat(); git(s.kod); };
    g.appendChild(r);
  });
  const m = modalAc({ baslik: "Menü", govde: g });
}

function git(kod) {
  aktifSekme = kod;
  gezinmeCiz();
  ekranCiz();
  $("#icerik").scrollIntoView({ block: "start" });
  window.scrollTo(0, 0);
}

// ---------- Ekran çizimi ----------
function ekranCiz() {
  const k = $("#icerik");
  k.innerHTML = "";
  let dugum;
  try {
    switch (aktifSekme) {
      case "panel":           dugum = E.panel(); break;
      case "organizasyonlar": dugum = E.organizasyonlar(); break;
      case "kasa":            dugum = E.kasa(); break;
      case "cariler":         dugum = E.cariler(); break;
      case "musteriler":      dugum = E.musteriler(); break;
      case "raporlar":        dugum = E.raporlar(); break;
      case "ayarlar":         dugum = E.ayarlar(); break;
      default:                dugum = E.panel();
    }
  } catch (e) {
    console.error(e);
    dugum = el("div", "hata", "Ekran çizilemedi: " + e.message);
  }
  k.appendChild(dugum);
}

async function yenile(veriyiDeYukle = false) {
  if (veriyiDeYukle) {
    try { await V.defterVerisiYukle(); }
    catch (e) { bildir(e.message, "kotu"); }
  }
  ekranCiz();
}

// ---------- Defter değiştirme ----------
function defterCiz() {
  const d = D.defterler.find(x => x.kod === D.defter);
  $("#defterAd").textContent = d?.ad ?? "Defter";
}

function defterMenusu() {
  const g = el("div", "liste");
  D.defterler.forEach(d => {
    const r = el("button", "satir");
    r.type = "button";
    const sol = el("div");
    sol.appendChild(el("div", "baslik", d.ad));
    sol.appendChild(el("div", "alt", d.tur === "kisisel" ? "Kişisel defter" : "İş defteri"));
    r.appendChild(sol);
    if (d.kod === D.defter) r.appendChild(el("div", "rozet vurgu", "açık"));
    r.onclick = async () => {
      m.kapat();
      if (d.kod === D.defter) return;
      if (d.pin_hash && !(await pinSor(d))) return;
      D.defter = d.kod;
      localStorage.setItem("mks-defter", d.kod);
      defterCiz();
      $("#yukleniyor").classList.remove("gizli");
      try { await V.defterVerisiYukle(); } catch (e) { bildir(e.message, "kotu"); }
      $("#yukleniyor").classList.add("gizli");
      aktifSekme = "panel";
      gezinmeCiz(); ekranCiz();
    };
    g.appendChild(r);
  });
  const m = modalAc({ baslik: "Defter seç", govde: g });
}

async function pinSor(defter) {
  return new Promise((coz) => {
    const g = el("div");
    const l = el("label", "alan", "PIN");
    const i = el("input");
    i.type = "password"; i.inputMode = "numeric"; i.autocomplete = "off"; i.placeholder = "••••";
    l.appendChild(i); g.appendChild(l);
    const ayak = el("div");
    const iptal = el("button", "btn", "Vazgeç");
    const ac = el("button", "btn ana", "Aç");
    ayak.append(iptal, ac);
    const m = modalAc({ baslik: defter.ad, govde: g, ayak });
    setTimeout(() => i.focus(), 60);
    iptal.onclick = () => { m.kapat(); coz(false); };
    ac.onclick = async () => {
      const ozet = await pinOzet(i.value);
      if (ozet === defter.pin_hash) { m.kapat(); coz(true); }
      else bildir("PIN hatalı", "kotu");
    };
  });
}
async function pinOzet(pin) {
  const veri = new TextEncoder().encode("mks-defter:" + pin);
  const buf = await crypto.subtle.digest("SHA-256", veri);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
window.mksPinOzet = pinOzet; // Ayarlar'dan PIN kurmak için

// ---------- Hesap menüsü ----------
function hesapMenusu() {
  const g = el("div", "liste");
  const bilgi = el("div", "satir");
  bilgi.style.cursor = "default";
  const sol = el("div");
  sol.appendChild(el("div", "baslik", D.profil?.ad || D.kullanici?.email || ""));
  sol.appendChild(el("div", "alt", `${D.kullanici?.email ?? ""} · ${D.profil?.rol ?? ""}`));
  bilgi.appendChild(sol);
  g.appendChild(bilgi);

  const ayarB = el("button", "satir"); ayarB.type = "button";
  ayarB.appendChild(Object.assign(el("div"), { innerHTML: '<div class="baslik">Ayarlar</div>' }));
  ayarB.onclick = () => { m.kapat(); git("ayarlar"); };
  g.appendChild(ayarB);

  const parolaB = el("button", "satir"); parolaB.type = "button";
  parolaB.appendChild(Object.assign(el("div"), { innerHTML: '<div class="baslik">Parolamı değiştir</div>' }));
  parolaB.onclick = () => { m.kapat(); parolaFormu(); };
  g.appendChild(parolaB);

  const cikisB = el("button", "satir"); cikisB.type = "button";
  const c = el("div");
  const cb = el("div", "baslik", "Çıkış yap");
  cb.style.color = "var(--gider-ink)";
  c.appendChild(cb);
  cikisB.appendChild(c);
  cikisB.onclick = async () => { m.kapat(); await V.cikisYap(); location.reload(); };
  g.appendChild(cikisB);

  const m = modalAc({ baslik: "Hesabım", govde: g });
}

function parolaFormu() {
  const g = el("div");
  const l1 = el("label", "alan", "YENİ PAROLA (en az 6 karakter)");
  const p1 = el("input"); p1.type = "password"; p1.autocomplete = "new-password"; l1.appendChild(p1);
  const l2 = el("label", "alan", "PAROLA TEKRAR");
  const p2 = el("input"); p2.type = "password"; p2.autocomplete = "new-password"; l2.appendChild(p2);
  g.append(l1, l2);
  const ayak = el("div");
  const iptal = el("button", "btn", "Vazgeç");
  const kaydet = el("button", "btn ana", "Değiştir");
  ayak.append(iptal, kaydet);
  const m = modalAc({ baslik: "Parolamı değiştir", govde: g, ayak });
  iptal.onclick = () => m.kapat();
  setTimeout(() => p1.focus(), 60);
  kaydet.onclick = async () => {
    if (p1.value.length < 6) { bildir("Parola en az 6 karakter olmalı", "kotu"); return; }
    if (p1.value !== p2.value) { bildir("Parolalar aynı değil", "kotu"); return; }
    kaydet.disabled = true;
    try { await V.parolaDegistir(p1.value); m.kapat(); bildir("Parola değiştirildi", "iyi"); }
    catch (e) { bildir(e.message, "kotu"); kaydet.disabled = false; }
  };
}

// ---------- Başlatma ----------
async function baslat() {
  $("#yukleniyor").classList.remove("gizli");
  const oturum = await V.oturum();
  if (!oturum) { girisiGoster(); return; }

  D.kullanici = oturum.user;
  try {
    D.profil = await V.profilYukle(oturum.user.id);
  } catch (e) {
    bildir(e.message, "kotu");
  }

  if (!D.profil) {
    $("#yukleniyor").classList.add("gizli");
    modalAc({
      baslik: "Profil bulunamadı",
      govde: `<p style="margin:0;color:var(--ink2)">Hesabın oluşturuldu ama profil kaydı yok. Bu genelde kayıt sırasındaki geçici bir hatadır. Çıkış yapıp tekrar giriş yapmayı dene; sorun sürerse yöneticine haber ver.</p>`,
      ayak: (() => { const a = el("div"); const b = el("button", "btn ana", "Çıkış yap");
        b.onclick = async () => { await V.cikisYap(); location.reload(); }; a.appendChild(b); return a; })()
    });
    return;
  }

  if (!D.profil.aktif) {
    $("#yukleniyor").classList.add("gizli");
    modalAc({
      baslik: "Girişin kapalı",
      govde: `<p style="margin:0;color:var(--ink2)">Bu hesabın girişi yönetici tarafından kapatılmış. Erişim için yöneticine haber ver.</p>`,
      ayak: (() => { const a = el("div"); const b = el("button", "btn ana", "Çıkış yap");
        b.onclick = async () => { await V.cikisYap(); location.reload(); }; a.appendChild(b); return a; })()
    });
    return;
  }

  const kayitliDefter = localStorage.getItem("mks-defter");
  if (kayitliDefter) D.defter = kayitliDefter;

  try {
    await V.tumunuYukle();
  } catch (e) {
    bildir(e.message, "kotu");
  }

  $("#girisEkrani").classList.add("gizli");
  $("#uygulama").classList.remove("gizli");
  $("#yukleniyor").classList.add("gizli");
  $("#avatarHarf").textContent = (D.profil.ad || D.kullanici.email || "?").trim().charAt(0).toLocaleUpperCase("tr");
  defterCiz();
  gezinmeCiz();
  ekranCiz();
}

// ---------- Bağlantı durumu ----------
function cevrimDurumu() {
  $("#cevrimDisi").classList.toggle("gizli", navigator.onLine);
}

// ---------- Kurulum ----------
E.yenilemeyiAyarla(yenile);
E.gitAyarla(git);
girisKur();

$("#defterBtn").onclick = defterMenusu;
$("#hesapBtn").onclick = hesapMenusu;
$("#fabBtn").onclick = () => {
  if (aktifSekme === "organizasyonlar") E.orgFormu(null);
  else E.hareketFormu(null);
};
window.addEventListener("online", cevrimDurumu);
window.addEventListener("offline", cevrimDurumu);
cevrimDurumu();

sb.auth.onAuthStateChange((olay) => {
  if (olay === "SIGNED_OUT") location.reload();
});

baslat().catch(e => {
  console.error(e);
  $("#yukleniyor").classList.add("gizli");
  girisiGoster();
  bildir("Başlatılamadı: " + e.message, "kotu");
});
