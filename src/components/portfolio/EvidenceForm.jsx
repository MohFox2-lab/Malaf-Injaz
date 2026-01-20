import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function EvidenceForm({ isOpen, onClose, sectionKey, sectionName, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    evidence_type: 'صورة',
    file_url: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, file_url });
    } catch (error) {
      alert('فشل رفع الملف: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const evidenceData = {
        ...formData,
        section_key: sectionKey,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      await base44.entities.Evidence.create(evidenceData);
      onSuccess();
      setFormData({
        title: '',
        description: '',
        evidence_type: 'صورة',
        file_url: '',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        notes: ''
      });
    } catch (error) {
      alert('فشل حفظ الشاهد: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">إضافة شاهد جديد - {sectionName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label>عنوان الشاهد *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: شهادة دورة التعلم النشط"
              required
            />
          </div>

          <div>
            <Label>نوع الشاهد *</Label>
            <Select 
              value={formData.evidence_type}
              onValueChange={(value) => setFormData({ ...formData, evidence_type: value })}
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
            <Label>الوصف</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف مختصر للشاهد..."
              rows={3}
            />
          </div>

          <div>
            <Label>رفع ملف أو إدخال رابط</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="flex-1"
                disabled={uploading}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="أو أدخل رابط"
                className="flex-1"
              />
            </div>
            {uploading && <p className="text-sm text-gray-500 mt-2">جاري الرفع...</p>}
          </div>

          <div>
            <Label>التاريخ</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label>الوسوم (افصل بينها بفاصلة)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="مثال: دورة تدريبية, تطوير مهني, شهادة"
            />
          </div>

          <div>
            <Label>ملاحظات إضافية</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات أو تفاصيل إضافية..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={saving || !formData.title}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الشاهد'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}