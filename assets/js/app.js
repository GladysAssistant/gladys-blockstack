document.addEventListener('DOMContentLoaded', function(event) {

  var params = [];
  var blockStackParams = [];
  
  document.getElementById('signin-button').addEventListener('click', function(event) {
    event.preventDefault();
    var redirectURI = `${window.location.href}`;
    var manifestURI = `${window.location.origin}/hooks/blockstack/manifest.json`;
    blockstack.redirectToSignIn(redirectURI, manifestURI);
  });
  
  document.getElementById('signout-button').addEventListener('click', function(event) {
    event.preventDefault();
    blockstack.signUserOut(window.location.href);
  });

  document.getElementById('save-to-blockstack-button').addEventListener('click', function(event) {
    event.preventDefault();
    blockstack.putFile('params.json', JSON.stringify(params))
      .then(() => {
        document.getElementById('save-to-blockstack-button').innerText = 'Saved!';
        showProfile();
      });
  });

  document.getElementById('import-from-blockstack-button').addEventListener('click', function(event) {
    event.preventDefault();
    var promises = [];
    blockStackParams.forEach((blockStackParam) => {
      promises.push(fetch(`${window.location.origin}/param`, {
        method: 'post',
        body: JSON.stringify({
          name: blockStackParam.name,
          value: blockStackParam.value
        })
      }));
    });
    Promise.all(promises)
      .then(() => {
        document.getElementById('import-from-blockstack-button').innerText = 'Imported!';
        showProfile();
      });
  });

  function showProfile() {
    //var person = new blockstack.Person(profile);
    fetch(`${window.location.origin}/param`)
      .then((response) => response.json())
      .then((data) => {
        params = data;
        document.getElementById('gladys-param-count').innerText = `You have ${data.length} params in Gladys.`;
      });
   
    blockstack.getFile('params.json')
      .then((data) => {
        data = JSON.parse(data);
        blockStackParams = data;
        if(data) {
          document.getElementById('blockstack-param-count').innerText = `You have ${data.length} params saved in BlockStack.`;
        } else {
          document.getElementById('blockstack-param-count').innerText = `You have 0 params saved in BlockStack.`;
        }
      })
      .catch(() => {
        document.getElementById('blockstack-param-count').innerText = `You have 0 params saved in BlockStack.`;
      });
    document.getElementById('section-1').style.display = 'none';
    document.getElementById('section-2').style.display = 'block';
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile;
    showProfile(profile);
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location.reload();
    });
  } else {
    document.getElementById('section-1').style.display = 'block';
  }
});
