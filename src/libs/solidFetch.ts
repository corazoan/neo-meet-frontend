export const solidFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const domain = "http://localhost:8787";
  return fetch(domain + input, {
    ...init,
  });
};
