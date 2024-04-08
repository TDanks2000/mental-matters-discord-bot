export const createMDLink = (text: string, baseUrl: string, url?: string) => {
  if (!url) return '';

  const doesUrlStartWithBaseUrl = url.startsWith(baseUrl);
  return url ? `[${text}](${doesUrlStartWithBaseUrl ? url : `${baseUrl}${url}`})` : '';
};
