class SiteFooter extends HTMLElement {
  connectedCallback() {
    // 1. Attach the Shadow DOM to encapsulate your component
    const shadow = this.attachShadow({ mode: 'open' });

    // 2. Inject your HTML and link your CSS
    shadow.innerHTML = `
      <link rel="stylesheet" href="/styles.css">

      <footer>
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="nav-logo">
                <div class="logo-mark">
                  <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                </div>
                Kiaat Technologies
              </div>
              <p>Simplifying Technology, Amplifying Productivity</p>
            </div>
            <div class="footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="./services/serversetup.html">VPS Server Setup</a></li>
                <li><a href="/services/databackup.html">Data migration</a></li>
                <li><a href="/services/selfhosting.html">Self Hosting</a></li>
                <li><a href="/services/deployment.html">Automating Deployment</a></li>
                <li><a href="/services/softwaredev.html">Software Development</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#process">How We Work</a></li>
                <li><a href="#contact">Blog</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter / X</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© KIAAT Technologies</span>
            <div>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// 3. Register the custom HTML tag (must contain a hyphen)
customElements.define('site-footer', SiteFooter);