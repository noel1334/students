
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Globe, Zap } from 'lucide-react';

type GatewayKey = 'flutterwave' | 'paystack' | 'stripe';

interface GatewayInfo {
  key: GatewayKey;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface SchoolFeeGatewaySelectorProps {
  gateways: GatewayKey[];
  selectedGateway: GatewayKey | '';
  onSelectGateway: (gateway: GatewayKey) => void;
  isProcessing: boolean;
}

const gatewayInfo: Record<GatewayKey, GatewayInfo> = {
  flutterwave: {
    key: 'flutterwave',
    name: 'Flutterwave',
    description: 'Multiple payment options including cards, bank transfers, and USSD',
    icon: <Zap className="h-5 w-5" />,
  },
  paystack: {
    key: 'paystack',
    name: 'PayStack',
    description: 'Secure card payments with instant confirmation',
    icon: <CreditCard className="h-5 w-5" />,
  },
  stripe: {
    key: 'stripe',
    name: 'Stripe',
    description: 'International payment processing with enhanced security',
    icon: <Globe className="h-5 w-5" />,
  },
};

export const SchoolFeeGatewaySelector: React.FC<SchoolFeeGatewaySelectorProps> = ({
  gateways,
  selectedGateway,
  onSelectGateway,
  isProcessing,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Gateway</h3>
      <div className="grid gap-4">
        {gateways.map((gateway) => {
          const info = gatewayInfo[gateway];
          const isSelected = selectedGateway === gateway;
          
          return (
            <Card 
              key={gateway} 
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              } ${isProcessing ? 'opacity-50' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {info.icon}
                    <div>
                      <CardTitle className="text-base">{info.name}</CardTitle>
                      <CardDescription className="text-sm">{info.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelectGateway(gateway)}
                    disabled={isProcessing}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
