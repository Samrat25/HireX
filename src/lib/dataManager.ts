// Data Management System for HireX
export interface Job {
  id: string;
  title: string;
  department: string;
  salary: string;
  deadline: string;
  requirements: string;
  description: string;
  status: 'Active' | 'Closed';
  applicants: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeScore: number;
  quizScore: number;
  aiInterviewScore: number;
  finalInterviewScore: number;
  status: 'Applied' | 'Resume Uploaded' | 'Quiz Complete' | 'AI Interview Complete' | 'Final Interview Pending' | 'Final Interview Complete' | 'Completed';
  appliedDate: string;
  experience: string;
  education: string;
  skills: string[];
  jobId: string;
  report?: CandidateReport;
}

export interface CandidateReport {
  id: string;
  candidateId: string;
  overallScore: number;
  strengths: string[];
  recommendations: string;
  feedback: string;
  generatedAt: string;
  sentToCandidate: boolean;
}

export interface Analytics {
  totalJobs: number;
  totalCandidates: number;
  averageScore: number;
  completionRate: number;
  topPerformers: Candidate[];
  scoreDistribution: { range: string; count: number; percentage: number }[];
  departmentStats: { department: string; candidates: number; avgScore: number }[];
  monthlyApplications: { month: string; applications: number }[];
}

class DataManager {
  private static instance: DataManager;
  
  private constructor() {}
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Job Management
  createJob(jobData: Omit<Job, 'id' | 'applicants' | 'createdAt'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      applicants: 0,
      createdAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    localStorage.setItem('hirex_jobs', JSON.stringify(jobs));
    return newJob;
  }

  getJobs(): Job[] {
    const jobs = localStorage.getItem('hirex_jobs');
    return jobs ? JSON.parse(jobs) : [];
  }

  updateJob(jobId: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) return null;
    
