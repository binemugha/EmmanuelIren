/**
 * Speaking Page JavaScript
 * Handles booking form submission with Firebase
 */

import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Booking form handler
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      // Save to Firestore
      await addDoc(collection(db, 'speakingRequests'), {
        name: formData.get('name'),
        email: formData.get('email'),
        organization: formData.get('organization'),
        eventDate: formData.get('eventDate') || null,
        eventType: formData.get('eventType') || null,
        message: formData.get('message'),
        status: 'pending',
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        source: window.location.href
      });
      
      // Show success message
      alert('Thank you! Your speaking request has been submitted. We\'ll get back to you within 48-72 hours.');
      bookingForm.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error sending your request. Please try again or email us directly at hello@emmanueliren.com');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

console.log('Speaking page loaded');
