import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RemedialDetail({ profile, onUpdate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          الخطط العلاجية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">قيد الإنشاء...</p>
      </CardContent>
    </Card>
  );
}