import { NavLink } from 'react-router-dom';
import { Home, Lightbulb, ClipboardList, BookOpen, FileText, BarChart3, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Navbar = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explain', label: 'Explain', icon: Lightbulb },
    { to: '/quiz', label: 'Quiz', icon: ClipboardList },
    { to: '/flashcards', label: 'Flashcards', icon: BookOpen },
    { to: '/summary', label: 'Summary', icon: FileText },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
    { to: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <nav className="bg-card border-b-2 border-primary/20 shadow-medium sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl hover-scale">
              <img src={logo} alt="EduBuddy+ Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              EduBuddy+
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile menu - simplified for now */}
          <div className="md:hidden">
            <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-4 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
