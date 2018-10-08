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
const rad = frame.x / 8;
const borderW = 8;
/*
(0,0)
    ------ xDiv -------
    |                 |
    |                 |
    |                 |
    |                 |
   yDiv               |
    |                 |
    |                 |
    |                 |
    |                 |
    -------     -------

*/

const rotationalIncrementationBuffer = 15;


const elementArray = [
    'topleft',
    'topright',
    'bottomleft',
    'bottomright',
    'oven'
];


const defaultState = {
    elements: [
        { name: 'topleft', angle: 0, active: false, radius:  rad, border: borderW},
        { name: 'topright', angle: 0, active: false, radius:  rad, border: borderW },
        { name: 'bottomleft', angle: 0, active: false, radius:  rad, border: borderW },
        { name: 'bottomright', angle: 0, active: false, radius:  rad, border: borderW }
    ],
};

//  Display Vars
const shdClr = "#999";
const countdownColor = "#F1A94E";
const windupColor = "#44B3C2";
const alertColor = "#E45541";
const backgroundColor = "#fff";


const SECONDS_LABEL = 's';
const MINUTES_LABEL = 'm';
const HOURS_LABEL = 'h';

const defaultTime = {
    sec: 0,
    min: 0,
    hours: 0,
};

const timer = require('react-native-timer');

// timers maintained in the Map timer.intervals
timer.setInterval('SecondsThread', () =>{
    //  Decrement elements
    elementArray.forEach((name)=>{
        if(timer.intervalExists(name)){
            console.log('decrement :' + name);
        }
    });

}, 1000);





//  Attempting to be ES6 compliant

