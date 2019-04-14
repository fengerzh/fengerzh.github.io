if (typeof firebase === 'undefined')
  throw new Error(
    'hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js'
  );
firebase.initializeApp({
  apiKey: 'AIzaSyBHQjxlE2uaJ0janHVGUMsXpPGggkh-XrQ',
  // "apiKey": "AIzaSyCx13-CU1uqE3xQWpx1yxNBujUgnNmVb1Q",
  databaseURL: 'https://fengerzhcom.firebaseio.com',
  storageBucket: 'fengerzhcom.appspot.com',
  authDomain: 'fengerzhcom.firebaseapp.com',
  messagingSenderId: '84597767663',
  projectId: 'fengerzhcom'
});
