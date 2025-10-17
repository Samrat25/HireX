import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, firebaseUser, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If user is already verified, redirect to appropriate dashboard
    if (user?.isEmailVerified) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification email sent!",
        description: "Please check your inbox and spam folder.",
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleRefreshStatus = () => {
    // Reload the page to check verification status
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user || !firebaseUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-2xl backdrop-blur-xl bg-slate-900/90 border-slate-700/50 relative text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
              <Mail className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400 leading-relaxed">
            We've sent a verification email to{' '}
            <span className="text-cyan-400 font-medium">{user.email}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-8 space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              Click the verification link in your email to activate your account.
            </p>
          </div>
          
          <div className="text-left space-y-2 text-sm text-gray-400">
            <p>• Check your inbox and spam/junk folder</p>
            <p>• The verification link expires in 24 hours</p>
            <p>• After clicking the link, refresh this page</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleRefreshStatus}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            I've Verified My Email
          </Button>

          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full border-slate-600 text-white hover:bg-slate-800 py-3 rounded-xl"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isResending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : isResending 
                ? 'Sending...' 
                : 'Resend Email'
            }
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700 space-y-3">
          <p className="text-gray-400 text-sm">
            Wrong email address?
          </p>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sign in with different account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;