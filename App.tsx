
import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import WasteCategories from './components/WasteCategories';
import About from './components/About';
import Impact from './components/Impact';
import Tips from './components/Tips';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import History from './components/History';
import { db } from './services/db';
import { User } from './types';

type View = 'landing' | 'login' | 'register' | 'history';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = db.getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const scrollToScanner = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    setUser(null);
    navigateTo('landing');
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    navigateTo('landing');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        onStartScan={scrollToScanner} 
        onLoginClick={() => navigateTo('login')}
        onRegisterClick={() => navigateTo('register')}
        onHistoryClick={() => navigateTo('history')}
        onLogoClick={() => navigateTo('landing')}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {currentView === 'landing' && (
          <>
            <Hero onStartScan={scrollToScanner} onLearnMore={scrollToAbout} />
            <div ref={scannerRef}>
              <Scanner user={user} />
            </div>
            <WasteCategories />
            <div ref={aboutRef}>
              <About />
            </div>
            {!user && <Impact onSignUpClick={() => navigateTo('register')} />}
            <Tips />
          </>
        )}
        {currentView === 'login' && (
          <Login 
            onToggleAuth={() => navigateTo('register')} 
            onBackHome={() => navigateTo('landing')}
            onSuccess={handleAuthSuccess}
          />
        )}
        {currentView === 'register' && (
          <Register 
            onToggleAuth={() => navigateTo('login')} 
            onBackHome={() => navigateTo('landing')}
            onSuccess={handleAuthSuccess}
          />
        )}
        {currentView === 'history' && user && (
          <History user={user} onBackHome={() => navigateTo('landing')} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