    jobs[jobIndex] = { ...jobs[jobIndex], ...updates };
    localStorage.setItem('hirex_jobs', JSON.stringify(jobs));
    return jobs[jobIndex];
  }

  deleteJob(jobId: string): boolean {
    const jobs = this.getJobs();
    const filteredJobs = jobs.filter(job => job.id !== jobId);
    
    if (filteredJobs.length === jobs.length) return false;
    
    localStorage.setItem('hirex_jobs', JSON.stringify(filteredJobs));
    return true;
  }

  // Candidate Management
  createCandidate(candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'status'>): Candidate {
    const candidates = this.getCandidates();
    const newCandidate: Candidate = {
      ...candidateData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
      status: 'Applied'
    };
    
    candidates.push(newCandidate);
    localStorage.setItem('hirex_candidates', JSON.stringify(candidates));
    
    // Update job applicant count
    this.incrementJobApplicants(candidateData.jobId);
    
    return newCandidate;
  }

  getCandidates(): Candidate[] {
    const candidates = localStorage.getItem('hirex_candidates');
    return candidates ? JSON.parse(candidates) : [];
  }

  getCandidatesByUser(userEmail: string): Candidate[] {
    return this.getCandidates().filter(candidate => candidate.email === userEmail);
  }

  updateCandidate(candidateId: string, updates: Partial<Candidate>): Candidate | null {
    const candidates = this.getCandidates();
    const candidateIndex = candidates.findIndex(candidate => candidate.id === candidateId);
    
    if (candidateIndex === -1) return null;
    
    candidates[candidateIndex] = { ...candidates[candidateIndex], ...updates };
    localStorage.setItem('hirex_candidates', JSON.stringify(candidates));
    return candidates[candidateIndex];
  }

  // Report Management
  generateReport(candidateId: string): CandidateReport {
    const candidate = this.getCandidates().find(c => c.id === candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const overallScore = Math.round(
      (candidate.resumeScore + candidate.quizScore + candidate.aiInterviewScore + candidate.finalInterviewScore) / 
      (candidate.finalInterviewScore > 0 ? 4 : 3)
    );

    const report: CandidateReport = {
      id: Date.now().toString(),
      candidateId,
      overallScore,
      strengths: candidate.skills.slice(0, 3),
      recommendations: overallScore >= 85 ? "Highly Recommended" : overallScore >= 75 ? "Recommended" : "Consider with reservations",
      feedback: `Based on comprehensive AI assessment, ${candidate.name} demonstrates ${
        overallScore >= 85 ? 'exceptional' : overallScore >= 75 ? 'strong' : 'adequate'
      } qualifications for the ${candidate.position} role.`,
      generatedAt: new Date().toISOString(),
      sentToCandidate: false
    };

    // Update candidate with report
    this.updateCandidate(candidateId, { report });
    
    return report;
  }

  sendReportToCandidate(candidateId: string): boolean {
    const candidate = this.getCandidates().find(c => c.id === candidateId);
    if (!candidate || !candidate.report) return false;

    const updatedReport = { ...candidate.report, sentToCandidate: true };
    this.updateCandidate(candidateId, { report: updatedReport });
    return true;
  }

  // Analytics
  getAnalytics(): Analytics {
    const jobs = this.getJobs();
    const candidates = this.getCandidates();

    const totalCandidates = candidates.length;
    const completedCandidates = candidates.filter(c => c.status === 'Completed');
    
    const averageScore = totalCandidates > 0 
      ? Math.round(candidates.reduce((sum, c) => {
          const score = (c.resumeScore + c.quizScore + c.aiInterviewScore + c.finalInterviewScore) / 
                       (c.finalInterviewScore > 0 ? 4 : 3);
          return sum + score;
        }, 0) / totalCandidates)
      : 0;

    const completionRate = totalCandidates > 0 
      ? Math.round((completedCandidates.length / totalCandidates) * 100)
      : 0;

    const topPerformers = candidates
      .map(c => ({
        ...c,
        overallScore: Math.round((c.resumeScore + c.quizScore + c.aiInterviewScore + c.finalInterviewScore) / 
                                (c.finalInterviewScore > 0 ? 4 : 3))
      }))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 5);

    // Score distribution
    const scoreRanges = [
      { range: '90-100', min: 90, max: 100 },
      { range: '80-89', min: 80, max: 89 },
      { range: '70-79', min: 70, max: 79 },
      { range: '60-69', min: 60, max: 69 },
      { range: 'Below 60', min: 0, max: 59 }
    ];

    const scoreDistribution = scoreRanges.map(range => {
      const count = candidates.filter(c => {
        const score = (c.resumeScore + c.quizScore + c.aiInterviewScore + c.finalInterviewScore) / 
                     (c.finalInterviewScore > 0 ? 4 : 3);
        return score >= range.min && score <= range.max;
      }).length;
      
      return {
        range: range.range,
        count,
        percentage: totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0
      };
    });

    // Department stats
    const departmentMap = new Map<string, { candidates: number; totalScore: number }>();
    
    candidates.forEach(candidate => {
      const job = jobs.find(j => j.id === candidate.jobId);
      const department = job?.department || 'Unknown';
      const score = (candidate.resumeScore + candidate.quizScore + candidate.aiInterviewScore + candidate.finalInterviewScore) / 
                   (candidate.finalInterviewScore > 0 ? 4 : 3);
      
      if (!departmentMap.has(department)) {
        departmentMap.set(department, { candidates: 0, totalScore: 0 });
      }
      
      const dept = departmentMap.get(department)!;
      dept.candidates++;
      dept.totalScore += score;
    });

    const departmentStats = Array.from(departmentMap.entries()).map(([department, data]) => ({
      department,
      candidates: data.candidates,
      avgScore: Math.round(data.totalScore / data.candidates)
    }));

    // Monthly applications (last 6 months)
    const monthlyApplications = this.getMonthlyApplications(candidates);

    return {
      totalJobs: jobs.length,
      totalCandidates,
      averageScore,
      completionRate,
      topPerformers,
      scoreDistribution,
      departmentStats,
      monthlyApplications
    };
  }

  private incrementJobApplicants(jobId: string): void {
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex !== -1) {
      jobs[jobIndex].applicants++;
      localStorage.setItem('hirex_jobs', JSON.stringify(jobs));
    }
  }

  private getMonthlyApplications(candidates: Candidate[]): { month: string; applications: number }[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      const applications = candidates.filter(candidate => {
        const appliedDate = new Date(candidate.appliedDate);
        return appliedDate.getMonth() === date.getMonth() && 
               appliedDate.getFullYear() === date.getFullYear();
      }).length;
      
      last6Months.push({ month: monthKey, applications });
    }
    
    return last6Months;
  }

  // Utility methods
  clearAllData(): void {
    localStorage.removeItem('hirex_jobs');
    localStorage.removeItem('hirex_candidates');
  }

  exportData(): { jobs: Job[]; candidates: Candidate[] } {
    return {
      jobs: this.getJobs(),
      candidates: this.getCandidates()
    };
  }

  importData(data: { jobs: Job[]; candidates: Candidate[] }): void {
    localStorage.setItem('hirex_jobs', JSON.stringify(data.jobs));
    localStorage.setItem('hirex_candidates', JSON.stringify(data.candidates));
  }
}

export const dataManager = DataManager.getInstance();