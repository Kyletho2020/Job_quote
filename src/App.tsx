import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Calculator, Truck, Users, MapPin, Phone, Building, FileText, Mail, User, Bot, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AIChatbox from './components/AIChatbox';
import ApiKeyManager from './components/ApiKeyManager';
import AuthComponent from './components/AuthComponent';

const App: React.FC = () => {
  return <OmegaMorganQuoteForm />;
};

interface FormData {
  projectTitle: string;
  companyName: string;
  siteAddress: string;
  siteContactName: string;
  siteContactPhone: string;
  crewSize: string;
  forkliftSize: string;
  trailerType: string;
  tractorType: string;
  workDescription: string;
  storageType: string;
  storageSquareFootage: string;
  yardLocation: string;
  yourName: string;
}

const OmegaMorganQuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    projectTitle: '',
    companyName: '',
    siteAddress: '',
    siteContactName: '',
    siteContactPhone: '',
    crewSize: '3',
    forkliftSize: '',
    trailerType: '',
    tractorType: 'None',
    workDescription: '',
    storageType: 'None',
    storageSquareFootage: '',
    yardLocation: 'Shop',
    yourName: 'Kyle Thornton'
  });

  const [copied, setCopied] = useState(false);
  const [showAIChatbox, setShowAIChatbox] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [hasStoredApiKey, setHasStoredApiKey] = useState(false);
  const [storageCalculation, setStorageCalculation] = useState<number>(0);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const handleAIExtract = (extractedInfo: any) => {
    // Update form data with extracted information
    setFormData(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(extractedInfo).filter(([_, value]) => value && value.trim() !== '')
      )
    }));
    setShowAIChatbox(false);
  };

  const forkliftOptions = [
    { value: '', label: 'Select Forklift Size' },
    { value: 'Forklift (5k)', label: 'Forklift (5k)' },
    { value: 'Forklift (8k)', label: 'Forklift (8k)' },
    { value: 'Forklift (15k)', label: 'Forklift (15k)' },
    { value: 'Forklift (30k)', label: 'Forklift (30k)' },
    { value: 'Forklift - Hoist 18/26', label: 'Forklift - Hoist 18/26' },
    { value: 'Versalift 25/35', label: 'Versalift 25/35' },
    { value: 'Versalift 40/60', label: 'Versalift 40/60' },
    { value: 'Versalift 60/80', label: 'Versalift 60/80' },
    { value: 'Trilifter', label: 'Trilifter' }
  ];

  const trailerOptions = [
    { value: '', label: 'Select Trailer Type' },
    { value: 'Rolldeck', label: 'Rolldeck' },
    { value: 'Stepdeck', label: 'Stepdeck' },
    { value: 'Lowboy', label: 'Lowboy' },
    { value: 'Dovetail', label: 'Dovetail' },
    { value: 'Stretch Double Drop', label: 'Stretch Double Drop' },
    { value: 'Curtain', label: 'Curtain' }
  ];

  const tractorOptions = [
    { value: 'None', label: 'None' },
    { value: '3-axel', label: '3-axel' },
    { value: '4-axel', label: '4-axel' }
  ];

  const storageOptions = [
    { value: 'None', label: 'No Storage' },
    { value: 'Outdoor', label: 'Outdoor Storage' },
    { value: 'Indoor', label: 'Indoor Storage' }
  ];

  const yardOptions = [
    { value: 'Shop', label: 'Shop' },
    { value: 'Mukilteo', label: 'Mukilteo' },
    { value: 'Fife', label: 'Fife' }
  ];

  // Auto-select trailer based on forklift
  useEffect(() => {
    const smallForklifts = ['Forklift (5k)', 'Forklift (8k)', 'Forklift (15k)'];
    if (smallForklifts.includes(formData.forkliftSize)) {
      setFormData(prev => ({ ...prev, trailerType: 'Rolldeck' }));
    }
  }, [formData.forkliftSize]);

  // Auto-select tractor based on forklift
  useEffect(() => {
    const heavyEquipment = ['Versalift 40/60', 'Versalift 60/80', 'Trilifter'];
    if (heavyEquipment.includes(formData.forkliftSize)) {
      setFormData(prev => ({ ...prev, tractorType: '4-axel' }));
    }
  }, [formData.forkliftSize]);

  // Calculate storage costs
  useEffect(() => {
    if (formData.storageType !== 'None' && formData.storageSquareFootage) {
      const sqft = parseFloat(formData.storageSquareFootage);
      if (!isNaN(sqft)) {
        const rate = formData.storageType === 'Outdoor' ? 2.5 : 3.5;
        setStorageCalculation(sqft * rate);
      } else {
        setStorageCalculation(0);
      }
    } else {
      setStorageCalculation(0);
    }
  }, [formData.storageType, formData.storageSquareFootage]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateEquipmentList = () => {
    const equipment = ['Gear truck'];
    
    if (formData.trailerType) {
      equipment.push(`${formData.trailerType} trailer`);
    }
    
    if (formData.forkliftSize) {
      equipment.push(`${formData.forkliftSize} forklift`);
    }
    
    if (formData.tractorType && formData.tractorType !== 'None') {
      equipment.push(`${formData.tractorType} tractor`);
    }
    
    return equipment.join(', ');
  };

  const generateEmailTemplate = () => {
    const equipmentList = generateEquipmentList();
    const storageText = formData.storageType !== 'None' && storageCalculation > 0 
      ? `\n\nStorage fee for equipment after two weeks will be charged at $${storageCalculation.toFixed(2)}/month`
      : '';

    return `Hello ${formData.siteContactName || '[Contact Name]'},

Please find below the scope and quote details for the upcoming project:

Project: ${formData.projectTitle || '[Project Title]'}
Company: ${formData.companyName || '[Company Name]'}

Scope of Work
Mobilize crew and Omega Morgan equipment to site:

${formData.siteAddress || '[Site Address]'}

${formData.siteContactName || '[Site Contact Name]'}
${formData.siteContactPhone || '[Site Contact Phone]'}

Omega Morgan to supply a ${formData.crewSize}-man crew, ${equipmentList}.

${formData.workDescription || '[Work Description]'}${storageText}

When the job is complete, we will clean up debris and return to ${formData.yardLocation}.

Let me know if you have any questions or need revisions to this scope.

Best regards,
${formData.yourName}
Omega Morgan`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmailTemplate());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Truck className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Omega Morgan</h1>
            </div>
            <p className="text-xl text-gray-600">Quote Generator</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Project Details
              </h2>

              {/* AI Assistant Button */}
              <div className="mb-6 space-y-4">
                {!user && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Authentication Required</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Sign in to securely store your OpenAI API key and use AI extraction features.
                    </p>
                    <AuthComponent onAuthChange={setUser} />
                  </div>
                )}
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">AI Assistant</h3>
                      <p className="text-sm text-blue-600">Let AI extract project info from emails or documents</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowApiKeyManager(true)}
                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => setShowAIChatbox(true)}
                        disabled={!hasStoredApiKey || !user}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Open AI Chat
                      </button>
                    </div>
                  </div>
                  {!hasStoredApiKey && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                      ⚠️ {!user ? 'Sign in and set up' : 'Set up'} your OpenAI API key in settings to use AI extraction
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Project Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-1" />
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-1" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                {/* Site Information */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Site Address
                  </label>
                  <textarea
                    value={formData.siteAddress}
                    onChange={(e) => handleInputChange('siteAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={2}
                    placeholder="Enter complete site address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Site Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.siteContactName}
                      onChange={(e) => handleInputChange('siteContactName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Site Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.siteContactPhone}
                      onChange={(e) => handleInputChange('siteContactPhone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Equipment Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    Equipment Selection
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Crew Size
                      </label>
                      <select
                        value={formData.crewSize}
                        onChange={(e) => handleInputChange('crewSize', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                          <option key={size} value={size.toString()}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Forklift Size
                      </label>
                      <select
                        value={formData.forkliftSize}
                        onChange={(e) => handleInputChange('forkliftSize', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {forkliftOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trailer Type
                      </label>
                      <select
                        value={formData.trailerType}
                        onChange={(e) => handleInputChange('trailerType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {trailerOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tractor Type
                      </label>
                      <select
                        value={formData.tractorType}
                        onChange={(e) => handleInputChange('tractorType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {tractorOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Work Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Description
                  </label>
                  <textarea
                    value={formData.workDescription}
                    onChange={(e) => handleInputChange('workDescription', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Describe the work to be performed..."
                  />
                </div>

                {/* Storage Options */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                    Storage Options
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Storage Type
                      </label>
                      <select
                        value={formData.storageType}
                        onChange={(e) => handleInputChange('storageType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {storageOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    {formData.storageType !== 'None' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Square Footage
                        </label>
                        <input
                          type="number"
                          value={formData.storageSquareFootage}
                          onChange={(e) => handleInputChange('storageSquareFootage', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter square footage"
                        />
                      </div>
                    )}
                  </div>

                  {formData.storageType !== 'None' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        Storage rates: Outdoor $2.50/sqft/month • Indoor $3.50/sqft/month
                      </p>
                      {storageCalculation > 0 && (
                        <p className="text-lg font-semibold text-blue-600">
                          Monthly Cost: ${storageCalculation.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Final Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Return Location
                    </label>
                    <select
                      value={formData.yardLocation}
                      onChange={(e) => handleInputChange('yardLocation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {yardOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.yourName}
                      onChange={(e) => handleInputChange('yourName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-blue-600" />
                  Email Preview
                </h2>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Email
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {generateEmailTemplate()}
                </pre>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Equipment Summary:</h3>
                <p className="text-blue-700">{generateEquipmentList()}</p>
              </div>
            </div>
          </div>

          {/* AI Chatbox */}
          <AIChatbox
            isOpen={showAIChatbox}
            onClose={() => setShowAIChatbox(false)}
            onExtract={handleAIExtract}
            hasStoredApiKey={hasStoredApiKey}
          />

          {/* API Key Manager Modal */}
          {showApiKeyManager && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800">API Key Settings</h3>
                  <button
                    onClick={() => setShowApiKeyManager(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6">
                  <ApiKeyManager onApiKeySet={setHasStoredApiKey} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
