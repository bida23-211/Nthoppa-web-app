export function Partners() {
  return (
    <section id="partners" className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="font-body text-white/40 text-sm uppercase tracking-widest mb-10">Trusted Partners</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: "CreditYame", logo: "/partners/credityame.jpeg", category: "Credit Scoring" },
            { name: "iPachi Capital", logo: "/partners/ipachi.jpeg", category: "SME Finance" },
            { name: "Seriti Insights", logo: "/partners/seriti.jpeg", category: "Data & Analytics" },
            { name: "Seipone.ai", logo: "/partners/seipone.jpeg", category: "AI Solutions" },
          ].map(partner => (
            <div key={partner.name} className="bg-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-white/10 transition-all">
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