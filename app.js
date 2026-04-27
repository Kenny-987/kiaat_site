  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 30));

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(l =>
    l.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); })
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.form-submit');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'block';
      btn.textContent = 'Message Sent ✓';
      this.reset();
    }, 1000);
  });
const dropdownBtns = document.querySelectorAll('.dropbtn');


              dropdownBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Check if we are in mobile view (where hamburger is visible)
                    if (window.innerWidth <= 768) {
                        e.preventDefault(); // Prevent following the link
                        const parentItem = btn.parentElement;
                        
                        // Close other active dropdowns
                        document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                            if (item !== parentItem) {
                                item.classList.remove('mobile-dropdown-active');
                            }
                        });

                        // Toggle current dropdown
                        parentItem.classList.toggle('mobile-dropdown-active');
                    }
                });
            });
