import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import BioDataSection from '@/components/profile/BioDataSection';
import AdmissionSection from '@/components/profile/AdmissionSection';
import MedicalRecordSection from '@/components/profile/MedicalRecordSection';
import NextOfKinSection from '@/components/profile/NextOfKinSection';
import ContactInfoSection from '@/components/profile/ContactInfoSection';
import NextOfKinInfoSection from '@/components/profile/NextOfKinInfoSection';
import GuardianInfoSection from '@/components/profile/GuardianInfoSection';
import ReviewFormModal from '@/components/profile/ReviewFormModal';
import ProfileFormActions from '@/components/profile/ProfileFormActions';
import { StudentProfileData } from '@/services/studentServicesApi';
import { useUpdateStudentProfile } from '@/hooks/useStudentProfile';
import {
  studentProfileSchema,
  StudentProfileFormValues,
  GENDER_VALUES,
  MARITAL_VALUES,
  RELIGION_VALUES,
  BLOOD_GROUP_VALUES,
  GENOTYPE_VALUES,
  RELATIONSHIP_VALUES,
} from '@/lib/validation/studentProfile';

const coerce = <T extends readonly string[]>(v: unknown, allowed: T): T[number] | '' => {
  const s = typeof v === 'string' ? v.toUpperCase() : '';
  return (allowed as readonly string[]).includes(s) ? (s as T[number]) : '';
};

