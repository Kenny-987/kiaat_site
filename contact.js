class SiteContact extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <link rel="stylesheet" href="/styles.css">

      <section id="contact">
        <div class="container">
          <div class="contact-grid">
            <div class="">
              <div class="pill-label sage"><div class="dot"></div>Get In Touch</div>
              <h2 class="section-title">Let's Have a<br/>Conversation</h2>
              <p class="section-sub">No pressure, no jargon. Just a friendly chat about how we can help your business run better.</p>
              <div class="contact-details">

                <div class="contact-item">
                  <div class="ci-icon"><i data-lucide="map-pin" style="width: 20px; height: 20px;"></i></div>
                  <div>
                    <div class="ci-label">Location</div>
                    <div class="ci-value">18 Sebakwe, Richmond, Zimbabwe</div>
                  </div>
                </div>

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
                    <div class="ci-value">Mon – Fri, 08:00 – 18:00 CAT · 24/7 for managed clients</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <div class="contact-form-wrap">
                <div class="form-title">Send Us a Message</div>
                <div class="form-subtitle">We'll get back to you within 12hrs, usually sooner</div>
                <form class="contact-form" id="contactForm" novalidate>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="fname">First Name</label>
                      <input type="text" id="fname" placeholder="Ada" required />
                    </div>
                    <div class="form-group">
                      <label for="lname">Last Name</label>
                      <input type="text" id="lname" placeholder="Lovelace" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="ada@yourcompany.com" required />
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone Number (optional)</label>
                    <input type="tel" id="phone" placeholder="+263 77 123 4567" />
                  </div>
                  <div class="form-group">
                    <label for="service">What can we help with?</label>
                    <select id="service">
                      <option value="">Please select...</option>
                      <option>VPS Server Setup</option>
                      <option>Data Migration</option>
                      <option>Self & Hosting</option>
                      <option>Software Development</option>
                      <option>Automating Deployment</option>
                      <option>General Consultation</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="message">Tell us about your business</label>
                    <textarea id="message" placeholder="Briefly describe your situation or what you're hoping to achieve..."></textarea>
                  </div>
                  <button type="submit" class="form-submit">Send Message →</button>
                  <p class="form-note"><i data-lucide="lock" style="width: 10px; height: 10px;"></i> Your information is kept private and never shared with third parties.</p>
                  <div class="form-success" id="formSuccess">Message received! We'll be in touch within one business day.</div>
                </form>
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