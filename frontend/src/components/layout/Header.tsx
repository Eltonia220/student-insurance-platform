
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';

const Header = ({ isAuthenticated = false }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">SS</span>
            </div>
            <span className="font-bold text-xl">StudentSafe</span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background border-b border-border/40 animate-fade-in">
                <nav className="container py-4 flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>Dashboard</Link>
                      <Link to="/browse-plans" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>Browse Plans</Link>
                      <Link to="/" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>Sign Out</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>Home</Link>
                      <Link to="/about" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>About</Link>
                      <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground" onClick={toggleMenu}>How It Works</Link>
                      <div className="pt-2 flex flex-col space-y-2">
                        <Button asChild variant="outline">
                          <Link to="/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                          <Link to="/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">Dashboard</Link>
                  <Link to="/browse-plans" className="text-foreground/80 hover:text-foreground transition-colors">Browse Plans</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
                  <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
                  <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How It Works</Link>
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link to="/">
                    <User size={16} />
                    <span>Sign Out</span>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
