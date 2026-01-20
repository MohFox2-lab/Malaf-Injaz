import React from 'react';
import { FileText, ExternalLink, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EvidenceList({ evidences, onDelete }) {
  const getIcon = (type) => {
    switch(type) {
      case 'صورة': return '🖼️';
      case 'ملف PDF': return '📄';
      case 'رابط': return '🔗';
      case 'فيديو': return '🎥';
      case 'QR Code': return '📱';
      default: return '📝';
    }
  };

  return (
    <div className="grid gap-4">
      {evidences.map((evidence) => (
        <div
          key={evidence.id}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getIcon(evidence.evidence_type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{evidence.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {evidence.date ? new Date(evidence.date).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {evidence.evidence_type}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {evidence.description && (
                <p className="text-sm text-gray-600 mb-3">{evidence.description}</p>
              )}
              
              {evidence.tags && evidence.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {evidence.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 ml-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {evidence.notes && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 {evidence.notes}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {evidence.file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(evidence.file_url, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  فتح
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(evidence.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}