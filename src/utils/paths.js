// Utility function to get the correct base path for assets
export const getAssetPath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For Vercel deployment, always use root path
  return `/${cleanPath}`;
};
