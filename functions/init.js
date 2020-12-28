const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('./service-account-key.json');
const express = require('express');
const cors = require('cors');
const {env} = process;

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
        projectId: serviceAccount.project_id
    }),
    databaseURL: 'https://speako.firebaseio.com',
    storageBucket: 'speako.appspot.com',
});

env['GOOGLE_APPLICATION_CREDENTIALS'] = path.join(__dirname, 'service-account-key.json');


exports.initHttp = () => {
    const app = express();
    app.use(cors({origin: true}));
    return {app, admin};
}

exports.initTrigger = () => {
    return {admin};
}

exports.redeemMemberBalance = async (uid, noc) => {
    return await admin.firestore().runTransaction(async transaction => {
        let res = await admin.firestore().collection('members')
            .where('uid', '==', uid)
            .get();
        if (res.size !== 1) {
            return Promise.reject(new Error('member record not found, please contact support'));
        }
        const doc = res.docs[0];
        let newBalance = doc.data().balance - noc;
        if (newBalance > 0) {
            transaction.update(doc.ref, {balance: newBalance});
            return Promise.resolve(newBalance);
        } else {
            const neededBalance = noc - doc.data().balance;
            return Promise.reject(new Error(`You Are Out Of Balance: You Need Extra ${neededBalance} Points, Please Recharge Your Credit`));
        }
    });
}

exports.rechargeMemberBalance = async (points, data) => {
    const balanceInfo =  await admin.firestore().runTransaction(async transaction => {
        let res = await admin.firestore().collection('members')
            .where('uid', '==', data.passthrough)
            .get();
        if (res.size !== 1) {
            return Promise.reject(new Error('member record not found, please contact support'));
        }
        const doc = res.docs[0];
        const oldBalance = doc.data().balance;
        let newBalance = oldBalance + points;
        transaction.update(doc.ref, {balance: newBalance});
        return Promise.resolve({newBalance, oldBalance, points});
    });
    await admin.firestore().collection('payments').add({
        uid: data.passthrough,
        order_id: data.order_id,
        currency: data.currency,
        product_id: data.product_id,
        product_name: data.product_name,
        quantity: data.quantity,
        receipt_url: data.receipt_url,
        sale_gross: data.sale_gross,
        payment_method: data.payment_method,
        points: balanceInfo.points,
        date: new Date().toLocaleDateString()
    });
    return balanceInfo;
}

exports.revertPoints = async (points, uid) => {
    if (!uid) {
         return;
    }
    const balanceInfo =  await admin.firestore().runTransaction(async transaction => {
        let res = await admin.firestore().collection('members')
            .where('uid', '==', uid)
            .get();
        if (res.size !== 1) {
            return Promise.reject(new Error('member record not found, please contact support'));
        }
        const doc = res.docs[0];
        const oldBalance = doc.data().balance;
        let newBalance = oldBalance + points;
        transaction.update(doc.ref, {balance: newBalance});
        return Promise.resolve({newBalance, oldBalance, points});
    });
    return balanceInfo;
}
