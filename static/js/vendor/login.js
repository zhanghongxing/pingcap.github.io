$('document').ready(function () {
  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile',
  });

  var authResult
  var userProfile

  $('#qsLoginBtn').click(function (e) {
    e.preventDefault();
    webAuth.authorize();
  });

  $('#qsLogoutBtn').click(function (e) {
    console.log('inside logout click');
    e.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username')
    localStorage.removeItem('avatar')
    // debugger
    webAuth.logout({
      returnTo: AUTH0_LOGOUT_URL,
      client_id: AUTH0_CLIENT_ID
    })
  });

  function setSession() {
    // Set the time that the access token will expire at
    console.log('authResult: ', authResult.expiresIn * 1000)
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    console.log('expire at: ',expiresAt)
  }

  // function logout() {
  //   // Remove tokens and expiry time from localStorage
  //   console.log('inside logout click')
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('id_token');
  //   localStorage.removeItem('expires_at');
  //   debugger
  //   webAuth.logout({
  //     returnTo: AUTH0_LOGOUT_URL,
  //     client_id: AUTH0_CLIENT_ID
  //   })
  // }

  function getUserProfile() {
    webAuth.client.userInfo(authResult.accessToken, function (err, profile) {
      userProfile = profile
      console.log('userprofile:', userProfile)
      localStorage.setItem('username', userProfile.name)
      localStorage.setItem('avatar', userProfile.picture)
    })
  }
  $('#username').text(localStorage.username)
  $('.j-avatar').attr('src', localStorage.avatar)

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication() {
    console.log('handle token')
    webAuth.parseHash(function (err, authenticationRes) {
      authResult = authenticationRes
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('authResult: ', authResult)
        console.log('authResult.accessToken', authResult.accessToken)
        console.log('authResult.idToken', authResult.idToken)
        window.location.hash = '';
        setSession();
        getUserProfile();
      } else if (err) {
        console.log('inside handleAuthentication error ', err)
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
    });
  }

  handleAuthentication();

  // $('#handle-parse-hash').text()
});
