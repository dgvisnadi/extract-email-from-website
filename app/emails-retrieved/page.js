export const fetchCache = 'force-no-store';

import dbConnect from '@/config/database';
import ExtractUrl from '@/models/ExtractUrl';
import Link from 'next/link';
import Header from '@/components/Header';

// Function to format the URL for display in the link
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

// Fetch URLs from the database
export async function generateStaticParams() {
  await dbConnect();

  const urls = await ExtractUrl.find({}, '_id url').exec();

  return urls.map((urlDoc) => ({
    id: `${formatUrlForDisplay(urlDoc.url)}_${urlDoc._id.toString()}`, // Format URL and append ObjectId
  }));
}

// Render the page with formatted URLs
export default async function EmailsRetrieved() {
  await dbConnect();

  const urls = await ExtractUrl.find({}, '_id url').exec();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="w-full text-2xl font-bold mb-4">Emails Retrieved</h2>
        <ul className="list-disc list-inside">
          {urls.map((urlDoc, index) => {
            const formattedUrl = formatUrlForDisplay(urlDoc.url);
            return (
              <li key={index}>
                <Link href={`/urls/${formattedUrl}_${urlDoc._id}`} className="text-blue-500 hover:underline">
                  {urlDoc.url} {/* Display the full URL here */}
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
