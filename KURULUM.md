# MKS Defteri — yayına alma

Bu klasör hazır bir web uygulamasıdır. Derleme, npm, Node.js gerekmez — dosyaları
bir statik barındırma servisine yüklemen yeterli.

## 1. Cloudflare Pages'e yükle (5 dakika)

1. https://dash.cloudflare.com adresinde ücretsiz hesap aç (kredi kartı istemez).
2. Sol menüden **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
3. Projeye bir ad ver: `mks-defteri`.
4. Bu klasörün **içindekileri** (index.html, app.css, js/, vendor/) sürükleyip bırak.
   Klasörün kendisini değil, içindekileri yüklüyorsun — `index.html` en üstte olmalı.
5. **Deploy** de. Bir dakika içinde `https://mks-defteri.pages.dev` gibi bir adres verir.

Adresi not al; hem sen hem personel bu adresten girecek.

## 2. Supabase'e adresi tanıt (zorunlu)

Supabase, e-posta doğrulama ve parola sıfırlama bağlantılarını yalnızca tanıdığı
adreslere yönlendirir.

1. https://supabase.com/dashboard → **mks-defteri** projesi
2. **Authentication** → **URL Configuration**
3. **Site URL**: Cloudflare'in verdiği adres (örn. `https://mks-defteri.pages.dev`)
4. **Redirect URLs** listesine aynı adresi ekle
5. Kaydet

## 3. İlk hesabı aç

Uygulamayı aç → **Kayıt ol** → e-posta olarak **mlhsgn007@gmail.com** kullan.

Bu e-posta veritabanında "sahip" olarak tanımlı; bu adresle kaydolan kişi tüm
yetkilere sahip olur. Başka bir e-posta ile kaydolan herkes "personel" başlar.

E-posta doğrulaması istenirse gelen kutunu kontrol et. Posta gelmezse haber ver,
hesabını veritabanından doğrulanmış hale getirebilirim.

## 4. Personel ekleme

Personel aynı adrese girip kendi e-postasıyla **Kayıt ol** der. Kaydolduktan sonra
sen **Ayarlar → Kullanıcılar** listesinde onu görürsün; hangi sekmeleri görebileceğini
ve hangi kategorilere kayıt girebileceğini oradan işaretlersin.

Yeni kullanıcılar varsayılan olarak yalnızca **Panel** ve **Kasa** görür, silme
yetkisi kapalıdır.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Uygulamanın iskeleti ve giriş ekranı |
| `app.css` | Tüm görünüm (mobil öncelikli, açık/koyu tema) |
| `js/ayar.js` | Supabase adresi, anahtarı ve sekme listesi |
| `js/ui.js` | Biçimlendirme, modal, bildirim yardımcıları |
| `js/veri.js` | Supabase ile tüm veri alışverişi |
| `js/ekranlar.js` | Yedi ekranın çizimi ve formlar |
| `js/app.js` | Giriş, gezinme, defter değiştirme |
| `vendor/supabase.js` | Supabase istemcisi (dışa bağımlılık yok) |

`js/ayar.js` içindeki anahtar herkese açık olabilir — verinin güvenliği sunucudaki
satır-düzeyi yetki kurallarıyla sağlanır, anahtarla değil.

## Güncelleme

Değişiklik gerektiğinde aynı Cloudflare Pages projesine yeni bir yükleme yaparsın;
adres değişmez.
