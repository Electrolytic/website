var APP = new Vue({
  el: '#app',
  data: {
    photoURL: '',
    loggedIn: false,

    appKey: '',
    appName: '',
    appSecret: '',
  },
  methods: {
    doAuth: function () { _auth(); },
    doSignOut: function () { _signOut(); }
  }
})

firebase.initializeApp({
  projectId: "electrolytic",
  authDomain: "electrolytic.firebaseapp.com",
  apiKey: "AIzaSyBDIGQxo2GLD6D2ChY2Fgu0CTuHoU75XsA",
});

function signedOut () {
  APP.loggedIn = false;
  APP.photoURL = '';
}

function signedIn (user) {
  APP.loggedIn = true;
  APP.photoURL = user.photoURL;

  _getAppDetails()
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    signedIn(user);
  } else {
    signedOut();
  }
});

function _auth () {
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(console.log);
}

function _signOut () {
  firebase.auth().signOut();
}

function _getMyApps () {
  var getApps = firebase.functions().httpsCallable('getMyApps');
  return getApps().catch(console.error);
}

function _getAppDetails () {
  setTimeout(() => {
    _getMyApps().then(function (result) {
      let apps = result.data.apps;
      if (apps) {
        apps = apps[0];

        APP.appKey = apps.key;
        APP.appName = apps.name;
        APP.appSecret = apps.secret;
      }
    })
  }, 1000);
}