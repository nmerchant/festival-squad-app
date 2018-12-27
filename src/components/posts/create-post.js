import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';

const styles = require('../../styles/styles');

export default class CreatePostScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: 'Create Post',
            headerRight: (
                <TouchableOpacity style={{paddingRight: 15}}
                    onPress={params.onShare}>
                    <Text style={{color: 'black'}}>Share</Text>
                </TouchableOpacity>
            )
        };
    };

    static navigatorButtons = {
        rightButtons: [{
            title: 'Share',
            id: 'share',
            showAsAction: 'always',
            buttonFontSize: 14,
            buttonFontWeight: '600',
        }]
    };

    constructor(props) {
        super(props);

        this.defaultFontSize = 22;

        this.params = this.props.navigation.state.params;
        this.eventDoc = this.params.eventDoc;

        this.screenProps = this.props.screenProps;

        this.state = {
            fontSize: this.defaultFontSize,
            text: '',
            picture: this.screenProps.user.facebookPicture,
            loading: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ onShare: this.onShare });

        if (!this.screenProps.user.picture) {
            return;
        }

        const imageRef = firebase.storage().ref('users/' + this.screenProps.user.fbUser.id).child(this.screenProps.user.picture);
        imageRef.getDownloadURL().then((uri) => {
            this.setState({ picture: uri });
        });
    }

    render() {
        let avatarProps = {
            containerStyle: {
                marginRight: 10
            },
            medium: true,
            rounded: true
        };

        if (this.state.picture) {
            avatarProps.source = { uri: this.state.picture };
        }

        return (
            <View style={[styles.baseStyle, styles.containerStyle, {padding: 20}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar {...avatarProps} />
                    <Text style={[styles.bodyText, {fontSize: 16}]}>
                        {this.screenProps.user.first_name}  >  {this.eventDoc.data().name}
                    </Text>
                </View>
                <TextInput style={[styles.bodyText, {
                    padding: 0,
                    paddingTop: 10,
                    fontSize: this.state.fontSize
                }]}
                    placeholder="What's good?"
                    value={this.state.text}
                    multiline={true}
                    onChangeText={this.onChangeText}
                    placeholderTextColor="#9a9ba0"
                    underlineColorAndroid="transparent"
                    maxLength={1000}>
                </TextInput>
                {this.state.loading &&
                    <View style={styles.loading}>
                      <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        )
    }

    onChangeText = (text) => {
        let fontSize = this.defaultFontSize;

        if (text.length > 50) {
            fontSize = 16;
        }

        this.setState({ text, fontSize });
    }

    onShare = () => { // this is the onPress handler for the two buttons together
        const payload = {
            text: this.state.text,
            createdDate: moment().toISOString(),
            author: this.screenProps.user.fbUser.id
        };
        const postDoc = this.eventDoc.ref.collection('posts').doc();

        Keyboard.dismiss();

        this.setState({ loading: true });
        postDoc.set(payload).then(() => {
            this.setState({ loading: false });
            this.params.onPostCreated();
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false });
        });
    }
};
