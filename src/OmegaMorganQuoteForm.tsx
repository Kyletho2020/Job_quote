import React, { useState } from 'react';

const OmegaMorganQuoteForm = () => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    companyName: '',
    siteAddress: '',
    siteContactName: '',
    siteContactPhone: '',
    crewSize: '',
    forkliftSize: '',
    trailerType: '',
    tractorType: '',
    workDescription: '',
    storageOption: '',
    squareFootage: '',
    yardLocation: '',
    yourName: 'Kyle Thornton'
  });

  const [quote, setQuote] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-select equipment based on forklift selection
    if (name === 'forkliftSize') {
      let newFormData = {
        ...formData,
        [name]: value
      };
      
      // Auto-select Rolldeck for 5k, 8k, or 15k forklifts
      if (value === 'Forklift (5k)' || value === 'Forklift (8k)' || value === 'Forklift (15k)') {
        newFormData.trailerType = 'Rolldeck';
      }
      
      // Auto-select 4-axel tractor for 40/60, 60/80 Versalifts or Trilifter
      if (value === 'Versalift 40/60' || value === 'Versalift 60/80' || value === 'Trilifter') {
        newFormData.tractorType = '4-axel';
      }
      
      setFormData(newFormData);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStorageOptionChange = (option) => {
    setFormData({
      ...formData,
      storageOption: option
    });
  };

  const calculateStorageCost = () => {
    if (!formData.squareFootage) return '0.00';
    
    const sqft = parseFloat(formData.squareFootage);
    const rate = formData.storageOption === 'Outdoor ($2.50/sqft)' ? 2.5 : 3.5;
    
    return (sqft * rate).toFixed(2);
  };

  const generateEmailTemplate = () => {
    let equipmentList = `${formData.crewSize} crew, Gear truck and trailer`;
    
    // Add forklift if selected
    if (formData.forkliftSize && formData.forkliftSize !== 'None') {
      equipmentList += `, ${formData.forkliftSize}`;
    }
    
    // Add trailer if selected and different from default
    if (formData.trailerType && formData.trailerType !== 'None') {
      equipmentList += `, ${formData.trailerType}`;
    }
    
    // Add tractor if selected
    if (formData.tractorType && formData.tractorType !== 'None') {
      equipmentList += `, and ${formData.tractorType}`;
    }

    // Calculate storage fee
    let storageLine = '';
    if (formData.storageOption === 'Outdoor ($2.50/sqft)') {
      storageLine = '\nStorage fee for equipment after two weeks will be charged at $2.50/sqft per month.';
    } else if (formData.storageOption === 'Indoor ($3.50/sqft)') {
      storageLine = '\nStorage fee for equipment after two weeks will be charged at $3.50/sqft per month.';
    }

    const returnLocation = formData.yardLocation || 'Shop';

    return `Hello,

Please find below the scope and quote details for the upcoming project:

Project: ${formData.projectTitle}
Company: ${formData.companyName}

Scope of Work
Mobilize crew and Omega Morgan equipment to site:

${formData.siteAddress}

${formData.siteContactName}
${formData.siteContactPhone}

Omega Morgan to supply a ${equipmentList}.

${formData.workDescription}${storageLine}

When the job is complete, we will clean up debris and return to ${returnLocation}.

Let me know if you have any questions or need revisions to this scope.

Best regards,
${formData.yourName}
Omega Morgan`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailTemplate = generateEmailTemplate();
    
    setQuote({
      ...formData,
      emailTemplate: emailTemplate,
      generatedAt: new Date().toLocaleString()
    });
  };

  const handleReset = () => {
    setFormData({
      projectTitle: '',
      companyName: '',
      siteAddress: '',
      siteContactName: '',
      siteContactPhone: '',
      crewSize: '',
      forkliftSize: '',
      trailerType: '',
      tractorType: '',
      workDescription: '',
      storageOption: '',
      squareFootage: '',
      yardLocation: '',
      yourName: 'Kyle Thornton'
    });
    setQuote(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote.emailTemplate);
    alert('Email template copied to clipboard!');
  };

  if (quote) {
    return (
      <div className="quote-result">
        <h1>Omega Morgan Quote Generated</h1>
        
        <div className="email-template">
          <h2>Email Template</h2>
          <div className="email-content">
            <pre>{quote.emailTemplate}</pre>
          </div>
          <button onClick={copyToClipboard} className="copy-btn">Copy to Clipboard</button>
        </div>
        
        <p><strong>Quote Generated:</strong> {quote.generatedAt}</p>
        
        <button onClick={handleReset} className="generate-btn">Generate New Quote</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Omega Morgan Quote Generator</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectTitle">Project Title:</label>
          <input
            type="text"
            id="projectTitle"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="siteAddress">Site Address:</label>
          <input
            type="text"
            id="siteAddress"
            name="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="siteContactName">Site Contact Name:</label>
          <input
            type="text"
            id="siteContactName"
            name="siteContactName"
            value={formData.siteContactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="siteContactPhone">Site Contact Phone:</label>
          <input
            type="tel"
            id="siteContactPhone"
            name="siteContactPhone"
            value={formData.siteContactPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="crewSize">Crew Size:</label>
          <select
            id="crewSize"
            name="crewSize"
            value={formData.crewSize}
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            <option value="2-man">2-man</option>
            <option value="3-man">3-man</option>
            <option value="4-man">4-man</option>
            <option value="5-man">5-man</option>
            <option value="6-man">6-man</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="forkliftSize">Forklift Size (optional):</label>
          <select
            id="forkliftSize"
            name="forkliftSize"
            value={formData.forkliftSize}
            onChange={handleChange}
          >
            <option value="">None</option>
            <option value="Forklift (5k)">Forklift (5k)</option>
            <option value="Forklift (8k)">Forklift (8k)</option>
            <option value="Forklift (15k)">Forklift (15k)</option>
            <option value="Forklift (30k)">Forklift (30k)</option>
            <option value="Forklift - Hoist 18/26">Forklift - Hoist 18/26</option>
            <option value="Versalift 25/35">Versalift 25/35</option>
            <option value="Versalift 40/60">Versalift 40/60</option>
            <option value="Versalift 60/80">Versalift 60/80</option>
            <option value="Trilifter">Trilifter</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="trailerType">Trailer Type (optional):</label>
          <select
            id="trailerType"
            name="trailerType"
            value={formData.trailerType}
            onChange={handleChange}
          >
            <option value="">None</option>
            <option value="Rolldeck">Rolldeck</option>
            <option value="Stepdeck">Stepdeck</option>
            <option value="Lowboy">Lowboy</option>
            <option value="Dovetail">Dovetail</option>
            <option value="Stretch Double Drop">Stretch Double Drop</option>
            <option value="Curtain">Curtain</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tractorType">Tractor Type (optional):</label>
          <select
            id="tractorType"
            name="tractorType"
            value={formData.tractorType}
            onChange={handleChange}
          >
            <option value="">None</option>
            <option value="3-axel">3-axel</option>
            <option value="4-axel">4-axel</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workDescription">Work Description:</label>
          <textarea
            id="workDescription"
            name="workDescription"
            value={formData.workDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the work to be performed..."
            required
          />
        </div>

        <div className="form-group">
          <label>Storage Option:</label>
          <div className="storage-options">
            <button
              type="button"
              className={`storage-btn ${formData.storageOption === 'Outdoor ($2.50/sqft)' ? 'active' : ''}`}
              onClick={() => handleStorageOptionChange('Outdoor ($2.50/sqft)')}
            >
              Outdoor ($2.50/sqft)
            </button>
            <button
              type="button"
              className={`storage-btn ${formData.storageOption === 'Indoor ($3.50/sqft)' ? 'active' : ''}`}
              onClick={() => handleStorageOptionChange('Indoor ($3.50/sqft)')}
            >
              Indoor ($3.50/sqft)
            </button>
            <button
              type="button"
              className={`storage-btn ${formData.storageOption === 'No Storage' ? 'active' : ''}`}
              onClick={() => handleStorageOptionChange('No Storage')}
            >
              No Storage
            </button>
          </div>
          
          {(formData.storageOption === 'Outdoor ($2.50/sqft)' || formData.storageOption === 'Indoor ($3.50/sqft)') && (
            <div className="storage-calculator">
              <label htmlFor="squareFootage">Square Footage:</label>
              <input
                type="number"
                id="squareFootage"
                name="squareFootage"
                value={formData.squareFootage || ''}
                onChange={handleChange}
                placeholder="Enter square footage"
                min="0"
              />
              {formData.squareFootage && (
                <div className="storage-cost">
                  Monthly Storage Cost: ${calculateStorageCost()}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="yardLocation">Yard Location/Return To:</label>
          <select
            id="yardLocation"
            name="yardLocation"
            value={formData.yardLocation}
            onChange={handleChange}
          >
            <option value="">Shop (default)</option>
            <option value="Mukilteo">Mukilteo</option>
            <option value="Fife">Fife</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="yourName">Your Name:</label>
          <input
            type="text"
            id="yourName"
            name="yourName"
            value={formData.yourName}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="generate-btn">Generate Quote</button>
      </form>
    </div>
  );
};

export default OmegaMorganQuoteForm;