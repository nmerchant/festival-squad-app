import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Card } from 'react-native-elements';
import { StackRouter } from 'react-navigation';
import firebase from 'react-native-firebase';

import EventListScreen from './event-list';

const styles = require('../../styles/styles');

export default class EventScreen extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();

        this.user = props.screenProps.user;
        this.fbUser = this.user.fbUser;

        this.state ={
            loading: true
        };
    }

    render() {
        if (this.state.loading) {
            this.fetchEvents();
        }

        return (
            <EventListScreen navigation={this.props.navigation}
                events={this.state.events}
                user={this.user}
                fetchEvents={this.fetchEvents}
                eventCount={this.state.eventCount}
            />
        )
    }

    fetchEvents = (params, callback) => {
        let filtering = false;

        if (params) {
            this.params = params;
        } else {
            params = this.params;
        }
        if (callback) {
            this.callback = callback;
        } else {
            callback = this.callback;
        }

        let eventsDb = this.db.collection('events');
        let userEventsDb = this.db.collection('events');

        eventsDb = eventsDb.orderBy(params && params.orderBy || 'startDate');

        if (params) {
            if (params.favorites) {
                userEventsDb = userEventsDb.where('favorites.' + this.user.fbUser.id, '==', true);
                filtering = true;
            }
            if (params.attending) {
                userEventsDb = userEventsDb.where('attending.' + this.user.fbUser.id, '==', true);
                filtering = true;
            }
        }

        eventsDb.get().then((eventsData) => {
            let events = [];

            if (filtering) {
                userEventsDb.get().then((userEventsData) => {
                    let eventIds = [];

                    userEventsData.docs.forEach(userEvent => {
                        eventIds.push(userEvent.data().id);
                    });

                    eventsData.docs.forEach(event => {
                        if (eventIds.indexOf(event.data().id) != -1) {
                            events.push(event);
                        }
                    });

                    this.setState({
                        loading: false,
                        events: events,
                        eventCount: events.length
                    });

                    if (callback) {
                        callback(params);
                    }
                });
            } else {
                events = eventsData.docs;

                this.setState({
                    loading: false,
                    events: events,
                    eventCount: events.length
                });

                if (callback) {
                    callback(params);
                }
            }
        });
    }
};
