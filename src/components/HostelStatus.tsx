
import React from 'react';
import { Home, MapPin, Calendar, Users } from 'lucide-react';

const HostelStatus = () => {
  // This would come from an API in a real application
  const hostelData = {
    name: "Diamond Hall",
    room: "Room 234",
    block: "Block C",
    checkIn: "September 10, 2023",
    checkOut: "July 20, 2024",
    status: "active",
    roommates: [
      "Jane Smith",
      "Sarah Johnson"
    ],
    features: [
      "Wi-Fi",
      "Study Room",
      "Kitchen Access",
      "Laundry"
    ]
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Hostel Information</h2>
        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Active
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Home className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-medium">{hostelData.name}</h3>
              <p className="text-sm text-muted-foreground">{hostelData.room}, {hostelData.block}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin size={14} className="mr-1" />
                <span>Main Campus</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground">Check-in Date</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={14} />
                <span className="text-sm font-medium">{hostelData.checkIn}</span>
              </div>
            </div>
            <div className="p-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground">Check-out Date</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={14} />
                <span className="text-sm font-medium">{hostelData.checkOut}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Users size={16} />
              <span>Roommates</span>
            </h3>
            <div className="space-y-2">
              {hostelData.roommates.map((roommate, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center">
                    {roommate.charAt(0)}
                  </div>
                  <span className="text-sm">{roommate}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {hostelData.features.map((feature, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-secondary text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          <Home className="mr-2" size={16} />
          Hostel Details
        </button>
      </div>
    </div>
  );
};

export default HostelStatus;
