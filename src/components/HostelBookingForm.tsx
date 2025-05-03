
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreditCard, Wallet, Receipt } from "lucide-react";

// Schema for the form validation
const formSchema = z.object({
  blockId: z.string().min(1, { message: "Please select a block" }),
  roomId: z.string().min(1, { message: "Please select a room" }),
  paymentMethod: z.enum(["paystack", "stripe", "flutterwave"])
});

// Define the hostel blocks and rooms data
// This would come from an API in a real application
const hostelBlocks = [
  {
    id: "block-a",
    name: "Block A",
    gender: "male",
    description: "Newly renovated block with modern facilities and amenities",
    price: 75000,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80",
    rooms: [
      { id: "a-101", number: "A101", capacity: 4, available: 1 },
      { id: "a-102", number: "A102", capacity: 4, available: 2 },
      { id: "a-103", number: "A103", capacity: 2, available: 0 },
      { id: "a-104", number: "A104", capacity: 2, available: 2 },
    ]
  },
  {
    id: "block-b",
    name: "Block B",
    gender: "female",
    description: "Quiet block with study rooms and garden view",
    price: 65000,
    image: "https://images.unsplash.com/photo-1580041065738-e72023775cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80",
    rooms: [
      { id: "b-101", number: "B101", capacity: 4, available: 0 },
      { id: "b-102", number: "B102", capacity: 4, available: 3 },
      { id: "b-103", number: "B103", capacity: 2, available: 1 },
    ]
  },
  {
    id: "block-c",
    name: "Block C",
    gender: "male",
    description: "Premium block with air conditioning and private bathrooms",
    price: 95000,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80",
    rooms: [
      { id: "c-101", number: "C101", capacity: 2, available: 2 },
      { id: "c-102", number: "C102", capacity: 2, available: 1 },
    ]
  },
  {
    id: "block-d",
    name: "Block D",
    gender: "female",
    description: "Newly constructed block with modern amenities",
    price: 85000,
    image: "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80",
    rooms: [
      { id: "d-101", number: "D101", capacity: 4, available: 1 },
      { id: "d-102", number: "D102", capacity: 2, available: 0 },
    ]
  }
];

const HostelBookingForm = () => {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // Mock user data - in a real application, this would come from authentication
  const user = {
    id: "user-123",
    name: "John Doe",
    gender: "male",
    // Change this to "female" to test female-only blocks
  };
  
  // Filter blocks by user gender
  const availableBlocks = hostelBlocks.filter(block => block.gender === user.gender);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockId: "",
      roomId: "",
    },
  });
  
  // Watch the blockId field to update rooms when block changes
  const watchBlockId = form.watch("blockId");
  
  // When block selection changes, update the selected block and reset room selection
  React.useEffect(() => {
    if (watchBlockId) {
      const block = hostelBlocks.find(b => b.id === watchBlockId);
      setSelectedBlock(block);
      form.setValue("roomId", "");
    } else {
      setSelectedBlock(null);
    }
  }, [watchBlockId, form]);
  
  // Handler for form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // If there's no payment method selected, open the payment dialog
    if (!values.paymentMethod) {
      setShowPaymentDialog(true);
      return;
    }
    
    // In a real app, this would call an API to process the booking
    console.log("Form submitted:", values);
    
    // Show success message
    toast.success("Hostel booking confirmed! Redirecting to payment...", {
      description: "You will be redirected to complete your payment."
    });
    
    // Simulate payment processing - in a real app this would redirect to payment gateway
    setTimeout(() => {
      toast.success("Payment successful!", {
        description: "Your hostel booking has been confirmed."
      });
      
      // Reset form and close dialog
      form.reset();
      setShowPaymentDialog(false);
    }, 2000);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: "paystack" | "stripe" | "flutterwave") => {
    form.setValue("paymentMethod", method);
    onSubmit(form.getValues());
  };
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Block Selection */}
          <FormField
            control={form.control}
            name="blockId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Hostel Block</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hostel block" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBlocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Show Block Details if a block is selected */}
          {selectedBlock && (
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={selectedBlock.image} 
                  alt={selectedBlock.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-semibold">{selectedBlock.name}</h3>
                    <p className="text-sm opacity-90">{selectedBlock.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price per semester</p>
                    <p className="text-xl font-bold">₦{selectedBlock.price.toLocaleString()}</p>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                    {selectedBlock.gender === "male" ? "Male Only" : "Female Only"}
                  </div>
                </div>
                
                {/* Room Selection */}
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Room</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedBlock}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedBlock.rooms.map((room) => (
                            <SelectItem 
                              key={room.id} 
                              value={room.id}
                              disabled={room.available === 0}
                            >
                              {room.number} - {room.available} of {room.capacity} spots available
                              {room.available === 0 && " (Full)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!form.formState.isValid}
          >
            Proceed to Payment
          </Button>
        </form>
      </Form>
      
      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your hostel booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {selectedBlock && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{selectedBlock.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedBlock.rooms.find(r => r.id === form.getValues().roomId)?.number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm">₦{selectedBlock.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            
            <RadioGroup defaultValue="paystack" className="grid grid-cols-1 gap-3">
              <div 
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handlePaymentMethodSelect("paystack")}
              >
                <RadioGroupItem value="paystack" id="paystack" />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Paystack</span>
                  </label>
                  <img src="https://paystack.com/assets/img/logo/paystack-logo-vector.svg" alt="Paystack" className="h-6" />
                </div>
              </div>
              <div 
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handlePaymentMethodSelect("stripe")}
              >
                <RadioGroupItem value="stripe" id="stripe" />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Stripe</span>
                  </label>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                </div>
              </div>
              <div 
                className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handlePaymentMethodSelect("flutterwave")}
              >
                <RadioGroupItem value="flutterwave" id="flutterwave" />
                <div className="flex flex-1 items-center justify-between">
                  <label htmlFor="flutterwave" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="h-5 w-5" />
                    <span>Pay with Flutterwave</span>
                  </label>
                  <img src="https://cdn.filestackcontent.com/OITnhSPCSzOuiw9ohCBG" alt="Flutterwave" className="h-6" />
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelBookingForm;
