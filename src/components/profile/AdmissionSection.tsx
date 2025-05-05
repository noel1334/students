
import React from 'react';
import { FileText } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Control } from 'react-hook-form';

interface AdmissionSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const AdmissionSection = ({
  control,
  openSection,
  onToggleSection
}: AdmissionSectionProps) => {
  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-800" />
          <h2 className="font-semibold text-blue-800">ADMISSION</h2>
        </div>
        <span>{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="bg-white p-6 rounded-md border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode of Admission */}
            <FormField
              control={control}
              name="admissionMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Admission</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select admission mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTME">UTME</SelectItem>
                      <SelectItem value="Direct Entry">Direct Entry</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                      <SelectItem value="Scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of Entry */}
            <FormField
              control={control}
              name="yearOfEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Entry</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Level */}
            <FormField
              control={control}
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                      <SelectItem value="500">500 Level</SelectItem>
                      <SelectItem value="600">600 Level</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Year of Graduation */}
            <FormField
              control={control}
              name="yearOfGraduation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Year of Graduation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Admission Number */}
            <FormField
              control={control}
              name="admissionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Number</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Admission Document</div>
            <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Admission letter</p>
              <button type="button" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium">
                View Admission Letter
              </button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdmissionSection;
