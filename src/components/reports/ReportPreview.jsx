import React from 'react';
import { Table, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReportPreview({ data, selectedFields, entityName }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500">لا توجد بيانات لعرضها</p>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (Array.isArray(value)) return value.length > 0 ? `${value.length} عنصر` : '-';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      // Format date
      return new Date(value).toLocaleDateString('ar-SA');
    }
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5 text-green-600" />
            معاينة التقرير - {entityName}
          </CardTitle>
          <Badge variant="secondary">
            {data.length} سجل
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 border-l">
                  #
                </th>
                {selectedFields.map(field => (
                  <th key={field} className="px-4 py-3 text-right font-semibold text-gray-700 border-l">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 border-l font-medium">
                    {index + 1}
                  </td>
                  {selectedFields.map(field => (
                    <td key={field} className="px-4 py-3 text-gray-800 border-l">
                      {formatValue(row[field])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">إجمالي السجلات:</span> {data.length} سجل
            {' • '}
            <span className="font-semibold">الحقول المعروضة:</span> {selectedFields.length} حقل
          </p>
        </div>
      </CardContent>
    </Card>
  );
}