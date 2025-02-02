import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import no_profile from '../../assets/no_profile.svg';
import { useAuth } from '../../components/AuthContext';
import CollectionBlock from '../../components/CollectionBlock';
import CommentFragment from '../../components/CommentFragment';
import { Footerbar } from '../../components/Footerbar';
import {
  fetchLikesCollection,
  fetchLikesParticipant,
  fetchLikesReview,
} from '../../utils/Functions';
import type { Collection, Participant, Review } from '../../utils/Types';

export const Likes = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [collections, setCollections] = useState<Collection[] | null>([]);
  const [participants, setParticipants] = useState<Participant[] | null>([]);
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const [activeTab, setActiveTab] = useState<
    'participants' | 'collections' | 'reviews'
  >(() => {
    const selected = searchParams.get('selected');
    if (selected === 'collections') return 'collections';
    if (selected === 'reviews') return 'reviews';
    return 'participants';
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken == null) {
          return;
        }
        const collectionsData = await fetchLikesCollection(accessToken);
        const participantsData = await fetchLikesParticipant(accessToken);
        const reviewsData = await fetchLikesReview(accessToken);

        setCollections(collectionsData);
        setParticipants(participantsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    void fetchData();
  }, [accessToken]);

  const renderContent = () => {
    switch (activeTab) {
      case 'participants':
        return (
          <div className="grid grid-cols-3 gap-4">
            {participants?.map((participant: Participant) => (
              <div
                key={participant.id}
                className="flex flex-col items-center p-2 cursor-pointer"
                onClick={() => void navigate(`/people/${participant.id}`)}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                  <img
                    src={participant.profile_url ?? no_profile}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="font-semibold">{participant.name}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'collections':
        return (
          <div className="grid gap-4">
            {collections?.map((collection: Collection) => (
              <CollectionBlock key={collection.id} collection={collection} />
            ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-4">
            {reviews?.map((review: Review) => (
              <CommentFragment
                key={review.id}
                viewMode="commentPage"
                initialReview={review}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-4">
        <h2 className="text-xl font-bold mb-4">좋아요</h2>

        <div className="flex justify-center border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'participants' ? 'border-b-2 border-black font-bold' : ''} w-full`}
            onClick={() => {
              setActiveTab('participants');
            }}
          >
            인물
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'collections' ? 'border-b-2 border-black font-bold' : ''} w-full`}
            onClick={() => {
              setActiveTab('collections');
            }}
          >
            컬렉션
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-black font-bold' : ''} w-full`}
            onClick={() => {
              setActiveTab('reviews');
            }}
          >
            코멘트
          </button>
        </div>

        {renderContent()}
      </div>

      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
