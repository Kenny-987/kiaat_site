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
                Kiaat Labs
              </div>
              <p>Simplifying Technology, Amplifying Productivity</p>
            </div>
            <div class="footer-col">
              <h4>Services</h4>

            <ul >
    <li><a href="/services/digital-presence.html">Digital Presence & Growth</a></li>
    <li><a href="/services/business-systems.html">Business Systems & Automation</a></li>
    <li><a href="/services/managed-it.html">Managed IT & Support</a></li>
    <li><a href="/services/networking.html">Network & On-Site Technology</a></li>
    <li><a href="/services/infrastructure.html">Infrastructure & Hosting</a></li>
</ul>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="../about.html">About Us</a></li>
                <li><a href="#process">How We Work</a></li>
                <li><a href="#contact">Blog</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://www.linkedin.com/company/kiaat-labs">LinkedIn</a></li>
                <li><a href="https://www.facebook.com/kiaatlabs/">Facebook</a></li>
                <li><a href="https://wa.me/263718359679">WhatsApp</a></li>
                <li><a href="tel:0789644097">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© KIAAT</span>
            <div>
              
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// 3. Register the custom HTML tag (must contain a hyphen)
customElements.define('site-footer', SiteFooter);