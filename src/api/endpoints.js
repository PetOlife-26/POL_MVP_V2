/**
 * API endpoints for the Homepg early-access registration forms.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function submitPetParentForm(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register-interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pet_parent', ...data }),
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.detail || result.error || 'Registration failed' };
    }
    return { success: true, message: result.message || 'Registration successful!' };
  } catch (err) {
    console.error('submitPetParentForm error:', err);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

export async function submitVetForm(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register-interest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'veterinarian', ...data }),
    });
    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.detail || result.error || 'Registration failed' };
    }
    return { success: true, message: result.message || 'Registration successful!' };
  } catch (err) {
    console.error('submitVetForm error:', err);
    return { success: false, message: 'Network error. Please try again.' };
  }
}
