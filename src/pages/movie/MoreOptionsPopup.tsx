import { useState } from 'react';

import addCollection from '../../assets/add_collection.svg';
import calendar from '../../assets/calendar.svg';
import type { Movie } from '../../utils/Types';
import AddToCollection from './AddToCollection';

interface MoreOptionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

const MoreOptionsPopup = ({
  isOpen,
  onClose,
  movie,
}: MoreOptionsPopupProps) => {
  const [showCollection, setShowCollection] = useState(false);

  if (!isOpen) return null;

  const handleAddToCollection = () => {
    setShowCollection(true);
  };

  const handleCollectionClose = () => {
    setShowCollection(false);
  };

  const handleCollectionConfirm = () => {
    // Handle collection confirmation
    setShowCollection(false);
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 z-50"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center mb-4">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-12 h-18 object-cover rounded"
          />
          <div className="ml-3">
            <h3 className="font-semibold">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.year}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="flex justify-between items-center py-3 cursor-pointer"
            onClick={handleAddToCollection}
          >
            <div>컬렉션에 추가</div>
            <img
              src={addCollection}
              alt="Add to collection"
              className="w-8 h-8"
            />
          </div>
          <div className="flex justify-between items-center py-3">
            <div>본 날짜 추가</div>
            <img src={calendar} alt="Add date" className="w-8 h-8" />
          </div>
          <button
            onClick={onClose}
            className="w-full text-hotPink py-2 text-center"
          >
            취소
          </button>
        </div>
      </div>

      <AddToCollection
        isOpen={showCollection}
        onClose={handleCollectionClose}
        onConfirm={handleCollectionConfirm}
      />
    </>
  );
};

export default MoreOptionsPopup;
