import React, { useState, useEffect } from 'react';

// async function fetchWithAutoRetry(fetcher, maxRetries, ...fetcherArgs) {
//   let attempts = 0;

//   while (attempts < maxRetries) {
//     try {
//       attempts++;
//       const response = await fetcher(...fetcherArgs);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json(); // Assuming we want to return the JSON response
//     } catch (error) {
//       if (attempts >= maxRetries) {
//         throw new Error(`Max retries reached. ${error.message}`);
//       }
//       console.log(`Attempt ${attempts} failed. Retrying...`);
//     }
//   }
// }

async function fetchWithAutoRetry(
  fetcher,
  maxRetries,
  delayMs = 5000,
  ...fetcherArgs
) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      attempts++;
      const response = await fetcher(...fetcherArgs);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Assuming we want to return the JSON response
    } catch (error) {
      if (attempts >= maxRetries) {
        throw new Error(`Max retries reached. ${error.message}`);
      }
      console.log(`Attempt ${attempts} failed. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = 'https://testapi.devtoolsdaily.com/users';
  const maxRetries = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAutoRetry(fetch, maxRetries, 5000, url);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
