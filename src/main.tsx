import React, { useState } from 'react'

// ...your other imports

const [aiInput, setAiInput] = useState('')
const [loading, setLoading] = useState(false)

// Add this function inside your component:
const handleAIAutoFill = async () => {
  if (!aiInput.trim()) return
  setLoading(true)
  try {
    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: aiInput })
    })
    const data = await res.json()
    // For each field, if AI found it, update form state. If not, leave as-is.
    setFormData(prev => ({ ...prev, ...Object.fromEntries(
      Object.entries(data).filter(([k, v]) => v && v !== '')
    ) }))
  } catch (e) {
    alert('AI extraction failed')
  }
  setLoading(false)
}

// In your JSX, above the form:
<div style={{ marginBottom: 24 }}>
  <label><b>Paste Project Details (AI will auto-fill):</b></label>
  <textarea
    rows={4}
    style={{ width: '100%', marginBottom: 8 }}
    placeholder="Paste a client email, project scope, or job request here…"
    value={aiInput}
    onChange={e => setAiInput(e.target.value)}
    disabled={loading}
  />
  <button onClick={handleAIAutoFill} disabled={loading || !aiInput.trim()}>
    {loading ? 'Filling…' : 'Auto-Fill'}
  </button>
</div>
