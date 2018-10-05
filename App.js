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

const defaultState = {
    elements: [
        { name: 'topleft', angle: 0, active: false },
        { name: 'topright', angle: 0, active: false },
        { name: 'bottomleft', angle: 0, active: false },
        { name: 'bottomright', angle: 0, active: false }
    ],
};



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
        let tag = '';

        //
        if (moveY <= yDivider){
            tag += 'top';
        } else if (moveY > yDivider) {
            tag += 'bottom';
        }

        if (moveX >= xDivider){
            tag += 'right';
        } else if (moveX < xDivider){
            tag += 'left';
        }
        //  Update the current State once a burner has been selected
        let elements = [...this.state.elements];
        let index = elements.findIndex(el => el.name === tag);
        elements[index] = {...elements[index],
            angle: this.cartesianToAngle(moveX,moveY,tag), active: true};
        this.setState({ elements });
    }

    cartesianToAngle( x, y , tag){
        let anchor = {
            x: 0,
            y: 0
        };

        //  TODO: Reduce expression to ternary statements
        //  More verbose but debuggable in this form
        if (tag == 'topleft'){
            anchor.x = xDivider / 2;
            anchor.y = yDivider / 2;
        } else if (tag == 'topright'){
            anchor.x = xDivider + (xDivider / 2);
            anchor.y = yDivider / 2;
        } else if (tag == 'bottomleft'){
            anchor.x = xDivider / 2;
            anchor.y = yDivider + (yDivider / 2);
        } else if (tag == 'bottomright'){
            anchor.x = xDivider + (xDivider / 2);
            anchor.y = yDivider + (yDivider / 2);
        }

        let deltaY = y - anchor.y;
        let deltaX = x - anchor.x;
        let Victor = require('victor');
        let vec = new Victor(x > anchor.x ? x - anchor.x : - anchor.x + x,
            y > anchor.y ? - y + anchor.y : - y + anchor.y);

        let refAngle = vec.verticalAngleDeg();
        return refAngle < 0 ? ((180 + refAngle) + 180) : refAngle;
    }

    polarToPercentage( degree ){
        return ((degree * 100)/360);
    }

    componentWillMount() {

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                console.log('Release @ X,Y: '+ gestureState.moveX+ ','+gestureState.moveY );

                //  Start Timer logic it to the appropriate element index
                //  elements.findIndex(el => el.active === true)

            },
            onPanResponderMove: (evt,gestureState) => {
                this.setActiveElement(gestureState);
            }
        });
    }

    render() {
        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                <View style={styles.elementWrapper}
                >
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[0].angle)}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{this.state.elements[0].angle}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[1].angle)}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{this.state.elements[1].angle}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[2].angle)}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{this.state.elements[2].angle}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[3].angle)}
                                radius={50}
                                borderWidth={8}
                                color="#3399FF"
                                shadowColor="#999"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 18 }}>{this.state.elements[3].angle}</Text>
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
