import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Briefcase, Users, FileCheck, Video, BarChart3, 
  Plus, Calendar, TrendingUp, LogOut, Trash2, Eye,
  Download, Mic, FileText, Award, Send, Star,
  CheckCircle, Clock, MapPin, DollarSign, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { dataManager, Job, Candidate, Analytics } from "@/lib/dataManager";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    salary: '',
    deadline: '',
    requirements: '',
    description: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setJobs(dataManager.getJobs());
    setCandidates(dataManager.getCandidates());
    setAnalytics(dataManager.getAnalytics());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.department || !newJob.salary || !newJob.deadline) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdJob = dataManager.createJob({
        title: newJob.title,
        department: newJob.department,
        salary: newJob.salary,
        deadline: newJob.deadline,
        requirements: newJob.requirements,
        description: newJob.description,
        status: 'Active'
      });

      loadData(); // Refresh data
      setNewJob({ title: '', department: '', salary: '', deadline: '', requirements: '', description: '' });
      setShowJobForm(false);
      
      toast({
        title: "Job Created Successfully!",
        description: `${createdJob.title} has been posted and is now accepting applications.`,
      });
    } catch (error) {
      toast({
        title: "Error creating job",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTopCandidates = () => {
    return candidates
      .map(candidate => ({
        ...candidate,
        overallScore: Math.round((candidate.resumeScore + candidate.quizScore + candidate.aiInterviewScore + candidate.finalInterviewScore) / 
                                (candidate.finalInterviewScore > 0 ? 4 : 3))
      }))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 10);
  };

  const scheduleInterview = (candidateId: string) => {
    try {
      dataManager.updateCandidate(candidateId, { status: "Final Interview Pending" });
      loadData(); // Refresh data
      
      toast({
        title: "Interview Scheduled!",
        description: "Final interview has been scheduled with the candidate.",
      });
    } catch (error) {
      toast({
        title: "Error scheduling interview",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = (candidate: Candidate) => {
    try {
      const report = dataManager.generateReport(candidate.id);
      loadData(); // Refresh data
      
      toast({
        title: "Report Generated!",
        description: `Report has been generated for ${candidate.name}`,
      });
      
      return report;
    } catch (error) {
      toast({
        title: "Error generating report",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSendReport = (candidateId: string) => {
    try {
      const success = dataManager.sendReportToCandidate(candidateId);
      if (success) {
        loadData(); // Refresh data
        toast({
          title: "Report Sent!",
          description: "Feedback report has been sent to the candidate.",
        });
      } else {
        throw new Error("Failed to send report");
      }
    } catch (error) {
      toast({
        title: "Error sending report",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockCandidates = [
    { 
      id: 1, 
      name: "Dr. Sarah Johnson", 
      position: "Professor - CS", 
      email: "sarah.j@email.com",
      resumeScore: 92, 
      quizScore: 88, 
      interviewScore: 90,
      aiInterviewScore: 85,
      finalInterviewScore: 0,
      status: "Final Interview Pending",
      appliedDate: "2025-10-05",
      phone: "+1-555-0123",
      experience: "8 years",
      education: "PhD Computer Science, MIT",
      skills: ["Machine Learning", "Data Structures", "Research", "Teaching"]
    },
    { 
      id: 2, 
      name: "Dr. Michael Chen", 
      position: "Assoc. Prof - Math", 
      email: "m.chen@email.com",
      resumeScore: 85, 
      quizScore: 92, 
      interviewScore: 87,
      aiInterviewScore: 89,
      finalInterviewScore: 88,
      status: "Completed",
      appliedDate: "2025-10-06",
      phone: "+1-555-0124",
      experience: "6 years",
      education: "PhD Mathematics, Stanford",
      skills: ["Statistics", "Calculus", "Research Methods", "Academic Writing"]
    },
    { 
      id: 3, 
      name: "Dr. Emily Rodriguez", 
      position: "Research Assoc.", 
      email: "e.rodriguez@email.com",
      resumeScore: 88, 
      quizScore: 85, 
      interviewScore: 89,
      aiInterviewScore: 87,
      finalInterviewScore: 0,
      status: "AI Interview Complete",
      appliedDate: "2025-10-08",
      phone: "+1-555-0125",
      experience: "4 years",
      education: "PhD Physics, Caltech",
      skills: ["Quantum Physics", "Lab Management", "Data Analysis", "Research"]
    }
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "jobs", label: "Job Management", icon: Briefcase },
    { id: "top-candidates", label: "Top Candidates", icon: Award },
    { id: "interviews", label: "Final Interviews", icon: Video },
    { id: "reports", label: "Reports & Feedback", icon: FileText }
  ];

  const getKpiData = () => {
    if (!analytics) return [];
    
    return [
      { label: "Total Jobs", value: analytics.totalJobs.toString(), icon: Briefcase, color: "text-blue-600" },
      { label: "Total Candidates", value: analytics.totalCandidates.toString(), icon: Users, color: "text-purple-600" },
      { label: "Average Score", value: `${analytics.averageScore}%`, icon: TrendingUp, color: "text-green-600" },
      { label: "Completion Rate", value: `${analytics.completionRate}%`, icon: CheckCircle, color: "text-orange-600" }
    ];
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6">
          <h2 className="bg-gradient-hero bg-clip-text text-2xl font-bold text-transparent">
            Admin Portal
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{user?.name}</p>
        </div>
        <nav className="space-y-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-smooth ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 mt-auto">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeSection === "overview" && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                  Monitor recruitment progress and key metrics
                </p>
              </div>
              <Button variant="hero" onClick={() => setActiveSection("jobs")}>
                <Plus className="h-4 w-4" />
                Create New Job Post
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {getKpiData().map((kpi, idx) => (
                <Card key={idx} className="bg-gradient-card border-border/50 p-6 shadow-medium">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">{kpi.label}</p>
                      <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Applications */}
            <Card className="mb-8 border-border/50 p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-semibold">Recent Applications</h3>
              <div className="space-y-4">
                {[
                  { name: "Dr. Sarah Johnson", position: "Professor - CS", status: "Screening", time: "2 hours ago" },
                  { name: "Dr. Michael Chen", position: "Assoc. Prof - Math", status: "Interview", time: "5 hours ago" },
                  { name: "Dr. Emily Rodriguez", position: "Research Assoc.", status: "Evaluation", time: "1 day ago" }
                ].map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.position}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-primary">{app.status}</Badge>
                      <span className="text-sm text-muted-foreground">{app.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="border-border/50 p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-semibold">Top Candidates Leaderboard</h3>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Dr. Sarah Johnson", score: 92, badge: "🥇" },
                  { rank: 2, name: "Dr. James Wilson", score: 90, badge: "🥈" },
                  { rank: 3, name: "Dr. Emily Rodriguez", score: 88, badge: "🥉" },
                  { rank: 4, name: "Dr. Michael Chen", score: 87, badge: "" },
                  { rank: 5, name: "Dr. Lisa Anderson", score: 85, badge: "" }
                ].map((candidate) => (
                  <div
                    key={candidate.rank}
                    className="flex items-center justify-between rounded-lg bg-gradient-card p-4 transition-smooth hover:shadow-soft"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {candidate.badge || `#${candidate.rank}`}
                      </span>
                      <div>
                        <p className="font-semibold">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{candidate.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-muted-foreground">
                  Comprehensive insights and data visualization
                </p>
              </div>
              <Button variant="outline" onClick={loadData}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>

            {analytics ? (
              <AnalyticsDashboard analytics={analytics} />
            ) : (
              <Card className="p-8 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                <p className="text-muted-foreground">Start by creating jobs and receiving applications to see analytics.</p>
              </Card>
            )}
          </div>
        )}

        {activeSection === "candidates" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Candidate Management</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>

            <div className="space-y-4">
              {candidates.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Candidates Yet</h3>
                  <p className="text-muted-foreground">Candidates will appear here once they start applying for positions.</p>
                </Card>
              ) : (
                candidates.map((candidate) => (
                <Card key={candidate.id} className="p-6 border-border/50 shadow-soft">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <Badge className={
                          candidate.status === "Completed" ? "bg-green-500" :
                          candidate.status === "Final Interview Pending" ? "bg-yellow-500" :
                          candidate.status === "AI Interview Complete" ? "bg-blue-500" :
                          "bg-gray-500"
                        }>
                          {candidate.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1">{candidate.position}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email} • {candidate.phone}</p>
                      <p className="text-sm text-muted-foreground">Applied: {candidate.appliedDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowCandidateDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {candidate.status === "Final Interview Pending" && (
                        <Button 
                          variant="hero" 
                          size="sm"
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowVideoCall(true);
                          }}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Start Interview
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const report = handleGenerateReport(candidate);
                          if (report) {
                            setSelectedCandidate(candidate);
                            setShowReportGenerator(true);
                          }
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                    </div>
                  </div>

                  {/* Scorecard */}
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-gradient-card rounded-lg">
                      <p className="text-2xl font-bold text-primary">{candidate.resumeScore || 0}%</p>
                      <p className="text-xs text-muted-foreground">Resume</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-card rounded-lg">
                      <p className="text-2xl font-bold text-primary">{candidate.quizScore || 0}%</p>
                      <p className="text-xs text-muted-foreground">Quiz</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-card rounded-lg">
                      <p className="text-2xl font-bold text-primary">{candidate.aiInterviewScore || 0}%</p>
                      <p className="text-xs text-muted-foreground">AI Interview</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-card rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {candidate.finalInterviewScore || 'N/A'}
                        {candidate.finalInterviewScore ? '%' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">Final Interview</p>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <p className="text-2xl font-bold text-accent">
                        {Math.round((candidate.resumeScore + candidate.quizScore + candidate.aiInterviewScore + candidate.finalInterviewScore) / 
                                   (candidate.finalInterviewScore > 0 ? 4 : 3)) || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-sm font-medium mb-2">Skills & Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      )) || <span className="text-muted-foreground text-sm">No skills listed</span>}
                    </div>
                  </div>
                </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeSection === "jobs" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Job Management</h2>
              <Button variant="hero" onClick={() => setShowJobForm(true)}>
                <Plus className="h-4 w-4" />
                Create New Position
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {jobs.length === 0 ? (
                <div className="col-span-2">
                  <Card className="p-8 text-center">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first job posting to start receiving applications.</p>
                    <Button variant="hero" onClick={() => setShowJobForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Job
                    </Button>
                  </Card>
                </div>
              ) : (
                jobs.map((job) => (
                <Card key={job.id} className="border-border/50 p-6 shadow-soft hover:shadow-lg transition-all duration-300">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{job.department}</p>
                      <p className="text-sm text-muted-foreground">{job.applicants} applicants</p>
                      {job.salary && (
                        <p className="text-sm text-green-600 font-medium mt-1">{job.salary}</p>
                      )}
                      {job.deadline && (
                        <p className="text-xs text-orange-600 mt-1">Deadline: {job.deadline}</p>
                      )}
                    </div>
                    <Badge className={job.status === "Active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Applications
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => setActiveSection('top-candidates')}
                    >
                      Top Candidates
                    </Button>
                  </div>
                </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Top Candidates Section */}
        {activeSection === "top-candidates" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Top Candidates</h2>
              <Button variant="outline" onClick={() => setShowReportGenerator(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </div>

            <div className="space-y-6">
              {getTopCandidates().map((candidate, index) => (
                <Card key={candidate.id} className="p-6 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.position}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-1">{candidate.overallScore}%</div>
                      <Badge className={candidate.overallScore >= 90 ? "bg-green-500" : candidate.overallScore >= 80 ? "bg-blue-500" : "bg-yellow-500"}>
                        {candidate.overallScore >= 90 ? "Excellent" : candidate.overallScore >= 80 ? "Very Good" : "Good"}
                      </Badge>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{candidate.resumeScore}%</p>
                      <p className="text-xs text-muted-foreground">Resume</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{candidate.quizScore}%</p>
                      <p className="text-xs text-muted-foreground">Quiz</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{candidate.aiInterviewScore}%</p>
                      <p className="text-xs text-muted-foreground">AI Interview</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">
                        {candidate.finalInterviewScore || 'Pending'}
                        {candidate.finalInterviewScore ? '%' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">Final</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowCandidateDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {!candidate.finalInterviewScore && (
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => scheduleInterview(candidate.id)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Final Interview
                      </Button>
                    )}
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowReportGenerator(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Report
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "screening" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">AI-Based Eligibility Verification</h2>
            <Card className="border-border/50 p-6 shadow-soft">
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Automated Screening Process</h3>
                <p className="text-muted-foreground">
                  AI analyzes resumes and applications to verify candidate eligibility based on predefined criteria.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <span className="font-medium">Total Screened</span>
                  <span className="text-xl font-bold text-primary">248</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <span className="font-medium">Passed Screening</span>
                  <span className="text-xl font-bold text-accent">187</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                  <span className="font-medium">Under Review</span>
                  <span className="text-xl font-bold text-primary">43</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === "interviews" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Interview Scheduler</h2>
            <Card className="border-border/50 p-6 shadow-soft">
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Upcoming Interviews</h3>
                <p className="text-muted-foreground">Manage and schedule candidate interviews</p>
              </div>
              <div className="space-y-4">
                {[
                  { candidate: "Dr. Sarah Johnson", date: "2025-10-15", time: "10:00 AM" },
                  { candidate: "Dr. Michael Chen", date: "2025-10-15", time: "2:00 PM" },
                  { candidate: "Dr. Emily Rodriguez", date: "2025-10-16", time: "11:00 AM" }
                ].map((interview, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div>
                      <p className="font-medium">{interview.candidate}</p>
                      <p className="text-sm text-muted-foreground">
                        {interview.date} at {interview.time}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeSection === "reports" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Analytics & Reports</h2>
            <Card className="border-border/50 p-6 shadow-soft">
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Generate Reports</h3>
                <p className="text-muted-foreground">
                  Export comprehensive recruitment analytics and candidate data
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="default">Export as PDF</Button>
                <Button variant="outline">Export as DOC</Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Candidate Details Dialog */}
      <Dialog open={showCandidateDetails} onOpenChange={setShowCandidateDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Profile & Scorecard</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedCandidate.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedCandidate.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedCandidate.phone}</p>
                    <p><span className="font-medium">Position:</span> {selectedCandidate.position}</p>
                    <p><span className="font-medium">Applied:</span> {selectedCandidate.appliedDate}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Qualifications</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Education:</span> {selectedCandidate.education}</p>
                    <p><span className="font-medium">Experience:</span> {selectedCandidate.experience}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className="ml-2">{selectedCandidate.status}</Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Detailed Scorecard */}
              <div>
                <h3 className="font-semibold mb-3">Detailed Scorecard</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Resume Screening</p>
                    <p className="text-3xl font-bold text-primary mb-2">{selectedCandidate.resumeScore}%</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${selectedCandidate.resumeScore}%`}}
                      ></div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Knowledge Quiz</p>
                    <p className="text-3xl font-bold text-primary mb-2">{selectedCandidate.quizScore}%</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${selectedCandidate.quizScore}%`}}
                      ></div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">AI Interview</p>
                    <p className="text-3xl font-bold text-primary mb-2">{selectedCandidate.aiInterviewScore}%</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${selectedCandidate.aiInterviewScore}%`}}
                      ></div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Final Interview</p>
                    <p className="text-3xl font-bold text-primary mb-2">
                      {selectedCandidate.finalInterviewScore || 'Pending'}
                      {selectedCandidate.finalInterviewScore ? '%' : ''}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${selectedCandidate.finalInterviewScore || 0}%`}}
                      ></div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Overall Score */}
              <Card className="bg-accent/10 p-6 text-center">
                <h3 className="font-semibold mb-2">Overall Score</h3>
                <p className="text-5xl font-bold text-accent mb-2">
                  {Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3))}%
                </p>
                <p className="text-muted-foreground">
                  {selectedCandidate.finalInterviewScore ? 'All assessments completed' : 'Final interview pending'}
                </p>
              </Card>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedCandidate.status === "Final Interview Pending" && (
                  <Button variant="hero" className="flex-1" onClick={() => {
                    setShowCandidateDetails(false);
                    setShowVideoCall(true);
                  }}>
                    <Video className="h-4 w-4 mr-2" />
                    Start Final Interview
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Candidate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Final Interview - {selectedCandidate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video Interface */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Main Video */}
              <div className="md:col-span-2">
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">{selectedCandidate?.name}</p>
                    <p className="text-sm opacity-75">Candidate Video</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    ● LIVE
                  </div>
                </div>
                
                {/* Self Video (Picture-in-Picture) */}
                <div className="relative">
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gradient-to-br from-green-900 to-blue-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white text-xs">
                      <Users className="h-6 w-6 mx-auto mb-1" />
                      <p>You</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Panel */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Interview Questions</h4>
                  <div className="space-y-2 text-sm">
                    <p className="p-2 bg-muted rounded">1. Tell us about your research experience</p>
                    <p className="p-2 bg-muted rounded">2. How do you handle classroom challenges?</p>
                    <p className="p-2 bg-muted rounded">3. Describe your teaching philosophy</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Live Scoring</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span>8/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technical Knowledge</span>
                        <span>9/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Problem Solving</span>
                        <span>7/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '70%'}}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Share Screen
                </Button>
                <Button variant="outline" size="sm">
                  Record
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Interview Duration</p>
                <p className="font-mono text-lg">25:43</p>
              </div>

              <div className="flex gap-2">
                <Button variant="hero" onClick={() => {
                  setShowVideoCall(false);
                  toast({
                    title: "Interview Completed",
                    description: "Final score has been recorded",
                  });
                }}>
                  Complete Interview
                </Button>
                <Button variant="destructive" onClick={() => setShowVideoCall(false)}>
                  End Call
                </Button>
              </div>
            </div>

            {/* Interview Notes */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Interview Notes</h4>
              <textarea 
                className="w-full h-24 p-3 border rounded-lg resize-none"
                placeholder="Add notes about the candidate's performance, responses, and overall impression..."
              />
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Creation Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Job Position</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="e.g., Professor of Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={newJob.department}
                  onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary Range *</Label>
                <Input
                  id="salary"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requirements">Key Requirements</Label>
              <Textarea
                id="requirements"
                value={newJob.requirements}
                onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                placeholder="List the key requirements for this position..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                placeholder="Provide a detailed description of the role..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowJobForm(false)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleCreateJob}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job Position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Generator Dialog */}
      <Dialog open={showReportGenerator} onOpenChange={setShowReportGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCandidate ? `Candidate Report - ${selectedCandidate.name}` : 'Generate Reports'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCandidate ? (
            <div className="space-y-6">
              {/* Report Header */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedCandidate.name}</h3>
                    <p className="text-lg text-muted-foreground">{selectedCandidate.position}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3))}%
                    </div>
                    <Badge className="bg-green-500 text-white">Overall Score</Badge>
                  </div>
                </div>
              </Card>

              {/* Detailed Assessment */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Excellent technical knowledge ({selectedCandidate.quizScore}% quiz score)</li>
                    <li>• Strong communication skills in AI interview</li>
                    <li>• Relevant experience: {selectedCandidate.experience}</li>
                    <li>• Advanced education: {selectedCandidate.education}</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Performance Breakdown */}
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Performance Analysis</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{selectedCandidate.resumeScore}%</div>
                    <p className="text-sm text-muted-foreground mb-2">Resume Analysis</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${selectedCandidate.resumeScore}%`}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{selectedCandidate.quizScore}%</div>
                    <p className="text-sm text-muted-foreground mb-2">Knowledge Quiz</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: `${selectedCandidate.quizScore}%`}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{selectedCandidate.aiInterviewScore}%</div>
                    <p className="text-sm text-muted-foreground mb-2">AI Interview</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: `${selectedCandidate.aiInterviewScore}%`}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {selectedCandidate.finalInterviewScore || 'N/A'}
                      {selectedCandidate.finalInterviewScore ? '%' : ''}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Final Interview</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: `${selectedCandidate.finalInterviewScore || 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recommendation */}
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  Final Recommendation
                </h4>
                <p className="text-lg mb-4">
                  <strong>
                    {Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3)) >= 85 
                      ? "HIGHLY RECOMMENDED" 
                      : Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3)) >= 75 
                        ? "RECOMMENDED" 
                        : "CONSIDER WITH RESERVATIONS"}
                  </strong>
                </p>
                <p className="text-muted-foreground">
                  Based on comprehensive AI assessment, {selectedCandidate.name} demonstrates{' '}
                  {Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3)) >= 85 
                    ? 'exceptional qualifications and is an ideal candidate' 
                    : Math.round((selectedCandidate.resumeScore + selectedCandidate.quizScore + selectedCandidate.aiInterviewScore + (selectedCandidate.finalInterviewScore || 0)) / (selectedCandidate.finalInterviewScore ? 4 : 3)) >= 75 
                      ? 'strong qualifications and would be a valuable addition' 
                      : 'adequate qualifications but may require additional evaluation'} for the {selectedCandidate.position} role.
                </p>
              </Card>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowReportGenerator(false)}>
                  Close
                </Button>
                <Button variant="default" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="hero" 
                  className="flex-1"
                  onClick={() => {
                    if (selectedCandidate) {
                      handleSendReport(selectedCandidate.id);
                      setShowReportGenerator(false);
                    }
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Candidate
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">Select a candidate to generate their detailed report.</p>
              <div className="grid gap-4">
                {getTopCandidates().map((candidate) => (
                  <Card key={candidate.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedCandidate(candidate)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.position}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{candidate.overallScore}%</div>
                        <p className="text-xs text-muted-foreground">Overall Score</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
