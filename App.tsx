import React, { useState, useEffect } from 'react';
import { 
  Home, Search, MessageSquare, User as UserIcon, 
  MapPin, SlidersHorizontal, ArrowLeft, Star, 
  CheckCircle, PlusCircle, Send, Sparkles, X, Menu, ChevronDown,
  CreditCard, Banknote, Smartphone, ChevronRight, ShieldCheck, Phone, LogOut
} from 'lucide-react';
import { Service, ServiceCategory, Booking, User } from './types';
import { MOCK_SERVICES, MOCK_BOOKINGS, CURRENT_USER } from './constants';
import { Button, Input, Badge, SectionHeader } from './components/Shared';
import ServiceCard from './components/ServiceCard';
import SellerDashboard from './components/SellerDashboard';
import { aiSearchServices, enhanceServiceDescription } from './services/geminiService';

// -- Types --
type ViewState = 'LANDING' | 'HOME' | 'SEARCH' | 'MESSAGES' | 'PROFILE' | 'SERVICE_DETAIL' | 'PAYMENT' | 'BOOKING_SUCCESS';
type PaymentMethod = 'M-Pesa' | 'Airtel Money' | 'PayPal' | 'Cash';

// -- Components --

// 1. Mobile Bottom Navigation
const MobileNavigation: React.FC<{ current: ViewState, onChange: (v: ViewState) => void }> = ({ current, onChange }) => {
  const navItems = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'SEARCH', icon: Search, label: 'Search' },
    { id: 'MESSAGES', icon: MessageSquare, label: 'Chat' },
    { id: 'PROFILE', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-4 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id as ViewState)}
          className={`flex flex-col items-center gap-1 transition-colors ${current === item.id ? 'text-brand-600' : 'text-gray-400'}`}
        >
          <item.icon className={`w-6 h-6 ${current === item.id ? 'fill-current' : ''}`} strokeWidth={2} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// 2. Desktop Top Header
