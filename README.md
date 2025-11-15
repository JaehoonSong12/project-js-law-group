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
JS Law Group Website is a professional, responsive web application built for a law firm specializing in Personal Injury and Criminal Defense cases. The website features bilingual support (English/Korean), a modern UI built with Bootstrap 5, and an integrated contact form system.

## Key Features
- **Bilingual Support**: Full English/Korean language switching with i18n implementation
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI/UX**: Clean, professional design with custom styling
- **Contact Forms**: Integrated inquiry forms for different case types (General Inquiry, Personal Injury, Criminal Defense)
- **Debug Mode**: Built-in debugging tools for development
- **Performance**: Optimized loading with modular JavaScript architecture
- **Accessibility**: WCAG-compliant design practices





## Table of Contents

- [JS Law Group Website](#js-law-group-website)
  - [Key Features](#key-features)
  - [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Development Server](#development-server)
    - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
  - [Frontend](#frontend)
  - [Internationalization](#internationalization)
  - [Development Tools](#development-tools)
  - [Fonts](#fonts)
- [Development](#development)
  - [Debug Mode](#debug-mode)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Styling](#styling)
  - [Features in Detail](#features-in-detail)
    - [Bilingual Support](#bilingual-support)
    - [Contact Forms](#contact-forms)
    - [Responsive Design](#responsive-design)
    - [Performance](#performance)
- [Contributing](#contributing)
  - [For Developers](#for-developers)
  - [For Copywriters](#for-copywriters)
- [References](#references)
  - [Website References](#website-references)
  - [Official Law Firm Website Examples](#official-law-firm-website-examples)
  - [Contact Form Examples](#contact-form-examples)
  - [24/7 Commercial/Marketing Websites](#247-commercialmarketing-websites)
  - [UI/UX Resources](#uiux-resources)
  - [Additional Resources](#additional-resources)
    - [Documentation \& Frameworks](#documentation--frameworks)
    - [Standards \& Guidelines](#standards--guidelines)
    - [Development Tools](#development-tools-1)
- [License](#license)
- [Contact](#contact)














<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---



# Installation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** (for development server)
- **Node.js** (for build tools and dependencies)
- **npm** or **yarn** (package manager)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd base-web
   ```

2. **Install Python dependencies**
   ```bash
   python --version  # Verify Python 3.7+ is installed
   pip install flask
   ```

3. **Install Node.js dependencies** (if applicable)
   ```bash
   npm install
   ```

4. **Verify installation**
   ```bash
   python server.py --help
   ```

## Usage

### Development Server

Start the local development server:

```bash
# Start server in root directory
python server.py

# Start server in a specific subdirectory
python server.py <subdirectory>
```

The server will typically run on `http://localhost:5000` (or the port specified in `server.py`).

### Building for Production

Build the project for production deployment:

```bash
# Build all assets
python server.py --build

# Build for a specific subdirectory
python server.py --build <subdirectory>
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---



# Project Structure

```
base-web/
│
├── public/                 # Public-facing HTML files and static assets
│   ├── jslaw.html          # Main law firm website page
│   ├── index.html           # Landing page
│   ├── locales/            # Translation JSON files
│   │   ├── en-US.json      # English translations
│   │   ├── ko-KR.json      # Korean translations
│   │   ├── ja-JP.json      # Japanese translations
│   │   └── es-US.json      # Spanish translations
│   ├── images/             # Image assets
│   └── css/                # Compiled CSS files
│
├── src/                    # Source code
│   ├── js/                 # JavaScript modules
│   │   ├── jslaw.js        # Main page controller
│   │   └── *.js            # Other page controllers
│   ├── core-module.js      # Core utility functions
│   ├── ext-module-i18n.js  # Internationalization module
│   ├── ext-module-bs.js    # Bootstrap extensions
│   ├── ext-module-fa.js    # Font Awesome extensions
│   ├── scss/               # SCSS source files
│   │   └── custom.scss     # Custom Bootstrap overrides
│   └── css/                # Compiled CSS output
│
├── includes/               # Reusable HTML fragments
│   ├── nav-*.html          # Navigation components
│   └── footer-*.html       # Footer components
│
├── scripts-*/              # Translation workspace directories
│   ├── scripts-en-US/      # English copywriter workspace
│   ├── scripts-ko-KR/      # Korean copywriter workspace
│   ├── scripts-ja-JP/      # Japanese copywriter workspace
│   └── scripts-es-US/      # Spanish copywriter workspace
│
├── docs/                   # Documentation and agreements
├── server.py               # Python development server
├── server.js               # Node.js server (alternative)
└── README.md              # This file
```

**Note**: The `scripts-en-US` directory is the primary workspace for copywriters (Nayun's workspace).



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br /><br /><br />

---



# Technologies

## Frontend
- **HTML5** - Semantic markup
- **CSS3 / SCSS** - Styling and theming
- **Bootstrap 5** - Responsive framework
- **JavaScript (ES6+)** - Modern JavaScript with modules
- **Font Awesome 6** - Icon library

## Internationalization
- **Custom i18n Module** - Lightweight translation system
- **JSON-based Translations** - Easy-to-manage locale files

## Development Tools
- **Python Flask** - Development server
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

1. **Translation Files**: Located in `public/locales/`
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

- **SCSS Source**: `src/scss/custom.scss`
- **Compiled CSS**: `src/css/custom.min.css`
- **Bootstrap Customization**: Custom variables and overrides in SCSS

To compile SCSS:
```bash
# Use the provided script or your preferred SCSS compiler
sass src/scss/custom.scss src/css/custom.min.css --style compressed
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

Translation files are managed in JSON format in `public/locales/`.





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
- [Personal Injury - Korean (상해 한국어)](https://docs.google.com/forms/d/e/1FAIpQLSf62nW3gun6QiLc157Cs-CWc1vzMgS7EzMZ4fj6S1KNONu8xQ/viewform?usp=header)

**Criminal Defense Forms:**
- [Criminal Defense - English (형사 영어)](https://docs.google.com/forms/d/e/1FAIpQLSc7v4ccD3KJjcuS4AYfqrO3eTTt8dMtg5KNd89B-zwwJRwIUw/viewform?usp=header)
- [Criminal Defense - Korean (형사 한국어)](https://docs.google.com/forms/d/e/1FAIpQLSf62nW3gun6QiLc157Cs-CWc1vzMgS7EzMZ4fj6S1KNONu8xQ/viewform?usp=header)

**General Inquiry:**
- [General Contact Form](https://docs.google.com/forms/d/e/1FAIpQLSdvEg_la4wmUD77wIJ1EZ4c_2HkOkGNZ9ThIiFpj-JU7swFZw/viewform?usp=header)





## 24/7 Commercial/Marketing Websites
- [411 Pain - Atlanta Motor Vehicle Accident](https://411pain.com/atlanta-georgia/motor-vehicle-accident/#free-case-review)




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

*Last updated: 14 Nov 2025*

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>