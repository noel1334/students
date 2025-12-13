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
import { updateStudentProfile, StudentProfileData } from '@/services/studentServicesApi';

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
  studentData: StudentProfileData;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ studentInfo, studentData }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionName>('bioData');
  const [signature, setSignature] = useState<string | null>(studentData.studentDetails?.signatureImg || null);
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split name into parts
  const nameParts = studentData.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';
  const otherName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  // Initialize the form with actual student data
  const methods = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      otherName: otherName,
      email: studentData.email || '',
      regNo: studentData.regNo || '',
      dateOfBirth: studentData.studentDetails?.dob ? new Date(studentData.studentDetails.dob).toISOString().split('T')[0] : '',
      gender: studentData.studentDetails?.gender || '',
      country: '',
      state: '',
      lga: '',
      placeOfBirth: '',
      maritalStatus: '',
      phoneNumber: studentData.studentDetails?.phone || '',
      homeEmailAddress: '',
      maidenName: '',
      permanentHomeAddress: studentData.studentDetails?.address || '',
      contactAddress: studentData.studentDetails?.address || '',
      contactTelephone: studentData.studentDetails?.phone || '',
      hall: '',
      room: '',
      hobbies: '',
      games: '',
      religion: '',
      nin: '',
      jambRegNumber: studentData.jambRegNo || '',
      // Admission details (read-only)
      admissionMode: studentData.entryMode || '',
      yearOfEntry: studentData.yearOfAdmission?.toString() || '',
      currentLevel: studentData.currentLevel?.name || '',
      yearOfGraduation: '',
      admissionNumber: studentData.regNo || '',
      // Medical Records
      bloodGroup: '',
      genotype: '',
      allergies: '',
      chronicConditions: '',
      disabilities: '',
      // Next of Kin
      nextOfKinName: '',
      nextOfKinRelation: '',
      nextOfKinPhone: '',
      nextOfKinAddress: '',
      nextOfKinEmail: '',
      // Sponsor (Guardian)
      sponsorName: studentData.studentDetails?.guardianName || '',
      sponsorRelation: '',
      sponsorPhone: studentData.studentDetails?.guardianPhone || '',
      sponsorAddress: '',
      sponsorEmail: '',
      // Parents
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      fatherEmail: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      motherEmail: '',
      parentAddress: '',
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
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = methods.getValues();
      
      // Map form data to API structure (only editable fields)
      const updateData = {
        dob: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        address: formData.permanentHomeAddress || undefined,
        phone: formData.phoneNumber || undefined,
        guardianName: formData.sponsorName || undefined,
        guardianPhone: formData.sponsorPhone || undefined,
        signatureImg: signature || undefined,
      };

      const response = await updateStudentProfile(updateData);
      
      if (response.status === 'success') {
        toast.success("Profile information updated successfully");
        setReviewModalOpen(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
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
        isSubmitting={isSubmitting}
      />
    </FormProvider>
  );
};

export default ProfileForm;
