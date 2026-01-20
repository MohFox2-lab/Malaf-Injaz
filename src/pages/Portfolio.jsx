import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Briefcase, User, Target, BookOpen, TrendingUp, FileText, Users, Award, Calendar, Folder } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileDetail from '../components/portfolio/ProfileDetail';
import PhilosophyDetail from '../components/portfolio/PhilosophyDetail';
import PlanningDetail from '../components/portfolio/PlanningDetail';
import StrategiesDetail from '../components/portfolio/StrategiesDetail';
import AssessmentDetail from '../components/portfolio/AssessmentDetail';
import RemedialDetail from '../components/portfolio/RemedialDetail';
import InitiativeDetail from '../components/portfolio/InitiativeDetail';
import EvidencesDetail from '../components/portfolio/EvidencesDetail';

const componentMap = {
  'profile': ProfileDetail,
  'philosophy': PhilosophyDetail,
  'planning': PlanningDetail,
  'strategies': StrategiesDetail,
  'assessment': AssessmentDetail,
  'remedial': RemedialDetail,
  'initiative': InitiativeDetail,
  'evidences': EvidencesDetail,
};

const iconMap = {
  'User': User,
  'Target': Target,
  'BookOpen': BookOpen,
  'TrendingUp': TrendingUp,
  'FileText': FileText,
  'Users': Users,
  'Award': Award,
  'Calendar': Calendar,
  'Folder': Folder,
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('');
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['portfolioSections'],
    queryFn: async () => {
      const results = await base44.entities.PortfolioSection.list('order_index');
      return results;
    },
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['teacherProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.TeacherProfile.list();
      return profiles[0] || null;
    },
  });

  React.useEffect(() => {
    if (sections.length > 0 && !activeTab) {
      setActiveTab(sections[0].section_key);
    }
  }, [sections, activeTab]);

  const handleProfileUpdate = (updatedProfile) => {
    queryClient.setQueryData(['teacherProfile'], updatedProfile);
  };

  if (sectionsLoading || profileLoading) {
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

        {sections.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            لا توجد أقسام محددة بعد
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg flex-wrap h-auto gap-2">
              {sections.map((section) => {
                const IconComponent = iconMap[section.icon] || Folder;
                return (
                  <TabsTrigger
                    key={section.section_key}
                    value={section.section_key}
                    className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    <IconComponent className="w-4 h-4" />
                    {section.section_name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {sections.map((section) => {
              const Component = componentMap[section.section_key];
              return (
                <TabsContent key={section.section_key} value={section.section_key} className="mt-6">
                  {Component ? (
                    <Component 
                      profile={profile} 
                      onUpdate={handleProfileUpdate}
                      section={section}
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-6 text-gray-600">
                      {section.description || 'قيد الإنشاء...'}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}