import React, { useState, useEffect } from 'react';
import { Truck, FileText, Copy, RotateCcw, Sparkles, Wand2, AlertTriangle, Key } from 'lucide-react';

interface QuoteFormData {
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
  storageOption: string;
  storageSquareFootage: string;
  yardLocation: string;
  yourName: string;
}

const defaultFormData: QuoteFormData = {
  projectTitle: '',
  companyName: '',
  siteAddress: '',
  siteContactName: '',
  siteContactPhone: '',
  crewSize: '',
  forkliftSize: '',
  trailerType: '',
  tractorType: 'None',
  workDescription: '',
  storageOption: 'None',
  storageSquareFootage: '',
  yardLocation: 'Shop',
  yourName: 'Kyle Thornton',
};

const forkliftOptions = [
  { value: '', label: 'Select Forklift' },
  { value: '5k', label: 'Forklift (5k)' },
  { value: '8k', label: 'Forklift (8k)' },
  { value: '15k', label: 'Forklift (15k)' },
  { value: '30k', label: 'Forklift (30k)' },
  { value: 'Hoist 18/26', label: 'Forklift - Hoist 18/26' },
  { value: 'Versalift 25/35', label: 'Versalift 25/35' },
  { value: 'Versalift 40/60', label: 'Versalift 40/60' },
  { value: 'Versalift 60/80', label: 'Versalift 60/80' },
  { value: 'Trilifter', label: 'Trilifter' },
];

const trailerOptions = [
  { value: '', label: 'Select Trailer' },
  { value: 'Rolldeck', label: 'Rolldeck' },
  { value: 'Stepdeck', label: 'Stepdeck' },
  { value: 'Lowboy', label: 'Lowboy' },
  { value: 'Dovetail', label: 'Dovetail' },
  { value: 'Stretch Double Drop', label: 'Stretch Double Drop' },
  { value: 'Curtain', label: 'Curtain' },
];

const tractorOptions = [
  { value: 'None', label: 'None' },
  { value: '3-axel', label: '3-axel' },
  { value: '4-axel', label: '4-axel' },
];

const storageOptions = [
  { value: 'None', label: 'No Storage' },
  { value: 'Outdoor', label: 'Outdoor Storage' },
  { value: 'Indoor', label: 'Indoor Storage' },
];

const yardOptions = [
  { value: 'Shop', label: 'Shop' },
  { value: 'Mukilteo', label: 'Mukilteo' },
  { value: 'Fife', label: 'Fife' },
];

const OmegaMorganQuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>(defaultFormData);
  const [quote, setQuote] = useState<string>('');
  const [storageCalculation, setStorageCalculation] = useState<number>(0);
  const [aiInput, setAiInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [openaiApiKey] = useState<string>('YOUR_API_KEY_HERE'); // Replace with your actual API key
  const [apiError, setApiError] = useState<string>('');

  // Auto-select trailer and tractor based on forklift selection
  useEffect(() => {
    const { forkliftSize } = formData;
    let newTrailerType = formData.trailerType;
    let newTractorType = formData.tractorType;

    // Auto-select Rolldeck for 5k, 8k, or 15k forklifts
    if (['5k', '8k', '15k'].includes(forkliftSize) && !formData.trailerType) {
      newTrailerType = 'Rolldeck';
    }

    // Auto-select 4-axel tractor for 40/60, 60/80 Versalift or Trilifter
    if (['Versalift 40/60', 'Versalift 60/80', 'Trilifter'].includes(forkliftSize)) {
      newTractorType = '4-axel';
    }

    if (newTrailerType !== formData.trailerType || newTractorType !== formData.tractorType) {
      setFormData(prev => ({
        ...prev,
        trailerType: newTrailerType,
        tractorType: newTractorType
      }));
    }
  }, [formData.forkliftSize]);

  // Calculate storage cost
  useEffect(() => {
    const { storageOption, storageSquareFootage } = formData;
    const sqft = parseFloat(storageSquareFootage) || 0;
    
    let rate = 0;
    if (storageOption === 'Outdoor') rate = 2.50;
    if (storageOption === 'Indoor') rate = 3.50;
    
    setStorageCalculation(sqft * rate);
  }, [formData.storageOption, formData.storageSquareFootage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseAIInput = () => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const input = aiInput.toLowerCase();
      const newFormData = { ...formData };
      
      // Extract project title (look for "project:" or first line)
      const projectMatch = input.match(/project[:\s]+([^\n]+)/i) || input.match(/^([^\n]+)/);
      if (projectMatch) {
        newFormData.projectTitle = projectMatch[1].trim();
      }
      
      // Extract company name
      const companyMatch = input.match(/company[:\s]+([^\n]+)/i) || input.match(/client[:\s]+([^\n]+)/i);
      if (companyMatch) {
        newFormData.companyName = companyMatch[1].trim();
      }
      
      // Extract address
      const addressMatch = input.match(/address[:\s]+([^\n]+)/i) || input.match(/location[:\s]+([^\n]+)/i) || input.match(/site[:\s]+([^\n]+)/i);
      if (addressMatch) {
        newFormData.siteAddress = addressMatch[1].trim();
      }
      
      // Extract contact name
      const contactMatch = input.match(/contact[:\s]+([^\n]+)/i) || input.match(/site contact[:\s]+([^\n]+)/i);
      if (contactMatch) {
        newFormData.siteContactName = contactMatch[1].trim();
      }
      
      // Extract phone number
      const phoneMatch = input.match(/phone[:\s]*([\d\-\(\)\s]+)/i) || input.match(/(\(\d{3}\)\s*\d{3}-\d{4})/);
      if (phoneMatch) {
        newFormData.siteContactPhone = phoneMatch[1].trim();
      }
      
      // Extract crew size
      const crewMatch = input.match(/(\d+)[^\d]*(?:man|person|crew|worker)/i);
      if (crewMatch) {
        newFormData.crewSize = crewMatch[1];
      }
      
      // Extract forklift information
      if (input.includes('5k') || input.includes('5000')) {
        newFormData.forkliftSize = '5k';
      } else if (input.includes('8k') || input.includes('8000')) {
        newFormData.forkliftSize = '8k';
      } else if (input.includes('15k') || input.includes('15000')) {
        newFormData.forkliftSize = '15k';
      } else if (input.includes('30k') || input.includes('30000')) {
        newFormData.forkliftSize = '30k';
      } else if (input.includes('hoist')) {
        newFormData.forkliftSize = 'Hoist 18/26';
      } else if (input.includes('versalift 25') || input.includes('25/35')) {
        newFormData.forkliftSize = 'Versalift 25/35';
      } else if (input.includes('versalift 40') || input.includes('40/60')) {
        newFormData.forkliftSize = 'Versalift 40/60';
      } else if (input.includes('versalift 60') || input.includes('60/80')) {
        newFormData.forkliftSize = 'Versalift 60/80';
      } else if (input.includes('trilifter')) {
        newFormData.forkliftSize = 'Trilifter';
      }
      
      // Extract trailer type
      if (input.includes('rolldeck')) {
        newFormData.trailerType = 'Rolldeck';
      } else if (input.includes('stepdeck')) {
        newFormData.trailerType = 'Stepdeck';
      } else if (input.includes('lowboy')) {
        newFormData.trailerType = 'Lowboy';
      } else if (input.includes('dovetail')) {
        newFormData.trailerType = 'Dovetail';
      } else if (input.includes('stretch double drop')) {
        newFormData.trailerType = 'Stretch Double Drop';
      } else if (input.includes('curtain')) {
        newFormData.trailerType = 'Curtain';
      }
      
      // Extract storage information
      if (input.includes('outdoor storage')) {
        newFormData.storageOption = 'Outdoor';
      } else if (input.includes('indoor storage')) {
        newFormData.storageOption = 'Indoor';
      }
      
      // Extract square footage
      const sqftMatch = input.match(/(\d+)\s*(?:sq\s*ft|square\s*feet|sqft)/i);
      if (sqftMatch) {
        newFormData.storageSquareFootage = sqftMatch[1];
      }
      
      // Extract yard location
      if (input.includes('mukilteo')) {
        newFormData.yardLocation = 'Mukilteo';
      } else if (input.includes('fife')) {
        newFormData.yardLocation = 'Fife';
      }
      
      // Extract work description (everything that doesn't match other patterns)
      let workDescription = input;
      // Remove already extracted information
      workDescription = workDescription.replace(/project[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/company[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/client[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/address[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/location[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/contact[:\s]+[^\n]+/gi, '');
      workDescription = workDescription.replace(/phone[:\s]*[\d\-\(\)\s]+/gi, '');
      workDescription = workDescription.replace(/(\d+)[^\d]*(?:man|person|crew|worker)/gi, '');
      workDescription = workDescription.trim();
      
      if (workDescription && workDescription.length > 20) {
        newFormData.workDescription = workDescription.charAt(0).toUpperCase() + workDescription.slice(1);
      }
      
      setFormData(newFormData);
      setIsProcessing(false);
    }, 1500); // Simulate processing time
  };

  const generateEquipmentList = () => {
    const equipment = [];
    
    if (formData.crewSize) {
      equipment.push(`${formData.crewSize}-man crew`);
    }
    
    equipment.push('Gear truck and trailer');
    
    if (formData.forkliftSize) {
      equipment.push(`${formData.forkliftSize} forklift`);
    }
    
    if (formData.trailerType) {
      equipment.push(`${formData.trailerType} trailer`);
    }
    
    if (formData.tractorType && formData.tractorType !== 'None') {
      equipment.push(`${formData.tractorType} tractor`);
    }
    
    return equipment.join(', ');
  };

  const generateQuote = () => {
    const equipmentList = generateEquipmentList();
    const storageText = formData.storageOption !== 'None' && storageCalculation > 0 
      ? `\nStorage fee for equipment after two weeks will be charged at $${storageCalculation.toFixed(2)}/month`
      : '';

    const quoteText = `Project: ${formData.projectTitle}
Company: ${formData.companyName}

Scope of Work
Mobilize crew and Omega Morgan equipment to site:

${formData.siteAddress}

${formData.siteContactName}
${formData.siteContactPhone}

Omega Morgan to supply a ${equipmentList}.

${formData.workDescription}${storageText}

When the job is complete, we will clean up debris and return to ${formData.yardLocation}.

Let me know if you have any questions or need revisions to this scope.

Best regards,
${formData.yourName}
Omega Morgan`;

    setQuote(quoteText);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quote);
      // Visual feedback could be added here
      const button = document.querySelector('.copy-btn') as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.backgroundColor = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#059669';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setQuote('');
    setStorageCalculation(0);
    setAiInput('');
    setApiError('');
  };

  if (quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Generated Quote</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                  {quote}
                </pre>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="copy-btn flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </button>
                <button 
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Omega Morgan Quote Generator</h1>
                <p className="text-blue-100 mt-1">Professional equipment rental quotes</p>
              </div>
            </div>
          </div>

          {/* AI Input Section */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">ChatGPT-Powered Project Parser</h2>
                <p className="text-sm text-gray-600">
                  Paste your project details and let ChatGPT intelligently fill out the form
                </p>
              </div>
            </div>
            
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-vertical"
                rows={4}
                placeholder="Example: Project: Office Building Move&#10;Company: ABC Construction&#10;Address: 123 Main St, Seattle, WA&#10;Contact: John Smith&#10;Phone: (206) 555-0123&#10;Need 3-man crew with 8k forklift and rolldeck trailer&#10;Moving office equipment from 2nd floor to ground level..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              
              <button
                type="button"
                onClick={parseAIInput}
                disabled={!aiInput.trim() || isProcessing}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing with ChatGPT...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Parse with ChatGPT
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); generateQuote(); }} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Project Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="projectTitle">
                    Project Title *
                  </label>
                  <input
                    id="projectTitle"
                    name="projectTitle"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="companyName">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="siteAddress">
                    Site Address *
                  </label>
                  <textarea
                    id="siteAddress"
                    name="siteAddress"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="siteContactName">
                    Site Contact Name *
                  </label>
                  <input
                    id="siteContactName"
                    name="siteContactName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.siteContactName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="siteContactPhone">
                    Site Contact Phone *
                  </label>
                  <input
                    id="siteContactPhone"
                    name="siteContactPhone"
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.siteContactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Equipment & Crew */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Equipment & Crew</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="crewSize">
                    Crew Size *
                  </label>
                  <input
                    id="crewSize"
                    name="crewSize"
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.crewSize}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="forkliftSize">
                    Forklift Size
                  </label>
                  <select
                    id="forkliftSize"
                    name="forkliftSize"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.forkliftSize}
                    onChange={handleChange}
                  >
                    {forkliftOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="trailerType">
                    Trailer Type
                  </label>
                  <select
                    id="trailerType"
                    name="trailerType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.trailerType}
                    onChange={handleChange}
                  >
                    {trailerOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tractorType">
                    Tractor Type
                  </label>
                  <select
                    id="tractorType"
                    name="tractorType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.tractorType}
                    onChange={handleChange}
                  >
                    {tractorOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="yardLocation">
                    Return Location
                  </label>
                  <select
                    id="yardLocation"
                    name="yardLocation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.yardLocation}
                    onChange={handleChange}
                  >
                    {yardOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Work Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="workDescription">
                Work Description *
              </label>
              <textarea
                id="workDescription"
                name="workDescription"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Describe the work to be performed..."
                value={formData.workDescription}
                onChange={handleChange}
                required
              />
            </div>

            {/* Storage Options */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="storageOption">
                Storage Option
              </label>
              <select
                id="storageOption"
                name="storageOption"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.storageOption}
                onChange={handleChange}
              >
                {storageOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {formData.storageOption !== 'None' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="storageSquareFootage">
                    Square Footage
                  </label>
                  <input
                    id="storageSquareFootage"
                    name="storageSquareFootage"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.storageSquareFootage}
                    onChange={handleChange}
                    placeholder="Enter square footage"
                  />
                  {storageCalculation > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">
                        {formData.storageOption} Storage Rate: ${formData.storageOption === 'Outdoor' ? '2.50' : '3.50'}/sqft/month
                      </span>
                      <div className="font-semibold text-blue-600 text-lg">
                        Monthly Cost: ${storageCalculation.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Your Name */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="yourName">
                Your Name
              </label>
              <input
                id="yourName"
                name="yourName"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.yourName}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Generate Professional Quote
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OmegaMorganQuoteForm;