const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/>
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
      </svg>
    )
  },
];

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-[#E9521C]/20">
                <img src="/nthoppa-logo.png" alt="Nthoppa" className="h-9 w-9 object-cover" />
              </div>
              <span className="font-display font-black text-white text-lg">Nthoppa</span>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed">Empowering the unbanked with financial education, marketplace access, and rewards that transform lives.</p>
          </div>
          <div>
            <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Quick Links</div>
            {[
              { label: 'About Us', href: '#partners' },
              { label: 'Our Offerings', href: '#offerings' },
              { label: 'How It Works', href: '#banking' },
              { label: 'SME Pipeline', href: '#sme-pipeline' },
              { label: 'Incubator', href: '#incubator' },
            ].map(link => (
              <a key={link.label} href={link.href}
                onClick={(e) => { e.preventDefault(); const el = document.querySelector(link.href); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
                className="block font-body text-white/40 hover:text-[#E9521C] text-sm mb-3 cursor-pointer transition-colors">{link.label}</a>
            ))}
          </div>
          <div>
            <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Legal</div>
            {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Disclaimer'].map(link => (
              <div key={link} className="font-body text-white/40 hover:text-[#E9521C] text-sm mb-3 cursor-pointer transition-colors">{link}</div>
            ))}
          </div>
          <div>
            <div className="font-body font-semibold text-white/60 text-xs uppercase tracking-widest mb-4">Contact</div>
            <div className="font-body text-white/40 text-sm mb-2">info@nthoppa.com</div>
            <div className="font-body text-white/40 text-sm mb-2">+267 7123 4567</div>
            <div className="font-body text-white/40 text-sm">Gaborone, Botswana</div>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E9521C]/20 flex items-center justify-center transition-colors border border-white/10 hover:border-[#E9521C]/30 text-white/50 hover:text-[#E9521C]"
                  aria-label={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-body text-white/20 text-xs">© 2026 Nthoppa. All rights reserved.</div>
          <div className="font-body text-white/20 text-xs">Made with ❤️ for Batswana</div>
        </div>
      </div>
    </footer>
  );
}