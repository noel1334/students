import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DashboardHeader from '@/components/DashboardHeader';

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    bioData: true,
    admission: false,
    medicalRecord: false,
    nextOfKin: false,
    parents: false,
    signatureUpload: false
  });

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

  // Student information - in a real app, this would come from an API or context
  const studentInfo = {
    name: "Victor NOEL",
    regNo: "18/50770D/6",
    department: "Science Education",
    program: "Full Time",
    level: "600 Level",
    email: "victor.noel@example.com",
    phone: "+1234567890",
    session: "FIRST SEMESTER, 2024/2025 SESSION"
  };

  // Initialize the form
  const form = useForm({
    defaultValues: {
      firstName: "Victor",
      lastName: "NOEL",
      otherName: "",
      email: studentInfo.email,
      regNo: studentInfo.regNo,
      dateOfBirth: "",
      gender: "Male",
      country: "",
      state: "",
      lga: "",
      placeOfBirth: "",
      maritalStatus: "Single",
      phoneNumber: "07087230641",
      homeEmailAddress: "",
      maidenName: "",
      permanentHomeAddress: "Jankasa",
      contactAddress: "8103490626",
      contactTelephone: "08103490626",
      hall: "",
      room: "",
      hobbies: "",
      games: "",
      religion: "Christian",
      nin: "53840194954",
      jambRegNumber: "89113902JB",
      // Additional fields would be added for medical records, next of kin, etc.
    }
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would typically send this data to your backend API
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle section visibility
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold">My Profile</h1>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{studentInfo.session}</span>
            </div>
          </div>

          {/* Profile Header Section with Avatar */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-white p-6 flex flex-col items-center">
                <div className="relative mb-3 group">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    {avatar ? (
                      <AvatarImage src={avatar} alt={studentInfo.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {studentInfo.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label 
                      htmlFor="avatar-upload" 
                      className="bg-primary text-white rounded-full p-2 cursor-pointer"
                    >
                      Upload
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold">{studentInfo.name}</h2>
                <p className="text-sm text-muted-foreground">{studentInfo.regNo}</p>
                
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.program}</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.department}</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs">{studentInfo.level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Bio Data Section */}
              <Collapsible
                open={openSections.bioData}
                onOpenChange={() => toggleSection('bioData')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">BIO-DATA</h2>
                  <span>{openSections.bioData ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email - Read Only */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly className="bg-gray-100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Other Name */}
                    <FormField
                      control={form.control}
                      name="otherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Country */}
                    <FormField
                      control={form.control}
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
                              form.setValue("state", "");
                              form.setValue("lga", "");
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
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State of origin</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedState(value);
                              // Reset lga when state changes
                              form.setValue("lga", "");
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
                      control={form.control}
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
                      control={form.control}
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

                    {/* Marital Status */}
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
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
                      control={form.control}
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

                    {/* Maiden Name */}
                    <FormField
                      control={form.control}
                      name="maidenName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maiden Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Permanent Home Address */}
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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

                    {/* Hobbies */}
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Admission Section */}
              <Collapsible
                open={openSections.admission}
                onOpenChange={() => toggleSection('admission')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">ADMISSION</h2>
                  <span>{openSections.admission ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <p className="text-muted-foreground text-sm">Admission details will appear here</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Medical Record Section */}
              <Collapsible
                open={openSections.medicalRecord}
                onOpenChange={() => toggleSection('medicalRecord')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">MEDICAL RECORD</h2>
                  <span>{openSections.medicalRecord ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <p className="text-muted-foreground text-sm">Medical records will appear here</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Next of Kin Section */}
              <Collapsible
                open={openSections.nextOfKin}
                onOpenChange={() => toggleSection('nextOfKin')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">NEXT OF KIN & SPONSOR</h2>
                  <span>{openSections.nextOfKin ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <p className="text-muted-foreground text-sm">Next of kin details will appear here</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Parents Section */}
              <Collapsible
                open={openSections.parents}
                onOpenChange={() => toggleSection('parents')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">PARENTS</h2>
                  <span>{openSections.parents ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <p className="text-muted-foreground text-sm">Parents details will appear here</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Signature Upload Section */}
              <Collapsible
                open={openSections.signatureUpload}
                onOpenChange={() => toggleSection('signatureUpload')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <h2 className="font-semibold text-blue-800">SIGNATURE UPLOAD</h2>
                  <span>{openSections.signatureUpload ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <p className="text-muted-foreground text-sm">Signature upload controls will appear here</p>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Print Profile Records
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Print Medical Records
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Profile;
