
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Headphones, Mail, MessageCircle, Phone } from 'lucide-react';

const SupportPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted successfully");
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setCategory('');
  };
  
  return (
    <>
      <DashboardHeader />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
            <p className="text-gray-600">Get help with any issue you're facing</p>
          </div>
          
          <Tabs defaultValue="contact">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Email Support</CardTitle>
                    <Mail className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">support@scholarhub.edu</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Phone Support</CardTitle>
                    <Phone className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">+234 800 123 4567</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri, 8am-5pm</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Live Chat</CardTitle>
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Available on weekdays</p>
                    <p className="text-xs text-gray-500 mt-1">9am-3pm</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Submit a Support Request</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic Issue</SelectItem>
                          <SelectItem value="financial">Financial Issue</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="hostel">Hostel Issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                      <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                      <Textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Provide details about your issue"
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={handleSubmit} className="w-full">
                    Submit Request
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Find answers to common questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">How do I register for courses?</h3>
                    <p className="text-sm text-gray-600">
                      To register for courses, navigate to the 'Courses' section from your dashboard and follow the instructions to add courses for the current semester.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">When are school fees due?</h3>
                    <p className="text-sm text-gray-600">
                      School fees are generally due at the beginning of each semester. Check the 'Payments' section for specific deadlines and payment options.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">How do I apply for accommodation?</h3>
                    <p className="text-sm text-gray-600">
                      Visit the 'Hostel' section to apply for accommodation. Hostels are allocated on a first-come, first-served basis, so apply early.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">What if I can't see my results?</h3>
                    <p className="text-sm text-gray-600">
                      Results are typically released at the end of each semester. If you can't see your results, ensure all fees are paid and check with your department.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">How do I update my profile information?</h3>
                    <p className="text-sm text-gray-600">
                      You can update most of your personal information in the 'Profile' section. For changes to critical information like your name or registration number, please contact the registrar's office.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>Helpful guides and documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Student Handbook</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-xs text-gray-500">Complete guide to student life, rules, and regulations.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">Download PDF</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Course Registration Guide</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-xs text-gray-500">Step-by-step guide to registering for courses.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Payment Instructions</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-xs text-gray-500">How to make payments and verify transactions.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Instructions</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Academic Calendar</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <p className="text-xs text-gray-500">Important dates for the current academic year.</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Calendar</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Headphones className="mr-2 h-4 w-4" />
                    Contact Support Team
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
