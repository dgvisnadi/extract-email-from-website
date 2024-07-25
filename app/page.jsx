'use client';

import { useState } from 'react';
import axios from 'axios';
import { ensureScheme } from '@/utils/url';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const [url, setUrl] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [noEmailsMessage, setNoEmailsMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmails([]);
    setError('');
    setCopySuccess('');
    setLoading(true);
    setNoEmailsMessage('');

    const formattedUrl = ensureScheme(url);

    try {
      const response = await axios.post('/api/extract', { url: formattedUrl });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setEmails(response.data.emails);
        if (response.data.message) {
          setNoEmailsMessage(response.data.message);
        }
      }
    } catch (error) {
      setError('An error occurred while fetching emails.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emails.join('\n')).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        {/* Overlay and loader */}
        {loading && (
          <div className="overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="loader"></div>
          </div>
        )}
        
        <div className={`p-6 w-full max-w-4xl bg-white rounded-lg shadow-md ${loading ? 'opacity-50' : ''}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Email Extractor</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-4 w-full max-w-md">
              <input
                type="url"
                className="input input-bordered w-full"
                placeholder="Enter website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full max-w-md" disabled={loading}>
              {loading ? (
                <span className="loader">Loading...</span>
              ) : (
                'Extract Emails'
              )}
            </button>
          </form>
          {error && <div className="mt-4 text-center text-red-600">{error}</div>}
          {noEmailsMessage && <div className="mt-4 text-center text-yellow-600">{noEmailsMessage}</div>}
          {emails.length > 0 && (
            <div className="mt-6 w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-center">Extracted Emails:</h3>
              <ul className="list-disc list-inside text-center">
                {emails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
              <button className="btn btn-secondary mt-4" onClick={handleCopy}>
                {copySuccess ? copySuccess : 'Copy to Clipboard'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
