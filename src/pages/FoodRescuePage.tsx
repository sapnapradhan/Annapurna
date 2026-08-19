import React, { useState, useMemo } from 'react';
import { 
  RESCUE_NGO_DATABASE, INDIAN_STATES_AND_UTS, NGOOrganization 
} from '../data/rescueNGOs';
import { 
  Truck, MapPin, Search, Phone, Mail, Globe, Info, Filter, Compass, 
  CheckCircle2, Building, Heart, ArrowRight, X, ShieldAlert 
} from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { VoiceAssistWidget } from '../components/common/VoiceAssistWidget';

interface FoodRescuePageProps {
  onBackToHome: () => void;
}

export const FoodRescuePage: React.FC<FoodRescuePageProps> = ({ onBackToHome }) => {
  // Default location: Bhubaneswar, Odisha
  const [selectedState, setSelectedState] = useState<string>('Odisha');
  const [selectedCity, setSelectedCity] = useState<string>('Bhubaneswar');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrgModal, setSelectedOrgModal] = useState<NGOOrganization | null>(null);

  // Available cities for the selected state
  const availableCities = useMemo(() => {
    const stateData = RESCUE_NGO_DATABASE.find(s => s.state === selectedState);
    if (!stateData) return ['All Cities'];
    return ['All Cities', ...stateData.cities.map(c => c.city)];
  }, [selectedState]);

  // Handle state change: reset city to first available or 'All Cities'
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const stateData = RESCUE_NGO_DATABASE.find(s => s.state === newState);
    if (stateData && stateData.cities.length > 0) {
      setSelectedCity(stateData.cities[0].city);
    } else {
      setSelectedCity('All Cities');
    }
  };

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    let list: NGOOrganization[] = [];

    // Gather from database
    RESCUE_NGO_DATABASE.forEach(stData => {
      if (selectedState === 'All States' || stData.state === selectedState) {
        stData.cities.forEach(cData => {
          if (selectedCity === 'All Cities' || cData.city === selectedCity) {
            list.push(...cData.organizations);
          }
        });
      }
    });

    // Apply Service Type filter
    if (selectedService !== 'All') {
      list = list.filter(org => org.type === selectedService || org.services.includes(selectedService));
    }

    // Apply Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(org => 
        org.name.toLowerCase().includes(q) ||
        org.city.toLowerCase().includes(q) ||
        org.state.toLowerCase().includes(q) ||
        org.type.toLowerCase().includes(q) ||
        org.description.toLowerCase().includes(q) ||
        org.services.some(s => s.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedState, selectedCity, selectedService, searchQuery]);

  const handleUseGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Defaults to primary campus location
          setSelectedState('Odisha');
          setSelectedCity('Bhubaneswar');
        },
        () => {
          setSelectedState('Odisha');
          setSelectedCity('Bhubaneswar');
        }
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 font-sans selection:bg-[#C86D44] selection:text-white transition-colors duration-300">
      {/* Editorial Backdrop Scrim */}
      <div className="fixed inset-0 bg-[#FDFBF7]/85 dark:bg-[#12100F]/90 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#12100F]/90 backdrop-blur-md border-b border-[#EBE4D8] dark:border-[#2C2724] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="w-9 h-9 rounded-xl bg-[#C86D44] hover:bg-[#B35C33] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm cursor-pointer"
              title="Return to Home"
            >
              A
            </button>
            <div>
              <div className="font-serif font-bold text-base text-[#2C221E] dark:text-slate-100 leading-tight">
                ANNAPURNA FOOD RESCUE NETWORK
              </div>
              <div className="text-[10px] text-[#C86D44] dark:text-amber-400 font-mono font-bold">
                INDIA-WIDE DISPATCH HUB
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AudioPlayer />
            <VoiceAssistWidget label="Read Rescue Partners" textToRead="Annapurna Food Rescue Network. Default location: Bhubaneswar, Odisha. Connecting campus mess surplus food directly to verified NGOs including Robin Hood Army Bhubaneswar, Feeding India, and Capital Hospital Aahaar Kendra." />
            <ThemeToggle />
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 bg-[#EBE4D8] dark:bg-[#24201D] hover:bg-[#DCD1C0] dark:hover:bg-[#2E2824] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Default Location Banner */}
          <div className="p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D44]/10 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>DEFAULT CAMPUS LOCATION</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C221E] dark:text-white">
                📍 Bhubaneswar, Odisha
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Primary campus dining hub. Connect surplus mess food directly to verified NGOs and community kitchens.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUseGeolocation}
                className="px-4 py-2.5 rounded-2xl bg-[#F5EFE6] dark:bg-[#25201D] hover:bg-[#EBE4D8] dark:hover:bg-[#302B27] text-xs font-semibold text-[#2C221E] dark:text-slate-200 border border-[#EBE4D8] dark:border-[#38322E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#C86D44] dark:text-amber-400" />
                <span>Auto-Detect Location</span>
              </button>
            </div>
          </div>

          {/* India-Wide Filters & Search Bar */}
          <div className="p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#C86D44] dark:text-amber-400 uppercase">
                Filter Organizations & Rescue Partners
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {filteredOrganizations.length} Partners Available
              </span>
            </div>

            <div className="grid sm:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by organization name, city, state, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5EFE6] dark:bg-[#12100F] border border-[#EBE4D8] dark:border-[#2C2724] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#2C221E] dark:text-slate-100 focus:outline-none"
                />
              </div>

              {/* State Selector */}
              <div className="sm:col-span-3">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-[#F5EFE6] dark:bg-[#12100F] border border-[#EBE4D8] dark:border-[#2C2724] rounded-2xl p-2.5 text-xs text-[#2C221E] dark:text-slate-100 font-semibold focus:outline-none"
                >
                  <option value="All States">All States & UTs</option>
                  {INDIAN_STATES_AND_UTS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#F5EFE6] dark:bg-[#12100F] border border-[#EBE4D8] dark:border-[#2C2724] rounded-2xl p-2.5 text-xs text-[#2C221E] dark:text-slate-100 font-semibold focus:outline-none"
                >
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Type Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EBE4D8] dark:border-[#2C2724]">
              {[
                'All',
                'Food Rescue',
                'Food Distribution',
                'Community Kitchen',
                'Hunger Relief',
                'Emergency Food Assistance'
              ].map(service => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedService === service
                      ? 'bg-[#C86D44] text-white shadow-sm'
                      : 'bg-[#F5EFE6] dark:bg-[#201D1A] text-slate-600 dark:text-slate-300 hover:bg-[#EBE4D8] dark:hover:bg-[#2C2724]'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* NGO Organization Cards Grid */}
          {filteredOrganizations.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 rounded-3xl border border-[#EBE4D8] dark:border-[#2C2724] space-y-2">
              <ShieldAlert className="w-8 h-8 text-[#C86D44] mx-auto" />
              <div className="font-serif font-bold text-base text-[#2C221E] dark:text-slate-200">
                No organizations match your current search/filter.
              </div>
              <p className="text-xs">Try selecting a different state or clear your search term.</p>
              <button
                onClick={() => { setSelectedState('Odisha'); setSelectedCity('Bhubaneswar'); setSelectedService('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-[#C86D44] text-white text-xs font-bold mt-2"
              >
                Reset to Bhubaneswar, Odisha
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredOrganizations.map(org => (
                <div
                  key={org.id}
                  className="p-6 rounded-3xl bg-[#FDFBF7]/90 dark:bg-[#1A1715]/90 border border-[#EBE4D8] dark:border-[#2C2724] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C86D44]/15 text-[#C86D44] dark:text-amber-300 uppercase border border-[#C86D44]/30">
                          {org.type}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white mt-1.5">
                          {org.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#C86D44] dark:text-amber-400 font-semibold font-mono">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{org.city}, {org.state}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {org.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {org.services.map((srv, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-[#F5EFE6] dark:bg-[#201D1A] text-slate-600 dark:text-slate-300 border border-[#EBE4D8] dark:border-[#2C2724]">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#EBE4D8] dark:border-[#2C2724] grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {org.phone ? (
                      <a
                        href={`tel:${org.phone}`}
                        className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 text-center"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    ) : (
                      <div className="py-2 px-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-medium text-xs text-center">
                        No Phone
                      </div>
                    )}

                    {org.email ? (
                      <a
                        href={`mailto:${org.email}`}
                        className="py-2 px-2 rounded-xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs flex items-center justify-center gap-1 text-center"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </a>
                    ) : (
                      <div className="py-2 px-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-medium text-xs text-center">
                        No Email
                      </div>
                    )}

                    {org.website ? (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-2 rounded-xl bg-[#F5EFE6] dark:bg-[#24201D] hover:bg-[#EBE4D8] text-[#2C221E] dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 text-center border border-[#EBE4D8] dark:border-[#38322E]"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Website</span>
                      </a>
                    ) : (
                      <div className="py-2 px-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-medium text-xs text-center">
                        No Web
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedOrgModal(org)}
                      className="py-2 px-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Organization Details Modal */}
      {selectedOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#FDFBF7] dark:bg-[#1A1715] border border-[#EBE4D8] dark:border-[#2C2724] shadow-2xl space-y-5 text-[#2C221E] dark:text-slate-100 relative">
            <button
              onClick={() => setSelectedOrgModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C86D44]/15 text-[#C86D44] dark:text-amber-300 uppercase border border-[#C86D44]/30">
                {selectedOrgModal.type}
              </span>
              <h3 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white mt-1">
                {selectedOrgModal.name}
              </h3>
              <div className="text-xs text-[#C86D44] dark:text-amber-400 font-semibold font-mono flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedOrgModal.address}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedOrgModal.description}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">Services Offered:</div>
              <div className="flex flex-wrap gap-2">
                {selectedOrgModal.services.map((srv, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-[#F5EFE6] dark:bg-[#201D1A] text-slate-700 dark:text-slate-300 border border-[#EBE4D8] dark:border-[#2C2724]">
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EBE4D8] dark:border-[#2C2724]">
              {selectedOrgModal.phone && (
                <a
                  href={`tel:${selectedOrgModal.phone}`}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedOrgModal.phone}</span>
                </a>
              )}

              {selectedOrgModal.email && (
                <a
                  href={`mailto:${selectedOrgModal.email}`}
                  className="py-3 rounded-2xl bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
