export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({status: "ok"}), {
        headers: {"Content-Type": "application/json"}
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deckboss.ai - Technician AI for Edge Robotics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --bg: #0a0a0a; --text: #f8fafc; --accent: #f59e0b; --card: #1a1a1a; }
    body { 
      background: var(--bg); 
      color: var(--text); 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    header { padding: 1rem 0; border-bottom: 1px solid #333; position: sticky; top: 0; background: var(--bg); z-index: 100; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.5rem; font-weight: bold; color: var(--accent); }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a { color: var(--text); text-decoration: none; font-weight: 500; }
    .mobile-menu-btn { display: none; background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; }
    .mobile-menu { display: none; flex-direction: column; gap: 1rem; padding: 1rem 0; }
    .mobile-menu.active { display: flex; }
    section { padding: 4rem 0; }
    .hero { text-align: center; padding: 6rem 0; }
    .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; color: var(--accent); }
    .hero p { font-size: 1.25rem; max-width: 700px; margin: 0 auto 2rem; color: #cbd5e1; }
    .cta-button { 
      display: inline-block; 
      background: var(--accent); 
      color: var(--bg); 
      padding: 0.75rem 2rem; 
      border-radius: 0.5rem; 
      text-decoration: none; 
      font-weight: bold; 
      font-size: 1.1rem; 
    }
    .section-title { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: var(--accent); }
    .features-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 2rem; 
      margin-top: 2rem; 
    }
    .card { 
      background: var(--card); 
      padding: 2rem; 
      border-radius: 1rem; 
      border: 1px solid #333; 
    }
    .card h3 { color: var(--accent); margin-bottom: 1rem; font-size: 1.25rem; }
    .hardware-grid, .pricing-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 2rem; 
      margin-top: 2rem; 
    }
    .price-card, .hardware-card { 
      background: var(--card); 
      padding: 2rem; 
      border-radius: 1rem; 
      text-align: center; 
      border: 1px solid #333; 
    }
    .price { font-size: 2rem; color: var(--accent); font-weight: bold; margin: 1rem 0; }
    footer { 
      background: #111; 
      padding: 3rem 0; 
      margin-top: 4rem; 
      text-align: center; 
      border-top: 1px solid #333; 
    }
    .footer-links { 
      display: flex; 
      justify-content: center; 
      flex-wrap: wrap; 
      gap: 2rem; 
      margin: 2rem 0; 
    }
    .footer-links a { color: var(--accent); text-decoration: none; }
    .copyright { color: #94a3b8; margin-top: 2rem; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mobile-menu-btn { display: block; }
      .hero h1 { font-size: 2.5rem; }
      .section-title { font-size: 2rem; }
      .features-grid, .hardware-grid, .pricing-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo">Deckboss.ai</div>
        <div class="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#hardware">Hardware</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
        </div>
        <button class="mobile-menu-btn" onclick="toggleMenu()">☰</button>
      </nav>
      <div class="mobile-menu" id="mobileMenu">
        <a href="#home" onclick="toggleMenu()">Home</a>
        <a href="#features" onclick="toggleMenu()">Features</a>
        <a href="#hardware" onclick="toggleMenu()">Hardware</a>
        <a href="#pricing" onclick="toggleMenu()">Pricing</a>
        <a href="#docs" onclick="toggleMenu()">Docs</a>
      </div>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <h1>Design Your Robot Brain</h1>
      <p>AI assistant for edge robotics and IoT systems. Describe what you need, get wiring diagrams and parts lists.</p>
      <a href="#features" class="cta-button">Start Building</a>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
        <div class="card">
          <h3>Photo-to-Wiring</h3>
          <p>Take photos of hardware, get connection diagrams</p>
        </div>
        <div class="card">
          <h3>IoT Builder</h3>
          <p>Design sensor networks, get firmware suggestions</p>
        </div>
        <div class="card">
          <h3>BYOK</h3>
          <p>Bring your own API keys or try free with cloud services</p>
        </div>
        <div class="card">
          <h3>Hand Off to Cocapn</h3>
          <p>When done building, deploy to hardware</p>
        </div>
        <div class="card">
          <h3>TUI in Repo</h3>
          <p>Opens in any git repo, works on phone or terminal</p>
        </div>
        <div class="card">
          <h3>Offline Design</h3>
          <p>Works on the boat, syncs when connected</p>
        </div>
      </div>
    </div>
  </section>

  <section id="hardware">
    <div class="container">
      <h2 class="section-title">Hardware</h2>
      <div class="hardware-grid">
        <div class="hardware-card">
          <h3>Deckboss Nano</h3>
          <p class="price">$299</p>
          <p>Raspberry Pi 5</p>
        </div>
        <div class="hardware-card">
          <h3>Standard</h3>
          <p class="price">$599</p>
          <p>NVIDIA Jetson</p>
        </div>
        <div class="hardware-card">
          <h3>Pro</h3>
          <p class="price">$1199</p>
          <p>2x NVIDIA Jetson</p>
        </div>
        <div class="hardware-card">
          <h3>Enterprise</h3>
          <p class="price">$1499</p>
          <p>4x Raspberry Pi 5</p>
        </div>
      </div>
    </div>
  </section>

  <section id="pricing">
    <div class="container">
      <h2 class="section-title">Pricing</h2>
      <div class="pricing-grid">
        <div class="price-card">
          <h3>Free</h3>
          <p class="price">$0</p>
          <p>5 designs/day</p>
        </div>
        <div class="price-card">
          <h3>Standard</h3>
          <p class="price">$9/mo</p>
          <p>Unlimited designs</p>
        </div>
        <div class="price-card">
          <h3>Pro</h3>
          <p class="price">$29/mo</p>
          <p>White-label</p>
        </div>
        <div class="price-card">
          <h3>Enterprise</h3>
          <p class="price">$99/seat</p>
          <p>Custom deployment</p>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-links">
        <a href="https://deckboss.ai">Deckboss.ai</a>
        <a href="https://deckboss.net">Deckboss.net</a>
        <a href="https://cocapn.ai">Cocapn.ai</a>
        <a href="https://cocapn.com">Cocapn.com</a>
        <a href="https://capitaine.ai">Capitaine.ai</a>
        <a href="https://github.com/Lucineer">github.com/Lucineer</a>
      </div>
      <p class="copyright">© 2024 Deckboss.ai - Technician AI for Edge Robotics</p>
    </div>
  </footer>

  <script>
    function toggleMenu() {
      document.getElementById("mobileMenu").classList.toggle("active");
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth"
          });
          document.getElementById("mobileMenu").classList.remove("active");
        }
      });
    });
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none';",
        "X-Frame-Options": "DENY"
      }
    });
  }
};