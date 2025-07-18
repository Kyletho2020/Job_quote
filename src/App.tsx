import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Calculator, Truck, Users, MapPin, Phone, Building, FileText, Mail, User, Bot, X, Plus, Settings } from 'lucide-react';
import SimpleAIChatbox from './components/SimpleAIChatbox';
import SimpleApiKeyManager from './components/SimpleApiKeyManager';

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
  forkliftQuantity: number;
  forkliftSizes: string[];
  trailerType: string;
  trailerQuantity: number;
  trailerTypes: string[];
  tractorType: string;
  tractorQuantity: number;
  tractorTypes: string[];
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
    forkliftQuantity: 1,
    forkliftSizes: ['None'],
    trailerType: '',
    trailerQuantity: 1,
    trailerTypes: [''],
    tractorType: 'None',
    tractorQuantity: 1,
    tractorTypes: ['None'],
    workDescription: '',
    storageType: 'None',
    storageSquareFootage: '',
    yardLocation: 'Shop',
    yourName: 'Kyle Thornton'
  });

  const [copied, setCopied] = useState(false);
  const [showAIChatbox, setShowAIChatbox] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [storedKeyId, setStoredKeyId] = useState<string | null>('816a7bfb-8a9b-410c-8a62-84bef585eb28');
  const [storageCalculation, setStorageCalculation] = useState<number>(0);
  const [activeSection, setActiveSection] = useState('project');

  const handleAIExtract = (extractedInfo: any) => {
    setFormData(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(extractedInfo).filter(([_, value]) => value && value.trim() !== '')
      )
    }));
    setShowAIChatbox(false);
  };

  const handleApiKeySet = (hasKey: boolean, keyId?: string) => {
    setStoredKeyId(hasKey ? '816a7bfb-8a9b-410c-8a62-84bef585eb28' : null);
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

  const forklift2Options = [
    { value: 'None', label: 'None' },
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

  const sections = [
    { id: 'project', label: 'Project Info', icon: Building },
    { id: 'site', label: 'Site Details', icon: MapPin },
    { id: 'equipment', label: 'Equipment', icon: Truck },
    { id: 'storage', label: 'Storage', icon: Calculator },
    { id: 'final', label: 'Final Details', icon: User }
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

  // Auto-select equipment for Versalift 60/80
  useEffect(() => {
    if (formData.forkliftSize === 'Versalift 60/80') {
      setFormData(prev => ({
        ...prev,
        forkliftSizes: ['Forklift (15k)'],
        trailerQuantity: 2,
        trailerTypes: ['Stepdeck', 'Lowboy'],
        tractorQuantity: 2,
        tractorTypes: ['4-axel', '4-axel']
      }));
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

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleForkliftSizeChange = (index: number, value: string) => {
    const newSizes = [...formData.forkliftSizes];
    newSizes[index] = value;
    setFormData(prev => ({ ...prev, forkliftSizes: newSizes }));
  };

  const handleTrailerTypeChange = (index: number, value: string) => {
    const newTypes = [...formData.trailerTypes];
    newTypes[index] = value;
    setFormData(prev => ({ ...prev, trailerTypes: newTypes }));
  };

  const handleTractorTypeChange = (index: number, value: string) => {
    const newTypes = [...formData.tractorTypes];
    newTypes[index] = value;
    setFormData(prev => ({ ...prev, tractorTypes: newTypes }));
  };

  const addTrailerRow = () => {
    setFormData(prev => ({
      ...prev,
      trailerQuantity: prev.trailerQuantity + 1,
      trailerTypes: [...prev.trailerTypes, ''],
      tractorQuantity: prev.tractorQuantity + 1,
      tractorTypes: [...prev.tractorTypes, 'None']
    }));
  };

  const removeTrailerRow = (index: number) => {
    if (formData.trailerQuantity > 1) {
      const newTrailerTypes = formData.trailerTypes.filter((_, i) => i !== index);
      const newTractorTypes = formData.tractorTypes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        trailerQuantity: prev.trailerQuantity - 1,
        trailerTypes: newTrailerTypes,
        tractorQuantity: prev.tractorQuantity - 1,
        tractorTypes: newTractorTypes
      }));
    }
  };

  const generateEquipmentList = () => {
    const equipment = ['Gear truck and trailer'];
    
    // Add main forklift
    if (formData.forkliftSize) {
      equipment.push(formData.forkliftSize);
    }
    
    // Add additional forklifts (excluding None)
    const additionalForklifts = formData.forkliftSizes.filter(size => size && size !== 'None');
    additionalForklifts.forEach(forklift => {
      equipment.push(forklift);
    });
    
    // Count and consolidate equipment
    const equipmentCounts: { [key: string]: number } = {};
    equipment.forEach(item => {
      equipmentCounts[item] = (equipmentCounts[item] || 0) + 1;
    });
    
    // Add trailers with tractors
    for (let i = 0; i < formData.trailerQuantity; i++) {
      const trailer = formData.trailerTypes[i];
      const tractor = formData.tractorTypes[i];
      
      if (trailer) {
        let trailerText = trailer;
        if (tractor && tractor !== 'None') {
          trailerText += ` with ${tractor} tractor`;
        }
        equipmentCounts[trailerText] = (equipmentCounts[trailerText] || 0) + 1;
      }
    }
    
    // Format equipment list
    const formattedEquipment = Object.entries(equipmentCounts).map(([item, count]) => {
      if (count === 1) {
        return item === 'Rolldeck' ? `and a ${item}` : item;
      } else {
        return `${item} (Qty: ${count})`;
      }
    });
    
    return formattedEquipment.join(', ');
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

  const isAutoSelected = (equipment: string) => {
    if (formData.forkliftSize === 'Versalift 60/80') {
      return equipment === 'Stepdeck' || equipment === 'Lowboy' || equipment === '4-axel' || equipment === 'Forklift (15k)';
    }
    
    const smallForklifts = ['Forklift (5k)', 'Forklift (8k)', 'Forklift (15k)'];
    const heavyEquipment = ['Versalift 40/60', 'Versalift 60/80', 'Trilifter'];
    
    if (smallForklifts.includes(formData.forkliftSize) && equipment === 'Rolldeck') {
      return true;
    }
    
    if (heavyEquipment.includes(formData.forkliftSize) && equipment === '4-axel') {
      return true;
    }
    
    return false;
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-10 h-10 text-black mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-black">Omega Morgan</h1>
                <p className="text-lg text-gray-600">Quote Generator</p>
              </div>
            </div>
            
            {/* AI Assistant Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowApiKeyManager(true)}
                className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button
                onClick={() => setShowAIChatbox(true)}
                disabled={!storedKeyId}
                className="flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Bot className="w-5 h-5 mr-2" />
                AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
              <h3 className="text-lg font-bold text-black mb-6">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>

              {/* AI Status */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Bot className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">AI Status</span>
                </div>
                <div className={`text-sm ${storedKeyId ? 'text-green-600' : 'text-red-600'}`}>
                  {storedKeyId ? '✓ Ready' : '✗ Setup Required'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Project Information */}
              <section id="project" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
                  <Building className="w-7 h-7 mr-3" />
                  Project Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={formData.projectTitle}
                        onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-3">
                      Work Description
                    </label>
                    <textarea
                      value={formData.workDescription}
                      onChange={(e) => handleInputChange('workDescription', e.target.value)}
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      rows={4}
                      placeholder="Describe the work to be performed..."
                    />
                  </div>
                </div>
              </section>

              {/* Site Details */}
              <section id="site" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
                  <MapPin className="w-7 h-7 mr-3" />
                  Site Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-3">
                      Site Address
                    </label>
                    <textarea
                      value={formData.siteAddress}
                      onChange={(e) => handleInputChange('siteAddress', e.target.value)}
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      rows={3}
                      placeholder="Enter complete site address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Site Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.siteContactName}
                        onChange={(e) => handleInputChange('siteContactName', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Site Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.siteContactPhone}
                        onChange={(e) => handleInputChange('siteContactPhone', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Equipment Selection */}
              <section id="equipment" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
                  <Truck className="w-7 h-7 mr-3" />
                  Equipment Selection
                </h2>

                <div className="space-y-8">
                  {/* Crew and Main Forklift */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        <Users className="w-4 h-4 inline mr-2" />
                        Crew Size
                      </label>
                      <select
                        value={formData.crewSize}
                        onChange={(e) => handleInputChange('crewSize', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                          <option key={size} value={size.toString()}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Forklift Size
                      </label>
                      <select
                        value={formData.forkliftSize}
                        onChange={(e) => handleInputChange('forkliftSize', e.target.value)}
                        className={`w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg ${
                          isAutoSelected(formData.forkliftSize) ? 'ring-2 ring-green-500 border-green-500' : ''
                        }`}
                      >
                        {forkliftOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.forkliftQuantity}
                        onChange={(e) => handleInputChange('forkliftQuantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      />
                    </div>
                  </div>

                  {/* Forklift 2 Size */}
                  <div>
                    <label className="block text-sm font-bold text-black mb-3">
                      Forklift 2 Size
                    </label>
                    <select
                      value={formData.forkliftSizes[0] || 'None'}
                      onChange={(e) => handleForkliftSizeChange(0, e.target.value)}
                      className={`w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg ${
                        isAutoSelected(formData.forkliftSizes[0]) ? 'ring-2 ring-green-500 border-green-500' : ''
                      }`}
                    >
                      {forklift2Options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trailer and Tractor Selection */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-black">Trailers & Tractors</h3>
                    {formData.trailerTypes.map((trailerType, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-bold text-black mb-3">
                            {index === 0 ? 'Trailer Type' : `Trailer ${index + 1}`}
                          </label>
                          <select
                            value={trailerType}
                            onChange={(e) => handleTrailerTypeChange(index, e.target.value)}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                              isAutoSelected(trailerType) ? 'ring-2 ring-green-500 border-green-500' : ''
                            }`}
                          >
                            {trailerOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-3">
                            Qty
                          </label>
                          <input
                            type="number"
                            value={1}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-3">
                            {index === 0 ? 'Tractor Type' : `Tractor ${index + 1}`}
                          </label>
                          <select
                            value={formData.tractorTypes[index] || 'None'}
                            onChange={(e) => handleTractorTypeChange(index, e.target.value)}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                              isAutoSelected(formData.tractorTypes[index]) ? 'ring-2 ring-green-500 border-green-500' : ''
                            }`}
                          >
                            {tractorOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-3">
                            Qty
                          </label>
                          <input
                            type="number"
                            value={1}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div className="flex justify-center">
                          {index === 0 ? (
                            <button
                              onClick={addTrailerRow}
                              className="flex items-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Trailer
                            </button>
                          ) : (
                            <button
                              onClick={() => removeTrailerRow(index)}
                              className="flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Storage Options */}
              <section id="storage" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
                  <Calculator className="w-7 h-7 mr-3" />
                  Storage Options
                </h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">
                        Storage Type
                      </label>
                      <select
                        value={formData.storageType}
                        onChange={(e) => handleInputChange('storageType', e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      >
                        {storageOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    {formData.storageType !== 'None' && (
                      <div>
                        <label className="block text-sm font-bold text-black mb-3">
                          Square Footage
                        </label>
                        <input
                          type="number"
                          value={formData.storageSquareFootage}
                          onChange={(e) => handleInputChange('storageSquareFootage', e.target.value)}
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                          placeholder="Enter square footage"
                        />
                      </div>
                    )}
                  </div>

                  {formData.storageType !== 'None' && (
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-3">
                        Storage rates: Outdoor $2.50/sqft/month • Indoor $3.50/sqft/month
                      </p>
                      {storageCalculation > 0 && (
                        <p className="text-xl font-bold text-black">
                          Monthly Cost: ${storageCalculation.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Final Details */}
              <section id="final" className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
                  <User className="w-7 h-7 mr-3" />
                  Final Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-3">
                      Return Location
                    </label>
                    <select
                      value={formData.yardLocation}
                      onChange={(e) => handleInputChange('yardLocation', e.target.value)}
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                    >
                      {yardOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-3">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.yourName}
                      onChange={(e) => handleInputChange('yourName', e.target.value)}
                      className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-lg"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Email Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black flex items-center">
                  <Mail className="w-6 h-6 mr-2" />
                  Email Preview
                </h3>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-black text-white hover:bg-gray-800'
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
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {generateEmailTemplate()}
                </pre>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-black mb-2">Equipment Summary:</h4>
                <p className="text-gray-700 text-sm">{generateEquipmentList()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbox */}
        <SimpleAIChatbox
          isOpen={showAIChatbox}
          onClose={() => setShowAIChatbox(false)}
          onExtract={handleAIExtract}
          keyId={storedKeyId}
        />

        {/* API Key Manager Modal */}
        {showApiKeyManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-black">API Key Settings</h3>
                <button
                  onClick={() => setShowApiKeyManager(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <SimpleApiKeyManager onApiKeySet={handleApiKeySet} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;