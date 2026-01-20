import React, { useState } from 'react';
import { TrendingUp, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

export default function StrategiesDetail({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      let result;
      if (profile?.id) {
        result = await base44.entities.TeacherProfile.update(profile.id, formData);
      } else {
        result = await base44.entities.TeacherProfile.create(formData);
      }
      onUpdate(result);
      alert('تم الحفظ بنجاح');
    } catch (error) {
      console.error('Error saving strategies:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          استراتيجيات التدريس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>الخطط العلاجية المطبقة</Label>
          <Textarea
            value={formData.strategies_remedial || ''}
            onChange={(e) => setFormData({ ...formData, strategies_remedial: e.target.value })}
            rows={5}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="w-4 h-4 ml-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
      </CardContent>
    </Card>
  );
}