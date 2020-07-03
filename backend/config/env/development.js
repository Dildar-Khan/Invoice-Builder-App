export const devConfig = {
    port: process.env.PORT || 3000,
    database:
        'mongodb+srv://DildarKhan:khan@invoice-builder-app-0rjad.mongodb.net/InvoiceBuilderDB?retryWrites=true&w=majority',
    secret: 'what_is_this_secret_all_about_I_do_not_care',
    // below URL doesn't work in production
    // frontendURL: 'http://localhost:4200',
    google: {
        clientId:
            '1090621758108-e5bkpi6oonimrqkc2ftks00k49e7ta11.apps.googleusercontent.com',
        clientSecret: 'ZCx3ETesMt9D342O_PCoFb0V',
        callbackURL:
            'https://invoice-builder-app.herokuapp.com/api/auth/google/callback',
    },
    twitter: {
        consumerKey: '',
        consumerSecret: '',
        callbackURL:
            'https://invoice-builder-app.herokuapp.com/api/auth/google/callback',
    },
    github: {
        clientId: '9a335e86a31b21c1c7b5',
        clientSecret: 'c71d1ac2233467473a7dfb959e2cd77194d505af',
        callbackURL:
            'https://invoice-builder-app.herokuapp.com/api/auth/github/callback',
    },
    ethereal: {
        username: 'hayley.hyatt52@ethereal.email',
        password: 'a3xyxyBh5s976Q8AUj',
        host: 'smtp.ethereal.email',
        port: 587,
    },
};
