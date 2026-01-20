import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

export default function ReportExport({ data, selectedFields, entityName, entitySchema }) {
  const [exporting, setExporting] = useState(false);

  const formatValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  const getFieldLabel = (fieldName) => {
    // Built-in fields
    const builtInFields = {
      id: 'المعرف',
      created_date: 'تاريخ الإنشاء',
      updated_date: 'تاريخ التحديث',
      created_by: 'المنشئ'
    };
    
    if (builtInFields[fieldName]) return builtInFields[fieldName];
    
    // Schema fields
    return entitySchema?.properties?.[fieldName]?.description || fieldName;
  };

  const exportToCSV = () => {
    setExporting(true);
    try {
      // Create CSV header
      const headers = selectedFields.map(field => getFieldLabel(field)).join(',');
      
      // Create CSV rows
      const rows = data.map(row =>
        selectedFields.map(field => {
          const value = formatValue(row[field]);
          // Escape commas and quotes
          return `"${value.replace(/"/g, '""')}"`;
        }).join(',')
      );

      // Combine header and rows
      const csv = [headers, ...rows].join('\n');

      // Add BOM for proper Arabic display in Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      
      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${entityName}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert('حدث خطأ أثناء التصدير');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF({
        orientation: selectedFields.length > 5 ? 'landscape' : 'portrait'
      });

      // Add Arabic font support (use default for now)
      doc.setFont('helvetica');
      doc.setFontSize(16);

      // Title
      doc.text(entityName || 'Report', 20, 20);
      
      // Date
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString('ar-SA')}`, 20, 30);
      doc.text(`Total Records: ${data.length}`, 20, 35);

      // Table setup
      let y = 50;
      const lineHeight = 8;
      const pageHeight = doc.internal.pageSize.height;
      
      // Column widths (adjust based on number of fields)
      const colWidth = (doc.internal.pageSize.width - 40) / selectedFields.length;

      // Header
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      selectedFields.forEach((field, index) => {
        doc.text(
          getFieldLabel(field).substring(0, 20), 
          20 + (index * colWidth), 
          y
        );
      });
      
      y += lineHeight;
      doc.line(20, y, doc.internal.pageSize.width - 20, y);
      y += 2;

      // Data rows
      doc.setFont('helvetica', 'normal');
      data.forEach((row, rowIndex) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        selectedFields.forEach((field, colIndex) => {
          const value = formatValue(row[field]).substring(0, 30);
          doc.text(value, 20 + (colIndex * colWidth), y);
        });

        y += lineHeight;
      });

      // Save
      doc.save(`${entityName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      alert('حدث خطأ أثناء التصدير');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    setExporting(true);
    try {
      const exportData = data.map(row => {
        const obj = {};
        selectedFields.forEach(field => {
          obj[getFieldLabel(field)] = row[field];
        });
        return obj;
      });

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${entityName}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert('حدث خطأ أثناء التصدير');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="w-5 h-5 text-orange-600" />
          تصدير التقرير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={exportToCSV}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700 gap-2 h-auto py-4 flex-col"
            variant="default"
          >
            <FileSpreadsheet className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">تصدير CSV</div>
              <div className="text-xs opacity-90">للاستخدام مع Excel</div>
            </div>
          </Button>

          <Button
            onClick={exportToPDF}
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 gap-2 h-auto py-4 flex-col"
            variant="default"
          >
            <FileText className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">تصدير PDF</div>
              <div className="text-xs opacity-90">للطباعة والأرشفة</div>
            </div>
          </Button>

          <Button
            onClick={exportToJSON}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-auto py-4 flex-col"
            variant="default"
          >
            <FileText className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">تصدير JSON</div>
              <div className="text-xs opacity-90">للبيانات المنظمة</div>
            </div>
          </Button>
        </div>

        {exporting && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>جاري التصدير...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}