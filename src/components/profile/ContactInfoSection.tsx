import React from 'react';
import { MapPin } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const ContactInfoSection = ({ control, openSection, onToggleSection }: Props) => (
  <Collapsible open={openSection} onOpenChange={onToggleSection} className="w-full">
    <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
      <div className="flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-accent-foreground" />
        <h2 className="font-semibold text-accent-foreground">CONTACT / RESIDENTIAL INFO</h2>
      </div>
      <span className="text-accent-foreground">{openSection ? '▲' : '▼'}</span>
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-4 px-1">
      <div className="bg-card p-6 rounded-md border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={control} name="countryOfResidence" render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Residence</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="stateOfResidence" render={({ field }) => (
            <FormItem>
              <FormLabel>State of Residence</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="lgaOfResidence" render={({ field }) => (
            <FormItem>
              <FormLabel>LGA of Residence</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="residentialAddress" render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Residential Address</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default ContactInfoSection;