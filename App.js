import React from 'react';
import {    StyleSheet,
            Text,
            View,
            PanResponder,
            Animated,
            Dimensions } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import ProgressCircle from 'react-native-progress-circle';

const frame =   {
                    x: Dimensions.get('window').width,
                    y: Dimensions.get('window').height
                };

const xDivider = frame.x / 2;
const yDivider = frame.y / 2;



//  Attempting to be ES6 compliant

export default class App extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            elements: [
                { name: 'topleft', angle: 0, active: false },
                { name: 'topright', angle: 0, active: false },
                { name: 'bottomleft', angle: 0, active: false },
                { name: 'bottomright', angle: 0, active: false }
            ],
        };
        console.log('Frame X:'+xDivider);
        console.log('Frame Y:'+yDivider);

    }


    setActiveElement({ moveX, moveY, dx, dy }) {
        console.log('moveX: '+moveX);
        console.log('moveY: '+moveY);
        return true;
    }

    componentWillMount() {

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => this.setActiveElement(gestureState),
            onPanResponderMove: (evt,gestureState) => {
                this.setActiveElement(gestureState);
            }
        });
    }

    render() {
        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={30}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{'30%'}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={30}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{'30%'}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={30}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{'30%'}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={30}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{'30%'}</Text>
                    </ProgressCircle>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    elementWrapper: {
        width: '50%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ovenWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
