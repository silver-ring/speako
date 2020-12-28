const init = require('./init');
const {admin} = init.initTrigger();

exports.trigger = async (user, context) => {
    const uid = user.uid;
    const balance = 5000;
    const db = admin.firestore();
    await db.collection('members').add({
        uid,
        balance
    })
    return 'ok';
}
