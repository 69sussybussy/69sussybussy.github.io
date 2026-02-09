// netlify/functions/proxy.js

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" query parameter' }),
    };
  }

  try {
    // Ajoutez des en-têtes pour imiter un navigateur réel
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://coomer.st/', // Très important pour certains sites
      }
    });

    if (!response.ok) {
      // Pour le débogage, vous pouvez vouloir voir le texte de la réponse en cas d'erreur
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API returned status ${response.status}`, details: errorText }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function failed:', error); // Log l'erreur dans le terminal
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: error.message }),
    };
  }
};