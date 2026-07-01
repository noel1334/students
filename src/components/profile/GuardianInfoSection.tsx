import React from 'react';
import { Users } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const GuardianInfoSection = ({ control, openSection, onToggleSection }: Props) => (
  <Collapsible open={openSection} onOpenChange={onToggleSection} className="w-full">
    <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
      <div className="flex items-center">
        <Users className="h-5 w-5 mr-2 text-accent-foreground" />
        <h2 className="font-semibold text-accent-foreground">GUARDIAN INFORMATION</h2>
      </div>
      <span className="text-accent-foreground">{openSection ? '▲' : '▼'}</span>
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-4 px-1">
      <div className="bg-card p-6 rounded-md border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={control} name="guardianFullName" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="guardianRelationship" render={({ field }) => (
            <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="guardianPhoneInfo" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="guardianEmail" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="guardianOccupation" render={({ field }) => (
            <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="guardianAddress" render={({ field }) => (
            <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default GuardianInfoSection;