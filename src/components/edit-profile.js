import React, { Component } from 'react';
import { Text, TextInput, View, ActivityIndicator, FlatList, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'react-native-firebase';

const colors = require('../styles/colors');
const styles = require('../styles/styles');


export default class EditProfileScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: 'Edit Profile',
            headerRight: (
                <TouchableOpacity style={{paddingRight: 15}}
                    onPress={params.onSave}>
                    <Text style={{color: 'black'}}>Save Profile</Text>
                </TouchableOpacity>
            ),
            headerLeft:  <HeaderBackButton
                onPress={() => {
                    if (params.changed) {
                        Alert.alert(
                            'Unsaved Chnges',
                            'Do you want to discard your changes?',
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Discard', onPress: () => {
                                    navigation.goBack(null);
                                }},
                            ],
                            { cancelable: false }
                        )
                    } else {
                        navigation.goBack(null);
                    }
                }}
            />
        };
    };

    static navigatorButtons = {
        rightButtons: [{
            title: 'Save Profile',
            id: 'save',
            showAsAction: 'always',
            buttonFontSize: 14,
            buttonFontWeight: '600',
        }]
    };

    constructor(props) {
        super(props);

        this.params = this.props.navigation.state.params;
        this.screenProps = this.props.screenProps;
        this.user = this.screenProps.user;
        this.fbUser = this.user.fbUser;

        this.state = {
            loading: false,
            changed: false,
            description: this.user.description
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ onSave: this.onSave });
    }

    render() {
        return (
            <View style={[styles.baseStyle, {padding: 20, flexDirection: 'column'}]}>
                <TextInput style={[styles.bodyText, {
                    padding: 0,
                    paddingTop: 10,
                    fontSize: this.state.fontSize
                }]}
                    placeholder="Add Profile description..."
                    value={this.state.description}
                    multiline={true}
                    onChangeText={this.onChangeText}
                    placeholderTextColor="#9a9ba0"
                    underlineColorAndroid="transparent"
                    multiline={true}
                    numberOfLines={5}
                    maxLength={100}>
                </TextInput>
                {this.state.loading &&
                    <View style={styles.loading}>
                      <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        )
    }

    onChangeText = (description) => {
        this.setState({description, changed: true});
        this.props.navigation.setParams({ changed: this.state.changed });
    }

    onSave = () => { // this is the onPress handler for the two buttons together
        console.log('save');
        const payload = {
            description: this.state.description
        };
        const userDoc = firebase.firestore().collection('users').doc(this.fbUser.id);

        Keyboard.dismiss();

        this.setState({ loading: true });
        userDoc.update(payload).then(() => {
            this.setState({ loading: false });
            this.params.updateUserRecord();
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false });
        });
    }
};
