import dbConnect from '@/config/database';
import ExtractUrl from '@/models/ExtractUrl';
import Link from 'next/link';
import mongoose from 'mongoose';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Function to format the URL for display
const formatUrlForDisplay = (url) => {
  try {
    const urlObject = new URL(url);
    let hostname = urlObject.hostname.replace(/^www\./, ''); // Remove 'www.'
    hostname = hostname.replace(/\./g, '_'); // Replace dots with underscores
    return hostname;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return url;
  }
};

// Function to parse the formatted URL and ObjectId
const parseUrlId = (formattedId) => {
  // Split on the last underscore to separate rootDomain from objectId
  const lastUnderscoreIndex = formattedId.lastIndexOf('_');
  if (lastUnderscoreIndex === -1) {
    throw new Error('Invalid formatted ID');
  }
  
  const rootDomain = formattedId.substring(0, lastUnderscoreIndex);
  const objectId = formattedId.substring(lastUnderscoreIndex + 1);
  
  return {
    originalUrl: rootDomain.replace(/_/g, '.'),
    objectId,
  };
};

export async function generateStaticParams() {
  await dbConnect();

  const urls = await ExtractUrl.find({}, '_id url').exec();

  return urls.map((urlDoc) => ({
    id: `${formatUrlForDisplay(urlDoc.url)}_${urlDoc._id.toString()}`, // Format URL and append ObjectId
  }));
}

export default async function UrlPage({ params }) {
  const { id } = params;
  console.log('Received formatted ID:', id);

  try {
    const { originalUrl, objectId } = parseUrlId(id);
    console.log('Parsed URL:', originalUrl);
    console.log('Parsed ObjectId:', objectId);

    await dbConnect();

    // Validate ObjectId
    if (!mongoose.isValidObjectId(objectId)) {
      console.error(`Invalid ObjectId: ${objectId}`);
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <Header />
          <main className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-600">Invalid URL ID.</p>
          </main>
        </div>
      );
    }

    // Fetch the URL data using ObjectId
    const urlData = await ExtractUrl.findById(objectId).exec();
    console.log('URL data from database:', urlData);

    if (!urlData) {
      console.error(`URL data not found for ObjectId: ${objectId}`);
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <Header />
          <main className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-600">URL not found.</p>
          </main>
        </div>
      );
    }

    const { url, emails, title, description } = urlData;

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        
        <main className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">{title || 'Website Details'}</h2>
          
          {/* Clickable URL */}
          <p className="mb-4 text-gray-700 text-center">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
          </p>
          
          {description && <p className="mb-4 text-gray-700">{description}</p>}
          {emails.length > 0 ? (
            <ul className="list-disc list-inside text-center">
              {emails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No emails found for this URL.</p>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in UrlPage:', error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <Header />
        <main className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-600">Error fetching URL data.</p>
        </main>
        <Footer />
      </div>
    );
  }
}
