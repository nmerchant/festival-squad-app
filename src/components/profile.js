import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';

import EventCard from './events/event-card';

var ImagePicker = require('react-native-image-picker');

const colors = require('../styles/colors');
const styles = require('../styles/styles');

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

var options = {
  title: 'Update Profile Picture',
  // customButtons: [
  //   {name: 'fb', title: 'Choose Photo from Facebook'},
  // ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.screenProps = this.props.screenProps;
        this.user = this.screenProps.user;
        this.fbUser = this.user.fbUser;

        const state = this.props.navigation.state;
        this.profileUser = state.params && state.params.user || this.user;
        this.profileUser.id = this.profileUser.id || this.fbUser.id;

        this.isUserProfile = this.profileUser.id === this.fbUser.id;

        this.state = {
            picture: this.profileUser.facebookPicture,
            description: this.profileUser.description,
            loading: false
        };
    }

    componentDidMount() {
        this.getProfilePicture();
        this.getEvents();
    }

    render() {
        let adminButton = null;

        if (this.user.isAdmin && this.isUserProfile) {
            adminButton = (
                <Button
                    small
                    containerStyle={{margin: 10}}
                    icon={{name: 'tools', type: 'entypo', buttonStyle: {backgroundColor: '#e1183d'}}}
                    title='Admin'
                    onPress={this.navigateToAdminView}
                />
            )
        }

        return (
            <View style={[styles.baseStyle, {padding: 20, flexDirection: 'column'}]}>
                <View style={{flex: 1}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Avatar containerStyle={{
                            marginRight: 20,
                            marginTop: 10
                            }}
                            size={65}
                            rounded
                            source={{ uri: this.state.picture }}
                            onPress={this.selectProfilePicture}
                        />
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={[styles.bodyText, {
                                color: 'white',
                                fontSize: 22,
                                marginTop: 7,
                                marginBottom: 3
                            }]}>{this.profileUser.first_name}
                                { this.profileUser.age &&
                                    <Text>, {this.profileUser.age}</Text>
                                }
                            </Text>
                            { this.profileUser.location && this.profileUser.location.name &&
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
                                    <Icon containerStyle={{marginRight: 3, marginLeft: -3}}
                                        name='location-pin'
                                        type='entypo'
                                        color={colors.vybeGreen}
                                        size={20}
                                    />
                                        <Text style={[styles.bodyText, {
                                            color: colors.secondaryText,
                                            fontSize: 15
                                        }]}>{this.profileUser.location.name}</Text>
                                </View>
                            }
                        </View>
                    </View>
                    <Text style={[styles.bodyText, {marginTop: 15, padding: 0, lineHeight: 24}]}>
                        {this.state.description}
                    </Text>
                    <View style={{marginTop: 15, padding: 0}}>
                    <Text style={[styles.bodyText, {
                        color: colors.secondaryText
                    }]}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 20
                         }}>
                            {this.state.events && this.state.events.length}
                         </Text> UPCOMING EVENTS
                     </Text>
                        <FlatList
                            horizontal={true}
                            data={this.state.events}
                            extraData={this.state}
                            renderItem={(item) => {
                                return (
                                    <EventCard style={{marginBottom: 0, padding: 0}}
                                        navigation={this.props.navigation}
                                        data={item}
                                        user={this.user}
                                        viewType={'small-thumbnail'}
                                    />
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Button containerStyle={{margin: 10}} small title='Logout' onPress={this.screenProps.facebookLogout} />
                        <Button containerStyle={{margin: 10}} small title='Edit Profile' onPress={this.openEditProfileScreen} />
                        {adminButton}
                    </View>
                {this.state.loading &&
                    <View style={styles.loading}>
                      <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        )
    }

    uploadImage = (response) => {
        return new Promise((resolve, reject) => {
            // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            const uploadUri = response.uri;
            const imageRef = firebase.storage().ref('users/' + this.fbUser.id).child(response.fileName);
            const userRef = firebase.firestore().collection('users').doc(this.fbUser.id);
            let uploadBlob = null;

            this.setState({ loading: true });
            imageRef.put(response.uri, { contentType: response.type }).then((res) => {
                // console.log(res);
                if (res.state === 'success') {
                    userRef.update({
                        picture: res.metadata.name
                    }).then(() => {
                        this.setState({
                            picture: res.downloadURL,
                            loading: false
                        });
                        this.screenProps.updateUserRecord();
                    });
                }
            });

            // fs.readFile(uploadUri, 'base64')
            //   .then((data) => {
            //     return Blob.build(data, { type: `${mime};BASE64` });
            //   })
            //   .then((blob) => {
            //     uploadBlob = blob;
            //     return imageRef.put(blob, { contentType: mime });
            //   })
            //   .then(() => {
            //     uploadBlob.close();
            //     return imageRef.getDownloadURL();
            //   })
            //   .then((url) => {
            //     resolve(url);
            //   })
            //   .catch((error) => {
            //     reject(error);
            // })
        });
    }

    getProfilePicture = () => {
        if (!this.profileUser.picture) {
            return;
        }

        const imageRef = firebase.storage().ref('users/' + this.profileUser.id).child(this.profileUser.picture);
        imageRef.getDownloadURL().then((uri) => {
            this.setState({ picture: uri });
        }).catch(() => {});
    }

    selectProfilePicture = () => {
        if (!this.isUserProfile) {
            return;
        }

        const profilePictures = firebase.storage().ref('users/' + this.fbUser.id);

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // let source = { uri: response.uri };
                // this.setState({image_uri: response.uri})

                // You can also display the image using data:
                // let image_uri = { uri: 'data:image/jpeg;base64,' + response.data };

                this.uploadImage(response).then(url => {
                    console.log('uploaded');
                    this.setState({image_uri: url})
                }).catch(error => console.log(error));
            }
        });
    }

    getEvents = () => {
        let events = [];
        let eventsDb = firebase.firestore().collection('events');
        eventsDb = eventsDb.orderBy('startDate');

        eventsDb.get().then((data) => {
            const docs = data.docs;
            docs.forEach((doc) => {
                const attending = doc.data().attending;
                if (attending && attending[this.profileUser.id]) {
                    events.push(doc);
                }
            });

            this.setState({
                events: events
            });
        });
    }

    openEditProfileScreen = () => {
        this.props.navigation.navigate('EditProfile', {
            user: this.screenProps.user,
            updateUserRecord: this.updateUserRecord
        });
    }

    updateUserRecord = () => {
        this.screenProps.updateUserRecord((data) => {
            this.user = data;
            this.setState({
                description: data.description
            });
            this.props.navigation.goBack(null);
        });
    }

    navigateToAdminView = () => {
        this.props.navigation.navigate('Admin');
    }
};
