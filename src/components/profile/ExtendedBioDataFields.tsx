import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props { control: Control<any>; }

const ExtendedBioDataFields = ({ control }: Props) => (
  <>
    <FormField
      control={control}
      name="middleName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Middle Name</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="nationality"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nationality</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="placeOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Place of Birth</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="religion"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Religion</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder="Select religion" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
              <SelectItem value="ISLAM">Islam</SelectItem>
              <SelectItem value="TRADITIONAL">Traditional</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="maritalStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Marital Status</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="MARRIED">Married</SelectItem>
              <SelectItem value="DIVORCED">Divorced</SelectItem>
              <SelectItem value="WIDOWED">Widowed</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default ExtendedBioDataFields;