import './index.css';
import { useState, lazy, Suspense, useEffect } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useChatStore } from './store/chatStore';

const AuthPage = lazy(() => import('./components/AuthPage'));
const SmoothScroll = lazy(() => import('./components/SmoothScroll'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const ChatArea = lazy(() => import('./components/ChatArea'));
const ChatNavbar = lazy(() => import('./components/ChatNavbar'));
const FloatingBlobs = lazy(() => import('./components/FloatingBlobs'));
const AnimatedBackground = lazy(() => import('./components/AnimatedBackground'));
const ParticleField = lazy(() => import('./components/ParticleField'));

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-berry-50 text-berry-500">
      Loading...
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSession: setStoreSession } = useChatStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setStoreSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setStoreSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setStoreSession]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <SmoothScroll>
        <CustomCursor />
        <div className="relative h-screen bg-cream-50 noise-overlay overflow-hidden">
          {/* Background layers */}
          <FloatingBlobs />
          <AnimatedBackground />

          {/* Desktop-only particles */}
          {!isMobile && <ParticleField />}

          {/* App layout */}
          <div className="relative z-10 flex h-screen">
            {/* Sidebar */}
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen((v) => !v)}
              onCloseMobile={() => setSidebarOpen(false)}
            />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Mobile navbar */}
              <ChatNavbar
                onToggleSidebar={() => setSidebarOpen((v) => !v)}
              />

              {/* Chat */}
              <ChatArea />
            </div>
          </div>
        </div>
      </SmoothScroll>
    </Suspense>
  );
}
