
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ReviewFormModalProps {
  formData: Record<string, any>;
  dirtyFields?: Record<string, boolean>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const ReviewFormModal = ({ formData, dirtyFields, open, onOpenChange, onConfirm, isSubmitting = false }: ReviewFormModalProps) => {
  // Function to format field names from camelCase to readable text
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Group data into sections for better organization
  const sections = {
    "Personal Information": [
      'firstName', 'lastName', 'middleName', 'otherName', 'email', 'regNo',
      'dateOfBirth', 'gender', 'nationality', 'placeOfBirth', 'religion', 'maritalStatus'
    ],
    "Contact Information": [
      'phoneNumber', 'permanentHomeAddress',
      'countryOfResidence', 'stateOfResidence', 'lgaOfResidence', 'residentialAddress'
    ],
    "Admission Details": [
      'admissionMode', 'yearOfEntry', 'currentLevel', 'yearOfGraduation', 'admissionNumber'
    ],
    "Medical Records": [
      'bloodGroup', 'genotype'
    ],
    "Next of Kin": [
      'nokFullName', 'nokRelationship', 'nokPhone', 'nokEmail', 'nokAddress'
    ],
    "Guardian Information": [
      'guardianFullName', 'guardianRelationship', 'guardianPhoneInfo',
      'guardianEmail', 'guardianOccupation', 'guardianAddress'
    ],
    "Sponsor": [
      'sponsorName', 'sponsorPhone'
    ]
  };

  const isDirty = (field: string) => !dirtyFields || !!dirtyFields[field];
  const hasAnyChanges = !dirtyFields || Object.keys(dirtyFields).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Review Your Information</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          {!hasAnyChanges && (
            <p className="text-sm text-muted-foreground mb-4">
              No changes to submit. Close this dialog and edit any field first.
            </p>
          )}
          <Accordion type="single" collapsible className="space-y-4">
            {Object.entries(sections).map(([sectionName, fields]) => {
              const changed = fields.filter(isDirty);
              if (changed.length === 0) return null;
              return (
              <AccordionItem key={sectionName} value={sectionName} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 bg-accent hover:bg-accent/80">
                  <h3 className="text-lg font-semibold text-accent-foreground">
                    {sectionName} <span className="text-xs font-normal opacity-70">({changed.length} changed)</span>
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {changed.map((field) => (
                      <div key={field} className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">{formatFieldName(field)}</span>
                        <span className="text-base">
                          {formData[field] ? String(formData[field]) : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>Back to Edit</Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isSubmitting || !hasAnyChanges}>
            {isSubmitting ? 'Updating...' : 'Confirm Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormModal;
