

export const environment = {
  production: false,
  // Point to Gateway, NOT directly to microservices
  gatewayUrl: 'http://localhost:9000',

  memberServiceUrl: 'http://localhost:9000/MEMBER/membres',
  eventServiceUrl: 'http://localhost:9000/EVENEMENT/evenements',
  outilServiceUrl: 'http://localhost:9000/OUTIL/outils',
  publicationServiceUrl: 'http://localhost:9000/PUBLICATION/publications'
};

export const firebaseConfig = {
  apiKey: "AIzaSyBl4Wkyej1VUTv1xXTjleER6t2bD9KoFw4",
  authDomain: "projetangular-91bcc.firebaseapp.com",
  projectId: "projetangular-91bcc",
  storageBucket: "projetangular-91bcc.firebasestorage.app",
  messagingSenderId: "959068212449",
  appId: "1:959068212449:web:9b6d18665591af58bdfba0",
  measurementId: "G-EYH9G2S373"
};
