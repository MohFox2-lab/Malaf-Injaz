import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Plus, Trash2, ExternalLink, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import EvidenceList from './EvidenceList';
import EvidenceForm from './EvidenceForm';

export default function EvidencesDetail({ profile, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: evidences = [], isLoading } = useQuery({
    queryKey: ['evidences', 'evidences'],
    queryFn: () => base44.entities.Evidence.filter({ section_key: 'evidences' }),
  });

  const handleDeleteEvidence = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الشاهد؟')) {
      await base44.entities.Evidence.delete(id);
      queryClient.invalidateQueries(['evidences', 'evidences']);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries(['evidences', 'evidences']);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            بنك الشواهد والملفات
          </h3>
          <p className="text-gray-500 mt-1">
            قم برفع جميع الشواهد والملفات والدورات والوثائق المهمة في مكان واحد
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة شاهد
        </Button>
      </div>

      {/* Introduction Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">💡 نصائح لإدارة الشواهد</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>قم برفع شهادات الدورات التدريبية وورش العمل التي حصلت عليها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>أضف وثائق التقدير والشكر والمشاركات المتميزة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>احفظ نسخ من الخطط والاستراتيجيات المطبقة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>نظم الشواهد باستخدام الوسوم لسهولة الوصول إليها</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Types Guide */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
        >
          <Award className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-blue-900 mb-1">شهادات ودورات</h4>
          <p className="text-sm text-blue-700">
            شهادات التطوير المهني والدورات التدريبية المعتمدة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
        >
          <FileText className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-purple-900 mb-1">مستندات وخطط</h4>
          <p className="text-sm text-purple-700">
            الخطط الدراسية، التحاضير، المشاريع التعليمية
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200"
        >
          <Upload className="w-8 h-8 text-amber-600 mb-3" />
          <h4 className="font-semibold text-amber-900 mb-1">شواهد متنوعة</h4>
          <p className="text-sm text-amber-700">
            صور، فيديوهات، روابط، تقارير، أي وثائق إضافية
          </p>
        </motion.div>
      </div>

      {/* Evidence List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>الشواهد المرفوعة ({evidences.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : evidences.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">لم يتم رفع أي شواهد بعد</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                ابدأ برفع الشواهد
              </Button>
            </div>
          ) : (
            <EvidenceList 
              evidences={evidences} 
              onDelete={handleDeleteEvidence}
            />
          )}
        </CardContent>
      </Card>

      {/* Evidence Form Modal */}
      <EvidenceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        sectionKey="evidences"
        sectionName="شواهد"
        onSuccess={handleSuccess}
      />
    </div>
  );
}