
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control, useFormContext } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';

interface LocationFieldsProps {
  control: Control<any>;
  selectedCountry: string | null;
  setSelectedCountry: (value: string | null) => void;
  selectedState: string | null;
  setSelectedState: (value: string | null) => void;
}

const LocationFields = ({
  control,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState
}: LocationFieldsProps) => {
  // Get form context to access setValue
  const { setValue } = useFormContext();
  
  // List of countries from the library
  const countries = Country.getAllCountries();
  
  // Get states for selected country
  const states = selectedCountry 
    ? State.getStatesOfCountry(selectedCountry) 
    : [];
  
  // Get cities/LGAs for selected state
  const lgas = (selectedCountry && selectedState) 
    ? City.getCitiesOfState(selectedCountry, selectedState) 
    : [];

  return (
    <>
      {/* Country */}
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedCountry(value);
                // Reset state and lga when country changes
                setSelectedState(null);
                // Use setValue from form context
                setValue("state", "");
                setValue("lga", "");
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State */}
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State of origin</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedState(value);
                // Reset lga when state changes
                // Use setValue from form context
                setValue("lga", "");
              }}
              defaultValue={field.value}
              disabled={!selectedCountry}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* LGA */}
      <FormField
        control={control}
        name="lga"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LGA of origin</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!selectedState}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {lgas.map((lga) => (
                  <SelectItem key={lga.name} value={lga.name}>
                    {lga.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Place of Birth */}
      <FormField
        control={control}
        name="placeOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Place Of Birth</FormLabel>
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

export default LocationFields;
