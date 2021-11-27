var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');
var serviceAccount = require("./pwagram-fb-key.json");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pwagram-ce869-default-rtdb.europe-west1.firebasedatabase.app/'
});


exports.storePostData = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  exports.storePostData = functions.https.onRequest(function (request, response) {
    cors(request, response, function () {
      admin.database().ref('posts').push({
        // id: request.body.id,
        // title: request.body.title,
        // location: request.body.location,
        // image: request.body.image
        id: request.body.id,
        prefix: request.body.prefix,
        master: request.body.master,
        house: request.body.house,
        split: request.body.split,
        npr: request.body.npr,
        npx: request.body.npx,
        description: request.body.description

      })
        .then(function () {
          webpush.setVapidDetails('mailto:ross.starkey@outlook.com',
            'BMlO0oZWg8hV_Y6zvSrSllEcmFJL_TcSWkQLpqn8Axnreur7ycCiW_mpA9OhCFq2Dfga5Y1XEwIpd9HdqA_GWv4',
            'jKLqWrY7XgH87lI-8fQFeAqSOXAdZQFqDGqSpQkNoMg');
          return admin.database().ref('subscriptions').once('value');
        })
        .then(function (subscriptions) {
          subscriptions.forEach(function (sub) {
            var pushConfig = {
              endpoint: sub.val().endpoint,
              keys: {
                auth: sub.val().keys.auth,
                p256dh: sub.val().keys.p256dh
              }
            };
            webpush.sendNotification(pushConfig, JSON.stringify({ title: 'New Post', content: 'New Post added!' }))
              .catch(function (err) {
                console.log(err);
              })
          });
          response.status(201).json({ message: 'Data stored', id: request.body.id });
        })
        .catch(function (err) {
          response.status(500).json({ error: err });
        });
    });
  });
});
