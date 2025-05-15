import BASE_URL from './config';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/user_authentication/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
