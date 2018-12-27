import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';
import _ from 'lodash';

import EventCard from './event-card';

const styles = require('../../styles/styles');

export default class EventListFilter extends Component {
    constructor (props) {
        super(props);

        this.sortMap = [
            {
                name: 'Date',
                orderBy: 'startDate'
            },
            {
                name: 'A->Z',
                orderBy: 'name'
            }
        ];

        this.viewMap = [
            {
                name: 'List',
                viewType: 'list'
            },
            {
                name: 'Small Thumb',
                viewType: 'small-thumbnail'
            },
            {
                name: 'Thumb',
                viewType: 'thumbnail'
            }
        ];

        const sortIndex = _.findIndex(this.sortMap, (item) => {
            return item.orderBy === this.props.orderBy;
        });
        const viewIndex = _.findIndex(this.viewMap, (item) => {
            return item.viewType === this.props.viewType;
        });

        this.state = {
            sortIndex: sortIndex,
            viewIndex: viewIndex,
            favorites: false,
            attending: false
        };

        this.onSortPress = this.onSortPress.bind(this);
        this.onViewPress = this.onViewPress.bind(this);
        this.onFavoritesPress = this.onFavoritesPress.bind(this);
        this.onAttendingPress = this.onAttendingPress.bind(this);
        this.fetchList = this.fetchList.bind(this);
        this.onFilterChange = this.props.onFilterChange;
        this.rerender = this.props.rerender;
    }

    render() {
        const { sortIndex, viewIndex } = this.state;
        const sortButtons = [];
        const viewButtons = [];

        this.sortMap.map((button) => {
            sortButtons.push(button.name);
        });
        this.viewMap.map((button) => {
            viewButtons.push(button.name);
        });

        return (
            <View style={{ marginBottom: 10 }}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 3}}>
                        <ButtonGroup
                            onPress={this.onSortPress}
                            selectedIndex={sortIndex}
                            buttons={sortButtons}
                        />
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Icon containerStyle={{marginRight: 15}}
                            name={this.state.attending ? 'calendar-check' : 'calendar-blank'}
                            type='material-community'
                            color={this.state.attending ? '#8fcd18' : 'gray'}
                            onPress={this.onAttendingPress}
                            underlayColor='#1E1A2A'
                            size={30}
                        />
                        <Icon
                            name={this.state.favorites ? 'star' : 'star-border'}
                            color={this.state.favorites ? '#ffde00' : 'gray'}
                            onPress={this.onFavoritesPress}
                            underlayColor='#1E1A2A'
                            size={30}
                        />
                    </View>
                </View>
                <View>
                    <ButtonGroup
                        onPress={this.onViewPress}
                        selectedIndex={viewIndex}
                        buttons={viewButtons}
                    />
                </View>
            </View>
        )
    }

    onSortPress(sortIndex) {
        if (sortIndex === this.state.sortIndex) {
            return;
        }

        this.setState({sortIndex}, this.fetchList);
    }

    onViewPress(viewIndex) {
        if (viewIndex === this.state.viewIndex) {
            return;
        }

        // this.setState({viewIndex}, this.renderEvents);
        this.setState({viewIndex}, this.fetchList);
    }

    onFavoritesPress() {
        const favorites = !Boolean(this.state.favorites);

        this.setState({favorites}, this.fetchList);
    }

    onAttendingPress() {
        const attending = !Boolean(this.state.attending);

        this.setState({attending}, this.fetchList);
    }

    fetchList() {
        const params = this.getParams();
        this.onFilterChange(params);
    }

    renderEvents() {
        const params = this.getParams();
        this.rerender(params);
    }

    getParams() {
        return {
            orderBy: this.sortMap[this.state.sortIndex].orderBy,
            viewType: this.viewMap[this.state.viewIndex].viewType,
            favorites: this.state.favorites,
            attending: this.state.attending
        };
    }
};
