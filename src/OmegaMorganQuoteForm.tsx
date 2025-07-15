import React, { useState, useEffect } from 'react';
import { Truck, FileText, Copy, RotateCcw } from 'lucide-react';

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