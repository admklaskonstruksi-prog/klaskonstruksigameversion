"use client";

import { ShoppingCart, Lock, AlertTriangle, CheckCircle, Zap, PlayCircle, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // PENTING: Untuk navigasi
import { useRouter } from "next/navigation";
import { purchaseChapter } from "../actions"; // Pastikan path ini sesuai dengan lokasi actions.ts Anda
import toast from "react-hot-toast";

// Interface data
interface MarketplaceItem {
  id: string; // chapter id
  title: string;
  courseTitle: string;
  courseId: string;
  price: number;
  level: number;
  image_url?: string | null;
  owned: boolean;
  imageColor?: string;
}

export default function StudentMarketplace({ items }: { items: MarketplaceItem[] }) {
  const router = useRouter();
  
  // State
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic Search / Filter
  const filteredItems = items.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.courseTitle.toLowerCase().includes(searchLower)
    );
  });

  // Logic Klik Tombol Beli (Cek Level)
  const handleBuyClick = (item: MarketplaceItem) => {
    // Cek apakah ada level sebelumnya di course yang sama yang belum dibeli
    const prevLevelItem = items.find((i) => i.courseTitle === item.courseTitle && i.level === item.level - 1);

    if (prevLevelItem && !prevLevelItem.owned) {
      setWarningMessage(`WARNING: You are attempting to unlock [Level ${item.level}] but you haven't acquired [Level ${prevLevelItem.level}] yet.`);
    } else {
      setWarningMessage(null);
    }
    setSelectedItem(item);
  };

  // Logic Proses Pembayaran (Mock Payment -> Save to DB)
  const proceedToPayment = async () => {
    if (!selectedItem) return;
    setIsLoading(true);

    try {
        // Panggil Server Action
        const result = await purchaseChapter(selectedItem.courseId, selectedItem.id, selectedItem.price);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Success! ${selectedItem.title} unlocked.`);
            setSelectedItem(null);
            setWarningMessage(null);
            router.refresh(); // Refresh halaman agar UI update
        }
    } catch (error) {
        toast.error("Terjadi kesalahan sistem.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
            <Zap className="text-yellow-500" /> Available Missions
            </h2>
            <p className="text-xs font-mono text-gray-500 mt-1">Unlock modules to upgrade your skills.</p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-red-900/30 rounded-lg leading-5 bg-[#120808] text-gray-300 placeholder-gray-600 focus:outline-none focus:bg-black focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* CONTENT GRID */}
      {filteredItems.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-800 rounded-2xl bg-[#120808]">
            <p className="text-gray-500 font-mono text-lg">No missions found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
            <div key={item.id} className={`relative group rounded-2xl border ${item.owned ? 'border-green-500/30 bg-green-950/10' : 'border-gray-800 bg-[#150a0a]'} overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg flex flex-col h-full`}>
                
                {/* Image Area (Thumbnail) */}
                <div className={`h-48 w-full relative ${!item.image_url ? (item.imageColor || 'bg-gray-800') : ''}`}>
                    {item.image_url ? (
                        <Image 
                            src={item.image_url} 
                            alt={item.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                    ) : null}
                    
                    {/* Overlay Status (Unlocked) */}
                    {item.owned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                <CheckCircle className="text-green-500 w-12 h-12 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-green-400 font-black text-sm uppercase tracking-[0.2em]">UNLOCKED</span>
                            </div>
                        </div>
                    )}

                    {/* Level Badge */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg ${item.owned ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            LVL {item.level}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1 relative">
                    <div className="mb-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 border border-gray-800 px-2 py-1 rounded bg-black/30">
                            {item.courseTitle}
                        </span>
                    </div>
                    
                    <h3 className="font-black text-xl text-white mb-4 leading-tight group-hover:text-red-500 transition-colors">
                        {item.title}
                    </h3>
                    
                    <div className="mt-auto">
                        {item.owned ? (
                        // TOMBOL START: Mengarah ke Learning Path (Peta Game)
                        <Link 
                            href="/dashboard/learning-path" 
                            className="w-full py-3 bg-green-600/20 border border-green-600/50 text-green-400 font-bold rounded-xl uppercase text-xs hover:bg-green-600 hover:text-white transition flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        >
                            <PlayCircle size={18} /> Start Mission
                        </Link>
                        ) : (
                        // TOMBOL BELI: Membuka Modal
                        <button 
                            onClick={() => handleBuyClick(item)}
                            className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl uppercase text-xs hover:bg-red-600 hover:border-red-600 transition flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        >
                            <ShoppingCart size={16} /> {item.price === 0 ? "FREE" : `IDR ${(item.price / 1000).toLocaleString()}k`}
                        </button>
                        )}
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* --- MODAL CONFIRMATION --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a0505] border-2 border-red-600 w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.4)] relative rounded-2xl overflow-hidden">
             
             <div className="bg-red-900/20 p-4 border-b border-red-500/30 flex items-center gap-3">
                <ShoppingCart className="text-red-500" />
                <h3 className="font-black text-white uppercase tracking-widest">Unlock Module</h3>
             </div>

             <div className="p-6">
                <div className="flex gap-4 mb-6">
                    {/* Thumbnail Preview di Modal */}
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900 flex-shrink-0">
                        {selectedItem.image_url ? (
                            <Image src={selectedItem.image_url} alt="" fill className="object-cover" />
                        ) : (
                            <div className={`w-full h-full ${selectedItem.imageColor}`}></div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-mono">Target Module</p>
                        <h4 className="text-lg font-bold text-white leading-tight">{selectedItem.title}</h4>
                        <p className="text-lg font-black text-orange-500 mt-1">IDR {selectedItem.price.toLocaleString()}</p>
                    </div>
                </div>

                {warningMessage && (
                  <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg mb-6 flex gap-3 items-start">
                     <AlertTriangle className="text-yellow-500 w-6 h-6 flex-shrink-0 animate-pulse" />
                     <p className="text-yellow-200 text-xs leading-relaxed">{warningMessage}</p>
                  </div>
                )}

                <div className="flex gap-3">
                   <button 
                    onClick={() => setSelectedItem(null)}
                    disabled={isLoading}
                    className="flex-1 py-3 border border-white/10 text-gray-400 font-bold uppercase text-xs rounded-lg hover:bg-white/5 transition disabled:opacity-50"
                   >
                    Cancel
                   </button>
                   <button 
                    onClick={proceedToPayment}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-red-600 text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-red-500 transition shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4" /> Processing...
                        </>
                    ) : (
                        warningMessage ? "Unlock Anyway" : "Confirm Unlock"
                    )}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}