import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  const topCandidates = [
    { rank: 1, name: "Dr. Sarah Johnson", score: 92, aiScore: 92, humanScore: 91 },
    { rank: 2, name: "Dr. James Wilson", score: 90, aiScore: 90, humanScore: 89 },
    { rank: 3, name: "Dr. Emily Rodriguez", score: 88, aiScore: 88, humanScore: 88 },
    { rank: 4, name: "Dr. Michael Chen", score: 87, aiScore: 85, humanScore: 89 },
    { rank: 5, name: "Dr. Lisa Anderson", score: 85, aiScore: 87, humanScore: 83 }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-muted-foreground">
                Comprehensive recruitment data and candidate performance metrics
              </p>
            </div>
          </div>
          <Button variant="hero">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-card border-border/50 p-6 shadow-medium">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-3xl font-bold text-primary">248</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 shadow-medium">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-accent">84.3%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 shadow-medium">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-primary">75.4%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 shadow-medium">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Time to Hire</p>
                <p className="text-3xl font-bold text-accent">14d</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Candidate Score Distribution */}
        <Card className="mb-8 border-border/50 p-6 shadow-soft">
          <h3 className="mb-6 text-lg font-semibold">Candidate Score Distribution</h3>
          <div className="space-y-4">
            {[
              { range: "90-100", count: 42, percentage: 17 },
              { range: "80-89", count: 98, percentage: 39 },
              { range: "70-79", count: 73, percentage: 29 },
              { range: "60-69", count: 28, percentage: 11 },
              { range: "Below 60", count: 7, percentage: 3 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{item.range}%</span>
                  <span className="text-muted-foreground">{item.count} candidates ({item.percentage}%)</span>
                </div>
                <div className="h-8 w-full overflow-hidden rounded-lg bg-muted">
                  <div
                    className="h-full bg-gradient-hero transition-smooth"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI vs Human Evaluation Comparison */}
        <Card className="mb-8 border-border/50 p-6 shadow-soft">
          <h3 className="mb-6 text-lg font-semibold">AI vs Human Evaluation Comparison</h3>
          <div className="space-y-4">
            {topCandidates.slice(0, 5).map((candidate) => (
              <div key={candidate.rank}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{candidate.name}</span>
                  <div className="flex gap-4">
                    <span className="text-primary">AI: {candidate.aiScore}%</span>
                    <span className="text-accent">Human: {candidate.humanScore}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-lg bg-muted">
                      <div
                        className="h-full bg-primary transition-smooth"
                        style={{ width: `${candidate.aiScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-lg bg-muted">
                      <div
                        className="h-full bg-accent transition-smooth"
                        style={{ width: `${candidate.humanScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 5 Candidates Leaderboard */}
        <Card className="border-border/50 p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top 5 Candidates Leaderboard</h3>
            <div className="flex gap-2">
              <Badge className="bg-primary">Department: All</Badge>
              <Badge className="bg-accent">Role: All</Badge>
            </div>
          </div>
          <div className="space-y-3">
            {topCandidates.map((candidate) => (
              <div
                key={candidate.rank}
                className="flex items-center justify-between rounded-lg bg-gradient-card p-4 transition-smooth hover:shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">
                    {candidate.rank === 1 ? "🥇" : candidate.rank === 2 ? "🥈" : candidate.rank === 3 ? "🥉" : `#${candidate.rank}`}
                  </span>
                  <div>
                    <p className="font-semibold">{candidate.name}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>AI: {candidate.aiScore}%</span>
                      <span>•</span>
                      <span>Human: {candidate.humanScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{candidate.score}%</p>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline">
              View All Candidates
            </Button>
            <Button variant="default">
              <Download className="h-4 w-4" />
              Export Leaderboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
