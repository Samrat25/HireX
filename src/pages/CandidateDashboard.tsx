import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, FileText, Brain, Video, BarChart3, Upload, 
  MapPin, Clock, DollarSign, LogOut, Trophy, CheckCircle,
  ArrowRight, ArrowLeft, Star, Target, Award, Download, Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AIQuiz } from "@/components/AIQuiz";
import { AIInterview } from "@/components/AIInterview";
import { dataManager, Job, Candidate } from "@/lib/dataManager";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type WorkflowStep = 'register' | 'upload' | 'quiz' | 'interview' | 'complete';

const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('register');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userApplications, setUserApplications] = useState<Candidate[]>([]);
  const [scores, setScores] = useState({
    resume: 0,
    quiz: 0,
    interview: 0
  });
  const [userKeywords, setUserKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (user?.email) {
        setJobs(dataManager.getJobs().filter(job => job.status === 'Active'));
        setUserApplications(dataManager.getCandidatesByUser(user.email));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApply = (job: Job) => {
    // Check if user already applied for this job
    const existingApplication = userApplications.find(app => app.jobId === job.id);
    
    if (existingApplication) {
      setCurrentCandidate(existingApplication);
      setSelectedJob(job);
      setSelectedJobId(job.id);
      
      // Determine current step based on application status
      if (existingApplication.status === 'Applied' || existingApplication.status === 'Resume Uploaded') {
        setCurrentStep('upload');
      } else if (existingApplication.status === 'Quiz Complete') {
        setCurrentStep('quiz');
      } else if (existingApplication.status === 'AI Interview Complete') {
        setCurrentStep('interview');
      } else if (existingApplication.status === 'Completed') {
        setCurrentStep('complete');
      }
    } else {
      // Create new application
      const newCandidate = dataManager.createCandidate({
        name: user?.name || 'Unknown',
        email: user?.email || '',
        phone: '',
        position: job.title,
        resumeScore: 0,
        quizScore: 0,
        aiInterviewScore: 0,
        finalInterviewScore: 0,
        experience: '',
        education: '',
        skills: [],
        jobId: job.id
      });
      
      setCurrentCandidate(newCandidate);
      setSelectedJob(job);
      setSelectedJobId(job.id);
      setCurrentStep('upload');
      loadData(); // Refresh data
    }
  };

  const handleResumeComplete = (score: number, keywords?: string[]) => {
    if (currentCandidate) {
      const updatedCandidate = dataManager.updateCandidate(currentCandidate.id, {
        resumeScore: score,
        skills: keywords || [],
        status: 'Resume Uploaded'
      });
      
      if (updatedCandidate) {
        setCurrentCandidate(updatedCandidate);
        setScores(prev => ({ ...prev, resume: score }));
        if (keywords) setUserKeywords(keywords);
      }
    }
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (score: number) => {
    if (currentCandidate) {
      const updatedCandidate = dataManager.updateCandidate(currentCandidate.id, {
        quizScore: score,
        status: 'Quiz Complete'
      });
      
      if (updatedCandidate) {
        setCurrentCandidate(updatedCandidate);
        setScores(prev => ({ ...prev, quiz: score }));
      }
    }
    setCurrentStep('interview');
  };

  const handleInterviewComplete = (score: number) => {
    if (currentCandidate) {
      const updatedCandidate = dataManager.updateCandidate(currentCandidate.id, {
        aiInterviewScore: score,
        status: 'AI Interview Complete'
      });
      
      if (updatedCandidate) {
        setCurrentCandidate(updatedCandidate);
        setScores(prev => ({ ...prev, interview: score }));
      }
    }
    setCurrentStep('complete');
  };

  const getStepProgress = () => {
    const steps = ['register', 'upload', 'quiz', 'interview', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const calculateJobMatch = (job: Job, keywords: string[]) => {
    if (!keywords.length) return 75; // Default match
    
    const jobText = `${job.title} ${job.department} ${job.requirements} ${job.description}`.toLowerCase();
    const matchingKeywords = keywords.filter(keyword => 
      jobText.includes(keyword.toLowerCase())
    );
    
    return Math.min(95, 60 + (matchingKeywords.length * 8));
  };

  const workflowSteps = [
    { id: 'register', label: 'Register', icon: User, completed: true },
    { id: 'upload', label: 'Upload Resume', icon: Upload, completed: currentCandidate?.resumeScore > 0 },
    { id: 'quiz', label: 'Attempt AI Quiz', icon: Brain, completed: currentCandidate?.quizScore > 0 },
    { id: 'interview', label: 'AI Interview', icon: Video, completed: currentCandidate?.aiInterviewScore > 0 },
    { id: 'complete', label: 'Complete', icon: CheckCircle, completed: currentStep === 'complete' }
  ];

  const navItems = [
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'reports', label: 'My Reports', icon: Award }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Header */}
      <header className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HireX - Faculty Recruitment
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 w-full sm:w-auto" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="mb-6 sm:mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500 rounded-lg shadow-md">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">Application Progress</h3>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(getStepProgress())}%
            </span>
          </div>
          <Progress value={getStepProgress()} className="mb-6 h-2 sm:h-3" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-shrink-0 relative">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                  step.completed 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                    : currentStep === step.id 
                      ? 'bg-blue-500 border-blue-500 text-white animate-pulse shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium text-center max-w-[80px] leading-tight ${
                  step.completed ? 'text-green-600 dark:text-green-400' : currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < workflowSteps.length - 1 && (
                  <div className={`absolute top-5 sm:top-6 left-full w-full h-0.5 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} style={{ width: 'calc(100vw / 5 - 40px)', maxWidth: '120px' }} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step 1: Register / Job Selection */}
        {currentStep === 'register' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to HireX!
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
                Choose a position that matches your expertise and start your application journey
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
              <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 dark:from-yellow-600/20 dark:to-orange-600/20 p-4 sm:p-6 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 dark:text-yellow-400 group-hover:animate-bounce" />
                  <div className="p-1.5 sm:p-2 bg-yellow-500 rounded-full">
                    <span className="text-white text-xs font-bold">ACTIVE</span>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-700 dark:text-yellow-400">{selectedJob ? '1' : '0'}</p>
                <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-300 font-medium">Selected Position</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-600/20 dark:to-purple-600/20 p-4 sm:p-6 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                  <div className="p-1.5 sm:p-2 bg-blue-500 rounded-full">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">{jobs.length}</p>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-medium">Available Positions</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-600/20 dark:to-pink-600/20 p-4 sm:p-6 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <Star className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 dark:text-purple-400 group-hover:animate-pulse" />
                  <div className="p-1.5 sm:p-2 bg-purple-500 rounded-full">
                    <span className="text-white text-xs font-bold">SMART</span>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">AI</p>
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-300 font-medium">Powered Matching</p>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Available Positions</h3>
              <div className="grid gap-4 sm:gap-6">
                {jobs.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Jobs Available</h3>
                    <p className="text-muted-foreground">Check back later for new opportunities.</p>
                  </Card>
                ) : (
                  jobs
                    .map(job => ({
                      ...job,
                      match: calculateJobMatch(job, userKeywords)
                    }))
                    .sort((a, b) => b.match - a.match)
                    .map((job, idx) => {
                      const hasApplied = userApplications.some(app => app.jobId === job.id);
                      return (
                        <Card key={job.id} className="p-4 sm:p-6 lg:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] group">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4 sm:mb-6">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <h4 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-200 leading-tight">{job.title}</h4>
                                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm w-fit">
                                  {job.match}% Match
                                </Badge>
                                {hasApplied && (
                                  <Badge className="bg-blue-500 text-white">Applied</Badge>
                                )}
                              </div>
                              <p className="text-base sm:text-lg text-muted-foreground mb-2 sm:mb-3">{job.department}</p>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{job.description}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1 w-fit lg:ml-4">{job.status}</Badge>
                          </div>
                          
                          {job.requirements && (
                            <div className="mb-4 sm:mb-6">
                              <h5 className="font-semibold mb-2 sm:mb-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base">Key Requirements:</h5>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {job.requirements.split(',').map((req, reqIdx) => (
                                  <Badge key={reqIdx} variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                                    {req.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                              <span className="font-medium truncate">{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                              <span className="font-medium truncate">Deadline: {job.deadline}</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleApply(job)}
                            variant="hero" 
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 group-hover:scale-105 transition-all duration-300"
                          >
                            {hasApplied ? (
                              <>
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Continue Application
                              </>
                            ) : (
                              <>
                                Apply Now
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </Card>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Resume */}
        {currentStep === 'upload' && selectedJob && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Upload Your Resume</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Applying for: <span className="font-semibold text-blue-600 break-words">{selectedJob?.title}</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('register')}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Positions
              </Button>
              <Badge className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-center">Step 2 of 4</Badge>
            </div>

            <ResumeUpload onUploadComplete={handleResumeComplete} />
          </div>
        )}

        {/* Step 3: AI Quiz */}
        {currentStep === 'quiz' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">AI Knowledge Assessment</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Test your expertise with our AI-powered quiz
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('upload')}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Resume
              </Button>
              <Badge className="bg-purple-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-center">Step 3 of 4</Badge>
            </div>

            <AIQuiz onQuizComplete={handleQuizComplete} />
          </div>
        )}

        {/* Step 4: AI Interview */}
        {currentStep === 'interview' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">AI Interview Session</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Complete your interview with our AI assistant
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('quiz')}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz
              </Button>
              <Badge className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-center">Step 4 of 4</Badge>
            </div>

            <AIInterview onInterviewComplete={handleInterviewComplete} />
          </div>
        )}

        {/* Step 5: Complete - Final Scorecard */}
        {currentStep === 'complete' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Application Complete!
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
                  Your application for <span className="font-semibold text-blue-600 break-words">{selectedJob?.title}</span> has been submitted successfully.
                </p>
              </div>
            </div>

            {/* Final Scorecard */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-green-800 dark:text-green-400">
                Your Final Scorecard
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Resume Analysis</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">{scores.resume}%</p>
                    </div>
                  </div>
                  <Progress value={scores.resume} className="h-2" />
                </Card>

                <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Knowledge Quiz</p>
                      <p className="text-2xl sm:text-3xl font-bold text-purple-600">{scores.quiz}%</p>
                    </div>
                  </div>
                  <Progress value={scores.quiz} className="h-2" />
                </Card>

                <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-200 dark:border-green-800 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">AI Interview</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{scores.interview}%</p>
                    </div>
                  </div>
                  <Progress value={scores.interview} className="h-2" />
                </Card>
              </div>

              {/* Overall Score */}
              <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-200 dark:border-yellow-800 text-center">
                <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-600 mx-auto mb-4 animate-pulse" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2">Overall Score</h4>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  {Math.round((scores.resume + scores.quiz + scores.interview) / 3)}%
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 px-4">
                  {Math.round((scores.resume + scores.quiz + scores.interview) / 3) >= 85 
                    ? "Outstanding Performance! You're a top candidate." 
                    : "Great job! You've successfully completed all assessments."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      setCurrentStep('register');
                      setSelectedJob(null);
                      setCurrentCandidate(null);
                      setScores({ resume: 0, quiz: 0, interview: 0 });
                    }} 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Apply for Another Position
                  </Button>
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    View Application Status
                  </Button>
                </div>
              </Card>
            </Card>
          </div>
        )}

        {/* My Reports Section */}
        {userApplications.some(app => app.report?.sentToCandidate) && (
          <div className="mt-12">
            <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">My Reports</h2>
              </div>
              
              <div className="space-y-6">
                {userApplications
                  .filter(app => app.report?.sentToCandidate)
                  .map(application => (
                    <Card key={application.id} className="p-6 bg-white dark:bg-slate-800 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{application.position}</h3>
                          <p className="text-muted-foreground">
                            Report generated on {new Date(application.report!.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {application.report!.overallScore}%
                          </div>
                          <Badge className={
                            application.report!.overallScore >= 85 ? "bg-green-500" : 
                            application.report!.overallScore >= 75 ? "bg-blue-500" : "bg-yellow-500"
                          }>
                            {application.report!.recommendations}
                          </Badge>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{application.resumeScore}%</p>
                          <p className="text-xs text-muted-foreground">Resume</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">{application.quizScore}%</p>
                          <p className="text-xs text-muted-foreground">Quiz</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{application.aiInterviewScore}%</p>
                          <p className="text-xs text-muted-foreground">AI Interview</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-lg font-bold text-orange-600">
                            {application.finalInterviewScore || 'N/A'}
                            {application.finalInterviewScore ? '%' : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">Final</p>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Feedback</h4>
                        <p className="text-muted-foreground">{application.report!.feedback}</p>
                      </div>

                      {/* Strengths */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {application.report!.strengths.map((strength, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="default" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          View Full Details
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
