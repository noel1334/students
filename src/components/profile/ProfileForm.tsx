import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import BioDataSection from '@/components/profile/BioDataSection';
import AdmissionSection from '@/components/profile/AdmissionSection';
import MedicalRecordSection from '@/components/profile/MedicalRecordSection';
import NextOfKinSection from '@/components/profile/NextOfKinSection';
import ParentsSection from '@/components/profile/ParentsSection';
import SignatureUploadSection from '@/components/profile/SignatureUploadSection';
import ReviewFormModal from '@/components/profile/ReviewFormModal';
import ProfileFormActions from '@/components/profile/ProfileFormActions';

// Define all possible section names
type SectionName = 'bioData' | 'admission' | 'medicalRecord' | 'nextOfKin' | 'parents' | 'signatureUpload';

interface ProfileFormProps {
  studentInfo: {
    name: string;
    regNo: string;
    department: string;
    program: string;
    level: string;
    email: string;
    phone: string;
    session: string;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ studentInfo }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionName>('bioData');
  const [signature, setSignature] = useState<string | null>(null);
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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

        <ProfileFormActions />
      </form>

      {/* Review Modal */}
      <ReviewFormModal
        formData={methods.getValues()}
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        onConfirm={handleFinalSubmit}
      />
    </FormProvider>
  );
};

export default ProfileForm;
