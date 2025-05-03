
import React from 'react';
import { Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const HostelGuidelines = () => {
  const guidelines = {
    allowed: [
      "Personal items including bedding, clothing, and toiletries",
      "Study materials and personal electronics (laptop, tablet)",
      "Small refrigerator (not exceeding 3.5 cubic feet)",
      "Small electric kettle (not exceeding 1.5L capacity)",
      "Personal medication and first aid supplies",
      "Room decor that doesn't damage walls (command strips recommended)",
    ],
    notAllowed: [
      "Cooking appliances including hot plates, toasters, and microwaves",
      "Candles, incense, or any open flames",
      "Extension cords that are not surge-protected",
      "Pets of any kind",
      "Weapons or items that could be deemed as weapons",
      "Alcohol and drugs (including smoking/vaping products)",
      "Large furniture that restricts movement or blocks exits",
    ],
    rules: [
      "Quiet hours are from 10 PM to 7 AM daily",
      "Visitors are allowed between 8 AM and 9 PM and must sign in",
      "All maintenance requests must be submitted through the student portal",
      "Room inspections occur once per semester with prior notice",
      "Keep your student ID card with you at all times for building access",
      "Report lost keys immediately to the hostel management office",
      "Common areas should be kept clean after use",
      "Respect your roommates' privacy and personal space",
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Items Allowed in the Hostel</h3>
        <div className="space-y-2">
          {guidelines.allowed.map((item, index) => (
            <div key={`allowed-${index}`} className="flex items-start">
              <div className="p-1 bg-green-100 rounded-full mr-2">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Items Not Allowed in the Hostel</h3>
        <div className="space-y-2">
          {guidelines.notAllowed.map((item, index) => (
            <div key={`not-allowed-${index}`} className="flex items-start">
              <div className="p-1 bg-red-100 rounded-full mr-2">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Hostel Rules & Regulations</h3>
        <div className="border rounded-lg divide-y">
          {guidelines.rules.map((rule, index) => (
            <div key={`rule-${index}`} className="p-3 hover:bg-gray-50">
              <p className="text-sm">{rule}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Important Note:</strong> Violation of hostel rules may result in disciplinary action, including fines or eviction from the hostel. All students are required to sign a hostel agreement form acknowledging these guidelines before check-in.
        </p>
      </div>
      
      <div className="text-center">
        <a href="#" className="text-primary hover:underline text-sm">
          Download Full Hostel Regulations PDF
        </a>
      </div>
    </div>
  );
};

export default HostelGuidelines;
