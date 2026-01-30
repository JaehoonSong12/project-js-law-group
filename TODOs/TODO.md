# JS Law Group - Website & SEO Strategy Plan

## 1. Domain Management (CheapDomain)

### A. Domain Acquisition (Typosquatting Protection)
- [ ] **Identify Variations:** List common misspellings of "jslawgroup" (e.g., `jslawgruop.com`, `jslaw-group.com`, `jslaw.com`, `jslogroup.com`).
- [ ] **Purchase Domains:** Register these variations on CheapDomain.
- [ ] **Main Domain:** Ensure `jslawgroup.net` (or preferred TLD) is the primary domain.

### B. DNS & Redirection Strategy
The goal is to consolidate all traffic to the **canonical** domain (e.g., `https://www.jslawgroup.net`) to maximize SEO authority.

- [ ] **301 Redirects (Permanent):**
    - Log in to CheapDomain DNS management.
    - Set up **Domain Forwarding** for all typo-domains to redirect to the primary domain `https://www.jslawgroup.net`.
    - Ensure "301 Permanent" is selected (not 302).
    - Enable "Forward Path" if you want `jslaw.com/about` to go to `jslawgroup.net/about` (optional, usually homepage redirect is enough for typos).
- [ ] **HTTPS Redirection:**
    - Ensure the hosting server forces HTTPS.
    - Configure redirects from `http://` to `https://` and `non-www` to `www` (or vice-versa, pick one).

## 2. Server-Side Configuration (Flask)

- [ ] **Canonical Host Enforcement:**
    - Middleware to check `request.host`. If it matches a typo-domain (if DNS points to server instead of forwarding at registrar level), return a 301 redirect response to the primary domain.
- [ ] **SSL Certificates:**
    - Use Let's Encrypt or CheapDomain's SSL for the primary domain.
    - If mapped via DNS alias, ensure the cert covers alternative names (SANs), though Registrar Forwarding avoids this complexity.

## 3. SEO Optimization (Google)

### A. Technical SEO
- [ ] **Sitemap.xml:**
    - Generate a `sitemap.xml` dynamically in Flask or static file.
    - List all valid routes: `/`, `/home`, `/247/demo1`, `/247/demo2`.
    - Submit to Google Search Console.
- [ ] **Robots.txt:**
    - Create `static/robots.txt`.
    - Allow all legitimate bots: `User-agent: *`, `Allow: /`.
    - Point to sitemap: `Sitemap: https://www.jslawgroup.net/sitemap.xml`.
- [ ] **Canonical Tags:**
    - In `base.html` or individual templates, add:
      `<link rel="canonical" href="https://www.jslawgroup.net{{ request.path }}" />`
    - This prevents duplicate content penalties if accessed via different URLs.

### B. Content & Meta Data
- [ ] **Title Tags:** Ensure every page has a unique `<title>` containing keywords (e.g., "Personal Injury Lawyer in Duluth | JS Law Group").
- [ ] **Meta Descriptions:** Add `<meta name="description" content="...">` summarizing the page for SERP clicks.
- [ ] **Open Graph (OG) Tags:** For better sharing on Facebook/LinkedIn.
    - `og:title`, `og:description`, `og:image`, `og:url`.
- [ ] **Schema.org Markup:**
    - Add JSON-LD script for **LegalService** or **Attorney**.
    - Include: Name, Address, Phone (NAP), OpeningHours, GeoCoordinates.

### C. Google Tools
- [ ] **Google Search Console (GSC):**
    - Verify ownership of `jslawgroup.net` via DNS TXT record.
    - Monitor "Performance" tab for search queries.
    - Check "Page Experience" and "Core Web Vitals".
- [ ] **Google My Business (GMB):**
    - Claim and verify the business profile.
    - Ensure NAP (Name, Address, Phone) matches the website footer exactly.
    - Encourage client reviews.

## 4. Accessibility & Performance
- [ ] **Mobile Responsiveness:** Verify Bootstrap grid works on mobile (already implemented).
- [ ] **Page Speed:**
    - Compress images (`.avif` is good, check file sizes).
    - Minify CSS/JS (Flask-Assets or manual minification).
- [ ] **Alt Text:** Ensure all `<img>` tags have descriptive `alt` attributes.

## 5. Deployment Checklist
- [ ] **Production Mode:** Ensure `debug=False` in `main.py`.
- [ ] **Secret Key:** Set a strong random environment variable for `SECRET_KEY`.
- [ ] **Error Pages:** Create custom `404.html` and `500.html` templates.
