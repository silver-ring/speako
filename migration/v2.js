const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
        projectId: serviceAccount.project_id
    }),
    databaseURL: 'https://speako.firebaseio.com',
    storageBucket: 'speako.appspot.com',
});


listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
        .then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
                console.log(userRecord.uid);
                admin.firestore().collection('user_ext').add({
                    newsSubscription: true,
                    tellUs: '',
                    uid: userRecord.uid
                });
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        })
        .catch(function(error) {
            console.log('Error listing users:', error);
        });
}

listAllUsers();
