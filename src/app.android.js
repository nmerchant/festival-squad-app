import React, {
    Component
} from 'react';
import {
    Text,
    View,
    Image,
    ActivityIndicator
} from 'react-native';
import {
    SocialIcon,
    Button,
     Avatar
 } from 'react-native-elements';
import {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager
} from 'react-native-fbsdk';
import { createAppContainer } from 'react-navigation';
import firebase from 'react-native-firebase';

import LoginScreen from './components/login';
import SplashScreen from './components/splash';
import { MainNavigator } from './components/router';

const AppContainer = createAppContainer(MainNavigator);

const styles = require('./styles/styles');

class Vybe extends Component {
    constructor() {
        super();

        console.log(AccessToken);

        this.db = firebase.firestore();

        this.state = {
            loading: true,
            user: null,
            selectedScreen: 'events'
        };
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={[styles.baseStyle, styles.container]}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }

        if (!this.state.user) {
            return (
                <LoginScreen
                    facebookLogin={this.facebookLogin}
                />
            );
        } else {
            console.log('rendering stuff', this.state.user);
            return <AppContainer screenProps={{
                user: this.state.user,
                facebookLogout: this.facebookLogout,
                updateUserRecord: this.updateUserRecord
            }} />;
        }
    }

    componentDidMount() {
        AccessToken.getCurrentAccessToken().then(this.onFetchedAccessToken)
    }

    onFetchedAccessToken = (data) => {
      console.log('fetch access token');
        if (!data) {
            // User is not logged in or token is invalid
            this.setState({ loading: false });
        } else {
            // Create Facebook credential with token and sign in
            this.setState({ tokens: data });
            const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
            firebase.auth().signInWithCredential(credential).then(this.onSigninWithCredential);
        }
    }

    onSigninWithCredential = (currentUser) => {
      console.log('sign in with credential', currentUser);
        this.fbUser = currentUser.additionalUserInfo.profile;
        const usersDb = this.db.collection('users');
        const userDoc = usersDb.doc(this.fbUser.id);

        console.log(userDoc);

        userDoc.get()
            .then(this.onFetchedFirebaseUserDocSuccess)
            .catch(this.onFetchedFirebaseUserDocError);
    }

    onFetchedFirebaseUserDocSuccess = (doc) => {
      console.log('fetched user doc', doc);
        var usersDb = this.db.collection('users');
        var userDoc = usersDb.doc(this.fbUser.id);
        let userObj = {
            email: this.fbUser.email,
            first_name: this.fbUser.first_name,
            last_name: this.fbUser.last_name,
            facebookPicture: this.fbUser.picture.data.url,
            gender: this.fbUser.gender,
            location: this.fbUser.location
        };

        // this.getUserLocation();

        userDoc.set({
            email: this.fbUser.email,
            first_name: this.fbUser.first_name,
            last_name: this.fbUser.last_name,
            facebookPicture: this.fbUser.picture.data.url,
            gender: this.fbUser.gender,
            location: this.fbUser.location
        }, { merge: true }).then(() => {
            userDoc.get().then(data => {
                this.getUsersFriends(data);
            });
        });
    }

    onFetchedFirebaseUserDocError = (error) => {
        console.log("Error getting document:", error);
        this.setState({ loading: false });
    }

    getUserLocation = (data) => {
        this.facebookGraphRequest('110843418940484', null, (error, result) => {
            console.log(error, result);
        });
    }

    getUsersFriends = (data) => {
        this.facebookGraphRequest('me/friends', null, (error, result) => {
            const facebookFriends = result.data;
            this.mergeFacebookFirebaseUserData({userDoc: data});//, facebookFriends: facebookFriends});
        });
    }

    facebookGraphRequest = (route, params, successHandler) => {
        const request = new GraphRequest(route, params, successHandler);
        new GraphRequestManager().addRequest(request).start();
    }

    mergeFacebookFirebaseUserData = (data) => {
        const user = data.userDoc.data();
        user.fbUser = this.fbUser;
        // user.facebookFriends = facebookFriends || [];

        console.log('user updated: ', user);
        this.setState({
            user,
            loading: false
        });
    }

    facebookLogin = () => {
      console.log('facebook login');
        this.setState({ loading: true });
        try {
            LoginManager.logInWithReadPermissions([
                'public_profile',
                'email',
                'user_birthday',
                'user_likes',
                'user_photos',
                'user_friends'
            ]).then((result) => {
              console.log('login manager logged in', result);
                AccessToken.getCurrentAccessToken().then(this.onFetchedAccessToken);
            });
        } catch (e) {
            console.error(e);
            this.setState({ loading: false });
        }
    }

    facebookLogout = () => {
        this.setState({ loading: true });
        try {
            LoginManager.logOut();
            this.setState({
                user: null,
                loading: false
            });
        } catch (e) {
            console.error(e);
            this.setState({ loading: false });
        }
    }

    updateUserRecord = (callback) => {
        console.log('update user record');
        var usersDb = this.db.collection('users');
        var userDoc = usersDb.doc(this.fbUser.id);
        userDoc.get().then(doc => {
            console.log('finished updating user record');
            this.mergeFacebookFirebaseUserData({userDoc: doc});
            if (callback) {
                callback(doc.data());
            }
        });
    }
}

export default Vybe;
