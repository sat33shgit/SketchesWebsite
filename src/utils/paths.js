// Utility function to get the correct base path for assets
export const getAssetPath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (GitHub Pages), use the base path
  if (import.meta.env.PROD) {
    return `/SketchesWebsite/${cleanPath}`;
  }
  
  // In development, use root path
  return `/${cleanPath}`;
};
