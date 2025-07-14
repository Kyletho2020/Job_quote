import React, { useState } from 'react';
import OmegaMorganQuoteForm from './OmegaMorganQuoteForm';
import ForkliftQuoteForm from './ForkliftQuoteForm';

const App: React.FC = () => {
  const [formType, setFormType] = useState<'omega' | 'forklift'>('omega');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Quote Generator</h1>

      <label className="block mb-2 font-medium">Select Form Type:</label>
      <select
        className="mb-6 border rounded p-2"
        value={formType}
        onChange={(e) => setFormType(e.target.value as 'omega' | 'forklift')}
      >
        <option value="omega">Omega Morgan Quote</option>
        <option value="forklift">Forklift Quote</option>
      </select>

      {formType === 'omega' ? <OmegaMorganQuoteForm /> : <ForkliftQuoteForm />}
    </div>
  );
};

export default App;
