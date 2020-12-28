export const environment = {
    production: true,
    proxy: 'https://us-central1-speako.cloudfunctions.net',
    firebaseConfig: {
        projectId: 'speako',
        apiKey: 'AIzaSyDx_RR3JeYYXLwkUHOrhypNm-ZYiRdTXX0',
        authDomain: 'speako.firebaseapp.com',
        databaseURL: 'https://speako.firebaseio.com',
        storageBucket: 'speako.appspot.com',
        messagingSenderId: '714153631277'
    },
    pricingPackages: {
        basicPackage: {
            id: '593760'
        },
        extraPackage: {
            id: '593767'
        },
        superPackage: {
            id: '593769'
        },
    }
};
