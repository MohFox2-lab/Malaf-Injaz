import React from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReportBuilder({ entitySchema, filters, onFiltersChange }) {
  if (!entitySchema) return null;

  const handleFilterChange = (fieldName, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [fieldName]: value || undefined
    }));
  };

  const getFieldInput = (fieldName, fieldSchema) => {
    // Handle enum fields
    if (fieldSchema.enum) {
      return (
        <Select
          value={filters[fieldName] || ''}
          onValueChange={(value) => handleFilterChange(fieldName, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>الكل</SelectItem>
            {fieldSchema.enum.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Handle different field types
    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.format === 'date') {
          return (
            <Input
              type="date"
              value={filters[fieldName] || ''}
              onChange={(e) => handleFilterChange(fieldName, e.target.value)}
            />
          );
        }
        return (
          <Input
            type="text"
            value={filters[fieldName] || ''}
            onChange={(e) => handleFilterChange(fieldName, e.target.value)}
            placeholder="ابحث..."
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={filters[fieldName] || ''}
            onChange={(e) => handleFilterChange(fieldName, e.target.value)}
            placeholder="أدخل رقم..."
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={filters[fieldName] || ''}
            onChange={(e) => handleFilterChange(fieldName, e.target.value)}
            placeholder="ابحث..."
          />
        );
    }
  };

  const filterableFields = Object.entries(entitySchema.properties || {})
    .filter(([_, schema]) => 
      schema.type === 'string' || 
      schema.type === 'number' || 
      schema.enum
    )
    .slice(0, 5); // Limit to first 5 fields

  if (filterableFields.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-purple-600" />
          عوامل التصفية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filterableFields.map(([fieldName, fieldSchema]) => (
          <div key={fieldName} className="space-y-2">
            <Label className="text-sm">
              {fieldSchema.description || fieldName}
            </Label>
            {getFieldInput(fieldName, fieldSchema)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}