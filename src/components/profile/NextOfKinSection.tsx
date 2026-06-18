
import React from 'react';
import { Users } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Control } from 'react-hook-form';

interface GuardianSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const NextOfKinSection = ({ control, openSection, onToggleSection }: GuardianSectionProps) => {
  return (
    <Collapsible open={openSection} onOpenChange={onToggleSection} className="w-full">
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-accent-foreground" />
          <h2 className="font-semibold text-accent-foreground">GUARDIAN / SPONSOR</h2>
        </div>
        <span className="text-accent-foreground">{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="bg-card p-6 rounded-md border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="sponsorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="sponsorPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NextOfKinSection;
