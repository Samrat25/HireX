import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Users, Shield, BarChart3, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'admin'>('candidate');
  
  const { user, login, signUp, loginWithGoogle, resetPassword, error, roleWarning } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect authenticated users with role preference
  useAuthRedirect({ preferredRole: selectedRole });

  // Prevent authenticated users from accessing auth page
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      
      // Show success message with role-specific content
      const roleMessage = selectedRole === 'admin' 
        ? "Welcome to the admin dashboard!" 
        : "Welcome to your candidate portal!";
        
      toast({
        title: "Welcome back!",
        description: roleMessage,
      });
      
      // Navigation will be handled by the auth state change
      // The selected role will be used as a preference for redirection
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, displayName, selectedRole);
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      setAuthMode('signin');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    console.log('Google sign in with selected role:', selectedRole);
    try {
      await loginWithGoogle(selectedRole);
      
      // Show success message with role-specific content
      const roleMessage = selectedRole === 'admin' 
        ? "Welcome to the admin dashboard!" 
        : "Welcome to your candidate portal!";
        
      toast({
        title: "Welcome!",
        description: roleMessage,
      });
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Please enter your email",
        description: "We need your email address to send reset instructions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: "Reset email sent!",
        description: "Please check your email for password reset instructions.",
      });
      setAuthMode('signin');
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDisplayName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-lg p-8 shadow-2xl backdrop-blur-xl bg-slate-900/90 border-slate-700/50 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              HireX
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {authMode === 'signin' ? 'Welcome Back' : 
             authMode === 'signup' ? 'Create Account' : 
             'Reset Password'}
          </h2>
          <p className="text-gray-400">
            {authMode === 'signin' ? 'Sign in to your account' : 
             authMode === 'signup' ? 'Join our AI-powered recruitment platform' : 
             'Enter your email to reset your password'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Role Warning Display */}
        {roleWarning && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">{roleWarning}</p>
          </div>
        )}

        {/* Role Selection for Both Sign Up and Sign In */}
        {(authMode === 'signup' || authMode === 'signin') && (
          <div className="mb-6">
            <Label className="text-white mb-3 block">
              {authMode === 'signup' ? 'Select Your Role' : 'Sign In As'}
            </Label>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'candidate' | 'admin')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="candidate" className="text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all duration-300 hover:bg-cyan-400/20">
                  <Users className="h-4 w-4 mr-2" />
                  Candidate
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-300 hover:bg-purple-400/20">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {authMode === 'signin' && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                Choose your role to access the appropriate dashboard
              </p>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Display Name - Only for Sign Up */}
          {authMode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your full name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Password - Not for Reset */}
          {authMode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password - Only for Sign Up */}
          {authMode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {authMode === 'signin' && (
            <>
              <Button 
                className={`w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  selectedRole === 'admin' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                } text-white`}
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : 
                 selectedRole === 'admin' ? 
                 `Sign In as Admin` : 
                 `Sign In as Candidate`}
              </Button>

              <div className="relative">
                <Separator className="bg-slate-600" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-gray-400 text-sm">
                  or
                </span>
              </div>

              <Button 
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-900 hover:text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            </>
          )}

          {authMode === 'signup' && (
            <Button 
              className={`w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                selectedRole === 'admin' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
              } text-white`}
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : 
               selectedRole === 'admin' ? 
               `Create Admin Account` : 
               `Create Candidate Account`}
            </Button>
          )}

          {authMode === 'reset' && (
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handlePasswordReset}
              disabled={isLoading}
            >
              {isLoading ? "Sending Reset Email..." : "Send Reset Email"}
            </Button>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          {authMode === 'signin' && (
            <>
              <button
                onClick={() => {
                  setAuthMode('reset');
                  resetForm();
                }}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Forgot your password?
              </button>
              <div className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    resetForm();
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {authMode === 'signup' && (
            <div className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setAuthMode('signin');
                  resetForm();
                }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in
              </button>
            </div>
          )}

          {authMode === 'reset' && (
            <button
              onClick={() => {
                setAuthMode('signin');
                resetForm();
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          )}

          <div className="pt-4 border-t border-slate-700">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;