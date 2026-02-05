# JS Law Group - Website & SEO Strategy Plan

## 1. Domain & Server Configuration (Done)

- [x] **Domain Acquisition:** `jslawgroup.net` acquired.
- [x] **DNS Setup:** Pointed to OCI IP address.
- [x] **Infrastructure:** OCI Instance configured.
- [x] **Web Server:** Nginx configured as reverse proxy.
- [x] **SSL/HTTPS:** Enabled and working (Let's Encrypt/Certbot).
- [x] **Email Integration:** `GmailProxy` implemented with attachments (JSON/CSV) and HTML body.
- [x] **App Architecture:** Reorganized into `core/app.py` (Flask App) and `main.py` (Production/Dev Wrapper).

## 2. Production Hardening (Next Steps)

### A. Environment Variables (`.env`)
You must create a `.env` file in the project root on the production server. This file keeps your secrets safe and configures the app behavior.

**Create the file:**
`nano .env`

**Paste and Update the following content:**
```ini
# Flask Configuration
# SECRET_KEY: Used for session security. Generate a random strong string (e.g., `openssl rand -hex 32`).
SECRET_KEY=replace-this-with-a-secure-random-string

# FLASK_APP: Tells Flask where the application instance is located.
FLASK_APP=core.app:app

# FLASK_DEBUG: Set to 'False' for production security. Set to 'True' ONLY for local development.
FLASK_DEBUG=False

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=info@jslawgroup.net
SMTP_PASSWORD=your-google-app-password
SMTP_SECURITY=SSL
```

### B. Running the Application
We have implemented a smart wrapper script (`main.py`) that handles the server startup for you.

**To Start the Server:**
Simply run:
```bash
python main.py
```

**How it works:**
1.  **Dependencies:** It automatically checks if `gunicorn` is installed and installs it if missing (on Linux/Mac).
2.  **Windows:** If detected, it falls back to the standard Flask development server (`app.run()`).
3.  **Production (Linux):** It automatically launches the **Gunicorn** WSGI server with optimal settings (4 workers, bound to 0.0.0.0:5000), utilizing the `FLASK_DEBUG` setting from your environment.

### C. Persistent Service (Systemd)
To ensure `python main.py` keeps running after a reboot or crash, create a systemd service.

1.  **Create Service File:** `sudo nano /etc/systemd/system/jslaw.service`
2.  **Content:**
    ```ini
    [Unit]
    Description=Gunicorn instance to serve JS Law Group
    After=network.target

    [Service]
    User=opc
    Group=www-data
    WorkingDirectory=/home/opc/source/repo/_references/_jh07-jslaw
    Environment="PATH=/home/opc/source/repo/_references/_jh07-jslaw/venv/bin"
    # Execute the wrapper script
    ExecStart=/home/opc/source/repo/_references/_jh07-jslaw/venv/bin/python main.py

    [Install]
    WantedBy=multi-user.target
    ```
3.  **Enable & Start:**
    ```bash
    sudo systemctl start jslaw
    sudo systemctl enable jslaw
    ```

## 3. SEO Optimization (Google)

### A. Technical SEO
- [x] **Robots.txt:** Created and serving at `/robots.txt`.
- [x] **Sitemap.xml:** Serving at `/sitemap.xml` (Ensure content is up to date).
- [ ] **Canonical Tags:**
    - Verify `<link rel="canonical" href="...">` is present in `base.html` / templates.
- [ ] **Submission:** Submit `https://www.jslawgroup.net/sitemap.xml` to Google Search Console.

### B. Content & Meta Data
- [ ] **Title Tags:** Ensure unique titles for `/final/about`, `/final/accident`, etc.
- [ ] **Meta Descriptions:** Add description tags to all final templates.
- [ ] **Open Graph (OG) Tags:** Add for social sharing.
- [ ] **Schema.org:** Add JSON-LD for "LegalService".

### C. Google Tools
- [ ] **Google Search Console (GSC):** Verify domain ownership.
- [ ] **Google My Business:** Claim profile and match NAP (Name, Address, Phone).

## 4. Maintenance & Monitoring
- [ ] **Backups:** Schedule regular backups of the `submissions/` directory.
- [ ] **Logs:** Monitor service logs: `journalctl -u jslaw`
