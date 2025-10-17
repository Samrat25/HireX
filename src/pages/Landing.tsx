import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Users, BarChart3, Shield, Brain, Zap, Rocket, Star, Globe, ArrowRight, CheckCircle, Menu, X, User, LogIn, UserPlus, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ease-in-out ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-indigo-950 via-purple-950 to-pink-950' 
        : 'bg-gradient-to-br from-white via-blue-50/80 via-indigo-50/60 to-purple-50/40'
    }`}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ease-in-out ${
        isDarkMode 
          ? 'bg-slate-900/90 border-white/10 shadow-lg shadow-black/20' 
          : 'bg-white/95 border-gray-200/60 shadow-lg shadow-gray-900/10'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 group-hover:scale-110">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 transition-all duration-300">
                HireX
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {['home', 'features', 'positions', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 relative group ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-100/60'
                  }`}
                >
                  <span className="relative z-10 capitalize">
                    {section === 'home' ? 'Home' : 
                     section === 'features' ? 'Features' : 
                     section === 'positions' ? 'Positions' : 
                     section === 'about' ? 'About Us' : 'Contact'}
                  </span>
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10' 
                      : 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50'
                  }`}></div>
                </button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/15 hover:shadow-lg hover:shadow-yellow-400/20' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-100/80 hover:shadow-lg hover:shadow-amber-400/20'
                }`}
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> : 
                  <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                }
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-lg'
                }`}
                onClick={() => navigate("/auth")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 border-purple-500 ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-white hover:bg-purple-500/20 hover:shadow-lg' 
                    : 'text-purple-600 hover:text-white hover:bg-purple-500 hover:shadow-lg'
                }`}
                onClick={() => navigate("/admin-auth")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 group"
                onClick={() => navigate("/auth")}
              >
                <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 group ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/15' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-100/80'
                }`}
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> : 
                  <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                }
              </Button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                {isMobileMenuOpen ? 
                  <X className="h-6 w-6 rotate-0 hover:rotate-90 transition-transform duration-300" /> : 
                  <Menu className="h-6 w-6" />
                }
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden backdrop-blur-md border-t transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-900/95 border-white/10' 
                : 'bg-white/95 border-gray-200/50'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => scrollToSection('home')}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('positions')}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Positions
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  Contact
                </button>
                <div className={`border-t pt-3 mt-3 space-y-2 ${
                  isDarkMode ? 'border-white/10' : 'border-gray-200/50'
                }`}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`w-full justify-start transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => navigate("/auth")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`w-full justify-start transition-colors duration-300 border-purple-500 ${
                      isDarkMode 
                        ? 'text-purple-400 hover:text-white hover:bg-purple-500/20' 
                        : 'text-purple-600 hover:text-white hover:bg-purple-500'
                    }`}
                    onClick={() => navigate("/admin-auth")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                    onClick={() => navigate("/auth")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced Floating Orbs with better performance */}
        <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-glow-pulse will-change-transform ${
          isDarkMode 
            ? 'bg-gradient-to-br from-cyan-400/25 via-blue-500/20 to-purple-600/25' 
            : 'bg-gradient-to-br from-blue-200/30 via-indigo-300/25 to-purple-300/30'
        }`}></div>
        <div className={`absolute top-40 right-10 w-[500px] h-[500px] rounded-full blur-3xl animate-glow-pulse will-change-transform ${
          isDarkMode 
            ? 'bg-gradient-to-br from-purple-400/20 via-pink-500/15 to-rose-600/20' 
            : 'bg-gradient-to-br from-purple-200/25 via-pink-300/20 to-rose-300/25'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl animate-glow-pulse will-change-transform ${
          isDarkMode 
            ? 'bg-gradient-to-br from-emerald-400/15 via-teal-500/12 to-cyan-600/15' 
            : 'bg-gradient-to-br from-emerald-200/20 via-teal-300/15 to-cyan-300/20'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl animate-glow-pulse will-change-transform ${
          isDarkMode 
            ? 'bg-gradient-to-br from-yellow-400/12 via-orange-500/10 to-red-600/12' 
            : 'bg-gradient-to-br from-yellow-200/18 via-orange-300/15 to-red-300/18'
        }`} style={{ animationDelay: '3s' }}></div>
        
        {/* Enhanced Animated Grid with better opacity */}
        <div className={`absolute inset-0 bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,#000_60%,transparent_100%)] transition-all duration-700 ${
          isDarkMode 
            ? 'bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.04)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.12)_1px,transparent_1px)]'
        }`}></div>
        
        {/* Optimized Floating Particles - Reduced count for better performance */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float will-change-transform ${
              isDarkMode 
                ? (i % 4 === 0 ? 'w-3 h-3 bg-gradient-to-r from-blue-400/30 to-cyan-400/30' :
                   i % 4 === 1 ? 'w-2 h-2 bg-gradient-to-r from-purple-400/25 to-pink-400/25' :
                   i % 4 === 2 ? 'w-1.5 h-1.5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20' :
                   'w-1 h-1 bg-gradient-to-r from-yellow-400/15 to-orange-400/15')
                : (i % 4 === 0 ? 'w-3 h-3 bg-gradient-to-r from-blue-300/40 to-cyan-300/40' :
                   i % 4 === 1 ? 'w-2 h-2 bg-gradient-to-r from-purple-300/35 to-pink-300/35' :
                   i % 4 === 2 ? 'w-1.5 h-1.5 bg-gradient-to-r from-emerald-300/30 to-teal-300/30' :
                   'w-1 h-1 bg-gradient-to-r from-yellow-300/25 to-orange-300/25')
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}

        {/* Enhanced Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-1.5 h-1.5 rounded-full animate-ping will-change-transform ${
              isDarkMode ? 'bg-gradient-to-r from-white to-cyan-200' : 'bg-gradient-to-r from-gray-700 to-blue-600'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced Mouse Follower */}
      <div 
        className="fixed w-8 h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-md opacity-40 pointer-events-none z-50 transition-all duration-500 animate-pulse"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      ></div>
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60 pointer-events-none z-50 transition-all duration-300"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      ></div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="container mx-auto max-w-7xl">
          <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Left Side - Text Content */}
            <div className="text-left space-y-8 flex flex-col justify-center h-full">
              <div className={`inline-flex items-center gap-3 rounded-full backdrop-blur-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] px-6 py-3 group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/12 to-purple-500/15 text-white border border-white/20' 
                  : 'bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-purple-50/95 text-gray-800 border border-blue-300/50'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse group-hover:animate-spin transition-all duration-300" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
                    NEXT-GEN AI PLATFORM
                  </span>
                  <Star className="h-4 w-4 text-yellow-500 animate-pulse group-hover:animate-bounce transition-all duration-300" />
                </div>
              </div>
              
              <h1 className={`text-5xl font-extrabold md:text-6xl lg:text-8xl leading-[0.9] transition-all duration-700 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:400%_400%] hover:scale-105 transition-transform duration-300 inline-block">
                  HireX
                </span>
                <br />
                <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 hover:scale-105 inline-block ${
                  isDarkMode 
                    ? 'from-white via-blue-100 to-purple-100' 
                    : 'from-gray-900 via-blue-800 to-purple-800'
                }`}>
                  Faculty Recruitment
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                  Reimagined
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl max-w-2xl leading-relaxed transition-all duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your hiring process with cutting-edge AI technology. Experience recruitment that's 
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all duration-300"> fair, fast, and transparent.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Button 
                  variant="hero" 
                  size="lg"
                  className="text-xl px-12 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-110 transition-all duration-500 group relative overflow-hidden rounded-2xl font-bold"
                  onClick={() => navigate("/auth")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl animate-pulse"></div>
                  <Rocket className="h-7 w-7 mr-4 group-hover:animate-bounce group-hover:scale-110 relative z-10 transition-transform duration-300" />
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-3 group-hover:scale-110 transition-all duration-300 relative z-10" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`text-lg px-8 py-5 border-2 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:shadow-xl rounded-2xl font-semibold group ${
                    isDarkMode 
                      ? 'border-cyan-400/60 text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:shadow-cyan-500/30' 
                      : 'border-blue-500/70 text-gray-700 hover:bg-gradient-to-r hover:from-blue-100/70 hover:to-purple-100/70 hover:shadow-blue-500/30'
                  }`}
                  onClick={() => scrollToSection('features')}
                >
                  <Globe className="h-6 w-6 mr-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                  Explore Features
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12">
                <div className={`text-center p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-110 group ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20' 
                    : 'bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-cyan-200/50'
                }`}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className={`text-sm font-medium mt-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Successful Hires</div>
                </div>
                <div className={`text-center p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-110 group ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20' 
                    : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/50'
                }`}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">98%</div>
                  <div className={`text-sm font-medium mt-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Success Rate</div>
                </div>
                <div className={`text-center p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-110 group ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20' 
                    : 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/50'
                }`}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">60%</div>
                  <div className={`text-sm font-medium mt-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Time Saved</div>
                </div>
              </div>
            </div>

            {/* Right Side - Mac-style Website Mockup */}
            <div className="relative lg:pl-8 flex items-center justify-center">
              {/* Mac Window Frame */}
              <div className={`relative rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-cyan-500/20 w-full max-w-lg h-[600px] ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10' 
                  : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/50'
              }`}>
                
                {/* Mac Title Bar */}
                <div className={`flex items-center gap-2 px-4 py-3 border-b transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-slate-700/80 to-slate-800/80 border-white/10' 
                    : 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 border-gray-200/50'
                }`}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className={`rounded-md px-3 py-1 text-xs inline-block transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-slate-600/50 text-gray-300' 
                        : 'bg-gray-300/50 text-gray-600'
                    }`}>
                      hirex.ai - Faculty Recruitment Platform
                    </div>
                  </div>
                </div>

                {/* Website Content */}
                <div className="p-6 space-y-4 h-full flex flex-col">
                  {/* Header */}
                  <div className={`flex items-center justify-between pb-4 border-b transition-all duration-500 ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200/50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <span className={`font-bold transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>HireX</span>
                    </div>
                    <div className="flex gap-2">
                      <div className={`w-16 h-6 rounded border transition-all duration-500 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30' 
                          : 'bg-gradient-to-r from-cyan-200/40 to-purple-200/40 border-cyan-300/50'
                      }`}></div>
                      <div className={`w-12 h-6 rounded border transition-all duration-500 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30' 
                          : 'bg-gradient-to-r from-green-200/40 to-blue-200/40 border-green-300/50'
                      }`}></div>
                    </div>
                  </div>

                  {/* Dashboard Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-lg p-3 border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/20' 
                        : 'bg-gradient-to-br from-blue-100/60 to-purple-100/60 border-blue-300/40'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className={`text-xs transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Candidates</span>
                      </div>
                      <div className={`text-lg font-bold transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>1,247</div>
                      <div className={`w-full h-1 rounded-full mt-2 transition-all duration-500 ${
                        isDarkMode ? 'bg-blue-500/20' : 'bg-blue-200/40'
                      }`}>
                        <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className={`rounded-lg p-3 border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-400/20' 
                        : 'bg-gradient-to-br from-green-100/60 to-teal-100/60 border-green-300/40'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <span className={`text-xs transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Success Rate</span>
                      </div>
                      <div className={`text-lg font-bold transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>98.5%</div>
                      <div className={`w-full h-1 rounded-full mt-2 transition-all duration-500 ${
                        isDarkMode ? 'bg-green-500/20' : 'bg-green-200/40'
                      }`}>
                        <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Interview Section */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-medium text-white">AI Interview in Progress</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 bg-slate-700/50 rounded px-2 py-1">
                          <div className="text-xs text-gray-300">Tell me about your research experience...</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded px-2 py-1 border border-purple-400/30">
                          <div className="text-xs text-gray-300">I have 5 years of experience in...</div>
                        </div>
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-gradient-to-r from-cyan-400 to-blue-400' : 'bg-slate-600'}`}></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">Step 3 of 5</div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl animate-pulse"></div>
              </div>

              {/* Floating Elements around Mac */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce blur-sm"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg rotate-45 opacity-15 animate-pulse blur-sm"></div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-25 animate-ping blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Why Choose 
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:400%_400%]"> HireX?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              🚀 Revolutionizing academic recruitment with cutting-edge AI technology and innovative solutions
              <br />
              <span className="text-cyan-400 font-semibold">Experience the future of hiring today!</span>
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-900/60 border-blue-500/30 p-8 shadow-2xl backdrop-blur-md hover:shadow-blue-500/30 transition-all duration-700 hover:scale-110 hover:-translate-y-4 relative overflow-hidden animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl group-hover:shadow-blue-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Brain className="h-10 w-10 text-white group-hover:scale-125 transition-transform duration-500" />
                </div>
                <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-500">🧠 AI Screening</h3>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                  Advanced AI algorithms evaluate candidates fairly and efficiently, reducing bias and improving quality with machine learning precision.
                </p>
              </div>
            </Card>

            <Card className="group bg-gradient-to-br from-slate-800/60 via-purple-900/40 to-slate-900/60 border-purple-500/30 p-8 shadow-2xl backdrop-blur-md hover:shadow-purple-500/30 transition-all duration-700 hover:scale-110 hover:-translate-y-4 relative overflow-hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-400 via-pink-500 to-red-600 shadow-2xl group-hover:shadow-purple-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Zap className="h-10 w-10 text-white group-hover:scale-125 transition-transform duration-500" />
                </div>
                <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-500">⚡ Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                  Streamlined workflow cuts recruitment time by 60%, from application to final decision with automated processes.
                </p>
              </div>
            </Card>

            <Card className="group bg-gradient-to-br from-slate-800/60 via-emerald-900/40 to-slate-900/60 border-emerald-500/30 p-8 shadow-2xl backdrop-blur-md hover:shadow-emerald-500/30 transition-all duration-700 hover:scale-110 hover:-translate-y-4 relative overflow-hidden animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 shadow-2xl group-hover:shadow-emerald-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Shield className="h-10 w-10 text-white group-hover:scale-125 transition-transform duration-500" />
                </div>
                <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-500">🛡️ Transparent</h3>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                  Complete visibility into the evaluation process with detailed scoring and feedback at every stage of recruitment.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Open 
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Positions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join our prestigious institution and shape the future of education
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                title: "Professor", 
                dept: "Computer Science", 
                type: "Full-time",
                salary: "$80K - $120K",
                icon: Brain,
                color: "from-blue-500 to-purple-600",
                hoverColor: "hover:shadow-blue-500/20"
              },
              { 
                title: "Lecturer", 
                dept: "Mathematics", 
                type: "Full-time",
                salary: "$70K - $100K",
                icon: BarChart3,
                color: "from-purple-500 to-pink-600",
                hoverColor: "hover:shadow-purple-500/20"
              },
              { 
                title: "Research Associate", 
                dept: "Physics", 
                type: "Contract",
                salary: "$60K - $80K",
                icon: Zap,
                color: "from-cyan-500 to-blue-600",
                hoverColor: "hover:shadow-cyan-500/20"
              }
            ].map((position, idx) => (
              <Card key={idx} className={`group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${position.hoverColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${position.color} shadow-lg group-hover:shadow-lg transition-all duration-300 group-hover:rotate-6`}>
                    <position.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{position.title}</h3>
                  <p className="mb-1 text-gray-300 font-medium">{position.dept}</p>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{position.type}</span>
                    <span className="text-sm text-green-400 font-semibold">{position.salary}</span>
                  </div>
                  <Button 
                    variant="default" 
                    className={`w-full bg-gradient-to-r ${position.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white border-0`}
                    onClick={() => navigate("/auth")}
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              About 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> HireX</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We're revolutionizing faculty recruitment with cutting-edge AI technology, making the hiring process fair, fast, and transparent for educational institutions worldwide.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                To transform the way educational institutions discover and hire exceptional faculty members through innovative AI-powered solutions that eliminate bias and streamline the recruitment process.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">AI-powered candidate matching and evaluation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Transparent and unbiased recruitment process</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Comprehensive analytics and reporting</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-24 w-24 text-cyan-400 mx-auto mb-4 animate-pulse" />
                  <h4 className="text-2xl font-bold text-white mb-2">AI-Powered</h4>
                  <p className="text-gray-300">Smart recruitment technology</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 p-8 text-center">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-2">500+</h4>
              <p className="text-gray-300">Successful Placements</p>
            </Card>
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 p-8 text-center">
              <Globe className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-2">50+</h4>
              <p className="text-gray-300">Partner Institutions</p>
            </Card>
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 p-8 text-center">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-2">98%</h4>
              <p className="text-gray-300">Satisfaction Rate</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 via-pink-900/30 to-orange-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="container mx-auto max-w-5xl text-center relative">
          <div className="mb-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-8 py-4 backdrop-blur-md border border-yellow-400/30">
            <Star className="h-6 w-6 text-yellow-400 animate-spin" />
            <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              🎉 Limited Time: Early Access Available!
            </span>
            <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
          </div>
          
          <h2 className="mb-8 text-6xl font-bold text-white md:text-7xl leading-tight">
            Ready to 
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient bg-[length:400%_400%]"> Transform</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Your Career?</span>
          </h2>
          
          <p className="mb-12 text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            🚀 Join thousands of educators who have already discovered their dream positions through our AI-powered platform.
            <br />
            <span className="text-yellow-400 font-bold">Start your success story today!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              variant="hero" 
              size="lg"
              className="text-2xl px-16 py-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 shadow-2xl hover:shadow-yellow-500/40 transform hover:scale-115 transition-all duration-500 group relative overflow-hidden"
              onClick={() => navigate("/auth")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Star className="h-8 w-8 mr-4 group-hover:animate-spin relative z-10" />
              <span className="relative z-10 font-bold">Begin Your Journey Today</span>
              <Sparkles className="h-8 w-8 ml-4 group-hover:animate-bounce relative z-10" />
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Free to Start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 relative bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Get In 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Touch</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to transform your recruitment process? Contact us today and discover the future of faculty hiring.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📧</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <p className="text-white">contact@hirex.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📞</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Address</p>
                    <p className="text-white">123 Innovation Drive, Tech City, TC 12345</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Start</h3>
              <p className="text-gray-300 mb-6">
                Ready to begin your journey with HireX? Get started in just a few clicks and experience the future of faculty recruitment.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 py-3"
                  onClick={() => navigate("/auth")}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 py-3"
                  onClick={() => navigate("/auth")}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  HireX
                </h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Revolutionizing faculty recruitment with AI-powered technology. 
                Fair, fast, and transparent hiring for the future of education.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('positions')} className="hover:text-cyan-400 transition-colors">Positions</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 HireX. All rights reserved. Made with ❤️ for the future of education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
