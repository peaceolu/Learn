import EbookCard from '../components/ebooks/EbookCard';
import type { Product } from '../types';

export default function Ebooks() {
  // Minimal placeholder page to satisfy default export
  const ebooks: Product[] = [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="heading-2 mb-6">Ebooks</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ebooks.length === 0 ? (
          <p className="text-gray-600">No ebooks available yet.</p>
        ) : (
          ebooks.map((eb) => (
            <EbookCard key={eb.id} course={eb} />
          ))
        )}
      </div>
    </div>
  );
}
