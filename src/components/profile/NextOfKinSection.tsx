
import React from 'react';
import { Users } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Control } from 'react-hook-form';

interface NextOfKinSectionProps {
  control: Control<any>;
  openSection: boolean;
  onToggleSection: () => void;
}

const NextOfKinSection = ({
  control,
  openSection,
  onToggleSection
}: NextOfKinSectionProps) => {
  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-800" />
          <h2 className="font-semibold text-blue-800">NEXT OF KIN & SPONSOR</h2>
        </div>
        <span>{openSection ? "▲" : "▼"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">
        <div className="bg-white p-6 rounded-md border shadow-sm">
          <Tabs defaultValue="next-of-kin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="next-of-kin">Next of Kin</TabsTrigger>
              <TabsTrigger value="sponsor">Sponsor</TabsTrigger>
            </TabsList>
            <TabsContent value="next-of-kin" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Next of Kin Full Name */}
                <FormField
                  control={control}
                  name="nextOfKinName"
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

                {/* Next of Kin Relationship */}
                <FormField
                  control={control}
                  name="nextOfKinRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Uncle/Aunt">Uncle/Aunt</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Next of Kin Phone */}
                <FormField
                  control={control}
                  name="nextOfKinPhone"
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

                {/* Next of Kin Email */}
                <FormField
                  control={control}
                  name="nextOfKinEmail"
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

                {/* Next of Kin Address */}
                <FormField
                  control={control}
                  name="nextOfKinAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Contact Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="sponsor" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sponsor Full Name */}
                <FormField
                  control={control}
                  name="sponsorName"
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

                {/* Sponsor Relationship */}
                <FormField
                  control={control}
                  name="sponsorRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Self">Self-sponsored</SelectItem>
                          <SelectItem value="Organization">Organization</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sponsor Phone */}
                <FormField
                  control={control}
                  name="sponsorPhone"
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

                {/* Sponsor Email */}
                <FormField
                  control={control}
                  name="sponsorEmail"
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

                {/* Sponsor Address */}
                <FormField
                  control={control}
                  name="sponsorAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Contact Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NextOfKinSection;
