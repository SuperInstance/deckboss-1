/**
 * Deckboss.ai - Technician's AI Assistant for Edge Robotics Design
 * Cloudflare Worker - Single file TypeScript implementation
 */

interface Env {
  // Environment variables can be added here
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  accent?: boolean;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health endpoint
    if (path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'deckboss-worker'
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }

    // API endpoints
    if (path.startsWith('/api/v1')) {
      return handleApiRequest(request, path);
    }

    // Serve the main landing page for all other routes
    return serveLandingPage(request);
  }
} satisfies ExportedHandler<Env>;

function handleApiRequest(request: Request, path: string): Response {
  const method = request.method;

  // Mock API endpoints
  if (path === '/api/v1/design' && method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Design processing started",
        jobId: `job_${Date.now()}`,
        estimatedTime: "30 seconds"
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (path === '/api/v1/wiring' && method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        diagram: "wiring_diagram.svg",
        parts: ["Raspberry Pi 4", "ESP32", "5V Relay Module", "JST Connectors"],
        instructions: "Connect GPIO 17 to IN1, 5V to VCC, GND to GND"
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (path === '/api/v1/hardware' && method === 'GET') {
    return new Response(
      JSON.stringify({
        boards: ["Jetson Nano", "Raspberry Pi 5", "ESP32-S3", "Arduino Uno R4"],
        sensors: ["DHT22", "MPU6050", "HC-SR04", "MQ-135"],
        actuators: ["SG90 Servo", "28BYJ-48 Stepper", "5V Relay", "DC Motor"]
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (path === '/api/v1/identify' && method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        components: [
          { name: "Raspberry Pi 4 Model B", confidence: 0.98 },
          { name: "PCA9685 PWM Driver", confidence: 0.92 },
          { name: "SG90 Micro Servo", confidence: 0.87 }
        ],
        suggestions: ["Use I2C for PWM driver", "Power servos externally"]
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // 404 for unknown API endpoints
  return new Response(
    JSON.stringify({ error: "Endpoint not found" }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

function serveLandingPage(request: Request): Response {
  const html = generateHTML();
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}

function generateHTML(): string {
  const features: Feature[] = [
    { icon: "📝", title: "Describe Your Project", description: "Get wiring diagrams and parts lists tailored to your specific edge robotics application." },
    { icon: "📸", title: "Photo Component ID", description: "Take photos of your hardware - AI identifies components and suggests optimal connections." },
    { icon: "🔑", title: "BYOK - Bring Your Own Keys", description: "Use your own API keys, or try free with our managed cloud services. No vendor lock-in." },
    { icon: "📱", title: "TUI in Any Git Repo", description: "Terminal UI opens directly in your repository - works on phone, tablet, or desktop terminal." },
    { icon: "🚀", title: "Build → Hand Off to Cocapn", description: "Design the brain, then seamlessly hand off to Cocapn for deployment and monitoring." },
    { icon: "⚡", title: "Offline-Capable Design", description: "Design on the boat, in the field, or underground. Sync when you get connectivity." }
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "For hobbyists and students",
      features: ["3 designs/month", "Basic wiring diagrams", "Community support", "Public projects"],
      cta: "Get Started"
    },
    {
      name: "Standard",
      price: "$9",
      description: "For professional technicians",
      features: ["Unlimited designs", "Advanced diagrams", "Email support", "Private projects", "BYOK support"],
      cta: "Start Building",
      accent: true
    },
    {
      name: "Professional",
      price: "$29",
      description: "For engineering teams",
      features: ["All Standard features", "Team collaboration", "Priority support", "Custom templates", "API access"],
      cta: "Go Pro"
    },
    {
      name: "Enterprise",
      price: "$99/seat",
      description: "For organizations",
      features: ["All Professional features", "SLA guarantee", "Dedicated support", "On-prem deployment", "Custom integrations"],
      cta: "Contact Sales"
    }
  ];

  const supportedHardware = ["Jetson", "Raspberry Pi", "ESP32", "Arduino", "BeagleBone", "Custom Boards"];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deckboss.ai - AI Assistant for Edge Robotics Design</title>
    <style>
        :root {
            --accent: #f59e0b;
            --accent-dark: #d97706;
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-card: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --border: #475569;
            --success: #10b981;
            --radius: 0.75rem;
            --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            --transition: all 0.3s ease;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        /* Navigation */
        nav {
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            text-decoration: none;
        }

        .logo-icon {
            color: var(--accent);
            font-size: 2rem;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .nav-link {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
            padding: 0.5rem 0;
            position: relative;
        }

        .nav-link:hover {
            color: var(--accent);
        }

        .nav-link::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--accent);
            transition: var(--transition);
        }

        .nav-link:hover::after {
            width: 100%;
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
        }

        /* Hero Section */
        .hero {
            padding: 6rem 0 4rem;
            text-align: center;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            background: linear-gradient(90deg, var(--accent), #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto 2.5rem;
        }

        .cta-button {
            display: inline-block;
            background: var(--accent);
            color: var(--bg-primary);
            padding: 1rem 2.5rem;
            border-radius: var(--radius);
            text-decoration: none;
            font-weight: 700;
            font-size: 1.125rem;
            transition: var(--transition);
            border: 2px solid var(--accent);
            cursor: pointer;
        }

        .cta-button:hover {
            background: transparent;
            color: var(--accent);
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }

        /* Features */
        .section {
            padding: 5rem 0;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .section-subtitle {
            text-align: center;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto 3rem;
            font-size: 1.125rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .feature-card {
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 2rem;
            transition: var(--transition);
            border: 1px solid var(--border);
        }

        .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
            box-shadow: var(--shadow);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: var(--accent);
        }

        /* Hardware */
        .hardware-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }

        .hardware-chip {
            background: var(--bg-secondary);
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            border: 1px solid var(--border);
            font-weight: 500;
            transition: var(--transition);
        }

        .hardware-chip:hover {
            border-color: var(--accent);
            color: var(--accent);
            transform: scale(1.05);
        }

        /* Pricing */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .pricing-card {
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 2.5rem 2rem;
            border: 1px solid var(--border);
            transition: var(--transition);
            display: flex;
            flex-direction: column;
        }

        .pricing-card.accent {
            border-color: var(--accent);
            position: relative;
            overflow: hidden;
        }

        .pricing-card.accent::before {
            content: "Popular";
            position: absolute;
            top: 0;
            right: 0;
            background: var(--accent);
            color: var(--bg-primary);
            padding: 0.5rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 700;
            transform: rotate(45deg) translate(30%, -50%);
        }

        .pricing-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
        }

        .pricing-name {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .pricing-price {
            font-size: 3rem;
            font-weight: 800;
            margin: 1rem 0;
            color: var(--accent);
        }

        .pricing-desc {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }

        .pricing-features {
            list-style: none;
            margin-bottom: 2rem;
            flex-grow: 1;
        }

        .pricing-features li {
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .pricing-features li::before {
            content: "✓";
            color: var(--success);
            font-weight: bold;
        }

        .pricing-button {
            display: block;
            text-align: center;
            padding: 1rem;
            border-radius: var(--radius);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
            margin-top: auto;
        }

        .pricing-button.accent {
            background: var(--accent);
            color: var(--bg-primary);
            border: 2px solid var(--accent);
        }

        .pricing-button.accent:hover {
            background: transparent;
            color: var(--accent);
        }

        .pricing-button.outline {
            border: 2px solid var(--border);
            color: var(--text-primary);
        }

        .pricing-button.outline:hover {
            border-color: var(--accent);
            color: var(--accent);
        }

        /* Footer */
        footer {
            background: var(--bg-secondary);
            border-top: 1px solid var(--border);
            padding: 4rem 0 2rem;
            margin-top: 4rem;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-column h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: var(--accent);
        }

        .footer-links {
            list-style: none;
        }

        .footer-links li {
            margin-bottom: 0.75rem;
        }

        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: var(--transition);
        }

        .footer-links a:hover {
            color: var(--accent);
            padding-left: 0.5rem;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            color: var(--text-secondary);
            font-size: 0.875rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-secondary);
                flex-direction: column;
                padding: 1rem;
                gap: 1rem;
                border-top: 1px solid var(--border);
            }

            .nav-links.active {
                display: flex;
            }

            .mobile-menu-btn {
                display: block;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .hero-subtitle {
                font-size: 1.125rem;
            }

            .section {
                padding: 3rem 0;
            }

            .section-title {
                font-size: 2rem;
            }

            .features-grid,
            .pricing-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeIn 0.6s ease-out;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container nav-container">
            <a href="#" class="logo">
                <span class="logo-icon">⚙</span>
                <span>Deckboss.ai</span>
            </a>
            
            <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
            
            <div class="nav-links" id="navLinks">
                <a href="#features" class="nav-link">Edge & Robotics Design</a>
                <a href="#hardware" class="nav-link">IoT Wiring Assistant</a>
                <a href="#pricing" class="nav-link">Hardware Selector</a>
                <a href="#tui" class="nav-link">TUI in Repo</a>
                <a href="#cocapn" class="nav-link">Build → Hand Off to Cocapn</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1 class="fade-in">The Technician's AI Assistant for Edge Robotics Design</h1>
            <p class="hero-subtitle fade-in">
                Free mobile app with BYOK. Design IoT systems, get wiring guides, hand off to Cocapn.
                Work offline, sync when connected. Perfect for field technicians and robotics engineers.
            </p>
            <a href="#pricing" class="cta-button fade-in">Start Building</a>
        </div>
    </section>

    <!-- Features -->
    <section class="section" id="features">
        <div class="container">
            <h2 class="section-title">AI-Powered Edge Robotics Design</h2>
            <p class="section-subtitle">
                From concept to deployment - streamline your edge robotics workflow with intelligent assistance
            </p>
            
            <div class="features-grid">
                ${features.map(feature => `
                <div class="feature-card fade-in">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Hardware Support -->
    <section class="section" id="hardware">
        <div class="container">
            <h2 class="section-title">Supported Hardware Platforms</h2>
            <p class="section-subtitle">
                Works with your existing hardware stack - from prototyping to production
            </p>
            
            <div class="hardware-grid">
                ${supportedHardware.map(hw => `
                <div class="hardware-chip">${hw}</div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Pricing -->
    <section class="section" id="pricing">
        <div class="container">
            <h2 class="section-title">Simple, Transparent Pricing</h2>
            <p class="section-subtitle">
                BYOK means you control costs. Use your own API keys or our managed services.
            </p>
            
            <div class="pricing-grid">
                ${pricingTiers.map(tier => `
                <div class="pricing-card ${tier.accent ? 'accent' : ''} fade-in">
                    <h3 class="pricing-name">${tier.name}</h3>
                    <div class="pricing-price">${tier.price}</div>
                    <p class="pricing-desc">${tier.description}</p>
                    <ul class="pricing-features">
                        ${tier.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <a href="#" class="pricing-button ${tier.accent ? 'accent' : 'outline'}">
                        ${tier.cta}
                    </a>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h3>Deckboss.ai</h3>
                    <ul class="footer-links">
                        <li><a href="#features">Edge Robotics Design</a></li>
                        <li><a href="#hardware">IoT Wiring Assistant</a></li>
                        <li><a href="#pricing">Hardware Selector</a></li>
                        <li><a href="#tui">TUI Interface</a></li>
                        <li><a href="#cocapn">Cocapn Handoff</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Platforms</h3>
                    <ul class="footer-links">
                        <li><a href="https://deckboss.net" target="_blank">Deckboss.net</a></li>
                        <li><a href="https://cocapn.ai" target="_blank">Cocapn.ai</a></li>
                        <li><a href="https://cocapn.com" target="_blank">Cocapn.com</a></li>
                        <li><a href="https://capitaine.ai" target="_blank">Capitaine.ai</a></li>
                        <li><a href="https://github.com/deckboss" target="_blank">GitHub</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Resources</h3>
                    <ul class="footer-links">
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">API Reference</a></li>
                        <li><a href="#">Wiring Templates</a></li>
                        <li><a href="#">Community Forum</a></li>
                        <li><a href="#">Support</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Company</h3>
                    <ul class="footer-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© ${new Date().getFullYear()} Deckboss.ai. The technician's AI assistant for edge robotics design.</p>
                <p>BYOK - Bring Your Own Keys. Offline-capable. Open architecture.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.getElementById("mobileMenuBtn").addEventListener("click", function() {
            document.getElementById("navLinks").classList.toggle("active");
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                document.getElementById("navLinks").classList.remove("active");
            });
        });

        // Smooth scrolling for anchor links
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
                }
            });
        });

        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {