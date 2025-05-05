import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { Calendar, File, FileText, FileImage, FileCheck, Users, Signature, Upload } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DashboardHeader from '@/components/DashboardHeader';
import { toast } from 'sonner';

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
  const [signature, setSignature] = useState<string | null>(null);
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);

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
      // Admission details
      admissionMode: "UTME",
      yearOfEntry: "2018",
      currentLevel: "600",
      yearOfGraduation: "2024",
      admissionNumber: "18/50770D/6",
      // Medical Records
      bloodGroup: "",
      genotype: "",
      allergies: "",
      chronicConditions: "",
      disabilities: "",
      // Next of Kin
      nextOfKinName: "",
      nextOfKinRelation: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",
      nextOfKinEmail: "",
      // Sponsor
      sponsorName: "",
      sponsorRelation: "",
      sponsorPhone: "",
      sponsorAddress: "",
      sponsorEmail: "",
      // Parents
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      fatherEmail: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      motherEmail: "",
      parentAddress: "",
    }
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    toast.success("Profile information updated successfully");
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

  // Handle signature upload
  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
        toast.success("Signature uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle medical document upload
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMedicalDocuments(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} document(s) uploaded successfully`);
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
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-800" />
                    <h2 className="font-semibold text-blue-800">ADMISSION</h2>
                  </div>
                  <span>{openSections.admission ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <div className="bg-white p-6 rounded-md border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mode of Admission */}
                      <FormField
                        control={form.control}
                        name="admissionMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mode of Admission</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select admission mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UTME">UTME</SelectItem>
                                <SelectItem value="Direct Entry">Direct Entry</SelectItem>
                                <SelectItem value="Transfer">Transfer</SelectItem>
                                <SelectItem value="Scholarship">Scholarship</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Year of Entry */}
                      <FormField
                        control={form.control}
                        name="yearOfEntry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of Entry</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Current Level */}
                      <FormField
                        control={form.control}
                        name="currentLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="100">100 Level</SelectItem>
                                <SelectItem value="200">200 Level</SelectItem>
                                <SelectItem value="300">300 Level</SelectItem>
                                <SelectItem value="400">400 Level</SelectItem>
                                <SelectItem value="500">500 Level</SelectItem>
                                <SelectItem value="600">600 Level</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Expected Year of Graduation */}
                      <FormField
                        control={form.control}
                        name="yearOfGraduation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Year of Graduation</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Admission Number */}
                      <FormField
                        control={form.control}
                        name="admissionNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission Number</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly className="bg-gray-100" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Admission Document</div>
                      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Admission letter</p>
                        <button type="button" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium">
                          View Admission Letter
                        </button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Medical Record Section */}
              <Collapsible
                open={openSections.medicalRecord}
                onOpenChange={() => toggleSection('medicalRecord')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-blue-800" />
                    <h2 className="font-semibold text-blue-800">MEDICAL RECORD</h2>
                  </div>
                  <span>{openSections.medicalRecord ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <div className="bg-white p-6 rounded-md border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Blood Group */}
                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Genotype */}
                      <FormField
                        control={form.control}
                        name="genotype"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genotype</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select genotype" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AA">AA</SelectItem>
                                <SelectItem value="AS">AS</SelectItem>
                                <SelectItem value="SS">SS</SelectItem>
                                <SelectItem value="AC">AC</SelectItem>
                                <SelectItem value="SC">SC</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Allergies */}
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Allergies (if any)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any allergies you have" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Chronic Conditions */}
                      <FormField
                        control={form.control}
                        name="chronicConditions"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Chronic Conditions (if any)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any chronic conditions you have" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Disabilities */}
                      <FormField
                        control={form.control}
                        name="disabilities"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Disabilities (if any)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any disabilities you have" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Medical Documents</div>
                      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Upload medical reports or certificates</p>
                        <label 
                          htmlFor="document-upload" 
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm font-medium cursor-pointer"
                        >
                          Upload Document
                        </label>
                        <input
                          id="document-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          className="hidden"
                          onChange={handleDocumentChange}
                          multiple
                        />
                      </div>

                      {/* Display uploaded documents */}
                      {medicalDocuments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Uploaded Documents:</p>
                          {medicalDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">{(doc.size / 1024).toFixed(2)} KB</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Next of Kin Section */}
              <Collapsible
                open={openSections.nextOfKin}
                onOpenChange={() => toggleSection('nextOfKin')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-800" />
                    <h2 className="font-semibold text-blue-800">NEXT OF KIN & SPONSOR</h2>
                  </div>
                  <span>{openSections.nextOfKin ? "▲" : "▼"}</span>
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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

              {/* Parents Section */}
              <Collapsible
                open={openSections.parents}
                onOpenChange={() => toggleSection('parents')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-800" />
                    <h2 className="font-semibold text-blue-800">PARENTS</h2>
                  </div>
                  <span>{openSections.parents ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <div className="bg-white p-6 rounded-md border shadow-sm">
                    <Tabs defaultValue="father" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="father">Father's Information</TabsTrigger>
                        <TabsTrigger value="mother">Mother's Information</TabsTrigger>
                      </TabsList>
                      <TabsContent value="father" className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Father's Name */}
                          <FormField
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                        control={form.control}
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

              {/* Signature Upload Section */}
              <Collapsible
                open={openSections.signatureUpload}
                onOpenChange={() => toggleSection('signatureUpload')}
                className="w-full"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
                  <div className="flex items-center">
                    <Signature className="h-5 w-5 mr-2 text-blue-800" />
                    <h2 className="font-semibold text-blue-800">SIGNATURE UPLOAD</h2>
                  </div>
                  <span>{openSections.signatureUpload ? "▲" : "▼"}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-1">
                  <div className="bg-white p-6 rounded-md border shadow-sm">
                    <div className="text-center">
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-4">
                          Please upload a clear image of your signature on a white background. 
                          This signature will be used for official documents and verifications.
                        </p>

                        <div className="w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6">
                          {signature ? (
                            <div className="flex flex-col items-center">
                              <div className="mb-4 p-4 bg-white shadow rounded-md">
                                <img 
                                  src={signature} 
                                  alt="Your signature" 
                                  className="h-24 object-contain"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setSignature(null)}
                                className="px-4 py-2 text-red-600 bg-red-50 text-sm font-medium rounded-md hover:bg-red-100"
                              >
                                Remove Signature
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Signature className="h-16 w-16 text-gray-300 mb-4" />
                              <p className="text-sm text-gray-500 mb-4">
                                No signature uploaded yet
                              </p>
                              <label
                                htmlFor="signature-upload"
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 cursor-pointer"
                              >
                                Upload Signature
                              </label>
                              <input
                                id="signature-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleSignatureChange}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p className="mb-2 font-medium">Guidelines for signature upload:</p>
                        <ul className="list-disc text-left pl-6 space-y-1">
                          <li>Sign on a white piece of paper with black or blue ink</li>
                          <li>Ensure the signature is clear and legible</li>
                          <li>Upload in JPG, PNG, or GIF format</li>
                          <li>Maximum file size: 2MB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
