import React, { useState } from 'react';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import EventCard from './components/EventCard';
import AuthModal from './components/AuthModal';
import SkillPaths from './components/SkillPaths';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';

const FEATURED_EVENTS = [
  {
    title: "UX.3toryu Workshop",
    date: "September 2, 2024",
    time: "18:00 UTC",
    tags: ["UX", "Web3", "Design"],
    description: "An immersive workshop exploring the future of Web3 user experiences. Learn how to design intuitive interfaces for decentralized applications from industry experts.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    externalLink: "https://lu.ma/ux3",
    requiresAuth: false
  },
  {
    title: "AI & UX Book Club",
    date: "Every Sunday",
    time: "Weekly",
    tags: ["AI", "UX", "Book Club"],
    description: "Join our weekly discussions exploring the intersection of AI and UX design. We analyze cutting-edge research, share insights, and discuss practical applications of AI in user experience design.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    requiresAuth: true,
    price: 100,
    meetingLink: "https://meet.google.com/bed-xapu-fve"
  },
  {
    title: "Web3 Book Club",
    date: "Every Sunday",
    time: "Weekly",
    tags: ["Web3", "Blockchain", "Book Club"],
    description: "A weekly gathering of Web3 enthusiasts discussing the latest developments in blockchain technology, DeFi, and decentralized applications. From technical deep-dives to user experience analysis.",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    requiresAuth: true,
    price: 100,
    meetingLink: "https://meet.google.com/bed-xapu-fve"
  }
];

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingEventIndex, setPendingEventIndex] = useState<number | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  const handleEventRegistration = (index: number) => {
    const event = FEATURED_EVENTS[index];
    
    if (event.externalLink) {
      window.open(event.externalLink, '_blank');
      return;
    }

    if (event.requiresAuth && !isAuthenticated) {
      setPendingEventIndex(index);
      setIsAuthModalOpen(true);
      return;
    }

    if (event.price && !registeredEvents.includes(index)) {
      setPendingEventIndex(index);
      setIsPaymentModalOpen(true);
      return;
    }

    if (event.meetingLink && registeredEvents.includes(index)) {
      window.open(event.meetingLink, '_blank');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    
    if (pendingEventIndex !== null) {
      handleEventRegistration(pendingEventIndex);
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingEventIndex !== null) {
      setRegisteredEvents(prev => [...prev, pendingEventIndex]);
      setIsPaymentModalOpen(false);
      setPendingEventIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EXP3
            </div>
            <UserProfile 
              isAuthenticated={isAuthenticated}
              onLogin={() => setIsAuthModalOpen(true)}
              onLogout={() => setIsAuthenticated(false)}
            />
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <Hero onConnect={() => setIsAuthModalOpen(true)} />
        <Benefits />

        <section id="events" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_EVENTS.map((event, index) => (
                <EventCard
                  key={index}
                  {...event}
                  onRegister={() => handleEventRegistration(index)}
                  isAuthenticated={isAuthenticated}
                  isRegistered={registeredEvents.includes(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <SkillPaths />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingEventIndex(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {pendingEventIndex !== null && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPendingEventIndex(null);
          }}
          onSuccess={handlePaymentSuccess}
          price={FEATURED_EVENTS[pendingEventIndex].price || 0}
          title={FEATURED_EVENTS[pendingEventIndex].title}
        />
      )}

      <Footer />
    </div>
  );
}