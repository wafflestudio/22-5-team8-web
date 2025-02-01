import type {
  Collection,
  CollectionComment,
  Movie,
  People,
  Reply,
  Review,
  UserProfile,
} from '../utils/Types';

export const fetchMovie = async (movieId: number) => {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    return (await response.json()) as Movie;
  } catch (err) {
    console.error('Movie fetch error:', err);
    return null;
  }
};

export const fetchPeople = async (peopleId: number) => {
  try {
    const response = await fetch(`/api/participants/${peopleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch people details');
    }

    return (await response.json()) as People;
  } catch (err) {
    console.error('People fetch error:', err);
    return null;
  }
};

export const fetchCollection = async (collectionId: number) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch collection details');
    }

    return (await response.json()) as Collection;
  } catch (err) {
    console.error('Collection fetch error:', err);
    return null;
  }
};

export const fetchUser = async (userId: number) => {
  try {
    const response = await fetch(`/api/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return { ...(await response.json()), user_id: userId } as UserProfile;
  } catch (err) {
    console.error('User fetch error:', err);
    return null;
  }
};

export const fetchUserReviews = async (accessToken: string) => {
  try {
    const response = await fetch(`/api/reviews/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }
    return (await response.json()) as Review[];
  } catch (err) {
    console.error('User reviews fetch error:', err);
    return null;
  }
};

export const fetchReviewWithId = async (reviewId: number) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch review');
    }
    const review = (await response.json()) as Review;

    return review;
  } catch (err) {
    console.error('Review fetch error:', err);
    return null;
  }
};

export const fetchReplyList = async (
  reviewId: number,
  begin: number,
  end: number,
) => {
  try {
    const response = await fetch(
      `/api/comments/review/${reviewId}?begin=${begin}&end=${end}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    //console.log(await response.text());
    if (!response.ok) {
      throw new Error('Failed to fetch reply list');
    }
    return (await response.json()) as Reply[];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchLoggedInReplyList = async (
  reviewId: number,
  accessToken: string,
  begin: number,
  end: number,
) => {
  try {
    //console.log(`/api/comments/list/${reviewId}?begin=${begin}&end=${end}`);
    const response = await fetch(
      `/api/comments/list/${reviewId}?begin=${begin}&end=${end}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    //console.log(await response.text());

    if (!response.ok) {
      throw new Error('Failed to fetch reply list');
    }
    return (await response.json()) as Reply[];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateReview = async (
  reviewId: number,
  accessToken: string,
  content: string,
  rating: number,
  spoiler: boolean,
  status: '' | 'WatchList' | 'Watching',
  onReviewUpdate: (updatedReview: Review | null) => void,
) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content: content,
        rating: rating,
        spoiler: spoiler,
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save rating');
    }

    const data = (await response.json()) as Review;
    //console.log(data);

    onReviewUpdate(data);
  } catch (err) {
    console.error(err);
  }
};

export const newReview = async (
  movieId: number,
  accessToken: string,
  content: string,
  rating: number,
  spoiler: boolean,
  status: '' | 'WatchList' | 'Watching',
  onReviewUpdate: (updatedReview: Review | null) => void,
) => {
  try {
    const response = await fetch(`/api/reviews/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content: content,
        rating: rating,
        spoiler: spoiler,
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save review');
    }

    const data = (await response.json()) as Review;
    //console.log(data);

    onReviewUpdate(data);
  } catch (err) {
    console.error(err);
  }
};

export const deleteReview = async (
  reviewId: number,
  accessToken: string,
  onReviewDelete: (deletedReviewId: number) => void,
) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    //console.log(response);

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }

    onReviewDelete(reviewId);
  } catch (err) {
    console.error(err);
  }
};

export const patchCollection = async (
  collection_id: number,
  title: string,
  overview: string | null,
  add_movie_ids: number[],
  delete_movie_ids: number[],
  accessToken: string,
) => {
  try {
    const response = await fetch(`/api/collections/${collection_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title,
        overview,
        add_movie_ids,
        delete_movie_ids,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update collection');
    }

    return (await response.json()) as string;
  } catch (err) {
    console.error('Collection update error:', err);
    return null;
  }
};

export const fetchBlokedUserList = async (user_id: number) => {
  try {
    const response = await fetch(`/api/users/blocked_users/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blocked user list');
    }

    const blockedUserList = (await response.json()) as { id: number[] };
    return blockedUserList.id;
  } catch (err) {
    console.error('Blocked user list fetch error:', err);
    return [];
  }
};

export const fetchCollectionCommentList = async (
  collectionId: number,
  begin: number,
  end: number,
) => {
  try {
    const response = await fetch(
      `/api/collection_comments/${collectionId}/list?begin=${begin}&end=${end}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    //console.log(await response.text());
    if (!response.ok) {
      throw new Error('Failed to fetch reply list');
    }
    return (await response.json()) as CollectionComment[];
  } catch (err) {
    console.error(err);
    return null;
  }
};
