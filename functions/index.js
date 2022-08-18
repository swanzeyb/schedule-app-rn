const functions = require('firebase-functions')
const vision = require('@google-cloud/vision')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', {structuredData: true})
//   response.send('Hello from Firebase!')
// })

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info(context.auth.token?.firebase?.sign_in_provider, {structuredData: true})
  if (context.auth.token?.firebase?.sign_in_provider !== 'google.com') {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'annotateImage must be called while authenticated.'
    )
  }
  try {
    response.send('Hello from Firebase!')
  } catch (e) {
    throw new functions.https.HttpsError('internal', e.message, e.details)
  }
})
