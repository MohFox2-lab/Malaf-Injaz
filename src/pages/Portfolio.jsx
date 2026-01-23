import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { FileText, Award, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Portfolio() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.TeacherProfile.list();
      return profiles[0];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك في ملف الإنجاز المهني</h2>
        <p className="text-gray-600 mb-6">لم يتم إنشاء ملفك الشخصي بعد</p>
        <Button 
          onClick={() => navigate('/Profile')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          إنشاء الملف الشخصي
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          مرحباً {profile.full_name || 'بك'}
        </h1>
        <p className="text-emerald-50 text-lg">
          {profile.specialization && `${profile.specialization} - `}
          {profile.school || 'معلم مبدع'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <FileText className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-2xl font-bold text-blue-900">
              {profile.experience_years || 0}
            </p>
            <p className="text-sm text-blue-700">سنوات الخبرة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <Award className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-2xl font-bold text-purple-900">
              {profile.qualifications_list?.length || 0}
            </p>
            <p className="text-sm text-purple-700">المؤهلات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <BookOpen className="w-8 h-8 text-amber-600 mb-3" />
            <p className="text-2xl font-bold text-amber-900">
              {profile.stage || 'متعددة'}
            </p>
            <p className="text-sm text-amber-700">المرحلة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
            <p className="text-2xl font-bold text-emerald-900">متميز</p>
            <p className="text-sm text-emerald-700">الأداء</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/Profile')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">الملف الشخصي</h3>
                <p className="text-sm text-gray-600">البيانات الأساسية والسيرة الذاتية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/Evidences')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">بنك الشواهد</h3>
                <p className="text-sm text-gray-600">الشهادات والملفات والوثائق</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}