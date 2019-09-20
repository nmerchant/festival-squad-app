import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import {
   GraphRequest,
   GraphRequestManager
} from 'react-native-fbsdk';
import { SocialIcon, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

const styles = require('../../styles/styles');
const jsonData = require('../../data/festivals-2018.json');

export default class AdminScreen extends Component {
    static navigationOptions = () => {
        return {
            headerTitle: 'Admin'
        };
    };

    constructor(props) {
        super(props);

        this.screenProps = this.props.screenProps;

        this.storage = firebase.storage();
        this.db = firebase.firestore();

        this.getFacebookLikes = this.getFacebookLikes.bind(this);
    }

    render() {
        return (
            <View style={[styles.baseStyle, styles.container]}>
                <Button containerViewStyle={[{marginBottom: 10}]}
                    raised
                    title='Save Festivals From JSON'
                    onPress={this.saveFestivalsFromJson}
                />
                <Button
                    raised
                    title='Load User Likes'
                    onPress={this.getFacebookLikes}
                />
                <Button
                    raised
                    title='Delete Event Counts'
                    onPress={this.deleteEventCounts}
                />
            </View>
        )
    }

    saveFestivalsFromJson() {
        const festivalsDb = firebase.firestore().collection('events');

        jsonData.map((fest) => {
            console.log(fest.name, '...');
            const doc = festivalsDb.doc();

            doc
                .set({
                    id: fest.id,
                    name: fest.name,
                    startDate: fest.startDate,
                    endDate: fest.endDate,
                    city: fest.city,
                    state: fest.state,
                    country: fest.country
                }).then((savedData) => {
                    console.log('Saved doc', savedData);
                });
        });
    }

    getFacebookLikes() {
        const likes = [];
        console.log('Loading likes...');

        const onRequestSuccess = (error, result) => {
            console.log(result, 'before - ', result.paging.cursors.before, ' | after - ', result.paging.cursors.after);
            result.data.forEach((data) => {
                likes.push(data);
            });

            if (result.paging && result.paging.next) {
                fetch(result.paging.next).then((data) => data.json()).then((data) => {
                    onRequestSuccess(null, data);
                });
            } else {
                console.log(likes);
            }
        };

        const infoRequest = new GraphRequest(
              '/me/likes',
              // params,
              null,
              onRequestSuccess,
        );

        new GraphRequestManager().addRequest(infoRequest).start();
    }

    deleteEventCounts() {
        firebase.firestore().collection('events').get().then((eventDocs) => {
            eventDocs.docs.forEach(eventDoc => {
                eventDoc.ref.update({
                    numAttending: firebase.firestore.FieldValue.delete(),
                    numFavorites: firebase.firestore.FieldValue.delete()
                });
            });
        });
    }
};