const DesktopHeader: React.FC<{ current: ViewState, onChange: (v: ViewState) => void, user: User }> = ({ current, onChange, user }) => {
  const navItems = [
    { id: 'HOME', label: 'Home' },
    { id: 'SEARCH', label: 'Explore' },
    { id: 'MESSAGES', label: 'Messages' },
  ];

  if (current === 'LANDING') return null;

  return (
    <header className="hidden md:flex sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 items-center justify-between shadow-sm">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onChange('HOME')}
      >
         <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
         </div>
         <span className="font-bold text-xl tracking-tight text-gray-900">SkillSwap</span>
      </div>

      <nav className="flex items-center gap-8">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => onChange(item.id as ViewState)}
            className={`text-sm font-medium transition-colors ${current === item.id ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="!px-2" onClick={() => onChange('MESSAGES')}>
           <MessageSquare className="w-5 h-5" />
        </Button>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-gray-200"
          onClick={() => onChange('PROFILE')}
        >
          <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
          <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}

// -- Main App Component --
export default function App() {
  const [view, setView] = useState<ViewState>('LANDING');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>(MOCK_SERVICES);
  const [isSearching, setIsSearching] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');

  // Home View State
  const categories = Object.values(ServiceCategory);

  // Profile/Seller State
  const [user, setUser] = useState<User>(CURRENT_USER);

  // Logic
  const handleBookService = () => {
    setView('PAYMENT');
  };

  const handleConfirmPayment = () => {
    setView('BOOKING_SUCCESS');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!searchQuery) {
      setSearchResults(MOCK_SERVICES);
      return;
    }

    setIsSearching(true);
    
    if (useAI) {
      const matchedIds = await aiSearchServices(searchQuery, MOCK_SERVICES);
      const filtered = MOCK_SERVICES.filter(s => matchedIds.includes(s.id));
      if (filtered.length === 0 && matchedIds.length === 0) {
          const lowerQ = searchQuery.toLowerCase();
          setSearchResults(MOCK_SERVICES.filter(s => 
            s.title.toLowerCase().includes(lowerQ) || 
            s.category.toLowerCase().includes(lowerQ)
          ));
      } else {
        setSearchResults(filtered);
      }
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setSearchResults(MOCK_SERVICES.filter(s => 
        s.title.toLowerCase().includes(lowerQ) || 
        s.category.toLowerCase().includes(lowerQ)
      ));
    }
    
    setIsSearching(false);
  };

  // --- Views ---

  const LandingView = () => (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 md:w-[500px] md:h-[500px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 md:w-[600px] md:h-[600px]"></div>
      
      {/* Left Content (Desktop) / Top (Mobile) */}
      <div className="flex-1 flex flex-col justify-center px-6 pt-12 md:p-20 z-10 md:max-w-2xl">
        <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">SkillSwap</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Learn. Share. <br/>
          <span className="text-brand-600">Earn Money.</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
          The #1 marketplace for skills in Africa. Join 50,000+ Kenyans earning daily by sharing what they know.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8 md:max-w-md">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-600" />
                <span className="font-semibold text-gray-700">Verified Pros</span>
            </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-brand-600" />
                <span className="font-semibold text-gray-700">M-Pesa Ready</span>
            </div>
        </div>

        <div className="md:max-w-xs">
           <Button className="w-full py-4 text-lg shadow-xl shadow-brand-200" onClick={() => setView('HOME')}>
            Get Started
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right Image (Desktop) / Middle (Mobile) */}
      <div className="p-6 md:flex-1 md:h-screen md:p-12 flex items-center justify-center z-10">
        <div className="relative w-full aspect-[4/3] md:aspect-square md:h-full md:w-auto md:max-w-2xl rounded-3xl overflow-hidden shadow-2xl shadow-brand-100 rotate-3 md:-rotate-2 transform hover:rotate-0 transition-transform duration-500">
            <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000" 
                alt="Smiling African Friends" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
                <p className="font-bold text-2xl md:text-3xl">Connect. Collaborate.</p>
                <p className="opacity-90 mt-2">Build your future today.</p>
            </div>
        </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-brand-600 px-4 pt-8 pb-12 md:px-8 md:py-16 md:rounded-b-[3rem] rounded-b-3xl text-white shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="md:text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Jambo, {user.name.split(' ')[0]}! 👋</h1>
            <p className="opacity-90 text-sm md:text-lg">What skill do you need to learn or hire today?</p>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <Input 
              placeholder="Try 'Math tutor in Westlands' or 'Plumber in CBD'..." 
              className="w-full pl-12 py-4 rounded-2xl shadow-xl border-none text-gray-900 md:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { setView('SEARCH'); handleSearch(); } }}
            />
            <Search className="absolute left-4 top-4 md:top-5 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-8 md:px-8 max-w-7xl mx-auto">
        <SectionHeader title="Categories" />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 md:flex-wrap">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => { setSearchQuery(cat); setView('SEARCH'); handleSearch(); }}
              className="flex-shrink-0 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all active:scale-95"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Services Grid */}
      <div className="px-4 mt-8 md:px-8 max-w-7xl mx-auto">
        <SectionHeader title="Featured Services" action={<span className="text-brand-600 text-sm font-medium cursor-pointer hover:underline">See All</span>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_SERVICES.slice(0, 4).map(service => (
            <div key={service.id} className="h-full">
              <ServiceCard 
                service={service} 
                onClick={(s) => { setSelectedService(s); setView('SERVICE_DETAIL'); }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SearchView = () => (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-gray-50 md:px-8 max-w-7xl mx-auto">
      <div className="sticky top-0 md:static bg-gray-50 z-10 pb-4">
        <div className="flex items-center gap-4 mb-6">
           <button onClick={() => setView('HOME')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-200">
             <ArrowLeft className="w-5 h-5 text-gray-700" />
           </button>
           <h2 className="text-2xl font-bold text-gray-900">Find a Service</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
             <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-white px-4 py-2 rounded-lg border border-gray-300 font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-brand-300" onClick={() => setUseAI(!useAI)}>
              <div className="flex items-center gap-2 mr-3">
                <Sparkles className={`w-4 h-4 ${useAI ? 'text-brand-500 fill-brand-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${useAI ? 'text-brand-700' : 'text-gray-700'}`}>AI Match</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${useAI ? 'bg-brand-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${useAI ? 'left-4.5' : 'left-0.5'}`} style={{left: useAI ? '1.1rem' : '0.1rem'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-4"></div>
           <p>Searching best matches...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={(s) => { setSelectedService(s); setView('SERVICE_DETAIL'); }} 
              />
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-500">
               <p>No services found for "{searchQuery}".</p>
               <p className="text-sm mt-2">Try turning on AI Match!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );

  const ServiceDetailView = () => {
    if (!selectedService) return null;
    return (
      <div className="pb-24 bg-white min-h-screen md:bg-gray-50 md:pb-12">
        
        {/* Mobile Header Image */}
        <div className="relative h-64 md:hidden">
          <img src={selectedService.image} className="w-full h-full object-cover" alt="Service" />
          <button 
            onClick={() => setView('HOME')}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Desktop Wrapper */}
        <div className="max-w-6xl mx-auto md:pt-8 md:grid md:grid-cols-2 md:gap-8 md:items-start px-0 md:px-6">
          
          {/* Left Column (Desktop Image) */}
          <div className="hidden md:block sticky top-24">
             <button 
              onClick={() => setView('HOME')}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </button>
            <div className="rounded-3xl overflow-hidden shadow-xl h-[400px]">
               <img src={selectedService.image} className="w-full h-full object-cover" alt="Service" />
            </div>
          </div>

          {/* Right Column (Content) */}
          <div className="px-6 -mt-6 relative z-10 bg-white rounded-t-3xl pt-6 md:mt-0 md:rounded-3xl md:p-8 md:shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <Badge color="bg-brand-50 text-brand-700">{selectedService.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">{selectedService.rating}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{selectedService.title}</h1>
            <p className="text-2xl md:text-3xl font-bold text-brand-600 mb-6">
              {selectedService.currency} {selectedService.price.toLocaleString()}
            </p>

            <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <img src={selectedService.providerAvatar} alt="Provider" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-base">{selectedService.providerName}</p>
                <div className="flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3 text-brand-600" />
                   <p className="text-xs text-gray-500">Verified Seller</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href="tel:+254700000000"
                  className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-brand-600 hover:border-brand-600 transition-colors flex items-center justify-center shadow-sm"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <button 
                  className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-brand-600 hover:border-brand-600 transition-colors flex items-center justify-center shadow-sm"
                  onClick={() => setView('MESSAGES')}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">About this Service</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {selectedService.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Service Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedService.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Action (In flow) */}
            <div className="hidden md:block pt-6 border-t border-gray-100">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-2xl font-bold text-gray-900">{selectedService.currency} {selectedService.price.toLocaleString()}</span>
               </div>
               <Button className="w-full py-4 text-lg" onClick={handleBookService}>
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center gap-4 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-xl font-bold text-gray-900">{selectedService.currency} {selectedService.price.toLocaleString()}</p>
          </div>
          <Button className="flex-1 py-3 text-lg" onClick={handleBookService}>
            Book Now
          </Button>
        </div>
      </div>
    );
  };

  const PaymentView = () => {
    // BUSINESS LOGIC: Calculate percentages
    const price = selectedService?.price || 0;
    const platformFee = Math.round(price * 0.15); // 15% Platform Fee
    const workerEarnings = price - platformFee;   // 85% to Worker
    const total = price; 

    return (
      <div className="pb-24 bg-white min-h-screen flex flex-col md:bg-gray-50 md:items-center md:justify-center md:pb-0">
        <div className="w-full md:max-w-md md:bg-white md:rounded-2xl md:shadow-xl md:overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-10">
               <button onClick={() => setView('SERVICE_DETAIL')} className="p-2 rounded-full hover:bg-gray-100">
                 <ArrowLeft className="w-5 h-5" />
               </button>
               <h2 className="font-bold text-lg">Select Payment</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* M-Pesa */}
              <div 
                onClick={() => setPaymentMethod('M-Pesa')}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all relative ${
                    paymentMethod === 'M-Pesa' 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    paymentMethod === 'M-Pesa' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <div className="text-center leading-none">
                     <span className="block font-bold text-xs tracking-wider">M-PESA</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">M-Pesa</p>
                  <p className="text-xs text-gray-500">Pay via STK Push</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'M-Pesa' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'M-Pesa' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
      
              {/* Airtel Money */}
              <div 
                onClick={() => setPaymentMethod('Airtel Money')}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all relative ${
                    paymentMethod === 'Airtel Money' 
                    ? 'border-red-600 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    paymentMethod === 'Airtel Money' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                   <span className="font-bold text-xs tracking-wider">airtel</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Airtel Money</p>
                  <p className="text-xs text-gray-500">Fast & secure</p>
                </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Airtel Money' ? 'border-red-600 bg-red-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'Airtel Money' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
        
              {/* PayPal */}
              <div 
                onClick={() => setPaymentMethod('PayPal')}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all relative ${
                    paymentMethod === 'PayPal' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    paymentMethod === 'PayPal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className="font-bold text-lg italic font-serif">P</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">PayPal</p>
                  <p className="text-xs text-gray-500">International cards</p>
                </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'PayPal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'PayPal' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
        
               {/* Cash */}
               <div 
                onClick={() => setPaymentMethod('Cash')}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all relative ${
                    paymentMethod === 'Cash' 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                    paymentMethod === 'Cash' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cash</p>
                  <p className="text-xs text-gray-500">Pay upon completion</p>
                </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Cash' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'Cash' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
    
            {/* FINANCIAL BREAKDOWN */}
            <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100 md:bg-white">
               <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Service Cost</span>
                    <span>{selectedService?.currency} {price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Platform Fee (15%)</span>
                    <span>{selectedService?.currency} {platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                    <span>Worker Receives</span>
                    <span className="text-green-600">~ {selectedService?.currency} {workerEarnings.toLocaleString()}</span>
                  </div>
               </div>
               
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-900 font-bold">You Pay</span>
                  <span className="text-2xl font-bold text-brand-600">{selectedService?.currency} {total.toLocaleString()}</span>
               </div>
               <Button className="w-full py-3 text-lg" onClick={handleConfirmPayment}>
                  Confirm Payment
               </Button>
            </div>
        </div>
      </div>
    );
  };

  const BookingSuccessView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="w-10 h-10 text-brand-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        We've sent your request to <span className="font-bold">{selectedService?.providerName}</span>. 
        <br/>You will be notified once they accept.
      </p>
      
      <div className="w-full max-w-xs bg-gray-50 p-4 rounded-xl mb-4 text-left border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Payment Method</p>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${
            paymentMethod === 'M-Pesa' ? 'bg-green-600' : 
            paymentMethod === 'Airtel Money' ? 'bg-red-600' :
            paymentMethod === 'PayPal' ? 'bg-blue-600' : 'bg-gray-600'
          }`}>
            {paymentMethod === 'M-Pesa' ? 'MP' : paymentMethod === 'Airtel Money' ? 'AM' : paymentMethod === 'PayPal' ? 'PP' : 'CS'}
          </div>
          <span className="font-medium">
            {
              paymentMethod === 'M-Pesa' ? 'M-Pesa (..9087)' : 
              paymentMethod === 'Airtel Money' ? 'Airtel Money (..3421)' :
              paymentMethod === 'PayPal' ? 'PayPal Account' : 'Cash Payment'
            }
          </span>
        </div>
      </div>

      <div className="w-full max-w-xs mb-8 text-left border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 bg-white border-t border-gray-100 text-sm space-y-3">
          <div className="flex justify-between">
             <span className="text-gray-500 text-xs uppercase tracking-wide">Service</span>
             <span className="font-medium text-gray-900">{selectedService?.title}</span>
          </div>
          <div className="flex justify-between">
             <span className="text-gray-500 text-xs uppercase tracking-wide">Provider</span>
             <span className="font-medium text-gray-900">{selectedService?.providerName}</span>
          </div>
          <div className="flex justify-between">
             <span className="text-gray-500 text-xs uppercase tracking-wide">Date</span>
             <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <Button className="w-full max-w-xs" onClick={() => setView('HOME')}>
        Back to Home
      </Button>
    </div>
  );

  const MessagesView = () => (
    <div className="pb-20 pt-4 px-4 h-screen flex flex-col bg-gray-50 max-w-4xl mx-auto w-full">
       <h2 className="text-2xl font-bold mb-4 text-gray-900 px-2">Messages</h2>
       <div className="flex-1 overflow-y-auto space-y-4 px-2">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
             <img src="https://picsum.photos/seed/david/100/100" className="w-12 h-12 rounded-full" />
             <div className="flex-1">
                <div className="flex justify-between mb-1">
                   <h3 className="font-bold text-gray-900">David Tech</h3>
                   <span className="text-xs text-gray-400">2m ago</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">Can you bring the laptop tomorrow at 10am?</p>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
             <img src="https://picsum.photos/seed/grace/100/100" className="w-12 h-12 rounded-full" />
             <div className="flex-1">
                <div className="flex justify-between mb-1">
                   <h3 className="font-bold text-gray-900">Grace Kamau</h3>
                   <span className="text-xs text-gray-400">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">Thanks for the booking! Looking forward to the lesson.</p>
             </div>
          </div>
       </div>
    </div>
  );

  // Profile view wrapper for responsive alignment
  const ProfileViewWrapper = () => (
    <div className="max-w-4xl mx-auto w-full md:pt-6">
      <SellerDashboard user={user} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-100 selection:text-brand-900">
      
      {/* Desktop Header (Hidden on Mobile) */}
      <DesktopHeader current={view} onChange={setView} user={user} />

      {/* Main Content Area */}
      <main className="w-full">
        {view === 'LANDING' && <LandingView />}
        {view === 'HOME' && <HomeView />}
        {view === 'SEARCH' && <SearchView />}
        {view === 'SERVICE_DETAIL' && <ServiceDetailView />}
        {view === 'PAYMENT' && <PaymentView />}
        {view === 'BOOKING_SUCCESS' && <BookingSuccessView />}
        {view === 'MESSAGES' && <MessagesView />}
        {view === 'PROFILE' && <ProfileViewWrapper />}
      </main>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      {(view !== 'SERVICE_DETAIL' && view !== 'BOOKING_SUCCESS' && view !== 'PAYMENT' && view !== 'LANDING') && (
        <MobileNavigation current={view} onChange={setView} />
      )}
    </div>
  );
}