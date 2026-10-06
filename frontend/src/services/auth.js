export async function login(email, password) {
  try {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username: email,
        password,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.user || {
        email,
        name: email.split('@')[0],
      };

      localStorage.setItem('campusfix_token', data.access || 'token_' + Date.now());
      if (data.refresh) {
        localStorage.setItem('campusfix_refresh', data.refresh);
      }
      localStorage.setItem('campusfix_user', JSON.stringify(user));

      return user;
    } else if (res.status === 400 || res.status === 401) {
      const data = await res.json().catch(() => ({}));
      const message =
        data.non_field_errors?.[0] ||
        data.detail ||
        data.error ||
        'Invalid credentials. Please check your email and password.';
      throw new Error(message);
    }
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
  }

  // Fallback demo user when backend endpoint is not yet available
  const demoUser = {
    email,
    name: email.split('@')[0],
  };
  localStorage.setItem('campusfix_token', 'demo_token_' + Date.now());
  localStorage.setItem('campusfix_user', JSON.stringify(demoUser));
  return demoUser;
}

export async function register(formData) {
  try {
    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        username: formData.email || formData.username,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.user || {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
      };

      localStorage.setItem('campusfix_token', data.access || 'token_' + Date.now());
      if (data.refresh) {
        localStorage.setItem('campusfix_refresh', data.refresh);
      }
      localStorage.setItem('campusfix_user', JSON.stringify(user));

      return user;
    } else if (res.status === 400 || res.status === 422) {
      const data = await res.json().catch(() => ({}));
      const firstError = Object.values(data).flat()[0];
      throw new Error(firstError || 'Registration failed. Please try again.');
    }
  } catch (err) {
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
  }

  // Fallback demo user when backend endpoint is not yet available
  const demoUser = {
    email: formData.email,
    name: formData.name || formData.email.split('@')[0],
  };
  localStorage.setItem('campusfix_token', 'demo_token_' + Date.now());
  localStorage.setItem('campusfix_user', JSON.stringify(demoUser));
  return demoUser;
}

export function logout() {
  localStorage.removeItem('campusfix_token');
  localStorage.removeItem('campusfix_refresh');
  localStorage.removeItem('campusfix_user');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('campusfix_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}