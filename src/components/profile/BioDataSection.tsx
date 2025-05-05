
import React from 'react';
import { Control } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PersonalInfoFields from './bio-data/PersonalInfoFields';
import LocationFields from './bio-data/LocationFields';
import ContactFields from './bio-data/ContactFields';
import AdditionalInfoFields from './bio-data/AdditionalInfoFields';

interface BioDataSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
  selectedCountry: string | null;
  setSelectedCountry: (value: string | null) => void;
  selectedState: string | null;
  setSelectedState: (value: string | null) => void;
}

const BioDataSection = ({
  control,
  openSection,
  onToggleSection,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState
}: BioDataSectionProps) => {
  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
        <h2 className="font-semibold text-blue-800">BIO-DATA</h2>
        <span>{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information Fields */}
          <PersonalInfoFields control={control} />
          
          {/* Location Fields */}
          <LocationFields 
            control={control}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />
          
          {/* Contact Fields */}
          <ContactFields control={control} />
          
          {/* Additional Information Fields */}
          <AdditionalInfoFields control={control} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BioDataSection;
