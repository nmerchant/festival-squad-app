import React, { Component } from 'react';
import { View, Image, ActivityIndicator, FlatList, BackHandler, ScrollView } from 'react-native';
import { Text, Card, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';
import _ from 'lodash';

import EventUserList from '../events/event-user-list';
import CreatePostButton from '../posts/create-post-button';
import Posts from '../posts/posts';

const colors = require('../../styles/colors');
const styles = require('../../styles/styles');

export default class EventScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;

        return {
            headerTitle: 'Event Details'//params.doc.data().name
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            isAttending: false,
            isFavorite: false,
            numAttending: 0,
            numFavorites: 0,
            loading: true,
            eventDoc: null
        };

        this.db = firebase.firestore();
        this.screenProps = this.props.screenProps;
        this.fbUser = this.screenProps.user.fbUser;
        this.params =  this.props.navigation.state.params;

        this.id = this.params.doc.id;
        this.eventsDb = this.db.collection('events');
        this.eventDocRef = this.eventsDb.doc(this.id);

        this.fetchData();
    }

    render() {
        if (this.state.loading) {
            return(
                <View style={[styles.baseStyle, styles.container]}><ActivityIndicator /></View>
            );
        }

        let {
            startDate,
            endDate,
            name,
            city,
            state
        } = this.state.eventDoc.data();
        startDate = moment(startDate);
        endDate = moment(endDate);
        const endDateFormat = (!startDate.isSame(endDate, 'month')) ? 'MMMM D' : 'D';
        const dates = startDate.format('MMMM D') + ' - ' + endDate.format(endDateFormat) + ', ' + startDate.format('YYYY');

/*

    <Icon containerStyle={{marginRight: 3, marginTop: 3}}
        name='calendar'
        type='material-community'
        color={colors.vybeRed}
        size={20}
    />
*/
        return (
            <ScrollView style={styles.baseStyle}>
                <View style={{height: 200}}>
                    <Image style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                        resizeMode='cover'
                        source={{uri: this.params.eventImage}}
                    />
                </View>
                <View style={[styles.baseStyle, { padding: 10 }]}>
                    <View style={[{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                    }]}>
                        <View style={{flex: 1}}>
                            <Text h3 style={[styles.bodyText, {fontSize: 23, color: 'white', width: 300}]}>{name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
                                    <Text style={[styles.bodyText, {
                                        fontSize: 16,
                                        marginTop: 1
                                    }]}>{dates}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
                                <Icon containerStyle={{marginRight: 3, marginLeft: -3}}
                                    name='location-pin'
                                    type='entypo'
                                    color={colors.vybeGreen}
                                    size={20}
                                />
                                    <Text style={[styles.bodyText, {
                                        color: colors.secondaryText,
                                        fontSize: 14,
                                        marginTop: 1
                                    }]}>{city}, {state}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', marginBottom: 10}}>
                            <View style={{flexDirection: 'row', width: 80, justifyContent: 'flex-end', marginBottom: 10, marginTop: 5}}>
                                <Icon containerStyle={{marginRight: 10}}
                                    name={this.state.isAttending ? 'calendar-check' : 'calendar-blank'}
                                    type='material-community'
                                    color={this.state.isAttending ? '#8fcd18' : 'gray'}
                                    onPress={this.toggleAttending}
                                    underlayColor='#1E1A2A'
                                    size={28}
                                />
                                <Icon
                                    name={this.state.isFavorite ? 'star' : 'star-border'}
                                    color={this.state.isFavorite ? '#ffde00' : 'gray'}
                                    onPress={this.toggleFavorite}
                                    underlayColor='#1E1A2A'
                                    size={28}
                                />
                            </View>
                        </View>
                    </View>
                    <EventUserList
                        attending={this.state.attending}
                        openProfileScreen={this.openProfileScreen}
                    />
                    <CreatePostButton
                        openCreatePostScreen={this.openCreatePostScreen}
                        user={this.screenProps.user}
                    />
                    <Posts eventDocRef={this.eventDocRef} ref={(child) => { this.postsComponent = child; }} />
                </View>
            </ScrollView>
        );
    }

    fetchData = (callback) => {
        this.eventDocRef.get().then((eventDoc) => {
            const eventData = eventDoc && eventDoc.data() || {};
            const attendingCollection = eventData.attending || {};
            const favoritesCollection = eventData.favorites || {};
            let attending = [];
            let favorites = [];

            Object.keys(attendingCollection).forEach((attendee) => {
                if (attendingCollection[attendee]) {
                    attending.push(attendee);
                }
            });
            Object.keys(favoritesCollection).forEach((attendee, y) => {
                if (favoritesCollection[attendee]) {
                    favorites.push(attendee);
                }
            });

            const attendingPromises = [];
            attending.forEach((fbId) => {
                attendingPromises.push(new Promise((res, rej) => {
                    firebase.firestore().collection('users').doc(fbId).get().then((userDoc) => {
                        let attending = this.state.attending;
                        const data = userDoc.data();
                        data.id = fbId;
                        res(data);
                    }).catch((e) => {
                        // If user no longer exists, remove from attending object and update
                        delete attendingCollection[fbId];
                        attending = attending.splice(attending.indexOf(fbId), 1);
                        this.eventDocRef.update({
                            attending: attendingCollection
                        }).then(() => {
                            rej();
                        });
                    });
                }));
            });

            Promise.all(attendingPromises).then((attending) => {
                this.setState({ attending });
            }).catch((attending) => {
                console.log('eh', attending)
            });

            this.setState({
                eventDoc: eventDoc,
                loading: false,
                isFavorite: Boolean(favoritesCollection[this.fbUser.id]),
                isAttending: Boolean(attendingCollection[this.fbUser.id]),
                numFavorites: favorites.length,
                numAttending: attending.length
            }, () => {
                if (callback) {
                    callback();
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    toggleFavorite = () => {
        const eventData = this.state.eventDoc && this.state.eventDoc.data() || {};
        let favoritesCollection = eventData.favorites || {};
        const toggle = !Boolean(favoritesCollection[this.fbUser.id]);
        favoritesCollection[this.fbUser.id] = toggle;

        this.eventDocRef.update({ favorites: favoritesCollection }).then(() => {
            this.fetchData();
        });
    }

    toggleAttending = () => {
        const eventData = this.state.eventDoc && this.state.eventDoc.data() || {};
        let attendingCollection = eventData.attending || {};
        const toggle = !Boolean(attendingCollection[this.fbUser.id]);
        attendingCollection[this.fbUser.id] = toggle;

        this.eventDocRef.update({ attending: attendingCollection }).then(() => {
            this.fetchData(() => {
                this.params.updateProp({
                    isFavorite: this.state.isFavorite,
                    isAttending: this.state.isAttending,
                    numFavorites: this.state.numFavorites,
                    numAttending: this.state.numAttending,
                    attending: this.state.attending
                });
            });
        });
    }

    openProfileScreen = (user) => {
        console.log(user);
        this.props.navigation.navigate('Profile', {
            user: user
        });
    }

    openCreatePostScreen = () => {
        this.props.navigation.navigate('CreatePost', {
            eventDoc: this.state.eventDoc,
            user: this.screenProps.user,
            onPostCreated: this.onPostCreated
        });
    }

    onPostCreated = () => {
        this.fetchData(() => {
            this.props.navigation.goBack(null);
            this.postsComponent.fetchPosts();
        });
    }
};
