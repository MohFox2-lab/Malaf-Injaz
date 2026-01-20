import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Briefcase, User, BookOpen, Target, Award, FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileDetail from '@/components/portfolio/ProfileDetail';
import PhilosophyDetail from '@/components/portfolio/PhilosophyDetail';
import PlanningDetail from '@/components/portfolio/PlanningDetail';
import StrategiesDetail from '@/components/portfolio/StrategiesDetail';
import AssessmentDetail from '@/components/portfolio/AssessmentDetail';
import RemedialDetail from '@/components/portfolio/RemedialDetail';
import InitiativeDetail from '@/components/portfolio/InitiativeDetail';
import EvidencesDetail from '@/components/portfolio/EvidencesDetail';

const portfolioSections = [
  { key: 'profile', label: 'البيانات الشخصية', icon: User, component: ProfileDetail },
  { key: 'philosophy', label: 'الفلسفة التعليمية', icon: Target, component: PhilosophyDetail },
  { key: 'planning', label: 'التخطيط والتحضير', icon: BookOpen, component: PlanningDetail },
  { key: 'strategies', label: 'استراتيجيات التدريس', icon: TrendingUp, component: StrategiesDetail },
  { key: 'assessment', label: 'التقويم والقياس', icon: FileText, component: AssessmentDetail },
  { key: 'remedial', label: 'الخطط العلاجية', icon: Users, component: RemedialDetail },
  { key: 'initiative', label: 'المبادرات', icon: Award, component: InitiativeDetail },
  { key: 'evidences', label: 'الشواهد', icon: Calendar, component: EvidencesDetail },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.TeacherProfile.list();
      return profiles[0] || null;
    },
  });

  const handleProfileUpdate = (updatedProfile) => {
    queryClient.setQueryData(['teacherProfile'], updatedProfile);
  };

  const ActiveComponent = portfolioSections.find(s => s.key === activeTab)?.component;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">الملف الإنجازي الإلكتروني</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg flex-wrap h-auto gap-2">
            {portfolioSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {portfolioSections.map((section) => (
            <TabsContent key={section.key} value={section.key} className="mt-6">
              {ActiveComponent && (
                <ActiveComponent 
                  profile={profile} 
                  onUpdate={handleProfileUpdate}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}