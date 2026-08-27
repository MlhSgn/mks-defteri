// ============ Biçimlendirme ve arayüz yardımcıları ============

export const AY_KISA = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
export const AY_UZUN = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

const NUM  = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM0 = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export const sayi = (n) => { const x = Number(n); return isFinite(x) ? x : 0; };
export const para = (n) => NUM.format(sayi(n)) + " ₺";
export const paraKisa = (n) => {
  const a = Math.abs(sayi(n));
  if (a >= 1_000_000) return (Math.round(n / 100_000) / 10).toLocaleString("tr-TR") + " mn";
  if (a >= 1000) return NUM0.format(Math.round(n / 1000)) + " bin";
  return NUM0.format(Math.round(n));
};
export const paraTam = (n) => NUM0.format(Math.round(sayi(n))) + " ₺";

export const bugun = () => isoTarih(new Date());
export function isoTarih(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
export function trTarih(iso) {
  if (!iso) return "—";
  const p = String(iso).slice(0, 10).split("-");
  return `${p[2]} ${AY_KISA[Number(p[1]) - 1]}`;
}
export function trTarihUzun(iso) {
  if (!iso) return "—";
  const p = String(iso).slice(0, 10).split("-");
  return `${p[2]} ${AY_UZUN[Number(p[1]) - 1]} ${p[0]}`;
}
export function gunFarki(iso) {
  if (!iso) return null;
  return Math.round((new Date(iso + "T00:00:00") - new Date(bugun() + "T00:00:00")) / 86400000);
}
export function ayAnahtar(iso) { return String(iso).slice(0, 7); }
export function ayAdi(anahtar) {
  const [y, m] = anahtar.split("-");
  return `${AY_UZUN[Number(m) - 1]} ${y}`;
}

// ---------- DOM ----------
export const $  = (s, k = document) => k.querySelector(s);
export const $$ = (s, k = document) => Array.from(k.querySelectorAll(s));

export function el(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin != null) e.textContent = metin;
  return e;
}
export function html(kap, icerik) { kap.innerHTML = icerik; return kap; }

/** Güvenli HTML kaçışı — kullanıcı verisi şablona girmeden önce. */
export function kacis(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// ---------- Bildirim ----------
export function bildir(mesaj, tip = "") {
  const kap = $("#bildirimler");
  const b = el("div", "bildirim " + tip, mesaj);
  kap.appendChild(b);
  setTimeout(() => { b.style.opacity = "0"; b.style.transition = "opacity .3s"; }, 2600);
  setTimeout(() => b.remove(), 3000);
}

// ---------- Modal ----------
let modalDerinlik = 0;

export function modalAc({ baslik, govde, ayak, genislik, kapatilabilir = true }) {
  const d = modalDerinlik === 0 ? $("#modal") : $("#modal2");
  modalDerinlik++;

  const sar = el("div", "mdl");
  if (genislik) sar.style.maxWidth = genislik;

  const basi = el("div", "mdl-basi");
  basi.appendChild(el("h3", "", baslik));
  if (kapatilabilir) {
    const x = el("button", "kapat-x", "✕");
    x.type = "button";
    x.setAttribute("aria-label", "Kapat");
    x.onclick = () => kapat();
    basi.appendChild(x);
  }
  sar.appendChild(basi);

  const g = el("div", "mdl-govde");
  if (typeof govde === "string") g.innerHTML = govde; else if (govde) g.appendChild(govde);
  sar.appendChild(g);

  if (ayak) {
    const a = el("div", "mdl-ayak");
    if (typeof ayak === "string") a.innerHTML = ayak; else a.appendChild(ayak);
    sar.appendChild(a);
  }

  d.innerHTML = "";
  d.appendChild(sar);
  d.showModal();

  function kapat() {
    // Derinlik sayacı 'close' olayında düşer; burada tekrar düşürmüyoruz.
    try { d.close(); } catch (_) {}
  }
  d.addEventListener("cancel", (e) => { if (!kapatilabilir) e.preventDefault(); }, { once: true });
  d.addEventListener("close", () => { modalDerinlik = Math.max(0, modalDerinlik - 1); d.innerHTML = ""; }, { once: true });

  return { govde: g, kapat, kok: sar };
}

export function onayla(baslik, metin, eylemEtiketi = "Devam et", tehlikeli = true) {
  return new Promise((coz) => {
    let cevap = false;
    const ayak = el("div");
    const vazgec = el("button", "btn", "Vazgeç");
    const tamam = el("button", "btn " + (tehlikeli ? "tehlike" : "ana"), eylemEtiketi);
    ayak.append(vazgec, tamam);
    const m = modalAc({ baslik, govde: `<p style="margin:0;color:var(--ink2)">${kacis(metin)}</p>`, ayak });
    vazgec.onclick = () => { cevap = false; m.kapat(); coz(false); };
    tamam.onclick  = () => { cevap = true;  m.kapat(); coz(true); };
    m.kok.closest("dialog").addEventListener("close", () => { if (!cevap) coz(false); }, { once: true });
  });
}

// ---------- Grafik ipucu ----------
let ipucuEl = null;
export function ipucuGoster(olay, baslik, satirlar) {
  if (!ipucuEl) { ipucuEl = el("div", "ipucu"); document.body.appendChild(ipucuEl); }
  ipucuEl.innerHTML =
    `<div class="b">${kacis(baslik)}</div>` +
    satirlar.map(([a, b, renk]) =>
      `<div class="s"><span>${kacis(a)}</span><b${renk ? ` style="color:${renk}"` : ""}>${kacis(b)}</b></div>`
    ).join("");
  ipucuEl.classList.add("acik");
  const g = ipucuEl.offsetWidth || 170;
  const x = Math.min(Math.max(olay.clientX, g / 2 + 8), window.innerWidth - g / 2 - 8);
  const altta = olay.clientY < 170;
  ipucuEl.style.transform = altta ? "translate(-50%, 16px)" : "translate(-50%, calc(-100% - 14px))";
  ipucuEl.style.left = x + "px";
  ipucuEl.style.top = olay.clientY + "px";
}
export function ipucuGizle() { if (ipucuEl) ipucuEl.classList.remove("acik"); }

// ---------- Küçük bileşen üreticileri ----------
export function ozetSerit(kutular) {
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

export function bosDurum(baslik, aciklama) {
  const b = el("div", "bos");
  b.appendChild(el("strong", "", baslik));
  if (aciklama) b.appendChild(el("div", "", aciklama));
  return b;
}

export function alanSec(etiket, id, secenekler, secili) {
  const l = el("label", "alan", etiket);
  const s = el("select");
  s.id = id;
  for (const o of secenekler) {
    const op = el("option", "", o.ad ?? o);
    op.value = o.kod ?? o.id ?? o;
    s.appendChild(op);
  }
  if (secili != null) s.value = secili;
  l.appendChild(s);
  return l;
}

export function alanGiris(etiket, id, tur = "text", deger = "", ekstra = {}) {
  const l = el("label", "alan", etiket);
  const i = el("input");
  i.type = tur;
  i.id = id;
  if (deger != null) i.value = deger;
  Object.assign(i, ekstra);
  for (const [k, v] of Object.entries(ekstra)) if (k.startsWith("data") || k === "inputMode" || k === "placeholder" || k === "step" || k === "min" || k === "required") i[k] = v;
  l.appendChild(i);
  return l;
}
