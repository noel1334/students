import React from 'react';
import { UserCheck } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const NextOfKinInfoSection = ({ control, openSection, onToggleSection }: Props) => (
  <Collapsible open={openSection} onOpenChange={onToggleSection} className="w-full">
    <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
      <div className="flex items-center">
        <UserCheck className="h-5 w-5 mr-2 text-accent-foreground" />
        <h2 className="font-semibold text-accent-foreground">NEXT OF KIN</h2>
      </div>
      <span className="text-accent-foreground">{openSection ? '▲' : '▼'}</span>
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-4 px-1">
      <div className="bg-card p-6 rounded-md border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={control} name="nokFullName" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="nokRelationship" render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="PARENT">Parent</SelectItem>
                  <SelectItem value="SIBLING">Sibling</SelectItem>
                  <SelectItem value="SPOUSE">Spouse</SelectItem>
                  <SelectItem value="GUARDIAN">Guardian</SelectItem>
                  <SelectItem value="RELATIVE">Relative</SelectItem>
                  <SelectItem value="FRIEND">Friend</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="nokPhone" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="nokEmail" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="nokAddress" render={({ field }) => (
            <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default NextOfKinInfoSection;