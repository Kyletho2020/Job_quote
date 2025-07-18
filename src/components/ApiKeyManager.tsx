import React, { useState, useEffect } from 'react';
import { Key, Save, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ApiKeyManagerProps {
  onApiKeySet: (hasKey: boolean) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    checkForStoredKey();
  }, []);

  const checkForStoredKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const hasKey = !error && data;
      setHasStoredKey(hasKey);
      onApiKeySet(hasKey);
    } catch (error) {
      console.error('Error checking for stored key:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setMessage({ type: 'error', text: 'Invalid OpenAI API key format' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in first' });
        return;
      }

      // Encrypt and store the API key
      const encryptionKey = 'user-specific-key'; // In production, use a proper key derivation
      const { data, error } = await supabase.rpc('encrypt_api_key', {
        api_key: apiKey,
        encryption_key: encryptionKey
      });

      if (error) throw error;

      // Store encrypted key
      const { error: insertError } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          encrypted_api_key: data,
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'API key saved successfully!' });
      setHasStoredKey(true);
      setApiKey('');
      onApiKeySet(true);
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({ type: 'error', text: 'Failed to save API key' });
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'API key deleted successfully!' });
      setHasStoredKey(false);
      onApiKeySet(false);
    } catch (error) {
      console.error('Error deleting API key:', error);
      setMessage({ type: 'error', text: 'Failed to delete API key' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Key className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">OpenAI API Key Management</h3>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {hasStoredKey ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">API key is configured</span>
            </div>
            <button
              onClick={deleteApiKey}
              disabled={loading}
              className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Your OpenAI API key is securely stored and encrypted. You can now use the AI extraction feature.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Store your OpenAI API key securely to use AI extraction. Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAI's website
            </a>.
          </p>
          
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={saveApiKey}
            disabled={loading || !apiKey.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save API Key'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;