<!-- Anchor Tag (Object) for "back to top" -->
<a id="readme-top"></a>

<!-- 
 @requires
 1. VSCode extension: Markdown Preview Enhanced
 2. Shortcut: 'Ctrl/Command' + 'Shift' + 'V'
 3. Split: Drag to right (->)

 @requires
 1. VSCode extension: Markdown All in One
 2. `File` > `Preferences` > `Keyboard Shortcuts`
 3. toggle code span > `Ctrl + '`
 4. toggle code block > `Ctrl + Shift + '`

 @usage
 1. End of Proof (Q.E.D.): <div style="text-align: right;">&#11035;</div>
 2. End of Each Section: 

     <br /><br /><br />

     ---



     <p align="right">(<a href="#readme-top">back to top</a>)</p>
     

 3. ![image_title_](images/imagefile.png)
 4. [url_title](URL)
 -->




# JS Law Group Website
JS Law Group Website is a professional, responsive web application built for a law firm specializing in Personal Injury and Criminal Defense cases. The website features bilingual support (English/Korean), a modern UI built with Bootstrap 5, and an integrated contact form system. This project has been re-architected from a static/Node.js setup to a robust **Python Flask** application to support dynamic form processing, email automation, and secure backend logic.

## Key Features
- **Bilingual Support**: Full English/Korean language switching with i18n implementation
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI/UX**: Clean, professional design with custom styling
- **Contact Forms**: Integrated inquiry forms for different case types (General Inquiry, Personal Injury, Criminal Defense)
- **Debug Mode**: Built-in debugging tools for development
- **Performance**: Optimized loading with modular JavaScript architecture
- **Accessibility**: WCAG-compliant design practices
- **Dynamic Backend**: Built with Python Flask
- **Production-Ready Server**: Auto-switching server logic (Waitress for Windows, Gunicorn for Linux/Mac)
- **Secure Form Handling**: Integrated with Flask-WTF and WTForms for CSRF protection and validation
- **Email Automation**: Custom GmailProxy service to send structured case inquiries (HTML/JSON/CSV attachments)
- **Executable Builds**: Automated CI/CD pipeline (GitHub Actions) compiling standalone executables via PyInstaller for all major OS platforms (Windows, macOS, Ubuntu, Oracle Linux)



## About Copywriter

Copywriter **Nayun** collaborated on this project. Shared assets and PRs:

