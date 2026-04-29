class SiteNavbar extends HTMLElement {
  connectedCallback() {
    // 1. Attach the Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // 2. Inject HTML and CSS
    shadow.innerHTML = `
      <link rel="stylesheet" href="styles.css">

      <nav id="navbar">
        <a href="#hero" class="nav-logo">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          Kiaat<span class="logo-accent">Technologies</span>
        </a>
        
        <ul class="nav-links">
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropbtn">
              Services <span class="dropdown-icon">▼</span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#" class="dropdown-item">Server Setup</a></li>
              <li><a href="#" class="dropdown-item">Data migration & Backup</a></li>
              <li><a href="#" class="dropdown-item">Self-Hosting Apps</a></li>
              <li><a href="#" class="dropdown-item">Automating Deployment</a></li>
              <li><a href="#" class="dropdown-item">Software & Web development</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropbtn">
              Industries <span class="dropdown-icon">▼</span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#" class="dropdown-item">Education</a></li>
              <li><a href="#" class="dropdown-item">Healthcare</a></li>
              <li><a href="#" class="dropdown-item">Retail & E-commerce</a></li>
              <li><a href="#" class="dropdown-item">Startups</a></li>
              <li><a href="#" class="dropdown-item">Accounting</a></li>
              <li><a href="#" class="dropdown-item">Agencies</a></li>
            </ul>
          </li>
          <li><a href="#about">About</a></li>
          <li><a href="#process">Our Process</a></li>
        </ul>
        
        <a href="#contact" class="btn-nav">Talk to Us</a>
        
        <button class="hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <ul>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropbtn">
              Services <span class="dropdown-icon">▼</span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#" class="dropdown-item">Server Setup</a></li>
              <li><a href="#" class="dropdown-item">Data migration & Backup</a></li>
              <li><a href="#" class="dropdown-item">Self-Hosting Apps</a></li>
              <li><a href="#" class="dropdown-item">Automating Deployment</a></li>
              <li><a href="#" class="dropdown-item">Software & Web development</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropbtn">
              Industries <span class="dropdown-icon">▼</span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#" class="dropdown-item">Education</a></li>
              <li><a href="#" class="dropdown-item">Healthcare</a></li>
              <li><a href="#" class="dropdown-item">Retail & E-commerce</a></li>
              <li><a href="#" class="dropdown-item">Startups</a></li>
              <li><a href="#" class="dropdown-item">Accounting</a></li>
              <li><a href="#" class="dropdown-item">Agencies</a></li>
            </ul>
          </li>
        </ul>
        <a href="#about" class="mobile-link">About</a>
        <a href="#process" class="mobile-link">Our Process</a>
        <a href="#contact" class="btn-outline" style="text-align: center;">Talk to Us</a>
      </div>
    `;

 const navbar = shadow.getElementById('navbar');
    const hamburger = shadow.getElementById('hamburger');
    const mobileMenu = shadow.getElementById('mobileMenu');
    
    // 1. Scroll Effect (Listens to the global window, but affects the shadow navbar)
    window.addEventListener('scroll', () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
      }
    });

    // 2. Hamburger Menu Toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        // It is okay to target document.body from inside the shadow DOM
        document.body.classList.toggle('no-scroll'); 
      });
    }

    // 3. Mobile Links (Close menu when clicked)
    shadow.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger && mobileMenu) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.classList.remove('no-scroll');
        }
      });
    });

    // 4. Dropdown Buttons Toggle
    const dropdownBtns = shadow.querySelectorAll('.dropbtn');
    dropdownBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Check if we are in mobile view
        if (window.innerWidth <= 768) {
          e.preventDefault(); // Prevent following the link
          const parentItem = btn.parentElement;
          
          // Close other active dropdowns
          shadow.querySelectorAll('.nav-item.dropdown').forEach(item => {
            if (item !== parentItem) {
              item.classList.remove('mobile-dropdown-active');
            }
          });

          // Toggle current dropdown
          parentItem.classList.toggle('mobile-dropdown-active');
        }
      });
    });
  }
}

customElements.define('site-navbar', SiteNavbar);