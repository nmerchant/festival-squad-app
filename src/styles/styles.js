import React from 'react';
import { StyleSheet } from 'react-native';

import colors from './colors';

var styles = StyleSheet.create({
    baseStyle: {
        backgroundColor: colors.background,
        flex: 1
    },
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: colors.cardBackground
    },
    headerIcon: {
        width: 30,
        height: 30
    },
    vybeIconBlue: {
        backgroundColor: colors.vybeBlue
    },
    vybeIconRed: {
        backgroundColor: colors.vybeRed
    },
    vybeIconPurple: {
        backgroundColor: colors.vybePurple
    },
    vybeIconGreen: {
        backgroundColor: colors.vybeGreen
    },
    bodyText: {
        // fontFamily: 'Lato-Bold',
        color: 'white',
        letterSpacing: 1.5
    },
    subheaderText: {
        color: colors.secondaryText,
        fontSize: 16
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    reactionContainer: {
        borderWidth: 1,
        borderColor: '#7f7f7f',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    reaction: {
        color: 'white',
        padding: 3,
        fontSize: 18
    }
});

module.exports = styles;
