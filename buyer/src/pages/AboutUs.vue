<template>
  <div class="about-container">
    <!-- Tailwind CDN for modern styling without complex build config -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">

    <!-- Hero Section -->
    <section class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div class="absolute inset-0 bg-matte-black z-0"></div>
      <!-- Abstract Background (Simulated 3D Nodes) -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 1000 1000">
          <circle v-for="n in 20" :key="'c'+n" :cx="Math.random()*1000" :cy="Math.random()*1000" r="2" fill="#00FFCC">
            <animate attributeName="opacity" values="0;1;0" dur="3s" :begin="Math.random()*3 + 's'" repeatCount="indefinite" />
          </circle>
          <path v-for="n in 10" :key="'p'+n" :d="'M ' + Math.random()*1000 + ' ' + Math.random()*1000 + ' L ' + Math.random()*1000 + ' ' + Math.random()*1000" stroke="#00FFCC" stroke-width="0.5" opacity="0.1" />
        </svg>
      </div>

      <div class="z-10 text-center max-w-4xl animate-fade-in">
        <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Decentralized Supply Chain Protocol.
        </h1>
        <h2 class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400 mb-4">
          Native to the AI Era.
        </h2>
        <p class="text-xl md:text-2xl text-gray-400 mb-8 chinese-subtext">
          去中心化供应链协议。AI 纪元原生。
        </p>
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The infrastructure powering the autonomous economy. Connecting the world's best factories to your AI Agent.
        </p>
      </div>
      
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>
    </section>

    <!-- Value Section: Global Arbitrage -->
    <section class="py-24 bg-matte-black px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-white mb-6">Global Arbitrage. <span class="text-green-400">全球套利</span></h2>
            <p class="text-gray-300 text-lg mb-6 leading-relaxed">
              We source directly from the exact same ODMs (Original Design Manufacturers) that supply top Japanese brands. 
              You get the strict Japanese QC standard, but at China's raw production cost.
            </p>
            <p class="text-cyan-400 text-xl font-bold italic">No brand tax. No intermediaries.</p>
          </div>
          
          <div class="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 class="text-xl font-bold text-center text-gray-400 mb-8">Tokyo Standards. Shenzhen Prices.</h3>
            <div class="space-y-6">
              <div class="flex justify-between items-center p-4 bg-black rounded-lg border-l-4 border-red-500 opacity-60">
                <span class="text-gray-400 font-medium">Traditional Brand Label</span>
                <span class="text-red-500 line-through text-2xl font-bold">$500</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-black rounded-lg border-l-4 border-green-500">
                <span class="text-white font-medium">Mao Mall ODM Factory</span>
                <div class="flex items-center gap-2">
                  <span class="text-green-400 text-2xl font-bold">$80</span>
                  <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Model Section: Zero Profit -->
    <section class="py-24 bg-black px-4 relative">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-white mb-8">We Don't Take Profits. We Distribute Value.</h2>
        <p class="text-gray-400 text-lg mb-12">
          Mao Mall operates as a non-profit Foundation. We have no private shareholders. 
          All surplus revenue is returned to the community via the Shop-to-Earn mechanism.
        </p>
        
        <div class="relative py-12">
          <!-- Flow Chart Visual -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div class="p-6 bg-matte-black border border-gray-800 rounded-xl">
              <p class="text-sm uppercase tracking-widest text-gray-500 mb-2">Users Pay</p>
              <p class="text-2xl font-bold text-white">$100 Value</p>
            </div>
            <div class="flex justify-center">
              <svg class="w-12 h-12 text-cyan-400 animate-pulse hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              <svg class="w-12 h-12 text-cyan-400 animate-pulse md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
            <div class="p-6 bg-gradient-to-br from-green-900 to-black border border-green-500 rounded-xl">
              <p class="text-sm uppercase tracking-widest text-green-400 mb-2">Ecosystem Return</p>
              <p class="text-2xl font-bold text-white">100% Value</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOMO Section: Genesis Halving -->
    <section class="py-24 bg-matte-black px-4 overflow-hidden">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-4 text-center">The Fibonacci Halving Protocol.</h2>
        <p class="text-cyan-400 text-xl font-bold text-center mb-12">Like Bitcoin in 2009. The Era of Easy Mining Ends Soon. <span class="text-gray-500 block text-sm mt-2">创世倍增</span></p>

        <div class="bg-black p-8 rounded-3xl border border-gray-800 relative">
          <!-- The Genesis Graph -->
          <div class="h-80 w-full relative">
            <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <!-- Grid -->
              <line v-for="i in 5" :key="'l'+i" x1="0" :y1="i*60" x2="1000" :y2="i*60" stroke="#222" stroke-width="1" />
              
              <!-- Efficiency Curve -->
              <path d="M 0 50 L 150 50 L 150 200 L 450 200 L 450 260 L 1000 260" fill="none" stroke="#00FFCC" stroke-width="4" />
              
              <!-- Gradient Area -->
              <path d="M 0 50 L 150 50 L 150 200 L 450 200 L 450 260 L 1000 260 V 300 H 0 Z" fill="url(#grad1)" opacity="0.3" />
              
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#00FFCC;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#00FFCC;stop-opacity:0" />
                </linearGradient>
              </defs>

              <!-- Pulsing Dot -->
              <circle cx="75" cy="50" r="6" fill="#00FFCC">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            <!-- Labels -->
            <div class="absolute top-0 left-0 p-4">
              <span class="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">YOU ARE HERE</span>
            </div>
          </div>
          
          <div class="grid grid-cols-3 mt-8">
            <div class="text-center group">
              <p class="text-cyan-400 font-bold text-2xl group-hover:scale-110 transition-transform">1000%</p>
              <p class="text-gray-500 text-xs">Genesis Era (10x Yield)</p>
            </div>
            <div class="text-center">
              <p class="text-gray-400 font-bold text-2xl">125%</p>
              <p class="text-gray-500 text-xs">Growth Era</p>
            </div>
            <div class="text-center">
              <p class="text-gray-400 font-bold text-2xl">30%</p>
              <p class="text-gray-500 text-xs">Mature Era</p>
            </div>
          </div>
        </div>
        
        <p class="text-center text-gray-400 mt-12 max-w-2xl mx-auto">
          Mining difficulty increases exponentially. Don't wait for the difficulty explosion. Secure your Genesis Hashrate today.
        </p>
      </div>
    </section>

    <!-- Governance & Security -->
    <section class="py-24 px-4 bg-matte-black">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-16 text-center">Institutional Grade Security.</h2>
        <div class="grid md:grid-cols-3 gap-12">
          <div class="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-cyan-400/50 transition-colors">
            <u-icon name="shield-check" size="48" color="#00FFCC" class="mb-4 block"></u-icon>
            <h3 class="text-xl font-bold text-white mb-4">Secured by Protocols</h3>
            <p class="text-gray-400">Assets are secured in Multi-Sig Foundation Vaults. No rug pulls, just pure protocol logic.</p>
          </div>
          <div class="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-green-400/50 transition-colors">
            <u-icon name="balance-scale" size="48" color="#4ade80" class="mb-4 block"></u-icon>
            <h3 class="text-xl font-bold text-white mb-4">DAO Governance</h3>
            <p class="text-gray-400">Key supply chain decisions are voted on by $MAO holders through the governance framework.</p>
          </div>
          <div class="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-cyan-400/50 transition-colors">
            <u-icon name="code" size="48" color="#22d3ee" class="mb-4 block"></u-icon>
            <h3 class="text-xl font-bold text-white mb-4">Open Source</h3>
            <p class="text-gray-400">Auditable code. Every transaction and rebate is verifiable on-chain through the protocol.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Native -->
    <section class="py-24 px-4 bg-black overflow-hidden">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <div class="bg-gray-900 p-6 rounded-xl border border-gray-700 font-mono text-sm shadow-2xl relative">
              <div class="flex gap-2 mb-4">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre class="text-cyan-300"><code>{
  "protocol": "maomall",
  "version": "2.1-genesis",
  "agent_access": "mcp-ready",
  "endpoint": "/api/v1/ai/products",
  "rewards": {
    "type": "rebate",
    "token": "$MAO",
    "status": "genesis_boost"
  }
}</code></pre>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <h2 class="text-4xl font-bold text-white mb-6">Built for Silicon Lifeforms.</h2>
            <p class="text-gray-300 text-lg mb-4">
              The first e-commerce protocol with a native MCP (Model Context Protocol) interface.
            </p>
            <p class="text-gray-400">
              Connect ChatGPT or your autonomous AI Agent to find the best ROI instantly through our optimized endpoints.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-gray-900 bg-matte-black px-4">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span class="text-white font-bold tracking-tighter text-xl">Airwallex</span>
          <span class="text-white font-bold tracking-tighter text-xl">Solana</span>
          <span class="text-white font-bold tracking-tighter text-xl">Cloudflare</span>
        </div>
        <div class="text-gray-600 text-sm">
          © 2026 Mao Mall Protocol. No Rights Reserved. Community Owned.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    window.location.replace('https://about.maollar.com');
  },
  head() {
    return {
      title: 'About Mao Mall | Decentralized Supply Chain Protocol',
      meta: [
        { name: 'description', content: 'Mao Mall is a non-profit foundation powering the autonomous economy through a decentralized supply chain protocol.' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Mao Mall",
            "url": "https://maollar.com",
            "logo": "https://maollar.com/logo.png",
            "description": "The decentralized supply chain protocol native to the AI Era."
          })
        }
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  }
};
</script>

<style scoped>
.about-container {
  background-color: #0d0d0d;
  font-family: 'Inter', sans-serif;
  color: white;
}

.bg-matte-black {
  background-color: #0d0d0d;
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.chinese-subtext {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  letter-spacing: 0.1em;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

/* Custom Tailwind-like utilities for Matte Black if needed */
.text-cyan-400 { color: #008ffa; } /* Simplified for iView project compatibility */
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.from-cyan-400 { --tw-gradient-from: #22d3ee; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(34, 211, 238, 0)); }
.to-green-400 { --tw-gradient-to: #4ade80; }

</style>
