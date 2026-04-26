"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, Car, Home, Users, Star, CheckCircle2,
  Search, X, Info, ChevronDown, ChevronUp, ChevronLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoryTabs = [
  { key: 'all', label: 'All Products', icon: Shield },
  { key: 'motor_local', label: 'Motor (Local)', icon: Car },
  { key: 'motor_import', label: 'Motor (Import)', icon: Car },
  { key: 'household', label: 'Householders', icon: Home },
  { key: 'house_owners_standard', label: 'House Owners (Standard)', icon: Home },
  { key: 'house_owners_thatch', label: 'House Owners (Thatch)', icon: Home },
  { key: 'personal_all_risks', label: 'Personal All Risks', icon: Shield },
  { key: 'group_life', label: 'Group Life', icon: Users },
];

const subtypeColorMap: Record<string, string> = {
  motor_local: 'bg-blue-900',
  motor_import: 'bg-blue-800',
  household: 'bg-purple-900',
  house_owners_standard: 'bg-green-900',
  house_owners_thatch: 'bg-yellow-900',
  personal_all_risks: 'bg-orange-900',
  group_life: 'bg-green-800',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
      ))}
      <span className="text-sm text-gray-300 ml-1">{rating}</span>
    </div>
  );
}

function ProductCard({ product, onApply }: { product: any; onApply: (p: any) => void }) {
  const [expanded, setExpanded] = useState(false);
  const bg = subtypeColorMap[product.subtype] || 'bg-gray-800';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all">
      <div className="flex items-start gap-4 mb-3">
        <div className={`${bg} rounded-full p-3 flex-shrink-0`}>
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{product.providerFullName}</p>
          <StarRating rating={product.rating} />
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3">{product.description}</p>

      <div className="space-y-1.5 mb-3">
        {(product.features || []).slice(0, 3).map((f: string) => (
          <div key={f} className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">{f}</span>
          </div>
        ))}
        {(product.features || []).length > 3 && !expanded && (
          <p className="text-xs text-gray-500 ml-5">+{product.features.length - 3} more features</p>
        )}
      </div>

      {expanded && (
        <div className="space-y-4 mb-4">
          {(product.features || []).slice(3).map((f: string) => (
            <div key={f} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">{f}</span>
            </div>
          ))}

          <div>
            <p className="text-white text-sm font-semibold mb-2">Pricing Bands</p>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-300">
                <span>Cover Band</span>
                <span className="text-right">Rate</span>
              </div>
              {(product.pricingBands || []).map((band: any, i: number) => (
                <div key={i} className="grid grid-cols-2 px-3 py-2 border-t border-gray-700 text-xs">
                  <span className="text-gray-300">{band.label}</span>
                  <span className="text-right text-[#E9521C] font-medium">{band.rate || 'On application'}</span>
                </div>
              ))}
            </div>
            {product.minimumPremium && (
              <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" />{product.minimumPremium}
              </p>
            )}
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-2">Eligibility</p>
            <div className="space-y-1">
              {(product.eligibilityCriteria || []).map((c: string) => (
                <div key={c} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E9521C] mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-gray-300">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {(product.notes || []).length > 0 && (
            <div className="bg-gray-800/60 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-gray-400 mb-1">Important Notes</p>
              {product.notes.map((n: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <Info className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          {expanded ? <><ChevronUp className="h-3.5 w-3.5" />Less detail</> : <><ChevronDown className="h-3.5 w-3.5" />View rates</>}
        </button>
        <Button
          onClick={() => onApply(product)}
          className="bg-[#E9521C] hover:bg-black text-white text-sm px-5"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
}

export default function ClientMarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/partners/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.providerFullName || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (activeFilter === 'all' || p.subtype === activeFilter);
  });

  const handleApply = (product: any) => {
    toast({
      title: "✅ Application Submitted",
      description: `Your application for ${product.name} has been received. Westlife Insurance Botswana will contact you within 24 hours.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E9521C] font-medium text-sm mb-6 group transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E9521C]/10 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back
      </button>

      {/* Hero */}
      <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E9521C]/10 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#E9521C]" />
            <span className="text-sm font-medium opacity-80">Powered by Westlife Insurance Botswana (Pty) Ltd</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">NthoppaSure Marketplace</h1>
          <p className="text-white/70 max-w-lg mb-4">
            Browse and apply for insurance products tailored for Botswana. Motor, Property, Personal All Risks and Group Life cover.
          </p>
          <div className="flex gap-6 text-sm">
            <div><span className="font-bold text-xl">{products.length}</span><span className="opacity-70 ml-1">Products</span></div>
            <div><span className="font-bold text-xl">1</span><span className="opacity-70 ml-1">Licensed Insurer</span></div>
            <div><span className="font-bold text-xl">BWP</span><span className="opacity-70 ml-1">All prices in Pula</span></div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700">
          Rates shown are indicative and based on the Westlife Insurance Botswana quotation dated 29 January 2026.
          All values inclusive of 10% Broker commission and VAT. Quotes valid 30 days and subject to final validation.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-[#E9521C]"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categoryTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.key
                  ? 'bg-[#E9521C] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {!loading && (
        <p className="text-sm text-gray-400">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E9521C]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No products found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  );
}