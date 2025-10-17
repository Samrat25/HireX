import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Brain, Target, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadProps {
  onUploadComplete: (score: number, keywords?: string[]) => void;
}

export const ResumeUpload = ({ onUploadComplete }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setScanComplete(false);
    }
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate keyword extraction based on file name or random selection
    const allKeywords = [
      'Machine Learning', 'Data Science', 'Python', 'Research', 'PhD', 'Teaching',
      'Mathematics', 'Statistics', 'Computer Science', 'Physics', 'Engineering',
      'Publications', 'Leadership', 'Project Management', 'AI', 'Deep Learning',
      'Algorithms', 'Database', 'Software Development', 'Academic Writing'
    ];
    
    const keywords = allKeywords.slice(0, Math.floor(Math.random() * 8) + 5);
    setExtractedKeywords(keywords);

    // Generate job recommendations based on keywords
    const jobRecommendations = [
      {
        title: "Professor of Computer Science",
        match: keywords.includes('Computer Science') || keywords.includes('AI') ? 95 : 85,
        department: "Computer Science",
        matchingKeywords: keywords.filter(k => 
          ['Computer Science', 'AI', 'Machine Learning', 'Python', 'Research', 'PhD'].includes(k)
        )
      },
      {
        title: "Associate Professor - Mathematics",
        match: keywords.includes('Mathematics') || keywords.includes('Statistics') ? 92 : 78,
        department: "Mathematics",
        matchingKeywords: keywords.filter(k => 
          ['Mathematics', 'Statistics', 'Research', 'PhD', 'Teaching'].includes(k)
        )
      },
      {
        title: "Research Associate - Physics",
        match: keywords.includes('Physics') || keywords.includes('Research') ? 88 : 72,
        department: "Physics",
        matchingKeywords: keywords.filter(k => 
          ['Physics', 'Research', 'Data Science', 'Publications'].includes(k)
        )
      }
    ];

    setRecommendations(jobRecommendations.sort((a, b) => b.match - a.match));

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const score = Math.floor(Math.random() * 30) + 70; // 70-100
          setAiScore(score);
          setScanComplete(true);
          setIsScanning(false);
          onUploadComplete(score, keywords);
          toast({
            title: "AI Screening Complete",
            description: `Your eligibility score: ${score}% | ${keywords.length} skills identified`,
          });
          return 100;
        }
        return prev + 8;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 shadow-soft bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">AI-Powered Resume Analysis</h3>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8 text-center bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium mb-2">
                Upload your resume for AI analysis
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 5MB)</p>
            </label>
          </div>

          {file && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm flex-1 font-medium">{file.name}</span>
              {scanComplete && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          )}

          {file && !scanComplete && !isScanning && (
            <Button onClick={simulateAIScan} className="w-full" variant="hero" size="lg">
              <Brain className="h-5 w-5 mr-2" />
              Start AI Analysis
            </Button>
          )}

          {isScanning && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse text-blue-500" />
                  AI Analysis in Progress...
                </span>
                <span className="font-medium">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-3" />
              <div className="text-xs text-muted-foreground text-center">
                Extracting skills, experience, and qualifications...
              </div>
            </div>
          )}

          {scanComplete && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Eligibility Score
                  </span>
                  <span className="text-3xl font-bold">{aiScore}%</span>
                </div>
                <p className="text-sm opacity-90">
                  {aiScore >= 90 ? "Outstanding candidate!" : 
                   aiScore >= 80 ? "Excellent match!" : 
                   aiScore >= 70 ? "Good match!" : "Potential candidate"}
                </p>
              </div>

              {/* Extracted Keywords */}
              <div className="bg-gradient-card p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Identified Skills & Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {extractedKeywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Job Recommendations */}
      {scanComplete && recommendations.length > 0 && (
        <Card className="p-6 border-border/50 shadow-soft">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Recommended Positions Based on Your Profile
          </h3>
          <div className="space-y-4">
            {recommendations.map((job, idx) => (
              <div key={idx} className="p-4 border border-border rounded-lg bg-gradient-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{job.title}</h4>
                    <p className="text-muted-foreground">{job.department}</p>
                  </div>
                  <Badge className={`${job.match >= 90 ? 'bg-green-500' : job.match >= 80 ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}>
                    {job.match}% Match
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Matching Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.matchingKeywords.map((keyword: string, kidx: number) => (
                      <Badge key={kidx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
