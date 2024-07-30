export const maxDuration = 60
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import dbConnect from '@/config/database';
import Url from '@/models/ExtractUrl';
import { ensureScheme } from '@/utils/url';

const extractEmailsFromPage = async (url) => {
  const emails = new Set();
  let pageTitle = '';
  let pageDescription = '';

  const allowedTLDs = [
    ".com", ".org", ".net", ".int", ".edu", ".gov", ".mil", ".co", ".us", ".uk", ".ca", ".de", ".fr", ".au", ".ru", ".cn", ".jp", ".br", ".in", ".mx", ".nl", ".kr", ".se", ".es", ".ch", ".it", ".no", ".fi", ".dk", ".pl", ".nz", ".za", ".tr", ".gr", ".pt", ".ar", ".be", ".at", ".il", ".sg", ".hk", ".ie", ".cz", ".cl", ".hu", ".my", ".th", ".sk", ".ua", ".ro", ".bg", ".lt", ".lv", ".ee", ".si", ".hr", ".rs", ".ba", ".is", ".mt", ".cy", ".lu", ".li", ".by", ".mk", ".ge", ".am", ".az", ".al", ".md", ".me", ".ly", ".io", ".ai", ".app", ".dev", ".tech", ".xyz", ".site", ".online", ".shop", ".club", ".info", ".biz", ".pro", ".name", ".mobi", ".jobs", ".travel", ".museum", ".coop", ".aero", ".asia", ".post", ".tel"
  ];

  const isEmailValid = (email) => {
    return allowedTLDs.some(tld => email.endsWith(tld));
  };

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract page title
    pageTitle = $('title').text() || '';
    console.log('Page Title:', pageTitle);

    // Extract page description
    pageDescription = $('meta[name="description"]').attr('content') || '';
    console.log('Page Description:', pageDescription);

    // Extract emails with stricter pattern
    const emailPattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\b/g;
    const bodyText = $('body').text();
    (bodyText.match(emailPattern) || []).forEach(email => {
      if (isEmailValid(email.toLowerCase())) {
        emails.add(email.toLowerCase());
      }
    });

    console.log('Extracted Emails:', Array.from(emails));

    // Extract links and crawl subpages
    const links = $('a[href]').map((i, link) => link.attribs.href).get();
    const filteredLinks = links.filter(link => /^https?:\/\//i.test(link));
    for (const link of filteredLinks.slice(0, 10)) {
      const subUrl = new URL(link, url).href;
      try {
        const subResponse = await axios.get(subUrl);
        const sub$ = cheerio.load(subResponse.data);
        const subBodyText = sub$('body').text();
        (subBodyText.match(emailPattern) || []).forEach(email => {
          if (isEmailValid(email.toLowerCase())) {
            emails.add(email.toLowerCase());
          }
        });
      } catch (error) {
        console.error(`Error fetching subpage ${subUrl}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error fetching page ${url}:`, error.message);
    throw new Error(`Cannot fetch the page ${url}`);
  }

  return {
    emails: Array.from(emails),
    title: pageTitle,
    description: pageDescription
  };
};

export async function POST(request) {
  await dbConnect();
  const { url } = await request.json();
  const formattedUrl = ensureScheme(url);

  try {
    const { emails, title, description } = await extractEmailsFromPage(formattedUrl);

    console.log('Final Emails:', emails);
    console.log('Final Title:', title);
    console.log('Final Description:', description);

    if (emails.length === 0) {
      return NextResponse.json({ emails, message: "No emails were retrieved." });
    }

    const existingUrl = await Url.findOne({ url: formattedUrl });

    if (existingUrl) {
      emails.forEach(email => {
        if (!existingUrl.emails.includes(email)) {
          existingUrl.emails.push(email);
        }
      });
      existingUrl.title = title;
      existingUrl.description = description;
      await existingUrl.save();
    } else {
      const newUrl = new Url({ url: formattedUrl, emails, title, description });
      await newUrl.save();
    }

    return NextResponse.json({ emails, title, description });
  } catch (error) {
    console.error(`Error extracting emails or saving to the database: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
