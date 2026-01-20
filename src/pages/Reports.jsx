import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Filter, Settings2, Table, FileSpreadsheet, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ReportBuilder from '../components/reports/ReportBuilder';
import ReportPreview from '../components/reports/ReportPreview';
import ReportExport from '../components/reports/ReportExport';

export default function ReportsPage() {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Available entities
  const entities = [
    { key: 'TeacherProfile', name: 'البيانات الشخصية', icon: '👤' },
    { key: 'LessonPlan', name: 'خطط الدروس', icon: '📚' },
    { key: 'Certificate', name: 'الشهادات والدورات', icon: '🏆' },
    { key: 'Activity', name: 'الأنشطة', icon: '🎯' },
    { key: 'StudentProgress', name: 'تقدم الطلاب', icon: '📊' },
    { key: 'Evidence', name: 'الشواهد', icon: '📁' },
    { key: 'Report', name: 'التقارير', icon: '📋' },
  ];

  const { data: entitySchema } = useQuery({
    queryKey: ['schema', selectedEntity],
    queryFn: async () => {
      if (!selectedEntity) return null;
      return await base44.entities[selectedEntity].schema();
    },
    enabled: !!selectedEntity,
  });

  const handleEntityChange = (entityKey) => {
    setSelectedEntity(entityKey);
    setSelectedFields([]);
    setFilters({});
    setReportData([]);
    setShowPreview(false);
  };

  const handleFieldToggle = (fieldName) => {
    setSelectedFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  const handleGenerateReport = async () => {
    if (!selectedEntity || selectedFields.length === 0) {
      alert('يرجى اختيار الكيان والحقول أولاً');
      return;
    }

    try {
      const data = await base44.entities[selectedEntity].filter(filters);
      setReportData(data);
      setShowPreview(true);
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء التقرير');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              منشئ التقارير المخصصة
            </h1>
            <p className="text-gray-600 mt-2 mr-14">
              قم بإنشاء تقارير مخصصة من بياناتك مع خيارات تصفية متقدمة وتصدير متعدد التنسيقات
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report Builder - Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings2 className="w-5 h-5 text-blue-600" />
                  إعدادات التقرير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Entity Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">اختر مصدر البيانات</Label>
                  <Select value={selectedEntity} onValueChange={handleEntityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الكيان..." />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map(entity => (
                        <SelectItem key={entity.key} value={entity.key}>
                          <span className="flex items-center gap-2">
                            <span>{entity.icon}</span>
                            <span>{entity.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Field Selection */}
                {entitySchema && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">اختر الحقول المطلوبة</Label>
                    <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {/* Built-in fields */}
                      {['id', 'created_date', 'updated_date', 'created_by'].map(field => (
                        <div key={field} className="flex items-center gap-2">
                          <Checkbox
                            id={field}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={() => handleFieldToggle(field)}
                          />
                          <Label htmlFor={field} className="text-sm cursor-pointer">
                            {field === 'id' && 'المعرف'}
                            {field === 'created_date' && 'تاريخ الإنشاء'}
                            {field === 'updated_date' && 'تاريخ التحديث'}
                            {field === 'created_by' && 'المنشئ'}
                          </Label>
                        </div>
                      ))}
                      
                      {/* Schema fields */}
                      {Object.keys(entitySchema.properties || {}).map(fieldName => (
                        <div key={fieldName} className="flex items-center gap-2">
                          <Checkbox
                            id={fieldName}
                            checked={selectedFields.includes(fieldName)}
                            onCheckedChange={() => handleFieldToggle(fieldName)}
                          />
                          <Label htmlFor={fieldName} className="text-sm cursor-pointer">
                            {entitySchema.properties[fieldName].description || fieldName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateReport}
                  disabled={!selectedEntity || selectedFields.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <FilePlus className="w-4 h-4" />
                  إنشاء التقرير
                </Button>
              </CardContent>
            </Card>

            {/* Filters Card */}
            {selectedEntity && (
              <ReportBuilder
                entitySchema={entitySchema}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}
          </div>

          {/* Report Preview - Right Section */}
          <div className="lg:col-span-2">
            {!showPreview ? (
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12">
                  <div className="p-6 bg-blue-50 rounded-full mb-6">
                    <Table className="w-16 h-16 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    ابدأ بإنشاء تقريرك المخصص
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    اختر مصدر البيانات والحقول المطلوبة من القائمة الجانبية، ثم اضغط على "إنشاء التقرير" لعرض النتائج
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>تصفية متقدمة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>تصدير متعدد</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <ReportPreview
                  data={reportData}
                  selectedFields={selectedFields}
                  entityName={entities.find(e => e.key === selectedEntity)?.name}
                />
                
                <ReportExport
                  data={reportData}
                  selectedFields={selectedFields}
                  entityName={entities.find(e => e.key === selectedEntity)?.name}
                  entitySchema={entitySchema}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}