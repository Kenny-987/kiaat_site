class SiteContact extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <link rel="stylesheet" href="/styles.css">

      <section id="contact">
        <div class="container contacts">
          <div class="contact-grid">
            
              <div class="pill-label sage"><div class="dot"></div>Get In Touch</div>
              <h2 class="section-title">Let's Have a<br/>Conversation</h2>
              <p class="section-sub">Free Consultation with no strings attached.</p>
              <div class="contact-details">

               

                <div class="contact-item">
                  <div class="ci-icon"><i data-lucide="mail" style="width: 20px; height: 20px;"></i></div>
                  <div>
                    <div class="ci-label">Email Us</div>
                    <div class="ci-value"><a href="mailto:sales@kiaat.cloud">sales@kiaat.cloud</a></div>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="ci-icon"><i data-lucide="mail" style="width: 20px; height: 20px;"></i></div>
                  <div>
                    <div class="ci-label">Support</div>
                    <div class="ci-value"><a href="mailto:support@kiaat.cloud">support@kiaat.cloud</a></div>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="ci-icon"><i data-lucide="clock" style="width: 20px; height: 20px;"></i></div>
                  <div>
                    <div class="ci-label">Business Hours</div>
                    <div class="ci-value">Mon – Fri, 08:00 – 17:00 CAT</div>
                  </div>
                  </div>
                
                  <div class="contact-item">
                  <div class="ci-icon"><i data-lucide="clock" style="width: 20px; height: 20px;"></i></div>
                  <div>
                    <div class="ci-label">Location</div>
                    <div class="ci-value">18 Sebakwe Avenue, Richmond, Bulawayo</div>
                  </div>
                  </div>

              </div>
            

          </div>
        </div>
      </section>
    `;

    // --- FORM JAVASCRIPT LOGIC ---
    const contactForm = shadow.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.form-submit');
        
        if (btn) {
          btn.textContent = 'Sending…'; 
          btn.disabled = true;
        }
        
        setTimeout(() => {
          const formSuccess = shadow.getElementById('formSuccess');
          if (formSuccess) {
            formSuccess.style.display = 'block';
          }
          if (btn) {
            btn.textContent = 'Message Sent ✓';
          }
          this.reset();
        }, 1000);
      });
    }
  }
}

customElements.define('site-contact', SiteContact);