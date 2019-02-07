import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';

import AddReactionButton from './add-reaction-button';
import CreatePostButton from './create-post-button';

const styles = require('../../styles/styles');

export default class Post extends Component {
    constructor(props) {
        super(props);

        this.doc = this.props.doc;
        this.db = firebase.firestore();
        this.user = this.props.user;

        this.state = {
            loading: true,
            text: this.doc.data().text,
        };
    }

    componentDidMount() {
        this.fetchUserInfo();
    }

    render() {
        const data = this.doc.data();
        let avatarProps = {
            containerStyle: {
                marginRight: 10
            },
            small: true,
            rounded: true
        };
        let picture = this.state.picture || '';

        if (picture) {
            avatarProps.source = { uri: picture };
        }

        if (this.state.loading) {
            return(
                <View>
                    <ActivityIndicator />
                </View>
            );
        }

        const fontSize = data.text.length < 50 ? 22 : 16;
        const postTime = moment(data.createdDate).fromNow();

        return (
            <View style={[styles.card, { marginTop: 10, marginBottom: 10, padding: 10 }]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
                }}>
                    <Avatar {...avatarProps} />
                    <View style={{flexDirection: 'column'}}>
                        <Text style={[styles.bodyText, { fontSize: 14 }]}>{this.state.author}</Text>
                        <Text style={[styles.bodyText, { fontSize: 12, color: "#b3b3b3" }]}>{postTime}</Text>
                    </View>
                </View>
                <Text style={[styles.bodyText, {fontSize}]}>{this.state.text}</Text>
                <AddReactionButton />
            </View>
        )
    }

    fetchUserInfo() {
        const authorUserId = this.doc.data().author;
        this.db.collection('users').doc(authorUserId).get()
            .then((authorDoc) => {
                const data = authorDoc.data() || {};
                this.fetchUserPicture(authorUserId, data.picture, (uri) => {
                    this.setState({
                        author: data.first_name || 'Unknown User',
                        loading: false,
                        picture: uri || data.facebookPicture
                    });
                });
            });
    }

    fetchUserPicture(id, picture, callback) {
        if (!picture) {
            callback();
            return;
        }

        const imageRef = firebase.storage().ref('users/' + id).child(picture);
        imageRef.getDownloadURL().then((uri) => {
            callback(uri);
        }).catch(() => {
            callback();
        });
    }
};
