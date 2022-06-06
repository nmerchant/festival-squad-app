# [ARCHIVED] Festival Squad - iOS & Android App

### This is old app I was developing using React Native and Firebase.  It's no longer in development, but feel free to reference my code if it's of any use to you!

## Project Docs

* Notes: https://docs.google.com/document/d/1X9YFI7v6G4ffim3kHX0XRGTfYknMmNwBD42iO4xVXJM/edit?usp=sharing
* Trello: http://trello.com/b/HcDagP7z/vybe
* Firebase: https://console.firebase.google.com/u/0/project/vybe-fest/overview
* Festival Database: https://docs.google.com/spreadsheets/d/1SRwi0d8hT4bQkkm-gk6-kfBfsvvvv_Acy7Jx4nK0XNk/edit?usp=sharing

## Code Stuff

### Installation

```
$ npm install
$ cd ios && pod install
```

### Run on iOS

This should auto-launch an iPhone emulator (keyword should).

```
$ react-native run-ios
```


### Run on Android

This requires an Android Emulator to already be running.

* Create a new device in Android Studio > AVD Manager
* Name it something simple, I chose `pixel2`

The device should now be able to be run manually from AVD Manager or from the Terminal with `emulator @pixel2`

```
$ react-native run-android
```

If you encounter any errors, try a rebuild:
```
cd android && ./gradlew clean && cd .. && react-native run-android
```

### Issues and Solutions

* `permission denied: gradlew` - `cd android && chmod +x gradlew`
* `Could not install the app on the device, read the error above for details.` - `cd android && chmod 755 gradlew` - https://github.com/facebook/react-native/issues/8868
* `grpc cpu.h file not found` - downgrade node. v8.5.0 works.
* Debugger UI fails to connect at 10.2.2.2 - use `localhost` instead of that IP.  Not sure why the emulator doesn't open the right url automatically.

## Troubleshooting Android Build Errors (Missing Package Links)

If the error looks like the Android build is failing to find a newly added dependency, it may not have been imported correctly into the project.  Running `$ react-native-link <package>` is supposed to work, but sometimes it doesn't.  So go through and manually make sure the the following lines are in place (using Firebase as an example):

In `android/app/build.gradle`:
```
compile "com.google.firebase:firebase-core:11.6.0"`
```
At the top of `android/app/src/main/java/com/vybe/MainApplication.java`:
```
import io.invertase.firebase.RNFirebasePackage;
```
In `getPackages()` near the bottom of `android/app/src/main/java/com/vybe/MainApplication.java`:
```
new RNFirebasePackage(),
```

## Notes/TODO/Questions

* Firebase Firestore authentication / security: https://firebase.google.com/docs/firestore/security/overview
* Firebase offline sync: https://firebase.google.com/docs/firestore/manage-data/enable-offline
* Paging for all routes that may eventually need it (i.e. user friends)
* I want to track a list of events I'm going to, but I also want a # of users going for each event.  Currently writing transactions to store rsvp to user object and increment counter on event object.  This means data modified / deleted from user record would create concurrency problems.  But maybe this should fully tie this to the event object?
* What can we use cloud functions for?
* Figure out why `android/gradlew clean` doesn't work.  Have to `cd android && ./gradlew clean`

## Future Stuff, References, More Reading

### Libraries
* GetStream: https://getstream.io/react-native-activity-feed/tutorial/
* React Native Elements: https://github.com/react-native-training/react-native-elements/
* React Native Vector Icons: https://oblador.github.io/react-native-vector-icons/

### Native Boilerplate Components

* NativeBase: https://nativebase.io/
* Flat App Theme: https://market.nativebase.io/view/react-native-flat-app-theme
* Dating app boilerplate: https://market.nativebase.io/view/react-native-dating-app-theme
* Social app boilerplate: https://market.nativebase.io/view/react-native-social-app-theme
* Boilerplate using Firebase: https://market.nativebase.io/view/react-native-do-with-firebase

### Resources

* Facebook Graph API Documentation: https://developers.facebook.com/docs/graph-api/reference
* Material Icons: https://material.io/icons/
* Migo UI: https://ui8.net/products/migo-dating-ios-ui-kit
* UI Kits: https://ui8.net/categories/ui-kits
* Press & Hold Actions: https://codedaily.io/tutorials/24/React-Native-Press-and-Hold-Button-Actions
* React Native Spotify: https://github.com/lufinkey/react-native-spotify
  * Token refresh example: https://github.com/lufinkey/react-native-spotify/tree/master/example-server

### Examples & Documentation

* Facebook Login + Firebase Boilerplate: https://github.com/poprobertdaniel/fbLoginWithFirebaseExample/tree/master/fbLoginWithFirebaseExample
* Firebase + Redux Chat App: https://medium.com/react-native-development/build-a-chat-app-with-firebase-and-redux-part-1-8a2197fb0f88
* Firebase + Image Upload: https://github.com/CodeLinkIO/Firebase-Image-Upload-React-Native
* React Native Fetch Blob: https://github.com/wkh237/react-native-fetch-blob
* Firebase Android Package Declarations: https://github.com/invertase/react-native-firebase/blob/master/tests/android/app/src/main/java/com/reactnativefirebasedemo/MainApplication.java
