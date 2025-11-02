
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ReviewFormModal = ({ formData, open, onOpenChange, onConfirm }: ReviewFormModalProps) => {
  // Function to format field names from camelCase to readable text
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Group data into sections for better organization
  const sections = {
    "Personal Information": [
      'firstName', 'lastName', 'otherName', 'email', 'regNo', 
      'dateOfBirth', 'gender', 'placeOfBirth', 'maritalStatus'
    ],
    "Location": [
      'country', 'state', 'lga'
    ],
    "Contact Information": [
      'phoneNumber', 'homeEmailAddress', 'permanentHomeAddress', 
      'contactAddress', 'contactTelephone', 'hall', 'room'
    ],
    "Additional Information": [
      'hobbies', 'games', 'religion', 'nin', 'jambRegNumber', 'maidenName'
    ],
    "Admission Details": [
      'admissionMode', 'yearOfEntry', 'currentLevel', 'yearOfGraduation', 'admissionNumber'
    ],
    "Medical Records": [
      'bloodGroup', 'genotype', 'allergies', 'chronicConditions', 'disabilities'
    ],
    "Next of Kin": [
      'nextOfKinName', 'nextOfKinRelation', 'nextOfKinPhone', 'nextOfKinAddress', 'nextOfKinEmail'
    ],
    "Sponsor": [
      'sponsorName', 'sponsorRelation', 'sponsorPhone', 'sponsorAddress', 'sponsorEmail'
    ],
    "Parents": [
      'fatherName', 'fatherOccupation', 'fatherPhone', 'fatherEmail',
      'motherName', 'motherOccupation', 'motherPhone', 'motherEmail', 'parentAddress'
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Review Your Information</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <Accordion type="single" collapsible className="space-y-4">
            {Object.entries(sections).map(([sectionName, fields]) => (
              <AccordionItem key={sectionName} value={sectionName} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 bg-accent hover:bg-accent/80">
                  <h3 className="text-lg font-semibold text-accent-foreground">{sectionName}</h3>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fields.map((field) => (
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
            ))}
          </Accordion>
        </ScrollArea>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Back to Edit</Button>
          </DialogClose>
          <Button onClick={onConfirm}>Confirm Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormModal;
