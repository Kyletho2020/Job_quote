import React, { useState } from 'react';
import ChatAssistant from './components/ChatAssistant';

const OmegaMorganQuoteForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectTitle: '',
    siteContactPhone: '',
    forkliftSize: '',
    equipmentType: '',
  });

  const handleChatAnswer = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Omega Morgan Quote Request</h1>

      <ChatAssistant onAnswer={handleChatAnswer} />

      <form className="space-y-4 mt-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="w-full border p-2"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full border p-2"
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            className="w-full border p-2"
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-semibold">Project Title</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            className="w-full border p-2"
            onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-semibold">Site Contact Phone</label>
          <input
            type="text"
            name="siteContactPhone"
            value={formData.siteContactPhone}
            className="w-full border p-2"
            onChange={(e) => setFormData({ ...formData, siteContactPhone: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-semibold">Forklift Size</label>
          <input
            type="text"
            name="forkliftSize"
            value={formData.forkliftSize}
            className="w-full border p-2"
            onChange={(e) => setFormData({ ...formData, forkliftSize: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-semibold">Equipment Type</label>
          <input
            type="text"
            name="equipmentType"
            value={formData.equipmentType}
            className="w-full border p-2"
            onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OmegaMorganQuoteForm;
