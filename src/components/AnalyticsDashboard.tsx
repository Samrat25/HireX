import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Users, Briefcase, TrendingUp, Award, 
  BarChart3, PieChart as PieChartIcon, Activity
} from "lucide-react";
import { Analytics } from "@/lib/dataManager";

interface AnalyticsDashboardProps {
  analytics: Analytics;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export const AnalyticsDashboard = ({ analytics }: AnalyticsDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{analytics.totalJobs}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Candidates</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{analytics.totalCandidates}</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Average Score</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{analytics.averageScore}%</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{analytics.completionRate}%</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Score Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Candidates' : name]}
                labelFormatter={(label) => `Score Range: ${label}`}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Performance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Department Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.departmentStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, candidates }) => `${department} (${candidates})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="candidates"
              >
                {analytics.departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, 'Candidates']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Applications Trend */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Application Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="applications" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Performers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {analytics.topPerformers.map((candidate, index) => (
              <div key={candidate.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{candidate.overallScore}%</p>
                  <Badge className={
                    candidate.overallScore >= 90 ? "bg-green-500" : 
                    candidate.overallScore >= 80 ? "bg-blue-500" : "bg-yellow-500"
                  }>
                    {candidate.overallScore >= 90 ? "Excellent" : 
                     candidate.overallScore >= 80 ? "Very Good" : "Good"}
                  </Badge>
                </div>
              </div>
            ))}
            {analytics.topPerformers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No candidates available yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Department Statistics Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Department Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Department</th>
                <th className="text-left py-3 px-4 font-semibold">Candidates</th>
                <th className="text-left py-3 px-4 font-semibold">Average Score</th>
                <th className="text-left py-3 px-4 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.departmentStats.map((dept, index) => (
                <tr key={dept.department} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{dept.department}</td>
                  <td className="py-3 px-4">{dept.candidates}</td>
                  <td className="py-3 px-4">{dept.avgScore}%</td>
                  <td className="py-3 px-4">
                    <Badge className={
                      dept.avgScore >= 85 ? "bg-green-500" : 
                      dept.avgScore >= 75 ? "bg-blue-500" : 
                      dept.avgScore >= 65 ? "bg-yellow-500" : "bg-red-500"
                    }>
                      {dept.avgScore >= 85 ? "Excellent" : 
                       dept.avgScore >= 75 ? "Good" : 
                       dept.avgScore >= 65 ? "Average" : "Below Average"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {analytics.departmentStats.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    No department data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};