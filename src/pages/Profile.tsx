import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';
import BioDataSection from '@/components/profile/BioDataSection';
import AdmissionSection from '@/components/profile/AdmissionSection';
import MedicalRecordSection from '@/components/profile/MedicalRecordSection';
import NextOfKinSection from '@/components/profile/NextOfKinSection';
import ParentsSection from '@/components/profile/ParentsSection';
import SignatureUploadSection from '@/components/profile/SignatureUploadSection';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ReviewFormModal from '@/components/profile/ReviewFormModal';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define all possible section names
type SectionName = 'bioData' | 'admission' | 'medicalRecord' | 'nextOfKin' | 'parents' | 'signatureUpload';

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionName>('bioData');
  const [signature, setSignature] = useState<string | null>(null);
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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
  const methods = useForm({
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

  // Open review modal with current form data
  const handleReviewForm = () => {
    setReviewModalOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: any) => {
    handleReviewForm(); // Open the review modal instead of submitting right away
  };

  // Final submission after review
  const handleFinalSubmit = () => {
    const data = methods.getValues();
    console.log("Form submitted:", data);
    toast.success("Profile information updated successfully");
    setReviewModalOpen(false);
    // Here you would typically send this data to your backend API
  };

  // Set active section and collapse others
  const handleSectionToggle = (section: SectionName) => {
    setActiveSection(section === activeSection ? '' as SectionName : section);
  };

  // Check if a section is active/open
  const isSectionOpen = (section: SectionName) => section === activeSection;

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader 
            studentInfo={studentInfo}
            avatar={avatar}
            setAvatar={setAvatar}
          />

          {/* Profile Form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Bio Data Section */}
              <BioDataSection
                control={methods.control}
                openSection={isSectionOpen('bioData')}
                onToggleSection={() => handleSectionToggle('bioData')}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
              />

              {/* Other sections remain unchanged but use the new toggle approach */}
              <AdmissionSection
                control={methods.control}
                openSection={isSectionOpen('admission')}
                onToggleSection={() => handleSectionToggle('admission')}
              />

              <MedicalRecordSection
                control={methods.control}
                openSection={isSectionOpen('medicalRecord')}
                onToggleSection={() => handleSectionToggle('medicalRecord')}
                medicalDocuments={medicalDocuments}
                setMedicalDocuments={setMedicalDocuments}
              />

              <NextOfKinSection
                control={methods.control}
                openSection={isSectionOpen('nextOfKin')}
                onToggleSection={() => handleSectionToggle('nextOfKin')}
              />

              <ParentsSection
                control={methods.control}
                openSection={isSectionOpen('parents')}
                onToggleSection={() => handleSectionToggle('parents')}
              />

              <SignatureUploadSection
                openSection={isSectionOpen('signatureUpload')}
                onToggleSection={() => handleSectionToggle('signatureUpload')}
                signature={signature}
                setSignature={setSignature}
              />

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Eye className="mr-2" size={18} />
                  Review and Update
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Print Profile Records
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Print Medical Records
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>

          {/* Review Modal */}
          <ReviewFormModal
            formData={methods.getValues()}
            open={reviewModalOpen}
            onOpenChange={setReviewModalOpen}
            onConfirm={handleFinalSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
