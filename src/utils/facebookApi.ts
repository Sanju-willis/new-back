// src\utils\facebookApi.ts
import axios from 'axios';
import { UnauthorizedError, BadRequestError } from '@/errors/Errors';

const BASE_URL = 'https://graph.facebook.com/v22.0';

const handleFacebookApiError = (err: any, fallbackMsg: string) => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = err.response?.data?.error?.message || fallbackMsg;

    if (status === 401 || status === 403) {
      throw new UnauthorizedError(message);
    }

    throw new BadRequestError(message);
  }

  throw new BadRequestError(fallbackMsg);
};

// 🔹 Fetch pages the user manages
export async function fetchUserManagedPages(accessToken: string) {
  const url = `${BASE_URL}/me/accounts`;

  try {
    const { data } = await axios.get(url, {
      params: { access_token: accessToken },
    });

    return data?.data || [];
  } catch (err: any) {
    handleFacebookApiError(err, 'Failed to fetch user-managed pages');
  }
}

// 🔹 Fetch insights for a page
export async function fetchPageInsights(pageId: string, accessToken: string) {
  const metrics = [
    'page_impressions',
    'page_engaged_users',
    'page_views_total',
    'page_fans',
    'page_post_engagements',
  ];

  const url = `${BASE_URL}/${pageId}/insights`;

  try {
    const { data } = await axios.get(url, {
      params: {
        access_token: accessToken,
        metric: metrics.join(','),
      },
    });

    return data?.data || [];
  } catch (err: any) {
    handleFacebookApiError(err, 'Failed to fetch page insights');
  }
}
