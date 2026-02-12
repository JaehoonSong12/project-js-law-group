# JS Law Group - Website & SEO Strategy Plan

## 1. Domain & Server Configuration (Done)

- [x] **Domain Acquisition:** `jslawgroup.net` acquired.
- [x] **DNS Setup:** Pointed to OCI IP address.
- [x] **Infrastructure:** OCI Instance configured.
- [x] **Web Server:** Nginx configured as reverse proxy.
- [x] **SSL/HTTPS:** Enabled and working (Let's Encrypt/Certbot).
- [x] **Email Integration:** `GmailProxy` implemented with attachments (JSON/CSV) and HTML body.
- [x] **App Architecture:** Reorganized into `app/__init__.py` (Flask App) and `app/__main__.py` (Server Entry Point), with `main.py` wrapper.
- [x] **Wizard Integration:** Embedded 'Auto Accident Wizard' multi-step form into `index.html` with WTForms (`AutoAccidentWizardForm`) and backend processing.
- [x] **Build Pipeline:** Updated PyInstaller builds to bundle:
    - **Linux/Mac:** `gunicorn` (via `main.py` programmatic use).
        - Fixed `ModuleNotFoundError` for `glogging` and `workers.sync` via `--hidden-import` flags and explicit imports in `main.py`.
    - **Windows:** `waitress` (for true production serving on Windows).
    - **Dependencies:** Refactored GitHub Actions to use `requirements.txt` instead of hardcoded packages.

## 2. Frontend & UX Improvements (Done)

- [x] **Prototype Index (`index.html`):**
    - **Consistent Validation:** Implemented inline validation for Wizard steps and restored native browser validation for the final "Contact Details" section.
    - **Success Feedback:** Added a Bootstrap "Success Modal" that automatically triggers upon successful form submission.
    - **Fix:** Resolved `novalidate` conflict to ensure browser prompts appear correctly for visible fields while ignoring hidden ones.
- [x] **Dependencies:** Installed `email-validator` to resolve backend crash with WTForms validation.

## 3. Production Hardening (Next Steps)

### A. Environment Variables (`.env`)
You must create a `.env` file in the project root on the production server (or next to the executable). This file keeps your secrets safe and configures the app behavior.

**Create the file:**
`nano .env`

**Paste and Update the following content:**
```ini
# Flask Configuration
# SECRET_KEY: Used for session security. Generate a random strong string (e.g., `openssl rand -hex 32`).
SECRET_KEY=replace-this-with-a-secure-random-string

# FLASK_APP: Tells Flask where the application instance is located.
FLASK_APP=app:app

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
# OR if using the built executable:
./jslawgroup-oracle-linux-x64
```

**How it works:**
1.  **Dependencies:** It automatically uses `gunicorn` (bundled in the exe or installed via pip) on Linux/Mac, and `waitress` on Windows.
2.  **Windows (Production):** Detects Windows and uses **Waitress** WSGI server.
    - *Note:* If `waitress` is missing, it falls back to Flask Dev Server with a warning.
    - *Debug:* Set `FLASK_DEBUG=True` to force Flask Dev Server (useful for local coding).
3.  **Linux/Mac (Production):** Detects non-Windows and uses **Gunicorn** WSGI server (4 workers).

### C. Persistent Service (Systemd)
To ensure the app keeps running after a reboot or crash, create a systemd service.

1.  **Create Service File:** `sudo nano /etc/systemd/system/jslaw.service`
2.  **Content (Source Code Deployment):**
    ```ini
    [Unit]
    Description=Gunicorn instance to serve JS Law Group
    After=network.target

    [Service]
    User=opc
    Group=www-data
    WorkingDirectory=/home/opc/source/repo/_references/_jh07-jslaw
    Environment="PATH=/home/opc/source/repo/_references/_jh07-jslaw/venv/bin"
    ExecStart=/home/opc/source/repo/_references/_jh07-jslaw/venv/bin/python main.py

    [Install]
    WantedBy=multi-user.target
    ```
    *(Note: If using the PyInstaller executable, point `ExecStart` to the executable path instead)*

3.  **Enable & Start:**
    ```bash
    sudo systemctl start jslaw
    sudo systemctl enable jslaw
    ```

## 4. SEO Optimization (Google)

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

## 5. Maintenance & Monitoring
- [ ] **Backups:** Schedule regular backups of the `submissions/` directory.
- [ ] **Logs:** Monitor service logs: `journalctl -u jslaw`
