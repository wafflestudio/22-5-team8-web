import type { Collection, Movie, People, UserProfile } from '../utils/Types';

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
    return (await response.json()) as UserProfile;
  } catch (err) {
    console.error('User fetch error:', err);
    return null;
  }
};
