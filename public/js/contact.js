/**
 * Contact Page JavaScript
 * Handles contact form submission with Firebase
 */

import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Contact form handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      // Save to Firestore
      await addDoc(collection(db, 'contactRequests'), {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'general',
        message: formData.get('message'),
        status: 'pending',
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        source: window.location.href
      });
      
      // Show success message
      alert('Thank you for your message! We\'ll get back to you soon.');
      contactForm.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error sending your message. Please try again or email us directly at hello@emmanueliren.com');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

console.log('Contact page loaded');
