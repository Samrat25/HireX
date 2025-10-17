// Test data utilities for development
import { dataManager } from '@/lib/dataManager';

export const createSampleData = () => {
  // Create sample jobs if none exist
  const existingJobs = dataManager.getJobs();
  
  if (existingJobs.length === 0) {
    const sampleJobs = [
      {
        title: "Professor of Computer Science",
        department: "Computer Science",
        salary: "$80,000 - $120,000",
        deadline: "2025-12-15",
        requirements: "PhD in Computer Science, 5+ years teaching experience, Research publications",
        description: "Lead computer science curriculum development and conduct cutting-edge research in AI and machine learning.",
        status: 'Active' as const
      },
      {
        title: "Associate Professor - Mathematics",
        department: "Mathematics", 
        salary: "$70,000 - $100,000",
        deadline: "2025-12-20",
        requirements: "PhD in Mathematics, 3+ years experience, Strong analytical skills",
        description: "Teach undergraduate and graduate mathematics courses with focus on applied mathematics.",
        status: 'Active' as const
      },
      {
        title: "Research Associate - Physics",
        department: "Physics",
        salary: "$60,000 - $80,000", 
        deadline: "2025-12-30",
        requirements: "PhD in Physics, Research experience, Lab management skills",
        description: "Conduct research in quantum physics and mentor graduate students.",
        status: 'Active' as const
      }
    ];

    sampleJobs.forEach(job => {
      dataManager.createJob(job);
    });

    console.log('Sample jobs created successfully!');
  }
};

export const clearAllData = () => {
  dataManager.clearAllData();
  console.log('All data cleared!');
};

// Auto-create sample data in development
if (process.env.NODE_ENV === 'development') {
  createSampleData();
}