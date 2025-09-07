# Supono's Sports Bar — Development Setup

## Hızlı Başlangıç (Docker ile)
1) `.env.development` dosyası ve `docker-compose.dev.yml` bu paketle geldiler.
2) Çalıştırın:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Postgres: `localhost:5432` (db: `suponos`, user: `suponos_user`, pass: `devpassword123!`)
- pgAdmin: http://localhost:5050 (login: admin@local / admin123!)
- API: http://localhost:5000
- Vite dev (SPA): http://localhost:5173

> İlk çalıştırmada varsayılan admin otomatik oluşturuluyorsa `Supanos` / `Newyork1453*-` ile giriş yapabilirsiniz. Aksi halde `/api/admin/users` uç noktası için önce login olun.

## Manuel Kurulum (Docker olmadan)
```bash
# 1) Postgres kurun ve bu env değerleriyle DB oluşturun
createdb suponos
createuser suponos_user --pwprompt  # parola: devpassword123!

# 2) Bağımlılıkları yükleyin
npm ci

# 3) .env.development dosyası oluşturun
cp .env.development .env

# 4) Geliştirmeyi başlatın
npm run dev
```
