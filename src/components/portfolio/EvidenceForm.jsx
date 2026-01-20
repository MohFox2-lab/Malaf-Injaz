import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function EvidenceForm({ isOpen, onClose, sectionKey, sectionName, onSuccess }) {
  const [formData, setFormData] = useState({
    section_key: sectionKey,
    title: '',
    description: '',
    evidence_type: 'صورة',
    file_url: '',
    date: '',
    tags: '',
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, file_url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('حدث خطأ في رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };
      
      await base44.entities.Evidence.create(dataToSave);
      onSuccess();
      setFormData({
        section_key: sectionKey,
        title: '',
        description: '',
        evidence_type: 'صورة',
        file_url: '',
        date: '',
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving evidence:', error);
      alert('حدث خطأ في حفظ الشاهد');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">إضافة شاهد جديد</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label>العنوان *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="مثال: شهادة دورة تطوير المعلمين"
              required
            />
          </div>

          <div>
            <Label>الوصف</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر للشاهد..."
              rows={3}
            />
          </div>

          <div>
            <Label>نوع الشاهد *</Label>
            <Select
              value={formData.evidence_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, evidence_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="صورة">صورة</SelectItem>
                <SelectItem value="ملف PDF">ملف PDF</SelectItem>
                <SelectItem value="رابط">رابط</SelectItem>
                <SelectItem value="فيديو">فيديو</SelectItem>
                <SelectItem value="نص">نص</SelectItem>
                <SelectItem value="QR Code">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>رفع الملف</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'جاري الرفع...' : 'اضغط لرفع ملف'}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {formData.file_url && (
                <p className="text-xs text-emerald-600 mt-2">✓ تم رفع الملف بنجاح</p>
              )}
            </div>
          </div>

          <div>
            <Label>التاريخ</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div>
            <Label>الوسوم (افصل بينها بفواصل)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="مثال: تطوير, قيادة, تقنية"
            />
          </div>

          <div>
            <Label>ملاحظات</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving || !formData.title} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? 'جاري الحفظ...' : 'حفظ الشاهد'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}