import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function EcosystemHealthIndicators() {
  const [validators, setValidators] = useState<{ name: string; status: string }[]>([]);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const validatorData = await api.getValidatorData();
        const latencyData = await api.getLatencyData();
        setValidators(validatorData);
        setLatency(latencyData);
      } catch (err) {
        setError('Failed to fetch ecosystem health data.');
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div role="alert" className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Ecosystem Health Indicators</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Validators</h3>
        <ul>
          {validators.map((validator, index) => (
            <li key={index}>{validator.name}: {validator.status}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Latency</h3>
        <p>{latency ? `${latency} ms` : 'Loading...'}</p>
      </div>
    </div>
  );
}