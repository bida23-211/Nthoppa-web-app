export function Partners() {
  const partners = [
    { name: "Stanbic Bank", logo: "/partners/stanbic.png", category: "Banking Partner", featured: true },
    { name: "CreditYame", logo: "/partners/credityame.jpeg", category: "Credit Scoring", featured: false },
    { name: "iPachi Capital", logo: "/partners/ipachi.jpeg", category: "SME Finance", featured: false },
    { name: "Seriti Insights", logo: "/partners/seriti.jpeg", category: "Data & Analytics", featured: false },
    { name: "Seipone.ai", logo: "/partners/seipone.jpeg", category: "AI Solutions", featured: false },
  ];

  return (
    <section id="partners" className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="font-body text-white/40 text-sm uppercase tracking-widest mb-3">Trusted Partners</div>
        <h2 className="font-display text-3xl font-black text-white mb-2">Built with <span className="text-[#E9521C]">Industry Leaders</span></h2>
        <p className="font-body text-white/40 text-sm mb-12 max-w-md mx-auto">Nthoppa partners with Botswana's most trusted financial institutions to deliver real impact.</p>

        {/* Featured Stanbic Partner */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="bg-gradient-to-br from-[#E9521C]/20 to-[#E9521C]/5 border border-[#E9521C]/40 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[#E9521C]/70 transition-all">
            <div className="px-3 py-1 bg-[#E9521C]/20 border border-[#E9521C]/30 rounded-full mb-1">
              <span className="text-[#E9521C] text-[10px] font-bold uppercase tracking-widest">Strategic Banking Partner</span>
            </div>
            <div className="h-14 w-full flex items-center justify-center">
              <img src="/partners/stanbic.png" alt="Stanbic Bank" className="max-h-12 max-w-[160px] object-contain opacity-90 hover:opacity-100 transition-opacity" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-black text-2xl tracking-tight">STANBIC</span>';
                }}
              />
            </div>
            <div className="text-center">
              <p className="font-body font-bold text-white text-sm">Stanbic Bank Botswana</p>
              <p className="font-body text-white/40 text-xs mt-0.5">Banking Infrastructure & Product Integration</p>
            </div>
          </div>
        </div>

        {/* Other Partners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {partners.filter(p => !p.featured).map(partner => (
            <div key={partner.name} className="bg-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10">
              <div className="h-12 w-full flex items-center justify-center">
                <img src={partner.logo} alt={partner.name} className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-center">
                <p className="font-body font-semibold text-white/60 text-xs">{partner.name}</p>
                <p className="font-body text-white/30 text-[10px] mt-0.5">{partner.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}