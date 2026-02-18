
import { db } from './db';

// Endpoint for the local Express backend
const REPORTING_URL = 'http://localhost:3000/send-error-email';

export interface ErrorReport {
  error_name: string;
  error_message: string;
}

export const reportWebcamError = async (error: any) => {
  const user = db.getCurrentUser();

  const payload = {
    user_id: user?.id || 'guest',
    error_name: error.name || 'UnknownError',
    error_message: error.message || String(error),
    browser: navigator.userAgent
  };

  try {
    // Send the error details to the local backend server
    const response = await fetch(REPORTING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Backend server responded with status: ${response.status}`);
    }

    console.log('Webcam error reported to support team via backend.');
  } catch (err) {
    // We log to console but don't disrupt the user experience if reporting fails
    console.error('Error reporting service failed. Ensure the backend server is running on port 3000.', err);
  }
};
