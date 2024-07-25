export const ensureScheme = (url) => {
  // Regular expression to check if URL already has a scheme
  const schemeRegex = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
  
  // If URL does not have a scheme, prepend 'https://'
  if (!schemeRegex.test(url)) {
    return `https://${url}`;
  }
  
  return url;
};
