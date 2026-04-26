"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Lock,
  CheckCircle,
  ChevronRight,
  X,
  ChevronLeft,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  coinsReward: number;
  requiredScore: number;
  order: number;
}

interface UserProgress {
  completed: boolean;
  score?: number;
  coinsEarned?: number;
}

export default function EducationPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [literacyScore, setLiteracyScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const coursesRes = await fetch('/api/courses');
      const coursesData = await coursesRes.json();
      setCourses(coursesData);

      const progressRes = await fetch('/api/ai/recommendations');
      const progressData = await progressRes.json();
      setLiteracyScore(progressData.literacyScore || 0);

      const completedRes = await fetch('/api/user/courses');
      if (completedRes.ok) {
        const completedData = await completedRes.json();
        const progressMap: Record<string, UserProgress> = {};
        completedData.forEach((p: any) => {
          progressMap[p.courseId] = { completed: true, score: p.score, coinsEarned: p.coinsEarned };
        });
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Failed to load education data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/complete`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Course Completed! 🎉",
          description: `You earned ${data.coinsEarned} coins and +10% literacy score!`,
        });
        setIsModalOpen(false);
        loadData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to complete course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete course",
        variant: "destructive",
      });
    }
  };

  const isCourseAvailable = (course: Course) => {
    return literacyScore >= course.requiredScore;
  };

  const isCourseCompleted = (courseId: string) => {
    return userProgress[courseId]?.completed || false;
  };

  if (loading) {
    return (
      <DashboardLayout type="agent">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9521C] mx-auto"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="agent">
      <div className="space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E9521C] font-medium text-sm mb-6 group transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E9521C]/10 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-[#E9521C]" />
            Financial Education
          </h1>
          <p className="text-gray-600">
            Complete courses to improve your financial literacy score and earn Nthoppa Coins
          </p>
        </div>

        {/* Literacy Score Card */}
        <Card className="border-gray-200 bg-gradient-to-r from-[#E9521C]/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-black">Your Financial Literacy Score</h3>
                <p className="text-sm text-gray-500">Complete courses to increase your score</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#E9521C]">{literacyScore}%</div>
                  <p className="text-xs text-gray-500">Proficiency Level</p>
                </div>
                <div className="w-32">
                  <Progress value={literacyScore} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const available = isCourseAvailable(course);
            const completed = isCourseCompleted(course.id);
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                  !available ? 'opacity-75 border-gray-200' : 'border-gray-200 hover:shadow-md cursor-pointer'
                }`}
                onClick={() => { 
                  if (available && !completed) { 
                    setSelectedCourse(course); 
                    setIsModalOpen(true); 
                  } 
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${completed ? 'bg-green-100' : 'bg-[#E9521C]/10'}`}>
                    {completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-[#E9521C]" />
                    )}
                  </div>
                  <Badge className="bg-[#E9521C] text-white">+{course.coinsReward} coins</Badge>
                </div>
                
                <h3 className="font-semibold text-black text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                
                <div className="space-y-2">
                  {course.requiredScore > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Required Score:</span>
                      <span className="font-medium">{course.requiredScore}%</span>
                    </div>
                  )}
                  {!available && (
                    <div className="flex items-center gap-2 text-yellow-600 text-xs">
                      <Lock className="h-3 w-3" />
                      <span>Complete easier courses first</span>
                    </div>
                  )}
                  {completed && (
                    <div className="flex items-center gap-2 text-green-600 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      <span>Completed!</span>
                    </div>
                  )}
                  {available && !completed && (
                    <Button className="w-full mt-3 bg-[#E9521C] text-white hover:bg-black">
                      Start Course
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Course Modal */}
      <Dialog open={isModalOpen && !!selectedCourse} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCourse.title}</DialogTitle>
                <DialogDescription>{selectedCourse.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {(() => {
                  try {
                    const content = JSON.parse(selectedCourse.content);
                    return content.lessons?.map((lesson: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-black mb-2">
                          Lesson {idx + 1}: {lesson.title}
                        </h4>
                        <p className="text-sm text-gray-600">{lesson.body || lesson.content}</p>
                      </div>
                    ));
                  } catch (e) {
                    return <p className="text-gray-600">Course content loading...</p>;
                  }
                })()}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bg-[#E9521C] text-white hover:bg-black"
                  onClick={() => completeCourse(selectedCourse.id)}
                >
                  Complete Course & Earn {selectedCourse.coinsReward} Coins
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}