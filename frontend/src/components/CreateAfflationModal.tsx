import { useState } from 'react';

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateAfflationModal({ onClose, onCreated }: Props) {
  const [step, setStep] = useState<'type' | 'title'>('type');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a name.');
      return;
    }
    if (title.length > 20) {
      setError('Max 20 characters allowed.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
        body: JSON.stringify({
          type: 'painting',
          title: title.trim(),
          readme: '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || JSON.stringify(data) || 'Failed to create afflation');
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white p-6 rounded-lg shadow-lg w-80 space-y-4">
        <h2 className="text-lg font-bold">Create New Afflation</h2>

        {step === 'type' && (
          <>
            <p className="text-sm text-gray-300">Select type:</p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md"
              onClick={() => setStep('title')}
            >
              🎨 Painting
            </button>
          </>
        )}

        {step === 'title' && (
          <>
            <label className="text-sm text-gray-300 block">Afflation Title</label>
            <input
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:outline-none"
              placeholder="e.g. My Painting #1"
              maxLength={20}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Painting'}
            </button>
          </>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={onClose}
          className="text-xs text-gray-400 underline hover:text-gray-200 block text-center mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
