
import React from 'react';
import { Signature } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface SignatureUploadSectionProps {
  openSection: boolean;
  onToggleSection: () => void;
  signature: string | null;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
}

const SignatureUploadSection = ({
  openSection,
  onToggleSection,
  signature,
  setSignature
}: SignatureUploadSectionProps) => {
  
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

  return (
    <Collapsible
      open={openSection}
      onOpenChange={onToggleSection}
      className="w-full"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
        <div className="flex items-center">
          <Signature className="h-5 w-5 mr-2 text-blue-800" />
          <h2 className="font-semibold text-blue-800">SIGNATURE UPLOAD</h2>
        </div>
        <span>{openSection ? "▲" : "▼"}</span>
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
  );
};

export default SignatureUploadSection;
