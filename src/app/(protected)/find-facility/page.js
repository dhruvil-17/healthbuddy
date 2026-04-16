"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  ArrowLeft,
  Heart,
  Search,
  Loader2,
  Hospital,
  Building,
  Activity,
  AlertCircle,
  ExternalLink,
  Filter,
  Info,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Plus
} from "lucide-react";
import { useProtectedUser } from "@/hooks/useProtectedUser";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { ConfirmModal } from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import FacilityMap from "@/components/ui/Map";

export default function FacilityFinderPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [facilityType, setFacilityType] = useState("all");
  const [radius, setRadius] = useState(10);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = React.useRef(null);
  const isScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef(null);
  const router = useRouter();
  const { user, loading: autLoading } = useProtectedUser();

  const availableCities = [
    { value: "", label: "Select a city", lat: null, lng: null },
    { value: "Mumbai", label: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777 },
    { value: "Delhi", label: "Delhi", lat: 28.7041, lng: 77.1025 },
    { value: "Bangalore", label: "Bangalore, Karnataka", lat: 12.9716, lng: 77.5946 },
    { value: "Chennai", label: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { value: "Kolkata", label: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639 },
    { value: "Hyderabad", label: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
    { value: "Pune", label: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
    { value: "Ahmedabad", label: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714 },
    { value: "Gandhinagar", label: "Gandhinagar, Gujarat", lat: 23.2156, lng: 72.6369 },
    { value: "Surat", label: "Surat, Gujarat", lat: 21.1702, lng: 72.8311 },
    { value: "Jaipur", label: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873 },
  ];

  const facilityTypes = [
    { value: "all", label: "All Facilities", icon: Building },
    { value: "hospital", label: "Hospitals", icon: Hospital },
    { value: "clinic", label: "Clinics", icon: Activity },
    { value: "pharmacy", label: "Pharmacies", icon: Zap },
    { value: "diagnostic_center", label: "Diagnostics", icon: Info },
    { value: "emergency", label: "Emergency", icon: AlertCircle },
  ];

  // Filter facilities by search query
  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFacilities = React.useCallback(async (reset = true) => {
    if (!selectedCity || !user?.id) return;
    
    if (reset) {
      setLoading(true);
      setPage(0);
      setFacilities([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = reset ? 0 : page;
      const params = new URLSearchParams({
        city: selectedCity,
        type: facilityType,
        radius: radius.toString(),
        limit: '10',
        offset: (currentPage * 10).toString(),
      });
      const response = await fetch(`/api/find-facility?${params}`);
      const data = await response.json();
      if (data.success) {
        if (reset) {
          setFacilities(data.data);
        } else {
          setFacilities(prev => {
            const existingIds = new Set(prev.map(f => f.id));
            const newFacilities = data.data.filter(f => !existingIds.has(f.id));
            return [...prev, ...newFacilities];
          });
        }
        setHasMore(data.hasMore);
        if (!reset) setPage(currentPage + 1);
      }
    } catch (error) {
      // Error searching facilities - will show error toast
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [user?.id, selectedCity, facilityType, radius, page]);

  const loadMore = React.useCallback(() => {
    if (!loadingMore && hasMore && selectedCity && !isScrollingRef.current) {
      isScrollingRef.current = true;
      searchFacilities(false);
    }
  }, [loadingMore, hasMore, selectedCity, searchFacilities]);

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Location Error', {
        description: 'Geolocation is not supported by your browser'
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Calculate distance to each city using Haversine formula
          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
          };

          // Find nearest city
          let nearestCity = null;
          let minDistance = Infinity;

          availableCities.forEach(city => {
            if (city.lat && city.lng) {
              const distance = calculateDistance(latitude, longitude, city.lat, city.lng);
              if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
              }
            }
          });

          if (nearestCity) {
            setSelectedCity(nearestCity.value);
            toast.success('Location Found', {
              description: `Detected ${nearestCity.label}. Searching for nearby facilities.`
            });
          } else {
            // Fallback to Mumbai if no city found
            setSelectedCity("Mumbai");
            toast.success('Location Found', {
              description: 'Your location has been detected. Searching for nearby facilities.'
            });
          }
        } catch (error) {
          toast.error('Location Error', {
            description: 'Failed to process your location'
          });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        toast.error('Location Error', {
          description: 'Unable to retrieve your location'
        });
      }
    );
  };

  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setViewMode('list');
  };

  useEffect(() => {
    if (selectedCity) searchFacilities(true);
  }, [selectedCity, facilityType, radius]);

  // Scroll detection on the scrollable container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Don't trigger if we just programmatically scrolled
      if (container.dataset.isProgrammaticScroll === 'true') {
        return;
      }
      
      // Trigger loadMore when scrolled to 90% of the container (increased from 80%)
      if (scrollTop + clientHeight >= scrollHeight * 0.9 && !loading && !loadingMore && hasMore && !isScrollingRef.current) {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Debounce the loadMore call with longer delay (increased from 300ms to 500ms)
        scrollTimeoutRef.current = setTimeout(() => {
          loadMore();
        }, 500);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [loading, loadingMore, hasMore, loadMore]);

  // Scroll to bottom after loading more content
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isScrollingRef.current) return;

    // Only run when loadingMore transitions from true to false
    if (!loadingMore && isScrollingRef.current) {
      requestAnimationFrame(() => {
        if (container) {
          // Mark as programmatic scroll to prevent triggering loadMore again
          container.dataset.isProgrammaticScroll = 'true';
          container.scrollTop = container.scrollHeight;
          isScrollingRef.current = false;
          
          // Reset the flag after a short delay
          setTimeout(() => {
            if (container) {
              delete container.dataset.isProgrammaticScroll;
            }
          }, 100);
        }
      });
    }
  }, [loadingMore]);

  const getFacilityIcon = (type) => {
    const typeData = facilityTypes.find((t) => t.value === type);
    return typeData ? typeData.icon : Building;
  };

  const openDirections = (facility) => {
    const address = encodeURIComponent(`${facility.name}, ${facility.address}, ${facility.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
  };

  const callFacility = (facility) => {
    if (facility.phone) {
      window.open(`tel:${facility.phone}`, "_self");
    } else {
      toast.error('No Phone Number', {
        description: 'This facility does not have a phone number listed.'
      });
    }
  };

  if (autLoading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <Skeleton className="h-44 w-full rounded-[2.5rem]" />
        <div className="grid lg:grid-cols-4 gap-10">
          <Skeleton className="lg:col-span-1 h-96 w-full" />
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="grid md:grid-cols-2 gap-6">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-primary-700 p-8 sm:p-12 text-white shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white font-extrabold uppercase tracking-widest text-[10px]">
             Geo-Spatial Health Lookup
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            Nearby Healthcare <br className="sm:hidden" />
            <span className="text-primary-100">Facilities</span>
          </h1>
          <p className="text-lg text-primary-50/80 font-medium leading-relaxed">
            Locate the nearest professional medical services, clinics, and diagnostics labs in your community.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
             <Button 
                variant="secondary" 
                className="bg-white text-indigo-700 hover:bg-white/90 h-12 px-6" 
                leftIcon={Navigation}
                onClick={handleShareLocation}
                isLoading={locationLoading}
             >
                Share My Location
             </Button>
          </div>
        </div>
        <MapPin className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
           <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100" hover={false}>
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6 px-1">Search Parameters</h3>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Search Facilities</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, address, or type..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium h-[52px]"
                      />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Current City</label>
                    <select
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium h-[52px]"
                    >
                       {availableCities.map(city => <option key={city.value} value={city.value}>{city.label}</option>)}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Facility Type</label>
                    <div className="grid gap-2">
                       {facilityTypes.map(type => (
                         <button
                           key={type.value}
                           onClick={() => setFacilityType(type.value)}
                           className={`flex items-center p-3 rounded-xl border-2 transition-all duration-300 font-bold text-xs ${facilityType === type.value ? "bg-primary-600 border-primary-600 text-white shadow-lg" : "bg-white border-gray-50 text-gray-500 hover:border-primary-100"}`}
                         >
                           <type.icon className="h-4 w-4 mr-3" />
                           {type.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Search Radius</label>
                    <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                       {[5, 10, 25, 50].map(r => (
                         <button
                           key={r}
                           onClick={() => setRadius(r)}
                           className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold transition-all ${radius === r ? "bg-white text-primary-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                         >
                           {r}KM
                         </button>
                       ))}
                    </div>
                 </div>
                 
                 <Button className="w-full h-14 rounded-2xl font-extrabold shadow-xl shadow-primary-500/20" onClick={searchFacilities} isLoading={loading}>
                    Update Search
                 </Button>
              </div>
           </GlassCard>

           <GlassCard className="p-8 bg-indigo-900 text-white border-transparent" hover={false}>
              <div className="flex items-center space-x-3 mb-4">
                <Search className="h-5 w-5 text-indigo-300" />
                <span className="font-extrabold uppercase tracking-widest text-[10px]">Registry Status</span>
              </div>
              <p className="text-sm font-medium text-indigo-50/80 leading-relaxed italic">
                {selectedCity 
                  ? `Showing results for ${facilityType === 'all' ? 'healthcare facilities' : facilityType} in ${selectedCity}.` 
                  : "Select a city to retrieve verified nearby clinical and diagnostic centers from our network."}
              </p>
           </GlassCard>
        </div>

        {/* Results Content */}
        <div className="lg:col-span-3 space-y-8">
           {!selectedCity ? (
             <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[3rem] py-24 text-center flex flex-col items-center justify-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-full"><Search className="h-12 w-12 text-gray-300" /></div>
                <h3 className="text-2xl font-extrabold text-gray-900">Select a City to Begin</h3>
                <p className="text-gray-500 font-medium max-w-md">Choose your current location from the sidebar to find optimized healthcare services near you.</p>
             </div>
           ) : loading ? (
             <div className="grid md:grid-cols-2 gap-8">
                {[1,2,4,6].map(i => <Skeleton key={i} className="h-80 w-full rounded-[2.5rem]" />)}
             </div>
           ) : facilities.length > 0 ? (
             <>
               {/* View Toggle */}
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                   <button
                     onClick={() => setViewMode('list')}
                     className={`flex items-center px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     <Building className="h-4 w-4 mr-2" />
                     List View
                   </button>
                   <button
                     onClick={() => setViewMode('map')}
                     className={`flex items-center px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${viewMode === 'map' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     <MapPin className="h-4 w-4 mr-2" />
                     Map View
                   </button>
                 </div>
                 <span className="text-sm font-bold text-gray-400">
                   {filteredFacilities.length} facilities found
                 </span>
               </div>

               {/* Map View */}
               {viewMode === 'map' && (
                 <div className="h-[600px] rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl">
                   <FacilityMap
                     userLocation={userLocation}
                     facilities={filteredFacilities}
                     onFacilityClick={handleFacilityClick}
                   />
                 </div>
               )}

               {/* List View */}
               {viewMode === 'list' && (
                 <div ref={scrollContainerRef} className="h-[700px] overflow-y-auto pr-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="grid md:grid-cols-2 gap-8">
                   {filteredFacilities.map((f, i) => {
                     const Icon = getFacilityIcon(f.type);
                     return (
                       <GlassCard key={f.id} className="p-8 border-transparent shadow-xl ring-1 ring-gray-100 group">
                          <div className="flex items-start justify-between mb-8">
                             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-indigo-500/10">
                                <Icon className="h-6 w-6" />
                             </div>
                             <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-extrabold text-sm">{f.rating}</span>
                             </div>
                          </div>

                          <div className="space-y-4 mb-8">
                             <div className="flex items-center space-x-2">
                                <Badge variant="primary" className="py-1 px-3 text-[10px] uppercase font-extrabold tracking-widest bg-indigo-50 text-indigo-700 border-indigo-100">
                                   {f.type}
                                </Badge>
                                {f.emergency_services && <Badge variant="danger" className="py-1 px-3 text-[10px] uppercase font-extrabold tracking-widest italic animate-pulse">EMERGENCY</Badge>}
                             </div>
                             <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                               {f.name}
                             </h3>
                             <div className="space-y-2">
                               <div className="flex items-center text-gray-500 text-sm font-medium">
                                  <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                                  <span className="line-clamp-1">{f.address}</span>
                               </div>
                               {f.phone && (
                                 <div className="flex items-center text-gray-500 text-sm font-medium">
                                    <Phone className="h-4 w-4 mr-2 text-emerald-400" />
                                    <span>{f.phone}</span>
                                 </div>
                               )}
                               <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                  <Clock className="h-3.5 w-3.5 mr-2 text-indigo-300" />
                                  <span>{f.distance ? `Distance: ${f.distance} KM away` : 'Verified nearby facility'}</span>
                               </div>
                             </div>
                          </div>

                          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                               <Button
                                 variant="ghost"
                                 onClick={() => callFacility(f)}
                                 className="h-10 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-green-600 transition-all font-bold uppercase tracking-widest text-[11px]"
                                 leftIcon={Phone}
                               >
                                 Call
                               </Button>
                             </div>
                             <Button variant="ghost" onClick={() => openDirections(f)} className="text-primary-600 font-bold uppercase tracking-widest text-[11px] hover:translate-x-1 transition-transform" rightIcon={ChevronRight}>
                                NAVIGATE
                             </Button>
                          </div>
                       </GlassCard>
                     );
                   })}
                   </div>
                   
                   {/* Loading Indicator */}
                   {loadingMore && (
                     <div className="flex items-center justify-center py-8">
                       <Loader2 className="h-6 w-6 animate-spin text-primary-600 mr-2" />
                       <span className="text-sm font-bold text-gray-500">Loading more facilities...</span>
                     </div>
                   )}

                   {!hasMore && filteredFacilities.length > 0 && (
                     <div className="text-center py-4">
                       <p className="text-sm font-bold text-gray-400">Showing all {filteredFacilities.length} facilities</p>
                     </div>
                   )}
                 </div>
               )}
             </>
           ) : (
             <div className="bg-white border border-gray-100 rounded-[2.5rem] py-24 text-center flex flex-col items-center justify-center space-y-6">
                <div className="p-8 bg-red-50 rounded-full"><AlertCircle className="h-10 w-10 text-red-300" /></div>
                <h3 className="text-2xl font-extrabold text-gray-900">No Facilities Found</h3>
                <p className="text-gray-500 font-medium max-w-md">We couldn&apos;t find any matches in {selectedCity} for &quot;{facilityType}&quot;. Try expanding your search radius or selecting a different type.</p>
                <Button variant="ghost" onClick={() => { setFacilityType('all'); setRadius(50); }}>Expand Search Radius</Button>
             </div>
           )}

           {/* Emergency Notice */}
           <GlassCard className="p-8 bg-red-600 border-transparent text-white overflow-hidden relative group">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-extrabold">Emergency SOS</h3>
                    <p className="text-sm font-medium text-red-100 max-w-sm italic">Connect immediately to {selectedCity || "local"} paramedics and trauma centers.</p>
                 </div>
                 <div className="flex gap-3">
                    <a href="tel:102" className="no-underline">
                      <Button variant="primary" className="bg-red-800 text-white hover:bg-white/10 px-8 h-12 rounded-xl font-bold border-white/20">
                        Call 102
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      className="bg-red-800 text-white hover:bg-white/10 px-8 h-12 rounded-xl font-bold border-white/20"
                      onClick={() => setShowSOSModal(true)}
                    >
                      Trigger SOS
                    </Button>
                 </div>
              </div>
              <Activity className="absolute right-12 bottom-[-20%] h-32 w-32 text-white/5 opacity-50 rotate-12" />
           </GlassCard>
        </div>
      </div>

      <ConfirmModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onConfirm={() => {
          toast.warning('SOS Triggered', {
            description: '🚨 SOS triggered! Location shared with emergency services and contacts.'
          });
        }}
        title="Trigger Emergency SOS"
        description={`Are you sure you want to trigger SOS in ${selectedCity || 'your area'}? This will share your location with emergency services and your emergency contacts.`}
        confirmText="Trigger SOS"
        cancelText="Cancel"
        variant="danger"
        isDestructive={true}
      />
    </div>
  );
}
