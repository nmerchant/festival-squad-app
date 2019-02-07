import React from 'react';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import SplashScreen from './splash';
import ProfileScreen from './profile';
import EditProfileScreen from './edit-profile';
import AdminScreen from './admin/admin';
import CreatePostScreen from './posts/create-post';
import EventsScreen from './events/events';
import EventScreen from './events/event';
import TicketScreen from './tickets/tickets'

import logo from '../images/logo.png';
import logoGray from '../images/logo.png';
const styles = require('../styles/styles');
const colors = require('../styles/colors');


export const MainNavigator = TabNavigator({
    Account: StackNavigator({
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                header: null
            }
        },
        Admin: {
            screen: AdminScreen
        },
        EditProfile: {
            screen: EditProfileScreen
        }
    }),
    Events: StackNavigator({
        EventList: {
            screen: EventsScreen,
            navigationOptions: {
                header: null
            }
        },
        Event: {
            screen: EventScreen
        },
        CreatePost: {
            screen: CreatePostScreen
        },
        Profile: {
            screen: ProfileScreen
        },
        Tickets: {
            screen: TicketScreen
        }
    }),
    Explore: {
        screen: SplashScreen
    },
    Match: {
        screen: SplashScreen
    },
    Messages: {
        screen: SplashScreen
    }
}, {
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: (options) => {
            const { routeName } = navigation.state;
            let { tintColor } = options;
            let icon;
            let type = '';
            const focused = options.focused;

            switch (routeName) {
                case 'Account':
                    icon = 'account-circle';
                    color = focused ? colors.vybeGreen : 'gray';
                    break;
                case 'Events':
                    icon = 'event';
                    color = focused ? colors.vybeRed : 'gray';
                    break;
                case 'Explore':
                    icon = focused ? logo : logoGray;
                    break;
                case 'Match':
                    icon = 'star-half';
                    type = 'material-community';
                    color = focused ? colors.vybePurple : 'gray';
                    break;
                case 'Messages':
                    icon = 'chat';
                    color = focused ? colors.vybeBlue : 'gray';
                    break;
            }

            if (routeName === 'Explore') {
                return(
                    <Image style={{
                            height: 31,
                            width: 28
                        }}
                        source={icon}>
                    </Image>
                );
            } else {
            return (
                <Icon
                    name={icon}
                    type={type}
                    color={color}
                />
            );
            }
        },
    }),
    tabBarOptions: {
        showLabel: false,
        style: {
            backgroundColor: colors.navbarBackground
        }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    lazy: false,
    initialRouteName: 'Events'
});
