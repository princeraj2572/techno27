# Deploying Techno-aiMBiAtion '27 on AWS (EC2)

This guide takes the site from this repo to a live HTTPS domain on one EC2 server. The steps are in order. The config files it uses are in [`deploy/`](deploy/).

```
            Internet
               │  HTTPS 443 / HTTP 80 (redirects to HTTPS)
        ┌──────▼───────────────────────────── EC2 (Ubuntu 24.04, Elastic IP) ─┐
        │  Nginx  ── TLS (Let's Encrypt), security headers, gzip               │
        │    ├── /uploads/*  →  served from /var/www/techno27-uploads (disk)  │
        │    └── everything else → 127.0.0.1:3000                              │
        │  PM2  →  next start  (Node 22, Next.js 15)                           │
        └──────┬──────────────────────────────┬────────────────────────────────┘
               │ 27017 (TLS)                  │ 465/587 (TLS)
        MongoDB Atlas cluster           Gmail SMTP (OTP emails)
```

**What the app needs at runtime** (taken from the code):

| Need | Detail |
|---|---|
| Node.js | 22 LTS (same as `render.yaml`) |
| Database | MongoDB Atlas (`mongodb+srv://` URI), through Mongoose |
| Email | Gmail SMTP via Nodemailer, for signup and password-reset OTPs |
| Env vars | `MONGODB_URI`, `MONGODB_DBNAME`, `JWT_SECRET`, `SMTP_USER`, `SMTP_PASS`, `NODE_ENV=production` |
| Disk | Profile photos are written to `public/uploads/profiles/` (up to 2 MB each) |
| HTTPS | Required: the login cookie is `secure` in production, so login won't work over plain HTTP |
| **Never set** | `ALLOW_LOADTEST`. It turns on the `/api/loadtest/*` routes, which let a caller impersonate any user |

---

## 1. Before you start

- An AWS account with billing set up.
- A domain name. Examples below use `YOUR_DOMAIN`.
- Access to the MongoDB Atlas project and the Gmail account used for OTP emails. `SMTP_PASS` must be a 16-character Gmail **app password**, not the account password.
- On your computer: the `.pem` SSH key you'll create in step 3, and an SSH client.

**Region:** use **Asia Pacific (Mumbai) `ap-south-1`**, closest to Raigarh. Put the Atlas cluster in the same region (AWS / Mumbai) so database calls stay fast.

---

## 2. Networking

### 2.1 VPC and subnet
The **default VPC** is fine for a single server. Launch into one of its **public subnets** (they have a route to an Internet Gateway, and "Auto-assign public IP" is on).

Building a custom VPC instead? You need: a VPC (e.g. `10.0.0.0/16`), a public subnet (`10.0.1.0/24`), an Internet Gateway attached to the VPC, and a route table with `0.0.0.0/0 → IGW` linked to the subnet.

### 2.2 Security group `techno27-web`
Create it in the same VPC:

| Direction | Type | Port | Source | Why |
|---|---|---|---|---|
| Inbound | SSH | 22 | **My IP** only (`x.x.x.x/32`) | Admin access. Never `0.0.0.0/0` |
| Inbound | HTTP | 80 | `0.0.0.0/0`, `::/0` | Certificate checks, redirect to HTTPS |
| Inbound | HTTPS | 443 | `0.0.0.0/0`, `::/0` | The site |
| Outbound | All | All | `0.0.0.0/0` | Atlas (27017), Gmail (465/587), npm, GitHub, OS updates |

Do **not** open port 3000. Next.js listens on `127.0.0.1` only, and Nginx is the only way in.

> AWS blocks outbound port 25 by default. Nodemailer's Gmail transport uses 465/587, which are open, so OTP emails work without asking AWS to lift that limit.

### 2.3 Elastic IP
EC2 → **Elastic IPs** → *Allocate* → *Associate* with the instance after step 3. A normal public IP changes whenever the instance stops; the Elastic IP stays the same, so DNS and the Atlas allow-list keep working.

### 2.4 MongoDB Atlas network access
Atlas → **Network Access** → *Add IP Address* → the Elastic IP as `x.x.x.x/32`.

