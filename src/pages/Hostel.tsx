
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Bed, Receipt, Info, Calendar, Key, Users } from 'lucide-react';
import HostelBookingForm from '@/components/HostelBookingForm';
import HostelStatus from '@/components/HostelStatus';
import HostelGuidelines from '@/components/HostelGuidelines';

const Hostel = () => {
  const [activeTab, setActiveTab] = useState("status");
  
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Hostel Accommodation</h1>
          
          <Tabs defaultValue="status" onValueChange={setActiveTab} value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Book Accommodation</span>
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Guidelines</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="mt-4 space-y-4">
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <HostelStatus />
              </div>
            </TabsContent>
            <TabsContent value="booking" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Book Hostel Accommodation</CardTitle>
                  <CardDescription>
                    Select a block and room based on your preferences and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HostelBookingForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="guidelines" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hostel Guidelines & Requirements</CardTitle>
                  <CardDescription>
                    Important information for all hostel residents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HostelGuidelines />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default Hostel;