// Define all possible section names
type SectionName = 'bioData' | 'contactInfo' | 'admission' | 'medicalRecord' | 'nextOfKin' | 'guardian' | 'sponsor';

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
  const [activeSection, setActiveSection] = useState<SectionName>('bioData');
  const [medicalDocuments, setMedicalDocuments] = useState<File[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const updateMutation = useUpdateStudentProfile();

  // Split name into parts
  const nameParts = studentData.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';
  const otherName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  // Pull nested applicationProfile sub-models
  const appProfile = studentData.admissionOfferDetails?.applicationProfile;
  const bio = appProfile?.bioData || {};
  const contact = appProfile?.contactInfo || {};
  const nok = appProfile?.nextOfKin || {};
  const guardian = appProfile?.guardianInfo || {};

  // Initialize the form with actual student data
  const methods = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      otherName: bio.middleName || otherName,
      email: studentData.email || '',
      regNo: studentData.regNo || '',
      dateOfBirth: (studentData.studentDetails?.dob || bio.dateOfBirth)
        ? new Date(studentData.studentDetails?.dob || (bio.dateOfBirth as string)).toISOString().split('T')[0]
        : '',
      gender: coerce(studentData.studentDetails?.gender || bio.gender, GENDER_VALUES),
      phoneNumber: studentData.studentDetails?.phone || '',
      permanentHomeAddress: studentData.studentDetails?.address || '',
      // Extended bio-data (applicationProfile.bioData)
      middleName: bio.middleName || '',
      nationality: bio.nationality || '',
      placeOfBirth: bio.placeOfBirth || '',
      religion: coerce(bio.religion, RELIGION_VALUES),
      maritalStatus: coerce(bio.maritalStatus, MARITAL_VALUES),
      // Contact info (applicationProfile.contactInfo)
      countryOfResidence: contact.countryOfResidence || '',
      stateOfResidence: contact.stateOfResidence || '',
      lgaOfResidence: contact.lgaOfResidence || '',
      residentialAddress: contact.residentialAddress || '',
      // Admission details (read-only)
      admissionMode: studentData.entryMode || '',
      yearOfEntry: studentData.yearOfAdmission?.toString() || '',
      currentLevel: studentData.currentLevel?.name || '',
      yearOfGraduation: '',
      admissionNumber: studentData.regNo || '',
      // Medical Records
      bloodGroup: coerce(studentData.medicalFitness?.bloodGroup, BLOOD_GROUP_VALUES),
      genotype: coerce(studentData.medicalFitness?.genotype, GENOTYPE_VALUES),
      // Sponsor (studentDetails.guardianName/Phone - legacy sponsor)
      sponsorName: studentData.studentDetails?.guardianName || '',
      sponsorPhone: studentData.studentDetails?.guardianPhone || '',
      // Next of Kin (applicationProfile.nextOfKin)
      nokFullName: nok.fullName || '',
      nokRelationship: coerce(nok.relationship, RELATIONSHIP_VALUES),
      nokPhone: nok.phone || '',
      nokEmail: nok.email || '',
      nokAddress: nok.address || '',
      // Guardian Info (applicationProfile.guardianInfo)
      guardianFullName: guardian.fullName || '',
      guardianRelationship: coerce(guardian.relationship, RELATIONSHIP_VALUES),
      guardianPhoneInfo: guardian.phone || '',
      guardianEmail: guardian.email || '',
      guardianOccupation: guardian.occupation || '',
      guardianAddress: guardian.address || '',
    }
  });

  const onSubmit = () => setReviewModalOpen(true);

  // Final submission after review
  const handleFinalSubmit = async () => {
    try {
      const formData = methods.getValues();

      // Map form data to backend structure (self-editable fields only)
      const updateData: Record<string, any> = {
        // studentDetails
        dob: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        address: formData.permanentHomeAddress || undefined,
        phone: formData.phoneNumber || undefined,
        guardianName: formData.sponsorName || undefined,
        guardianPhone: formData.sponsorPhone || undefined,
        // medicalFitness
        bloodGroup: formData.bloodGroup || undefined,
        genotype: formData.genotype || undefined,
        // applicationProfile.bioData
        bioData: {
          middleName: formData.middleName || undefined,
          gender: formData.gender || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          nationality: formData.nationality || undefined,
          placeOfBirth: formData.placeOfBirth || undefined,
          religion: formData.religion || undefined,
          maritalStatus: formData.maritalStatus || undefined,
        },
        // applicationProfile.contactInfo
        contactInfo: {
          countryOfResidence: formData.countryOfResidence || undefined,
          stateOfResidence: formData.stateOfResidence || undefined,
          lgaOfResidence: formData.lgaOfResidence || undefined,
          residentialAddress: formData.residentialAddress || undefined,
        },
        // applicationProfile.nextOfKin
        nextOfKin: {
          fullName: formData.nokFullName || undefined,
          relationship: formData.nokRelationship || undefined,
          phone: formData.nokPhone || undefined,
          email: formData.nokEmail || undefined,
          address: formData.nokAddress || undefined,
        },
        // applicationProfile.guardianInfo
        guardianInfo: {
          fullName: formData.guardianFullName || undefined,
          relationship: formData.guardianRelationship || undefined,
          phone: formData.guardianPhoneInfo || undefined,
          email: formData.guardianEmail || undefined,
          occupation: formData.guardianOccupation || undefined,
          address: formData.guardianAddress || undefined,
        },
      };

      // Strip empty nested objects and undefined top-level keys
      ['bioData', 'contactInfo', 'nextOfKin', 'guardianInfo'].forEach((k) => {
        const obj = updateData[k];
        Object.keys(obj).forEach((f) => obj[f] === undefined && delete obj[f]);
        if (Object.keys(obj).length === 0) delete updateData[k];
      });
      Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

      const response = await updateMutation.mutateAsync(updateData);
      if (response.status === 'success') {
        toast.success('Profile information updated successfully');
        setReviewModalOpen(false);
        methods.reset(methods.getValues()); // clears dirty state
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
        />

        <ContactInfoSection
          control={methods.control}
          openSection={isSectionOpen('contactInfo')}
          onToggleSection={() => handleSectionToggle('contactInfo')}
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

        <NextOfKinInfoSection
          control={methods.control}
          openSection={isSectionOpen('nextOfKin')}
          onToggleSection={() => handleSectionToggle('nextOfKin')}
        />

        <GuardianInfoSection
          control={methods.control}
          openSection={isSectionOpen('guardian')}
          onToggleSection={() => handleSectionToggle('guardian')}
        />

        <NextOfKinSection
          control={methods.control}
          openSection={isSectionOpen('sponsor')}
          onToggleSection={() => handleSectionToggle('sponsor')}
        />

        <ProfileFormActions
          disabled={!methods.formState.isDirty || updateMutation.isPending}
        />
      </form>

      {/* Review Modal */}
      <ReviewFormModal
        formData={methods.getValues()}
        dirtyFields={methods.formState.dirtyFields as Record<string, boolean>}
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        onConfirm={handleFinalSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </FormProvider>
  );
};

export default ProfileForm;