export default class App extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            elements: [
                { name: 'topleft', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, },
                { name: 'topright', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, },
                { name: 'bottomleft', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, },
                { name: 'bottomright', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, }
            ],
        };

    }

    selectNextState( state, dirForward ){
        switch (state) {
            case SECONDS_LABEL:
                return {
                    label: dirForward == true ? MINUTES_LABEL : SECONDS_LABEL,
                    mods: this.getCSSMods(MINUTES_LABEL),
                };
                break;

            case MINUTES_LABEL:
                return {
                    label: dirForward == true ? HOURS_LABEL : SECONDS_LABEL,
                    mods: this.getCSSMods(HOURS_LABEL),
                };
                break;

            case HOURS_LABEL:
                let labelString;
                if (dirForward == 'decrement'){
                    labelString = HOURS_LABEL;
                } else if (dirForward){
                    labelString = HOURS_LABEL;
                } else if (!dirForward) {
                    labelString = MINUTES_LABEL;
                }
                return {
                    label: labelString,
                    mods: this.getCSSMods(HOURS_LABEL),
                };
                break;
            default:
                break;
        }
    }

    getCSSMods( label ){
        switch (label) {
            case SECONDS_LABEL:
                return {
                    borderMod: 1,
                    radiusMod: 10,
                };
                break;

            case MINUTES_LABEL:
                return {
                    borderMod: 2,
                    radiusMod: 12,
                };
                break;

            case HOURS_LABEL:
                return {
                    borderMod: 3,
                    radiusMod: 14,
                };
                break;
            default:
                return {
                    borderMod: 0,
                    radiusMod: 0,
                };
                break;
        }
    }


    setActiveElement({ moveX, moveY, dx, dy }) {
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

        //  Cache previous angle

        let prevAngle = elements[index].angle;

        let computedAngle = this.cartesianToAngle(moveX,moveY,tag);
        let computedMods;
        let tempState = elements[index].incState;
        let tempBorder;
        let tempRad;
        let tempTime = elements[index].time;

        let computedState;
        //  Rad case
        if (prevAngle > 360 - rotationalIncrementationBuffer &&
                computedAngle > 0 &&
                computedAngle < rotationalIncrementationBuffer){
                    computedState = this.selectNextState(elements[index].incState, true);
                    if ( computedState.label == HOURS_LABEL){
                        tempTime.hours = tempTime.hours + 1;
                    }
                    tempState = computedState.label;
                    tempBorder = computedState.mods.borderMod;
                    tempRad = computedState.mods.radiusMod;

        } else if ( prevAngle < rotationalIncrementationBuffer &&
                computedAngle > 360 - rotationalIncrementationBuffer){
                    if (tempTime.hours == 1){
                        computedState = this.selectNextState(elements[index].incState, false);
                    } else {
                        computedState = this.selectNextState(elements[index].incState, 'decrement');
                    }
                    if ( computedState.label == HOURS_LABEL){
                        tempTime.hours = tempTime.hours - 1;
                    }
                    tempState = computedState.label;
                    tempBorder = computedState.mods.borderMod;
                    tempRad = computedState.mods.radiusMod;

        } else {
            computedMods = this.getCSSMods(elements[index].incState);
            tempState = elements[index].incState;
            tempBorder = computedMods.borderMod;
            tempRad = computedMods.radiusMod;
        }


        elements[index] = {...elements[index],
            angle: computedAngle, active: true,
            radius: rad + tempRad, border: borderW + tempBorder,
            incState: tempState, time: tempTime,
        };

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

    degreeToTime( degree, label, currHour ){
        let time;
        let string = '';
        switch (label) {
            case SECONDS_LABEL:
                time = (degree * 60)/360;
                string = Math.round(time) + SECONDS_LABEL;
                break;
            case MINUTES_LABEL:
                time = (degree * 60)/360;
                string = Math.round(time) + MINUTES_LABEL;
                break;
            case HOURS_LABEL:
                time = (degree * 60)/360;
                string = currHour + HOURS_LABEL
                    + Math.round(time) + MINUTES_LABEL;
                break;

            default:
                string = 0 + SECONDS_LABEL;
                break;

        }
        return string;
    }

    timeToPercent( time ){

    }

    calcTime( time ){
        var totalTime = time.secs + (time.mins * 60) + (time.hours * 60 * 60);
        console.log('tTotal: '+ totalTime);

        //this.setState({ elements });
    }





    componentWillMount() {
        // Load the full build.
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                //  Update the current State once a burner has been selected
                let elements = [...this.state.elements];
                let index = elements.findIndex(el => el.active === true);
                elements[index] = {...elements[index],
                    active: false,
                    radius: rad, border: borderW, color: countdownColor};
                this.setState({ elements });
                //  Start Timer logic it to the appropriate element index
                //  elements.findIndex(el => el.active === true)



            },
            onPanResponderMove: (evt,gestureState) => this.setActiveElement(gestureState),
        });
    }

    render() {
        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                <View style={styles.elementWrapper}
                >
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[0].angle)}
                                radius={this.state.elements[0].radius}
                                borderWidth={this.state.elements[0].border}
                                color={this.state.elements[0].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{this.degreeToTime(this.state.elements[0].angle,
                                this.state.elements[0].incState,
                                this.state.elements[0].time.hours)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[1].angle)}
                                radius={this.state.elements[1].radius}
                                borderWidth={this.state.elements[1].border}
                                color={this.state.elements[1].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{this.degreeToTime(this.state.elements[1].angle,
                                this.state.elements[1].incState,
                                this.state.elements[1].time.hours)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[2].angle)}
                                radius={this.state.elements[2].radius}
                                borderWidth={this.state.elements[2].border}
                                color={this.state.elements[2].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{this.degreeToTime(this.state.elements[2].angle,
                                this.state.elements[2].incState,
                                this.state.elements[2].time.hours)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={this.polarToPercentage(this.state.elements[3].angle)}
                                radius={this.state.elements[3].radius}
                                borderWidth={this.state.elements[3].border}
                                color={this.state.elements[3].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{this.degreeToTime(this.state.elements[3].angle,
                                this.state.elements[3].incState,
                                this.state.elements[3].time.hours)}</Text>
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
