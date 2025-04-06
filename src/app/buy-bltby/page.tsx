'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

// Mock token data
const tokenData = {
  bltby: {
    name: 'BLTBY Token',
    description: 'The primary utility token of the Built By DAO ecosystem',
    price: '$0.42',
    minPurchase: '100 BLTBY',
    maxPurchase: '100,000 BLTBY',
    availableForSale: '10,000,000 BLTBY',
    paymentMethods: ['ETH', 'USDC']
  }
};

export default function BuyBLTBYPage() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ETH');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Calculate total cost based on amount and token price
  const calculateTotal = () => {
    if (!amount) return '0.00';
    const price = 0.42;
    return (parseFloat(amount) * price).toFixed(2);
  };
  
  // Handle purchase confirmation
  const handlePurchase = () => {
    // In a real implementation, this would connect to your buying contract
    setShowConfirmation(true);
  };
  
  // Reset form after purchase
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setAmount('');
  };

  return (
    <DashboardLayout title="Buy BLTBY Tokens">
      {isConnected ? (
        <div className="w-full space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">{tokenData.bltby.name}</h2>
            <p className="text-gray-600 mb-4">{tokenData.bltby.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Price</p>
                <p className="text-xl font-bold">{tokenData.bltby.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Available for Sale</p>
                <p className="text-xl font-bold">{tokenData.bltby.availableForSale}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Minimum Purchase</p>
                <p className="font-medium">{tokenData.bltby.minPurchase}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Maximum Purchase</p>
                <p className="font-medium">{tokenData.bltby.maxPurchase}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Purchase
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="bg-gray-100 p-2 border border-l-0 rounded-r-md">
                    BLTBY
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tokenData.bltby.paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Amount:</span>
                  <span>{amount || '0'} BLTBY</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price per Token:</span>
                  <span>{tokenData.bltby.price}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span>${calculateTotal()} {paymentMethod}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={handlePurchase}
              >
                Buy BLTBY Tokens
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">About BLTBY Token</h3>
            <p className="mb-4">
              BLTBY is the primary utility token of the Built By DAO ecosystem. Token holders can:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Participate in governance decisions</li>
              <li>Stake tokens to earn rewards</li>
              <li>Access premium features and services</li>
              <li>Receive discounts on DAO products and services</li>
            </ul>
            <p>
              BLTBY tokens are fully transferable and can be traded on supported exchanges.
            </p>
          </Card>
          
          {/* Purchase Confirmation Modal */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Purchase Confirmation</h3>
                <p className="mb-4">
                  Your purchase of {amount} BLTBY tokens has been initiated.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Amount:</span>
                    <span>{amount} BLTBY</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Payment Method:</span>
                    <span>{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Cost:</span>
                    <span>${calculateTotal()} {paymentMethod}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Please check your wallet for transaction confirmation.
                </p>
                <Button className="w-full" onClick={handleConfirmationClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Connect your wallet</h2>
          <p className="text-gray-500 mb-4">Please connect your wallet to purchase tokens</p>
        </div>
      )}
    </DashboardLayout>
  );
}
