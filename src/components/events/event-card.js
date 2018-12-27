import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';

const styles = require('../../styles/styles');

export default class EventCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAttending: false,
            isFavorite: false,
            numAttending: 0,
            numFavorites: 0,
            postCount: 0
        };

        this.doc = this.props.data.item;
        this.data = this.doc.data() || {};

        this.onCardPress = this.onCardPress.bind(this);
        this.updateProp = this.updateProp.bind(this);
    }

    componentDidMount() {
        const fbUser = this.props.user.fbUser;
        const eventId = this.data.id.toString();
        const imgUrl = 'events/' + this.data.id + '.png';
        const attendingCollection = this.data.attending || {};
        const favoritesCollection = this.data.favorites || {};
        const attending = [];
        const favorites = [];
        Object.keys(attendingCollection).forEach((attendee) => {
            if (attendingCollection[attendee]) {
                attending.push(attendingCollection[attendee]);
            }
        });
        Object.keys(favoritesCollection).forEach((attendee) => {
            if (favoritesCollection[attendee]) {
                favorites.push(favoritesCollection[attendee]);
            }
        });

        this.setState({ loading: true });

        firebase.storage().ref(imgUrl).getDownloadURL()
            .then((url) => {
                this.setState({
                    isAttending: Boolean(attendingCollection[fbUser.id]),
                    isFavorite: Boolean(favoritesCollection[fbUser.id]),
                    numAttending: attending.length,
                    numFavorites: favorites.length,
                    eventImage: url,
                    loading: false
                });
            })
            .catch((error) => { console.log(error); });
    }

    render() {
        const eventId = this.data.id.toString();
        const startDate = moment(this.data.startDate);
        const endDate = moment(this.data.endDate);

        let endDateFormat = 'D';
        if (!startDate.isSame(endDate, 'month')) {
            endDateFormat = 'MMMM D';
        }
        const dates = startDate.format('MMMM D') + '-' + endDate.format(endDateFormat) + ', ' + startDate.format('YYYY');

        let content = null;
        if (this.props.viewType === 'thumbnail') {
            content = this.getLargeCard(dates);
        } else if (this.props.viewType === 'list') {
            content = this.getListViewCard(dates);
        } else if (this.props.viewType === 'small-thumbnail') {
            content = this.getSmallCard(dates);
        }

        return (
            <TouchableOpacity onPress={this.onCardPress}>
                {content}
            </TouchableOpacity>
        );
    }

    onCardPress() {
        this.props.navigation.navigate('Event', {
            doc: this.doc,
            user: this.props.user,
            updateProp: this.updateProp,
            eventImage: this.state.eventImage
        });
    }

    updateProp(stateObj) {
        this.setState(stateObj);
    }

    getLargeCard(dates) {
        return (
            <Card containerStyle={[styles.card, {
                margin: 10,
                marginTop: 0,
                marginBottom: 20,
                borderWidth: 0
                }]}
                image={{uri: this.state.eventImage}}
                featuredTitleStyle={{color: '#fff', fontSize: 24, textShadowColor: 'black', textShadowOffset: {width: 2, height: 2, textShadowRadius: 2}}}
                featuredTitle={this.data.name}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.bodyText}>{dates}</Text>
                        <Text style={styles.bodyText}>{this.data.city}, {this.data.state}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <View style={{flexDirection: 'row', width: 50, justifyContent: 'flex-end'}}>
                            <Icon containerStyle={{marginRight: 5}}
                                name={this.state.isAttending ? 'calendar-check' : 'calendar-blank'}
                                type='material-community'
                                color={this.state.isAttending ? '#8fcd18' : 'gray'}
                                underlayColor='#1E1A2A'
                                size={20}
                            />
                            <Icon
                                name={this.state.isFavorite ? 'star' : 'star-border'}
                                color={this.state.isFavorite ? '#ffde00' : 'gray'}
                                underlayColor='#1E1A2A'
                                size={20}
                            />
                        </View>
                        <Text style={styles.bodyText}>{this.state.numAttending} people going</Text>
                    </View>
                </View>
            </Card>
        );
    }

    getSmallCard(dates) {
        return (
            <Card containerStyle={[styles.card, {
                margin: 10,
                borderWidth: 0,
                width: 220
            }, this.props.style]}
                imageStyle={{height: 100, width: 220}}
                image={{uri: this.state.eventImage}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'}}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.bodyText, {fontWeight: 'bold'}]}>{this.data.name}</Text>
                        <Text style={styles.bodyText}>{dates}</Text>
                    </View>
                </View>
            </Card>
        );
    }

    getListViewCard(dates) {
        return (
            <View style={[styles.card, {
                padding: 10,
                margin: 10,
                marginTop: 0,
                marginBottom: 20,
                borderWidth: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start'}]}>
                <View style={{flex: 1}}>
                    <Text style={[styles.bodyText, { fontWeight: 'bold', color: 'white', fontSize: 16}]}>{this.data.name}</Text>
                    <Text style={styles.bodyText}>{dates} - {this.data.city}, {this.data.state}</Text>
                </View>
                <View style={{flexDirection: 'row', width: 50, justifyContent: 'flex-end'}}>
                    <Icon containerStyle={{marginRight: 5}}
                        name={this.state.isAttending ? 'calendar-check' : 'calendar-blank'}
                        type='material-community'
                        color={this.state.isAttending ? '#8fcd18' : 'gray'}
                        underlayColor='#1E1A2A'
                        size={20}
                    />
                    <Icon
                        name={this.state.isFavorite ? 'star' : 'star-border'}
                        color={this.state.isFavorite ? '#ffde00' : 'gray'}
                        underlayColor='#1E1A2A'
                        size={20}
                    />
                </View>
            </View>
        );
    }
};
