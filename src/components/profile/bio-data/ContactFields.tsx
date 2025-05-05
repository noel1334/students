
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface ContactFieldsProps {
  control: Control<any>;
}

const ContactFields = ({ control }: ContactFieldsProps) => {
  return (
    <>
      {/* Phone Number */}
      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Home Email Address */}
      <FormField
        control={control}
        name="homeEmailAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Home Email Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Permanent Home Address */}
      <FormField
        control={control}
        name="permanentHomeAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permanent Home Address *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Address */}
      <FormField
        control={control}
        name="contactAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Telephone */}
      <FormField
        control={control}
        name="contactTelephone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Telephone</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hall */}
      <FormField
        control={control}
        name="hall"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Room */}
      <FormField
        control={control}
        name="room"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactFields;
