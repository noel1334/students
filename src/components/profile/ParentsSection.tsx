
import React from 'react';
import { Users } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Control } from 'react-hook-form';

interface ParentsSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const ParentsSection = ({
  control,
  openSection,
  onToggleSection
}: ParentsSectionProps) => {
  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-accent hover:bg-accent/80 transition-colors rounded-md">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-accent-foreground" />
          <h2 className="font-semibold text-accent-foreground">PARENTS</h2>
        </div>
        <span className="text-accent-foreground">{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="bg-card p-6 rounded-md border shadow-sm">
          <Tabs defaultValue="father" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="father">Father's Information</TabsTrigger>
              <TabsTrigger value="mother">Mother's Information</TabsTrigger>
            </TabsList>
            <TabsContent value="father" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Father's Name */}
                <FormField
                  control={control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's Occupation */}
                <FormField
                  control={control}
                  name="fatherOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's Phone */}
                <FormField
                  control={control}
                  name="fatherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Father's Email */}
                <FormField
                  control={control}
                  name="fatherEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="mother" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mother's Name */}
                <FormField
                  control={control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's Occupation */}
                <FormField
                  control={control}
                  name="motherOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's Phone */}
                <FormField
                  control={control}
                  name="motherPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mother's Email */}
                <FormField
                  control={control}
                  name="motherEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Parents' Contact Address */}
          <div className="mt-6">
            <FormField
              control={control}
              name="parentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parents' Contact Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" />
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

export default ParentsSection;
