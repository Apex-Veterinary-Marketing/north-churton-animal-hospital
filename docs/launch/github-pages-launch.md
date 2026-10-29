# Launch runbook: northchurtonanimalhospital.com on GitHub Pages

**Canonical domain: `https://northchurtonanimalhospital.com` (no www).** GitHub Pages 301s `www` to it. The old
WordPress site uses the same setup (www → apex), so nothing changes for visitors.

**Why GitHub Pages (decided 2026-10-29):** the domain's DNS is at Bluehost (`ns1/ns2.bluehost.com`). We can
edit its DNS records but can't move the nameservers to Cloudflare, so the Cloudflare Worker can't serve the
domain. Bluehost DNS points the domain at GitHub Pages instead. The Cloudflare Worker
(`north-churton-animal-hospital`) stays as the noindexed `workers.dev` staging preview.

**Repo setup (already done):**
- `.github/workflows/deploy-pages.yml` builds and publishes on every push to `main`, after blog posts from
  issues, every Thursday at 13:00 UTC, and on demand.
- `src/data/site.ts` `url` is the apex.
- Old WordPress URLs (`public/_redirects`) get Astro's meta-refresh pages, because Pages ignores
  `_redirects`. External ones (e.g. `/appointment-request` → the VetHero portal) work the same way.

**Known DNS state (2026-10-29), all at Bluehost:**

| Record | Value | At launch |
|---|---|---|
| `@` A | `162.241.216.77` (old site) | **replace** with GitHub's four IPs |
| `www` CNAME | `northchurtonanimalhospital.com` | **change** to `apex-veterinary-marketing.github.io` |
| `mail` A | `162.241.216.77` | **leave alone** (email) |
| `@` MX | `mail.northchurtonanimalhospital.com` | **leave alone** (email) |
| `@` TXT SPF | `v=spf1 a mx ptr include:bluehost.com ?all` | **leave alone** (still covers Bluehost mail through `mx` and `include`) |

`mail` has its own A record, so pointing the apex at GitHub doesn't move email. Bluehost's own DNS editor
may also hold `ftp`, `cpanel`, `webmail`, `autodiscover` and similar records; leave them all unchanged.

## A. Repo visibility and Pages

1. The repo must be **public**: the org is on GitHub Free, and Pages on a private repo needs Team. Don't
   make it private again unless Team is active. On Free, that takes the live site down.
2. Repo → **Settings** → **Pages** → **Build and deployment** → Source: **GitHub Actions**. Not "Deploy
   from a branch", which would skip the Astro build.
3. **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**. Wait for **build** and **deploy** to go
   green (2–4 min). The site at `apex-veterinary-marketing.github.io/north-churton-animal-hospital/` looks broken.
   That's expected, because the paths assume the domain root.

## B. Verify the domain (optional, recommended; no effect on the live site)

1. Org page → **Settings** → **Pages** → **Add a domain** → `northchurtonanimalhospital.com`. This needs an org
   owner. It stops anyone else's GitHub account from claiming the domain.
2. Bluehost → **Domains** → `northchurtonanimalhospital.com` → **DNS** → add the **TXT** record GitHub shows
   (`_github-pages-challenge-apex-veterinary-marketing`).
3. **Screenshot every DNS record first.** That's the rollback.
4. Back on GitHub, click **Verify**.

## C. Launch: attach the domain

1. Repo → **Settings** → **Pages** → **Custom domain**: `northchurtonanimalhospital.com` (no www) → **Save**.
2. Bluehost DNS → edit the `@` **A** record to `185.199.108.153`, then add three more `@` A records:
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Remove nothing else.
3. Bluehost DNS → `www` **CNAME** → `apex-veterinary-marketing.github.io`.
4. Optional IPv6: four `@` **AAAA** records, `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`.
5. GitHub → **Settings** → **Pages**: refresh until it shows **DNS check successful** (minutes, up to a few
   hours).

## D. Launch: HTTPS

1. GitHub issues the certificate after the DNS check passes, usually within an hour.
2. Tick **Enforce HTTPS**. It's greyed out until the certificate exists.

## E. Launch: checks and Google

```
curl -sI https://northchurtonanimalhospital.com/                       → 200, server: GitHub.com
curl -sI http://northchurtonanimalhospital.com/                        → 301 to https://
curl -sI https://www.northchurtonanimalhospital.com/                   → 301 to https://northchurtonanimalhospital.com/
curl -s  https://northchurtonanimalhospital.com/about/ | grep refresh  → url=/meet-the-team/
curl -sI https://northchurtonanimalhospital.com/does-not-exist         → 404 (the site's 404 page)
curl -sI https://northchurtonanimalhospital.com/sitemap.xml            → 200
```

- Send a test email to and from a clinic address to confirm mail still works.
- **Google Search Console:** the existing property → **Sitemaps** → submit `sitemap.xml`.
- **Blog:** publish one post through the issue flow and confirm **Deploy to GitHub Pages** runs after it.

## After launch

- Every push to `main` deploys. A failed build never deploys, so the live site keeps its last good version.
- **Don't set `DEPLOY_HOOK_URL`.** `scheduled-publish.yml` would only rebuild the Cloudflare preview;
  `deploy-pages.yml` has its own weekly cron.
- **Keep the Bluehost hosting for at least a week** as the rollback, and keep it longer if email is hosted
  there (`mail.` points at it).
- **Rollback:** restore the `@` A and `www` CNAME records from the screenshots in B.3.
