
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';

interface AdditionalInfoFieldsProps {
  control: Control<any>;
}

const AdditionalInfoFields = ({ control }: AdditionalInfoFieldsProps) => {
  return (
    <>
      {/* Hobbies */}
      <FormField
        control={control}
        name="hobbies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hobbies</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Games */}
      <FormField
        control={control}
        name="games"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Games</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Religion */}
      <FormField
        control={control}
        name="religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Religion</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Christianity">Christianity</SelectItem>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Judaism">Judaism</SelectItem>
                <SelectItem value="Hinduism">Hinduism</SelectItem>
                <SelectItem value="Buddhism">Buddhism</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* National Identification Number */}
      <FormField
        control={control}
        name="nin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>National Identification Number (NIN)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* JAMB Registration Number */}
      <FormField
        control={control}
        name="jambRegNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jamb Registration Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reg Number - Read Only */}
      <FormField
        control={control}
        name="regNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-gray-100" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AdditionalInfoFields;
