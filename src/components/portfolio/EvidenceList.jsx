import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, Link as LinkIcon, FileType, QrCode, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  'صورة': Image,
  'ملف PDF': FileType,
  'رابط': LinkIcon,
  'فيديو': Video,
  'نص': FileText,
  'QR Code': QrCode
};

const colorMap = {
  'صورة': 'bg-blue-100 text-blue-700',
  'ملف PDF': 'bg-red-100 text-red-700',
  'رابط': 'bg-green-100 text-green-700',
  'فيديو': 'bg-purple-100 text-purple-700',
  'نص': 'bg-gray-100 text-gray-700',
  'QR Code': 'bg-amber-100 text-amber-700'
};

export default function EvidenceList({ evidences, onDelete }) {
  return (
    <div className="grid gap-4">
      {evidences.map((evidence, index) => {
        const Icon = iconMap[evidence.evidence_type] || FileText;
        const colorClass = colorMap[evidence.evidence_type] || 'bg-gray-100 text-gray-700';
        
        return (
          <motion.div
            key={evidence.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-gray-900">{evidence.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(evidence.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {evidence.description && (
                  <p className="text-sm text-gray-600 mb-3">{evidence.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <Badge variant="outline" className={colorClass}>
                    {evidence.evidence_type}
                  </Badge>
                  
                  {evidence.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(evidence.date).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                  
                  {evidence.tags && evidence.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="w-3 h-3" />
                      {evidence.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {evidence.file_url && (
                  <div className="mt-3">
                    <a
                      href={evidence.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      عرض الملف
                    </a>
                  </div>
                )}
                
                {evidence.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">{evidence.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}