import React, { useState } from 'react';

interface QuoteFormData {
  projectTitle: string;
  companyName: string;
  siteContact: string;
  phoneNumber: string;
  pickUpAddress: string;
  setAddress: string;
  equipment: string;
  specialRequirements: string;
  yourName: string;
}

const defaultFormData: QuoteFormData = {
  projectTitle: '',
  companyName: '',
  siteContact: '',
  phoneNumber: '',
  pickUpAddress: '',
  setAddress: '',
  equipment: '',
  specialRequirements: '',
  yourName: 'Kyle Thornton',
};

const OmegaMorganQuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>(defaultFormData);
  const [quote, setQuote] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateQuote = () => {
    const quoteText = `Attached is a quote for your upcoming project:

Project Title: ${formData.projectTitle}
Company: ${formData.companyName}
Site Contact: ${formData.siteContact}
Phone: ${formData.phoneNumber}
Pick-Up Location: ${formData.pickUpAddress}
Set Address: ${formData.setAddress}

Equipment: ${formData.equipment}
Special Requirements: ${formData.specialRequirements}

Let me know if you have any questions or need revisions to this scope.

Happy to earn your business,
${formData.yourName}`;
    setQuote(quoteText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote);
    alert('Quote copied to clipboard!');
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setQuote('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {quote ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Quote</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded shadow">{quote}</pre>
          <div className="mt-4 flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={copyToClipboard}>Copy</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={resetForm}>New Quote</button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); generateQuote(); }} className="grid gap-4">
          {Object.entries(formData).map(([key, val]) => (
            <div key={key}>
              <label className="block font-medium mb-1" htmlFor={key}>{key.replace(/([A-Z])/g, ' $1')}</label>
              {key === 'specialRequirements' ? (
                <textarea
                  id={key}
                  name={key}
                  rows={3}
                  className="w-full border p-2 rounded"
                  value={val}
                  onChange={handleChange}
                />
              ) : (
                <input
                  id={key}
                  name={key}
                  type="text"
                  className="w-full border p-2 rounded"
                  value={val}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Generate Quote</button>
        </form>
      )}
    </div>
  );
};

export default OmegaMorganQuoteForm;
