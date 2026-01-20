import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

export default function ProfileDetail({ profile, onUpdate }) {
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
      console.error('Error saving profile:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          البيانات الشخصية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>الاسم الكامل</Label>
          <Input
            value={formData.full_name || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>
        
        <div>
          <Label>التخصص</Label>
          <Input
            value={formData.specialization || ''}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
        </div>

        <div>
          <Label>اسم المدرسة</Label>
          <Input
            value={formData.school || ''}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
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