import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShiftTypes } from '@/hooks/useShiftTypes';
import { Tag } from 'lucide-react';

interface ShiftTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ShiftTypeSelect: React.FC<ShiftTypeSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select type',
  disabled = false,
}) => {
  const { shiftTypes, customShiftTypes } = useShiftTypes();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Default types */}
        {shiftTypes
          .filter((t) => !t.isCustom)
          .map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        
        {/* Custom types with separator */}
        {customShiftTypes.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
              Custom Types
            </div>
            {customShiftTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};
