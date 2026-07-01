
import React from 'react';
import { Control } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PersonalInfoFields from './bio-data/PersonalInfoFields';
import ContactFields from './bio-data/ContactFields';
import ExtendedBioDataFields from './ExtendedBioDataFields';

interface BioDataSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const BioDataSection = ({
  control,
  openSection,
  onToggleSection,
}: BioDataSectionProps) => {
  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
        <h2 className="font-semibold text-accent-foreground">BIO-DATA</h2>
        <span className="text-accent-foreground">{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonalInfoFields control={control} />
          <ExtendedBioDataFields control={control} />
          <ContactFields control={control} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BioDataSection;
