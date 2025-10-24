import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from "./Apis";

const EncodingTest = () => {
  const [rawData, setRawData] = useState('');
  const [decodedData, setDecodedData] = useState('');
  const [bureauId, setBureauId] = useState('');

  useEffect(() => {
    const storedBureauId = localStorage.getItem("bureauId");
    if (storedBureauId) {
      setBureauId(String(storedBureauId));
    }
  }, []);

  const fetchAndTest = async () => {
    if (!bureauId) {
      alert('No bureau ID found');
      return;
    }

    try {
      const response = await apiClient.get(apiEndpoints.terms, {
        headers: {
          'Accept': 'application/json; charset=utf-8',
        }
      });
      
      console.log('Full API Response:', response);
      console.log('Response Headers:', response.headers);
      
      const bureauTerms = response.data.find(
        term => String(term.bureau_id) === String(bureauId)
      );

      if (bureauTerms) {
        const rawContent = bureauTerms.term || '';
        setRawData(rawContent);
        
        // Try different decoding approaches
        console.log('=== ENCODING DEBUG INFO ===');
        console.log('Raw content:', rawContent);
        console.log('Content length:', rawContent.length);
        console.log('Content type:', typeof rawContent);
        
        // Check if it's already a string with question marks
        if (rawContent.includes('?')) {
          console.log('Content contains question marks - encoding issue detected');
        }
        
        // Try to decode if it's a buffer or encoded string
        let decoded = rawContent;
        try {
          // If it's a base64 string, try to decode
          if (typeof rawContent === 'string' && !rawContent.includes('<') && !rawContent.includes('>')) {
            const buffer = Buffer.from(rawContent, 'base64');
            decoded = buffer.toString('utf8');
            console.log('Base64 decoded:', decoded);
          }
        } catch (e) {
          console.log('Not base64 encoded');
        }
        
        // Try different character encodings
        const encodings = ['utf8', 'latin1', 'ascii', 'utf16le'];
        encodings.forEach(encoding => {
          try {
            const testDecoded = Buffer.from(rawContent, encoding).toString('utf8');
            console.log(`${encoding} decoded:`, testDecoded);
          } catch (e) {
            console.log(`${encoding} decode failed:`, e.message);
          }
        });
        
        setDecodedData(decoded);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching data');
    }
  };

  const testTeluguInput = () => {
    const teluguText = 'ఈ వెబ్‌సైట్‌లో మీరు మీ వ్యక్తిగత వివరాలను నమోదు చేస్తున్నారు, మీరు మీ వ్యక్తిగత వివరాలను నమోదు చేస్తున్నారు.';
    console.log('Testing Telugu input:', teluguText);
    console.log('Telugu bytes:', new TextEncoder().encode(teluguText));
    setRawData(teluguText);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Encoding Test Component</h1>
      
      <div className="mb-4">
        <p>Bureau ID: {bureauId || 'Not found'}</p>
        <button 
          onClick={fetchAndTest}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Fetch and Test Data
        </button>
        <button 
          onClick={testTeluguInput}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Telugu Input
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Raw Data</h2>
          <div className="border p-4 bg-gray-100 rounded min-h-[200px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{rawData}</pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Decoded Data</h2>
          <div className="border p-4 bg-gray-100 rounded min-h-[200px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{decodedData}</pre>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
        <div className="border p-4 bg-gray-100 rounded">
          <p>Raw Data Length: {rawData.length}</p>
          <p>Contains Question Marks: {rawData.includes('?') ? 'Yes' : 'No'}</p>
          <p>Contains Telugu Characters: {/[\u0C00-\u0C7F]/.test(rawData) ? 'Yes' : 'No'}</p>
          <p>Data Type: {typeof rawData}</p>
        </div>
      </div>
    </div>
  );
};

export default EncodingTest; 