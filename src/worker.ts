// worker.ts - Deckboss.ai Professional Product Page
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deckboss.ai - Design Your Robot Brain</title>
    <meta name="description" content="AI-powered system design for edge robotics and IoT. Get wiring diagrams, simulations, and installation guides.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
    <style>
        :root {
            --accent: #f59e0b;
            --bg-dark: #0a0a0a;
            --text-white: #f5f5f5;
            --text-muted: #a3a3a3;
            --card-bg: #1a1a1a;
            --border: #333333;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            scroll-behavior: smooth;
            background-color: var(--bg-dark);
            color: var(--text-white);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
        }
        
        body {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
            border-bottom: 1px solid var(--border);
            margin-bottom: 80px;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent);
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 32px;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text-white);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .nav-links a:hover {
            color: var(--accent);
        }
        
        /* Hero */
        .hero {
            text-align: center;
            padding: 80px 0;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .hero h1 {
            font-size: 64px;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
            background: linear-gradient(135deg, var(--text-white) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hero p {
            font-size: 20px;
            color: var(--text-muted);
            margin-bottom: 48px;
            line-height: 1.6;
        }
        
        .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
        }
        
        .btn-primary {
            background-color: var(--accent);
            color: var(--bg-dark);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
        }
        
        .btn-outline {
            background-color: transparent;
            color: var(--text-white);
            border: 2px solid var(--border);
        }
        
        .btn-outline:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
        
        /* Sections */
        section {
            margin: 120px 0;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 64px;
        }
        
        .section-header h2 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
        }
        
        .section-header p {
            font-size: 18px;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Features Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }
        
        .feature-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            transition: transform 0.2s, border-color 0.2s;
        }
        
        .feature-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
        }
        
        .feature-icon {
            font-size: 32px;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-white);
        }
        
        .feature-card p {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
        }
        
        /* Education Cards */
        .education-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }
        
        .edu-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            text-align: center;
        }
        
        .edu-card h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--accent);
        }
        
        /* Content Economy */
        .flow-diagram {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 48px;
            margin-top: 48px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            color: var(--accent);
            line-height: 2;
        }
        
        /* Pricing */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-top: 48px;
        }
        
        .pricing-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            position: relative;
        }
        
        .pricing-card.featured {
            border-color: var(--accent);
            transform: scale(1.05);
        }
        
        .pricing-card h3 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .price {
            font-size: 48px;
            font-weight: 800;
            margin: 24px 0;
            color: var(--text-white);
        }
        
        .price span {
            font-size: 16px;
            color: var(--text-muted);
        }
        
        .pricing-features {
            list-style: none;
            margin: 24px 0;
        }
        
        .pricing-features li {
            padding: 8px 0;
            color: var(--text-muted);
            font-size: 14px;
            border-bottom: 1px solid var(--border);
        }
        
        .pricing-features li:last-child {
            border-bottom: none;
        }
        
        /* Footer */
        footer {
            margin-top: 120px;
            padding: 48px 0;
            border-top: 1px solid var(--border);
            text-align: center;
        }
        
        .footer-tagline {
            font-size: 18px;
            color: var(--text-muted);
            margin-bottom: 32px;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .footer-links a {
            color: var(--text-white);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }
        
        .footer-links a:hover {
            color: var(--accent);
        }
        
        .copyright {
            color: var(--text-muted);
            font-size: 14px;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 48px;
            }
            
            .nav-links {
                display: none;
            }
            
            .section-header h2 {
                font-size: 36px;
            }
            
            .features-grid,
            .education-cards,
            .pricing-grid {
                grid-template-columns: 1fr;
            }
            
            .pricing-card.featured {
                transform: none;
            }
            
            .flow-diagram {
                font-size: 16px;
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <nav>
        <a href="#" class="logo">Deckboss.ai</a>
        <ul class="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#economy">Economy</a></li>
            <li><a href="#pricing">Pricing</a></li>
        </ul>
    </nav>

    <main>
        <section class="hero">
            <h1>Design Your Robot Brain</h1>
            <p>AI-powered system design for edge robotics and IoT. Describe what you need. Get wiring diagrams, simulations, and installation guides.</p>
            <div class="cta-buttons">
                <a href="#pricing" class="btn btn-primary">Start Building</a>
                <a href="https://docs.deckboss.ai" class="btn btn-outline">View Documentation</a>
            </div>
        </section>

        <section id="features">
            <div class="section-header">
                <h2>Build with Intelligence</h2>
                <p>From concept to deployment, AI assists every step of your robotics journey</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📐</div>
                    <h3>Visual System Design</h3>
                    <p>Describe your project in plain language. The AI generates wiring diagrams, parts lists, and 3D-ready specifications. Share simulations with your client so they understand exactly what you are building.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📸</div>
                    <h3>Photo-to-Wiring</h3>
                    <p>Take photos of existing hardware. The AI identifies components, suggests connections, and flags compatibility issues before you wire anything.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3>IoT Architecture</h3>
                    <p>Design sensor networks, compute topologies, and communication buses. Get firmware suggestions and pin mappings for Jetson, Raspberry Pi, ESP32, and Arduino.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎓</div>
                    <h3>Education On Board</h3>
                    <p>Spend tokens on custom courses about your system, robotics, or anything you want to learn. Courses are generated fresh or remixed from community content.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Hand Off to Cocapn</h3>
                    <p>When design is complete, hand off to Cocapn runtime for deployment on physical hardware. Your design becomes the running system.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3>TUI in Every Repo</h3>
                    <p>Opens as a terminal UI in any git repo. Works on phone or laptop. No installation required.</p>
                </div>
            </div>
        </section>

        <section id="education">
            <div class="section-header">
                <h2>Learn Anything On Board</h2>
                <p>Token-based course generation. Need to understand your new fuel monitoring system? A course is built for it. Want to learn PID controllers for autopilot? Done.</p>
            </div>
            <div class="education-cards">
                <div class="edu-card">
                    <h3>Generate</h3>
                    <p>Fresh courses tailored to your specific hardware and software stack</p>
                </div>
                <div class="edu-card">
                    <h3>Share</h3>
                    <p>Content you generate can be shared. Others learn for free. Community grows.</p>
                </div>
                <div class="edu-card">
                    <h3>Remix</h3>
                    <p>Popular content gets remixed for new environments, seasons, or vessel types</p>
                </div>
            </div>
        </section>

        <section id="economy">
            <div class="section-header">
                <h2>The Sharing Flywheel</h2>
                <p>When people share content freely, new users get value instantly. Fresh content costs tokens. Remixed content costs less.</p>
            </div>
            <div class="flow-diagram">
                You Generate → Share Freely → Others Learn Free → Community Grows → More Content → Less Token Spend Per User
            </div>
        </section>

        <section id="pricing">
            <div class="section-header">
                <h2>Simple Pricing</h2>
                <p>Start free, upgrade as you grow. All plans include community content and support.</p>
            </div>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Free</h3>
                    <div class="price">$0<span>/mo</span></div>
                    <ul class="pricing-features">
                        <li>5 system designs/day</li>
                        <li>1 Cocapn instance</li>
                        <li>Community content</li>
                        <li>Community support</li>
                    </ul>
                    <a href="#" class="btn btn-outline" style="width: 100%;">Get Started</a>
                </div>
                <div class="pricing-card">
                    <h3>Standard</h3>
                    <div class="price">$9<span>/mo</span></div>
                    <ul class="pricing-features">
                        <li>Unlimited designs</li>
                        <li>5 Cocapn instances</li>
                        <li>Cloud sync</li>
                        <li>Email support</li>
                        <li>500 course tokens/mo</li>
                    </ul>
                    <a href="#" class="btn btn-outline" style="width: 100%;">Choose Plan</a>
                </div>
                <div class="pricing-card featured">
                    <h3>Professional</h3>
                    <div class="price">$29<span>/mo</span></div>
                    <ul class="pricing-features">
                        <li>Everything in Standard</li>
                        <li>Unlimited instances</li>
                        <li>Capitaine.ai access</li>
                        <li>Priority support</li>
                        <li>2000 course tokens/mo</li>
                        <li>White-label</li>
                    </ul>
                    <a href="#" class="btn btn-primary" style="width: 100%;">Choose Plan</a>
                </div>
                <div class="pricing-card">
                    <h3>Enterprise</h3>
                    <div class="price">$99<span>/seat/mo</span></div>
                    <ul class="pricing-features">
                        <li>Everything in Pro</li>
                        <li>Custom hardware configs</li>
                        <li>On-site training</li>
                        <li>SLA</li>
                        <li>Unlimited tokens</li>
                        <li>Dedicated support engineer</li>
                    </ul>
                    <a href="#" class="btn btn-outline" style="width: 100%;">Contact Sales</a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p class="footer-tagline">"Built by technicians, for technicians."</p>
        <div class="footer-links">
            <a href="https://deckboss.ai">Deckboss.ai</a>
            <a href="https://deckboss.net">Deckboss.net</a>
            <a href="https://cocapn.ai">Cocapn.ai</a>
            <a href="https://cocapn.com">Cocapn.com</a>
            <a href="https://capitaine.ai">Capitaine.ai</a>
            <a href="https://github.com/Lucineer">github.com/Lucineer</a>
        </div>
        <p class="copyright">© 2024 Deckboss.ai. All rights reserved.</p>
    </footer>

    <script>
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add active state to nav links
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Security headers
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        ...securityHeaders
      }
    });
  }
};