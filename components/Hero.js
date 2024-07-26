'use client';

import { useState } from 'react';
import axios from 'axios';
import { ensureScheme } from '@/utils/url';

const Hero = () => {
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
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-extrabold font-sans">Collect Emails Effortlessly</h1>
          <p className="py-6 text-lg font-sans opacity-90 leading-relaxed">
            Easily find and collect email addresses from any website. Just enter a URL and let our tool do the hard work for you.
          </p>
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
              <h3 className="text-xl font-semibold text-center font-sans">Extracted Emails:</h3>
              <ul className="list-disc list-inside text-center font-sans">
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
      </div>
    </div>
  );
};

export default Hero;
