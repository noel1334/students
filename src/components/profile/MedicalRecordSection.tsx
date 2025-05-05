
import React from 'react';
import { FileCheck, Upload } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Control } from 'react-hook-form';
import { toast } from 'sonner';

interface MedicalRecordSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
  medicalDocuments: File[];
  setMedicalDocuments: React.Dispatch<React.SetStateAction<File[]>>;
}

const MedicalRecordSection = ({
  control,
  openSection,
  onToggleSection,
  medicalDocuments,
  setMedicalDocuments
}: MedicalRecordSectionProps) => {
  
  // Handle medical document upload
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMedicalDocuments(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} document(s) uploaded successfully`);
    }
  };

  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
        <div className="flex items-center">
          <FileCheck className="h-5 w-5 mr-2 text-blue-800" />
          <h2 className="font-semibold text-blue-800">MEDICAL RECORD</h2>
        </div>
        <span>{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="bg-white p-6 rounded-md border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Group */}
            <FormField
              control={control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genotype */}
            <FormField
              control={control}
              name="genotype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genotype</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genotype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AA">AA</SelectItem>
                      <SelectItem value="AS">AS</SelectItem>
                      <SelectItem value="SS">SS</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allergies */}
            <FormField
              control={control}
              name="allergies"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Allergies (if any)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any allergies you have" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chronic Conditions */}
            <FormField
              control={control}
              name="chronicConditions"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Chronic Conditions (if any)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any chronic conditions you have" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Disabilities */}
            <FormField
              control={control}
              name="disabilities"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Disabilities (if any)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any disabilities you have" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Medical Documents</div>
            <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Upload medical reports or certificates</p>
              <label 
                htmlFor="document-upload" 
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium cursor-pointer"
              >
                Upload Document
              </label>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="hidden"
                onChange={handleDocumentChange}
                multiple
              />
            </div>

            {/* Display uploaded documents */}
            {medicalDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Uploaded Documents:</p>
                {medicalDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <FileCheck className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{(doc.size / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MedicalRecordSection;