Remove any `0.0.0.0/0` ("allow from anywhere") entry once the server works. (Larger setups can use VPC peering or PrivateLink instead, but that isn't needed here.)

### 2.5 DNS
Wherever the domain is managed (Route 53 or your registrar):

| Record | Name | Value |
|---|---|---|
| A | `YOUR_DOMAIN` | Elastic IP |
| A (or CNAME → `YOUR_DOMAIN`) | `www` | Elastic IP |

Using **Route 53**: create a *Hosted zone* for the domain, then set the four NS records it gives you at your registrar. Wait until `nslookup YOUR_DOMAIN` returns the Elastic IP before getting the certificate (step 6).

---

## 3. Launch the EC2 instance

EC2 → **Launch instance**:

| Setting | Value |
|---|---|
| Name | `techno27-web` |
| AMI | **Ubuntu Server 24.04 LTS** (64-bit x86) |
| Instance type | **t3.large** (2 vCPU, 8 GB RAM) |
| Key pair | Create one (`techno27-key`, `.pem`) and keep it safe; it can't be downloaded again |
| Network | Default VPC, a public subnet, auto-assign public IP **on**, security group `techno27-web` |
| Storage | **20 GB gp3** |
| Advanced → Metadata version | **IMDSv2 only** (required) |

Then associate the Elastic IP (2.3), add it to Atlas (2.4), and point DNS at it (2.5).

Connect:
```bash
chmod 400 techno27-key.pem
ssh -i techno27-key.pem ubuntu@ELASTIC_IP
```

---

## 4. Server setup (run once, as `ubuntu`)

### 4.1 OS updates, automatic patches, small swap
```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install git nginx curl unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades      # automatic security patches

# 1 GB swap as a safety net only; 8 GB RAM covers the build and two app processes
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

sudo timedatectl set-timezone Asia/Kolkata
```

### 4.2 Node.js 22 and PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs
node -v          # v22.x
sudo npm i -g pm2
```

### 4.3 Folders
Each deploy builds in its own **release folder**, and the live site runs from a `current` link. A new build therefore never touches the running site: `next build` rewrites `.next/` while it runs, which would break a live app built in the same folder.
```bash
sudo mkdir -p /var/www/techno27/{releases,shared} /var/www/techno27-uploads/profiles /var/log/techno27 /var/www/certbot
sudo chown -R ubuntu:ubuntu /var/www/techno27 /var/www/techno27-uploads /var/log/techno27
sudo chmod 755 /var/www/techno27-uploads        # Nginx (www-data) must be able to read uploads
```
```
/var/www/techno27/
├── repo/                         git clone (fetch only; also holds deploy/)
├── shared/.env.production.local  secrets, linked into every release
├── releases/<date>-<sha>/        one folder per deploy (last 3 kept)
└── current -> releases/…         what PM2 runs
/var/www/techno27-uploads/        profile photos, linked as public/uploads in every release
```

---

## 5. App setup and the Next.js build

### 5.1 Get the code
The repo is public, so HTTPS clone works. If it becomes private, add a read-only **deploy key**: `ssh-keygen -t ed25519`, then add the `.pub` under GitHub → Settings → Deploy keys.
```bash
git clone https://github.com/princeraj2572/techno27.git /var/www/techno27/repo
```

### 5.2 Secrets: `shared/.env.production.local`
Next.js reads this file at build time and at runtime. Each release gets a link to it. It never goes into git.
```bash
openssl rand -base64 48      # generate the production JWT secret
cat > /var/www/techno27/shared/.env.production.local <<'EOF'
NODE_ENV=production
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DBNAME=techno27
JWT_SECRET=PASTE_THE_OPENSSL_OUTPUT_HERE
SMTP_USER=fest-mailbox@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx
EOF
chmod 600 /var/www/techno27/shared/.env.production.local
```
- Use a **new** `JWT_SECRET` for production, not the one in your `.env.local`.
- Changing `JWT_SECRET` later logs everyone out.
- Do **not** add `ALLOW_LOADTEST`.

### 5.3 Persistent uploads
The upload API writes to `public/uploads/profiles/`. `deploy.sh` replaces that folder in every release with a link to `/var/www/techno27-uploads`, so photos survive redeploys and rollbacks.

> **Why Nginx serves `/uploads` itself:** `next start` only serves files that were in `public/` **when the build ran**. Photos uploaded afterwards would 404 through Next.js, so Nginx serves them straight from disk (see `deploy/nginx.conf`).

### 5.4 First build and start
The first deploy uses the same script as every later one:
```bash
bash /var/www/techno27/repo/deploy/deploy.sh
```
It does the following:
1. Exports `origin/main` into a new `releases/<date>-<sha>/` folder and links in the secrets and the uploads folder.
2. Runs `npm ci --include=dev` (TypeScript and the other dev dependencies are needed to build).
3. Runs `NODE_OPTIONS=--max-old-space-size=4096 npm run build`. That's `next build`: it type-checks, lints, and writes the production bundle to `.next/` inside the release.
4. Points `current` at the new release and starts or reloads PM2.
5. Checks `http://127.0.0.1:3000` and keeps the last 3 releases.

Notes:
- No `output: "standalone"` is needed; `next start` runs straight from the release folder.
- This exact build (`npm ci` + `next build` + `next start` on Node 22, Linux x86_64) has been verified on `main` @ `cfe676f`.

### 5.5 Keep PM2 running across reboots
```bash
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu     # run the command it prints
pm2 install pm2-logrotate                           # keeps /var/log/techno27 from filling the disk
pm2 status                                          # 2 × techno27 online (cluster mode)
curl -I http://127.0.0.1:3000                       # expect HTTP/1.1 200
```

---

## 6. Nginx and HTTPS

**6.1 Get the certificate first, using a temporary port-80-only site.** The HTTPS block in `deploy/nginx.conf` points at certificate files that don't exist yet, so Nginx won't load it until they do.
```bash
sudo rm -f /etc/nginx/sites-enabled/default
printf '%s\n' 'server {' '  listen 80; listen [::]:80;' '  server_name example.com www.example.com;' \
  '  location /.well-known/acme-challenge/ { root /var/www/certbot; }' '}' \
  | sudo tee /etc/nginx/sites-available/acme >/dev/null
sudo ln -s /etc/nginx/sites-available/acme /etc/nginx/sites-enabled/acme
sudo nginx -t && sudo systemctl reload nginx

sudo apt -y install certbot
sudo certbot certonly --webroot -w /var/www/certbot \
  -d example.com -d www.example.com -m you@example.com --agree-tos --no-eff-email \
  --deploy-hook "systemctl reload nginx"
```

**6.2 Swap in the real site config:**
```bash
sudo rm /etc/nginx/sites-enabled/acme /etc/nginx/sites-available/acme
sudo cp /var/www/techno27/repo/deploy/nginx.conf /etc/nginx/sites-available/techno27
sudo sed -i 's/YOUR_DOMAIN/example.com/g' /etc/nginx/sites-available/techno27   # your real domain
sudo ln -s /etc/nginx/sites-available/techno27 /etc/nginx/sites-enabled/techno27
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run       # renewal runs automatically (certbot.timer); this just proves it works
```

**6.3 Check:**
- Open `https://YOUR_DOMAIN`: you should see the home page with a padlock, and `http://` should redirect to it.
- Sign up with a real email. The OTP arriving proves Gmail SMTP and Atlas both work, and logging in afterwards proves the `Secure` cookie works over HTTPS.

---

## 7. Deploying updates

Push or merge to `main`, then on the server:
```bash
bash /var/www/techno27/repo/deploy/deploy.sh
```
- The new version builds in its own release folder while the site keeps serving the current one.
- Only after a successful build does `current` switch over. PM2 then reloads its two processes one at a time, so there is no downtime.
- **If the build fails, nothing changes:** the live site stays on the previous release. Delete the half-built folder in `releases/` if you like.
- The new release always uses its own `deploy/ecosystem.config.cjs`. The script also updates `repo/`, so a changed `deploy.sh` takes effect from the **next** run. `deploy/nginx.conf` is never applied automatically: copy it by hand (step 6.2) if it changes.

**Roll back** to the previous release (instant, no rebuild):
```bash
bash /var/www/techno27/repo/deploy/deploy.sh rollback
```

---

## 8. Day-to-day operations

| Task | Command / place |
|---|---|
| App logs | `pm2 logs techno27` or `/var/log/techno27/*.log` |
| Nginx logs | `/var/log/nginx/access.log`, `error.log` |
| Restart app | `pm2 restart techno27` |
| Resource use | `pm2 monit`, `htop`, `df -h` |
| Database backups | Atlas → *Backup* (enable continuous backup / snapshots on the cluster tier) |
| Upload backups | `aws s3 sync /var/www/techno27-uploads s3://YOUR_BUCKET/uploads` from a daily cron, or EBS snapshots via **Data Lifecycle Manager** |
| Alerts | CloudWatch → alarm on `CPUUtilization > 80%` and the instance status check |
| Cost | Roughly **$70–75/month** on-demand in Mumbai: t3.large (~$65), 20 GB gp3 (~$2) and the Elastic IP (~$4). A 1-year Savings Plan or Reserved Instance cuts the instance cost by about 35–40%. Atlas is billed separately |

**Scaling for fest week:**
- t3.large already runs **2 app processes** (PM2 cluster mode, one per vCPU), so a crash in one doesn't take the site down.
- **CPU credits:** t3 instances run at a 30% baseline and spend credits above that. AWS launches t3 in *Unlimited* mode by default, so heavy, sustained load keeps full speed but adds a small extra charge. Watch `CPUCreditBalance` in CloudWatch.
- Need more? *Stop* the instance, change the type to **t3.xlarge** (4 vCPU) or a non-burstable **m7i.large / c7i.xlarge**, then *Start* it. The Elastic IP stays, and PM2's `instances: "max"` uses the extra cores automatically.

More than one server would need uploads moved to S3 and an Application Load Balancer. That isn't needed for a single EC2 box.

---

## 9. Security checklist before going live

**Blockers for 3,000–4,000 real users** (found in code review; not fixed yet):
- [ ] **Passwords are stored in plain text.** `user.model.ts` saves them as typed, and login compares strings (`user-actions.ts`). Hash them (e.g. Node `crypto.scrypt`) and convert existing ones the next time each user logs in, *before* real signups start.
- [ ] **Gmail sends only ~500 emails/day.** Every signup and password reset needs an OTP email, so 3–4k signups will exceed that. Move to **Amazon SES** in `ap-south-1`: verify the domain, request production access (about a day), and use SES SMTP credentials. `src/lib/mailer.ts` currently hard-codes `service: "gmail"`, so SMTP host and port need to become env vars first.
- [ ] **Atlas tier and connection pool.** M0 (free) allows 500 connections, but the app opens up to 500 *per process* (`maxPoolSize` in `src/lib/mongodb.ts`), so 1,000 across PM2's two processes. Use **M10 or higher** for registration and fest weeks, and lower the pool to about 200 per process.

**Server and app settings:**

- [ ] SSH (22) open to your IP only; port 3000 not open.
- [ ] Atlas allow-list contains only the Elastic IP.
- [ ] New production `JWT_SECRET`; `.env.production.local` is `chmod 600`.
- [ ] `ALLOW_LOADTEST` is **not** set (`grep ALLOW_LOADTEST .env*` returns nothing on the server).
- [ ] HTTPS works and HTTP redirects to it; login sets a `Secure` cookie.
- [ ] `/dev`, `/admin` and `/event-manager` redirect to login when signed out.
- [ ] **Upload route hardening.** `src/app/api/upload/route.ts` currently:
  - accepts uploads without a login;
  - takes the file extension from the uploaded file's name;
  - trusts the browser-reported MIME type.

  `deploy/nginx.conf` already blocks the dangerous part: it only serves `.jpg/.jpeg/.png/.webp` from `/uploads/`, with `nosniff` and a locked-down CSP. The route should still be fixed in code: require a session, and pick the extension from the validated type.

---

## Files in `deploy/`

| File | Goes to | Purpose |
|---|---|---|
| `nginx.conf` | `/etc/nginx/sites-available/techno27` | HTTPS, headers, uploads from disk, proxy to Next.js |
| `ecosystem.config.cjs` | used in place | PM2: `next start` on `127.0.0.1:3000`, restart on crash or reboot |
| `deploy.sh` | used in place | Pull `main`, install, build, reload, health check |