- **Google Drive**: [shared folder](https://drive.google.com/drive/folders/1KxDCyep_wjzljJFg4_3VhuLtFhbTFJq_?usp=sharing)
- **Google Doc**: [shared document](https://docs.google.com/document/d/1ktVLaH3LRAZYLbDIvD55MNlNusYgBo8_NEND8peRMCM/edit?usp=sharing)
- **Pull requests**: [PR #2](https://github.com/JaehoonSong12/project-js-law-group/pull/2), [PR #8](https://github.com/JaehoonSong12/project-js-law-group/pull/8), [PR #9](https://github.com/JaehoonSong12/project-js-law-group/pull/9) (by Nayun)


- **PR #2** ([link](https://github.com/JaehoonSong12/project-js-law-group/pull/2)) - Content edits for pi.article.body, cd.article.body, about.desc, and related scripts.
  - Grammar/vocabulary edits.
  - Filler text replaced with informational content.
  - Rephrased sentences; added/removed phrases.

- **PR #8** ([link](https://github.com/JaehoonSong12/project-js-law-group/pull/8)) - Content writing for 24/7 Emergency Legal Rescue page (first half).
  - Grammar/vocabulary edits; rephrased sentences; added/removed phrases.
  - Requested: Move "What to Do in an Emergency" above "Our Practice Areas"; remove `tfs.incidents.title` / `tfs.incidents.subtitle` and merge "Our Practice Areas" with "We Handle All Types of Incidents".

- **PR #9** ([link](https://github.com/JaehoonSong12/project-js-law-group/pull/9)) - Content writing for 24/7 Emergency Legal Rescue page (second half).
  - Grammar/vocabulary edits; rephrased sentences; added/removed phrases.
  - Requested: Reorder Index sections (top to bottom): Personal Injury Lawyers -> Trust (770)-910-4545 After Your Motor Vehicle Accident -> Important Steps to Take When in a Motor Vehicle Accident -> What Happens When You Call? -> Case Evaluation Form. [Order in doc](https://docs.google.com/document/d/1QIYvsppMaTWNkEwfl84qfEmJMOyuRRv24sh1y7GCmXs/edit?usp=sharing).

**Quick reference (student contributors):** Run the dev server with `./on_server.sh`; use `../vcs-gh-nayun.exe` for git/PR workflow.




## Table of Contents

- [JS Law Group Website](#js-law-group-website)
  - [Key Features](#key-features)
  - [About Copywriter](#about-copywriter)
  - [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Building Executables](#building-executables)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment & Production Hardening](#deployment--production-hardening)
  - [Environment Variables (.env)](#environment-variables-env)
  - [Persistent Service (Systemd)](#persistent-service-systemd)
- [Technologies](#technologies)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Internationalization](#internationalization)
  - [Development Tools](#development-tools)
  - [Fonts](#fonts)
- [Development](#development)
  - [Debug Mode](#debug-mode)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Styling](#styling)
  - [Features in Detail](#features-in-detail)
- [SEO & Roadmap](#seo--roadmap)
- [Contributing](#contributing)
  - [For Developers](#for-developers)
  - [For Copywriters](#for-copywriters)
- [References](#references)
- [License](#license)
- [Contact](#contact)




<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Installation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** (for development and production server)
- **Git**

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Create virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Development Mode

To run the server locally with debug mode enabled:

```bash
# Windows (PowerShell)
$env:FLASK_DEBUG="True"; python main.py

# Mac/Linux
export FLASK_DEBUG=True && python main.py
```

The server will typically run on `http://localhost:5000`.

### Production Mode

Simply run the smart wrapper script (`main.py`). It automatically detects the OS and launches the appropriate production server (Waitress on Windows, Gunicorn on Linux/Mac).

```bash
python main.py
# OR if using the built executable:
./jslawgroup-oracle-linux-x64
```

**How it works:**
1.  **Dependencies:** Automatically uses `gunicorn` (bundled in the exe or installed via pip) on Linux/Mac, and `waitress` on Windows.
2.  **Windows (Production):** Detects Windows and uses **Waitress** WSGI server.
    - *Note:* If `waitress` is missing, it falls back to Flask Dev Server with a warning.
3.  **Linux/Mac (Production):** Detects non-Windows and uses **Gunicorn** WSGI server (4 workers).

### Building Executables

The project includes a GitHub Actions workflow (`.github/workflows/release.yml`) that automatically builds standalone executables when a tag starting with `v*` is pushed.

To build locally:

```bash
pyinstaller main.py --onefile --name jslawgroup --add-data "static;static" --add-data "templates;templates" --add-data "submissions;submissions"
```

*(Note: Separators for `--add-data` use `;` on Windows and `:` on Linux/Mac.)*


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Project Structure

```
/
├── app/                    # Backend Application Logic
│   ├── __init__.py         # Flask App Factory & Route Logic
│   ├── __main__.py         # Server Entry Point (Waitress/Gunicorn selection)
│   ├── forms.py            # WTForms Definitions (Validation logic)
│   └── gmailproxy.py       # Email Service (SMTP/Gmail integration)
├── templates/              # HTML Templates (Jinja2)
│   ├── final*.html         # Production-ready pages
│   ├── index.html          # Prototype Hub & Wizard
│   └── form_*.html         # Form fragments (for modals/iframes)
├── static/                 # Static Assets
│   ├── css/                # Compiled Styles
│   ├── js/                 # Frontend Scripts
│   └── images/             # Visual Assets
├── submissions/            # Local storage for form submissions (JSON/CSV)
├── main.py                 # Application Wrapper Script
├── requirements.txt        # Python Dependencies
├── .env.example            # Example Environment Variables
└── README.md               # Project Documentation
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Configuration

For production, creating a `.env` file is **mandatory** to secure the application.

**Create a `.env` file in the root directory:**

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


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Deployment & Production Hardening

## Persistent Service (Systemd)

To ensure the app keeps running after a reboot or crash on Linux servers, create a systemd service.

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

## Maintenance & Monitoring
- **Backups:** Schedule regular backups of the `submissions/` directory.
- **Logs:** Monitor service logs using `journalctl -u jslaw`


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Technologies

## Backend
- **Flask**: Web Framework
- **Flask-WTF / WTForms**: Form handling and validation
- **Waitress**: Production WSGI server for Windows
- **Gunicorn**: Production WSGI server for UNIX
- **PyInstaller**: For bundling the app into a single executable file

## Frontend
- **HTML5** - Semantic markup
- **CSS3 / SCSS** - Styling and theming
- **Bootstrap 5** - Responsive framework
- **Jinja2** - Templating engine
- **JavaScript (ES6+)** - Modern JavaScript with modules; client-side validation and interactivity
- **Font Awesome 6** - Icon library

## Internationalization
- **Custom i18n Module** - Lightweight translation system
- **JSON-based Translations** - Easy-to-manage locale files

## Development Tools
- **Python Flask** - Development and production server
- **SCSS Compiler** - CSS preprocessing
- **Git** - Version control

## Fonts
- **Inter** - Primary font family
- **Noto Sans KR** - Korean text support


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# Development

## Debug Mode

Enable debug mode to visualize i18n attributes:

1. Set the debug flag in the HTML body tag:
   ```html
   <body debug-i18n="true">
   ```

2. The debug mode will:
   - Add red dashed borders around elements with `data-i18n` attributes
   - Display labels showing the translation keys (e.g., "hero.title", "contact.submit")
   - Help identify which elements are using the i18n system

## Internationalization (i18n)

The project uses a custom i18n system:

1. **Translation Files**: Located in `static/locales/`
   - Format: `{locale-code}.json` (e.g., `en-US.json`, `ko-KR.json`)

2. **Using Translations in HTML**:
   ```html
   <h1 data-i18n="hero.title">Default fallback text</h1>
   <p data-i18n="hero.subtitle">Default subtitle</p>
   ```

3. **Translation Structure**:
   ```json
   {
     "hero": {
       "title": "Welcome to JS Law Group",
       "subtitle": "Expert legal representation"
     }
   }
   ```

4. **Switching Languages**: The language switcher is automatically wired up in the navigation component.

## Styling

- **SCSS Source**: `static/scss/custom.scss`
- **Compiled CSS**: `static/css/custom.min.css`
- **Bootstrap Customization**: Custom variables and overrides in SCSS

To compile SCSS:
```bash
# Use the provided script or your preferred SCSS compiler
sass static/scss/custom.scss static/css/custom.min.css --style compressed
```

## Features in Detail

### Bilingual Support
- Seamless language switching between English and Korean
- Additional support for Japanese and Spanish
- Language preference stored in localStorage
- Automatic locale detection

### Contact Forms
- Multiple form types:
  - General Inquiry
  - Personal Injury Cases
  - Criminal Defense Cases
- Email integration via `mailto:` links
- Form validation and error handling

### Responsive Design
- Mobile-first approach
- Breakpoints optimized for all device sizes
- Touch-friendly navigation
- Optimized images and assets

### Performance
- Modular JavaScript architecture
- Lazy loading of components
- Optimized asset delivery
- Minimal dependencies


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---

# SEO & Roadmap

## 1. Domain & Server Configuration (Done)
- [x] **Domain Acquisition:** `jslawgroup.net` acquired.
- [x] **DNS Setup:** Pointed to OCI IP address.
- [x] **Infrastructure:** OCI Instance configured.
- [x] **Web Server:** Nginx configured as reverse proxy.
- [x] **SSL/HTTPS:** Enabled and working (Let's Encrypt/Certbot).
- [x] **Email Integration:** `GmailProxy` implemented with attachments (JSON/CSV) and HTML body.
- [x] **App Architecture:** Reorganized into `app/__init__.py` (Flask App) and `app/__main__.py` (Server Entry Point), with `main.py` wrapper.
- [x] **Wizard Integration:** Embedded 'Auto Accident Wizard' multi-step form into `index.html` with WTForms (`AutoAccidentWizardForm`) and backend processing.
- [x] **Build Pipeline:** Updated PyInstaller builds to bundle dependencies and configurations.

## 2. Frontend & UX Improvements (Done)
- [x] **Prototype Index (`index.html`):** Consistent validation, success feedback modal, and layout fixes.
- [x] **Dependencies:** Installed `email-validator` to resolve backend validation issues.

## 3. SEO Optimization (Pending)
### A. Technical SEO
- [x] **Robots.txt:** Created and serving at `/robots.txt`.
- [x] **Sitemap.xml:** Serving at `/sitemap.xml` (Ensure content is up to date).
- [ ] **Canonical Tags:** Verify `<link rel="canonical" href="...">` is present in templates.
- [ ] **Submission:** Submit `https://www.jslawgroup.net/sitemap.xml` to Google Search Console.

### B. Content & Meta Data
- [ ] **Title Tags:** Ensure unique titles for `/final/about`, `/final/accident`, etc.
- [ ] **Meta Descriptions:** Add description tags to all final templates.
- [ ] **Open Graph (OG) Tags:** Add for social sharing.
- [ ] **Schema.org:** Add JSON-LD for "LegalService".

### C. Google Tools
- [ ] **Google Search Console (GSC):** Verify domain ownership.
- [ ] **Google My Business:** Claim profile and match NAP (Name, Address, Phone).


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# Contributing

## For Developers

1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Test thoroughly across different browsers
4. Submit a pull request with a clear description

## For Copywriters

The translation workspace is located in `scripts-*/` directories:
- **English**: `scripts-en-US/`
- **Korean**: `scripts-ko-KR/`
- **Japanese**: `scripts-ja-JP/`
- **Spanish**: `scripts-es-US/`

Translation files are managed in JSON format in `static/locales/`.




<p align="right">(<a href="#readme-top">back to top</a>)</p>


<br /><br /><br />

---

# References

## Website References

- **Project Website**: [GitHub Pages Deployment](/)
- **Original Website**: [JS Law Group Official Site](https://www.jslawgroup.net/)

The project is deployed using **GitHub Pages** for high availability and accessibility. This is a modernized version of the original website, built to replace legacy technology with contemporary web standards.





## Official Law Firm Website Examples


- [Rice Firm Duluth - Attorneys](https://ricefirmduluth.com/attorneys/)
- [Gonzalez Lawyer - Reviews](https://gonzalez-lawyer.com/review-us/)
- [KP Attorney](https://kpattorney.com/)
- [HB Injury Lawyers Atlanta](https://ga.hbinjurylawyers.com/personal-injury-lawyer-atlanta/)




## Contact Form Examples

**Personal Injury Forms:**
- [Personal Injury - English](https://docs.google.com/forms/d/e/1FAIpQLSfUtcNBRymBfjurq5eoeKHAiNh-ZtO7x8sNgVP01F2pIW80Aw/viewform?usp=header)
- [Personal Injury - Korean](https://docs.google.com/forms/d/e/1FAIpQLSf62nW3gun6QiLc157Cs-CWc1vzMgS7EzMZ4fj6S1KNONu8xQ/viewform?usp=header)

**Criminal Defense Forms:**
- [Criminal Defense - English](https://docs.google.com/forms/d/e/1FAIpQLSc7v4ccD3KJjcuS4AYfqrO3eTTt8dMtg5KNd89B-zwwJRwIUw/viewform?usp=header)
- [Criminal Defense - Korean](https://docs.google.com/forms/d/e/1FAIpQLSf62nW3gun6QiLc157Cs-CWc1vzMgS7EzMZ4fj6S1KNONu8xQ/viewform?usp=header)

**General Inquiry:**
- [General Contact Form](https://docs.google.com/forms/d/e/1FAIpQLSdvEg_la4wmUD77wIJ1EZ4c_2HkOkGNZ9ThIiFpj-JU7swFZw/viewform?usp=header)





## 24/7 Commercial/Marketing Websites
- [411 Pain - Atlanta Motor Vehicle Accident](https://411pain.com/atlanta-georgia/motor-vehicle-accident/#free-case-review)
- [1-800-Hurt 911 - Georgia injury treatment and attorney referrals](https://1800hurt911ga.com/)
- [Elite Accident Attorneys](https://eliteaccidentattorneys.com/)




## UI/UX Resources

- [Dictionary of Basic UI/UX Elements](https://en.training.qatestlab.com/blog/technical-articles/dictionary-of-the-basic-ui-ux-elements/)
- [User Interface Layouts](https://devsquad.com/blog/user-interface-layouts)
- [15 Common UI Components](https://designingwebinterfaces.com/15-common-components)

## Additional Resources

### Documentation & Frameworks
- **Bootstrap Documentation** - [getbootstrap.com](https://getbootstrap.com/docs/)
- **Font Awesome Icons** - [fontawesome.com](https://fontawesome.com/)
- **GitHub Pages** - [pages.github.com](https://pages.github.com/)

### Standards & Guidelines
- **Web Accessibility Guidelines** - [W3C WAI](https://www.w3.org/WAI/)
- **WCAG 2.1 Guidelines** - [w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

### Development Tools
- **Python Flask** - [flask.palletsprojects.com](https://flask.palletsprojects.com/)
- **SCSS Documentation** - [sass-lang.com](https://sass-lang.com/documentation)
- **ES6 Modules** - [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---


# License

This project is proprietary software developed for JS Law Group. All rights reserved.

# Contact

For questions or support regarding this project, please contact the development team.

<div align="center">

**Built for JS Law Group**

*Last updated: Feb 2026*

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>