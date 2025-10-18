
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Save, 
  Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('password');

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (data: z.infer<typeof passwordSchema>) => {
    toast.success("Password changed successfully!");
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <SettingsIcon className="text-[#1a4aa6]" size={24} />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h1>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                  activeTab === 'password' 
                    ? 'bg-[#1a4aa6] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock size={18} />
                <span>Password</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-[#1a4aa6] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md ${
                  activeTab === 'privacy' 
                    ? 'bg-[#1a4aa6] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield size={18} />
                <span>Privacy</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            {activeTab === 'password' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Change Password</h2>
                <p className="text-gray-500 mb-6">
                  Ensure your account is using a strong password to maintain security.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showCurrentPassword ? (
                                <EyeOff size={16} className="text-gray-500" />
                              ) : (
                                <Eye size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                          <FormDescription>
                            Enter your current password to confirm changes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showNewPassword ? (
                                <EyeOff size={16} className="text-gray-500" />
                              ) : (
                                <Eye size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                          <FormDescription>
                            Password must be at least 6 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} className="text-gray-500" />
                              ) : (
                                <Eye size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="bg-[#1a4aa6] hover:bg-[#0f3c8c]">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                <p className="text-gray-500 mb-6">
                  Manage how you receive notifications from the ScholarHub platform.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive emails about important updates</p>
                    </div>
                    <div className="form-control">
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Course Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about course content changes</p>
                    </div>
                    <div className="form-control">
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Payment Reminders</h3>
                      <p className="text-sm text-gray-500">Get reminders about upcoming payments</p>
                    </div>
                    <div className="form-control">
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Result Notifications</h3>
                      <p className="text-sm text-gray-500">Be notified when new results are published</p>
                    </div>
                    <div className="form-control">
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6 bg-[#1a4aa6] hover:bg-[#0f3c8c]">
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Privacy Settings</h2>
                <p className="text-gray-500 mb-6">
                  Control how your data is used and who can see your information.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-gray-500">Who can see your profile information</p>
                    </div>
                    <div className="w-40">
                      <select className="w-full p-2 border rounded-md bg-white">
                        <option value="public">Public</option>
                        <option value="students">Students Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Enable 2FA</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Two-Factor Authentication</h4>
                              <p className="text-sm text-muted-foreground">
                                Secure your account by requiring a second verification step when logging in.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline">SMS</Button>
                                <Button variant="outline">Authenticator App</Button>
                              </div>
                              <Button className="bg-[#1a4aa6] hover:bg-[#0f3c8c]">
                                Set up
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Data Usage</h3>
                      <p className="text-sm text-gray-500">Allow anonymous usage data collection</p>
                    </div>
                    <div className="form-control">
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button className="mt-6 bg-[#1a4aa6] hover:bg-[#0f3c8c]">
                  <Save size={16} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
