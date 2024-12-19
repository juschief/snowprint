"use client";

import { useState } from 'react';

interface FormData {
  chainName: string;
  symbol: string;
  description: string;
  consensusMechanism: string;
  initialValidators: number;
  blockTime: number;
  maxSupply: string;
  subnetThreshold: string;
}

export function LaunchpadForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    chainName: '',
    symbol: '',
    description: '',
    consensusMechanism: 'pos',
    initialValidators: 4,
    blockTime: 2,
    maxSupply: '',
    subnetThreshold: '',
  });

  const updateFormData = (key: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const steps = [
    {
      title: 'Basic Information',
      fields: ['chainName', 'symbol', 'description'],
    },
    {
      title: 'Technical Parameters',
      fields: ['consensusMechanism', 'blockTime', 'initialValidators'],
    },
    {
      title: 'Economic Model',
      fields: ['maxSupply', 'subnetThreshold'],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit the form
      console.log('Launch request:', formData);
    }
  };

  const renderFormFields = () => {
    const currentFields = steps[currentStep - 1].fields;

    return (
      <div className="space-y-6">
        {currentFields.includes('chainName') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Chain Name
            </label>
            <input
              type="text"
              value={formData.chainName}
              onChange={(e) => updateFormData('chainName', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              placeholder="My Avalanche Chain"
            />
          </div>
        )}

        {currentFields.includes('symbol') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Token Symbol
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => updateFormData('symbol', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              placeholder="MYTKN"
            />
          </div>
        )}

        {currentFields.includes('description') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe your chain..."
            />
          </div>
        )}

        {currentFields.includes('consensusMechanism') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Consensus Mechanism
            </label>
            <select
              value={formData.consensusMechanism}
              onChange={(e) => updateFormData('consensusMechanism', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="pos">Proof of Stake</option>
              <option value="poa">Proof of Authority</option>
            </select>
          </div>
        )}

        {currentFields.includes('blockTime') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Block Time (seconds)
            </label>
            <input
              type="number"
              value={formData.blockTime}
              onChange={(e) => updateFormData('blockTime', parseInt(e.target.value))}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        )}

        {currentFields.includes('initialValidators') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Initial Validators
            </label>
            <input
              type="number"
              value={formData.initialValidators}
              onChange={(e) => updateFormData('initialValidators', parseInt(e.target.value))}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        )}

        {currentFields.includes('maxSupply') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Maximum Token Supply
            </label>
            <input
              type="text"
              value={formData.maxSupply}
              onChange={(e) => updateFormData('maxSupply', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              placeholder="100000000"
            />
          </div>
        )}

        {currentFields.includes('subnetThreshold') && (
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Subnet Threshold (AVAX)
            </label>
            <input
              type="text"
              value={formData.subnetThreshold}
              onChange={(e) => updateFormData('subnetThreshold', e.target.value)}
              className="w-full bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700 focus:ring-2 focus:ring-blue-500"
              placeholder="2000"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex flex-col items-center ${
              index + 1 === currentStep
                ? 'text-blue-500'
                : index + 1 < currentStep
                ? 'text-green-500'
                : 'text-zinc-500'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index + 1 === currentStep
                  ? 'bg-blue-500 text-white'
                  : index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-zinc-700 text-zinc-400'
              }`}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-sm">{step.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderFormFields()}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 text-white rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg ml-auto hover:bg-blue-600 transition-colors"
          >
            {currentStep === steps.length ? 'Launch Chain' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
} 