import React from 'react';
import {    StyleSheet,
            Text,
            View,
            PanResponder,
            Animated,
            Dimensions,
            Alert } from 'react-native';
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
const COUNTDOWN_LABEL = 'countdown';

const defaultTime = {
    secs: 0,
    mins: 0,
    hours: 0,
};

const timer = require('react-native-timer');
const _ = require('lodash');
const contextHelper = require('./helpers/contextHelper.js');





//  Attempting to be ES6 compliant

export default class App extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            elements: [
                { name: 'topleft', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, timer: null,},
                { name: 'topright', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, timer: null,},
                { name: 'bottomleft', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, timer: null,},
                { name: 'bottomright', angle: 0, active: false, radius:  rad, border: borderW, color: windupColor, incState: SECONDS_LABEL, time: defaultTime, timer: null,}
            ],
        };

        timer.setInterval( 'Constant ', ()=>{
            //  Decrement time
            let elements = [...this.state.elements];
            //  Find the indexes of elements currently in COUNTDOWN state
            let indexes = _.map(_.keys(_.pickBy(elements,
                 {active: COUNTDOWN_LABEL})), Number);
            console.log(indexes);
            for (let i = 0; i < indexes.length; i++) {
                let selIndex = indexes[i];
                let tag = elements[selIndex].name;

                let tempTime = elements[selIndex].time;
                var decTime = contextHelper.getDecrementedTime(elements[selIndex].time);
                if (decTime.secs == 0 && decTime.mins == 0 && decTime.hours == 0){
                    //  Alarm alert
                    console.log('zeroed timer trigger');
                    console.log('tag :'+tag);
                    timer.clearInterval(tag);
                    elements[selIndex] = {...elements[selIndex],
                        time: defaultTime, timer: null, active: false, color: alertColor, angle: 360};

                    this.setState({elements});
                    this.generateAlert( tag );

                    //  TODO:
                    //  setup flashing red element until Alert dialog is dismissed
                } else {
                    console.log('timer trigger 1');

                    elements[selIndex] = {...elements[selIndex],
                        time: decTime, active: COUNTDOWN_LABEL,};
                    this.setState({elements});
                }
            }
        }, 1000);

    }

    setActiveElement({ moveX, moveY, dx, dy }) {
        let tag = '';

        //  Assemble the selected element's tag
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
        console.log('Set tag: '+tag);
        //  Update the current State once a burner has been selected
        let elements = [...this.state.elements];
        let index = elements.findIndex(el => el.name === tag);
        console.log('Computed index: '+index);

        //  Cache previous angle

        let prevAngle = elements[index].angle;

        let computedAngle = this.cartesianToAngle(moveX,moveY,tag);
        let computedMods;
        let tempState = elements[index].incState;
        let tempBorder;
        let tempRad;

        let tStamp = {
            secs: 0,
            mins: 0,
            hours: 0,
        };

        tStamp.secs = elements[index].secs == undefined ? 0 : elements[index].secs;
        tStamp.mins = elements[index].mins == undefined ? 0 : elements[index].mins;
        tStamp.hours = elements[index].hours == undefined ? 0 : elements[index].hours;
        let tempTime = tStamp;

        let computedState;
        //  Rad case
        if (prevAngle > 360 - rotationalIncrementationBuffer &&
                computedAngle > 0 &&
                computedAngle < rotationalIncrementationBuffer){
                    computedState = contextHelper.selectNextState(elements[index].incState, true);
                    if ( computedState.label == HOURS_LABEL){
                        tempTime.hours = tempTime.hours + 1;
                    }
                    tempState = computedState.label;
                    tempBorder = computedState.mods.borderMod;
                    tempRad = computedState.mods.radiusMod;

        } else if ( prevAngle < rotationalIncrementationBuffer &&
                computedAngle > 360 - rotationalIncrementationBuffer){
                    if (tempTime.hours == 1){
                        computedState = contextHelper.selectNextState(elements[index].incState, false);
                    } else {
                        computedState = contextHelper.selectNextState(elements[index].incState, 'decrement');
                    }
                    if ( computedState.label == HOURS_LABEL){
                        tempTime.hours = tempTime.hours - 1;
                    }
                    tempState = computedState.label;
                    tempBorder = computedState.mods.borderMod;
                    tempRad = computedState.mods.radiusMod;

        } else {
            computedMods = contextHelper.getCSSMods(elements[index].incState);
            tempState = elements[index].incState;
            tempBorder = computedMods.borderMod;
            tempRad = computedMods.radiusMod;
        }


        elements[index] = {...elements[index],
            angle: computedAngle, active: true,
            radius: rad + tempRad, border: borderW + tempBorder,
            incState: tempState, time: tempTime,
        };
        //  TODO: Resolve bug with 'tempTime' set incorrectly and therefore not
        //  prompting timer countdowns
        console.log('compAngle: '+computedAngle);
        console.log('set time below');
        console.log(tempTime);
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

    generateAlert( tag ){
        //  Launch alert and sound until OK function is handled
        Alert.alert(
            'Timer Alert',
            contextHelper.tagToDisplayString(tag),
            [
                {text: 'Ok', onPress: () => console.log('Stop alarm sound')},
            ],
            {cancelable: false}
        )
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
                let indexes = _.map(_.keys(_.pickBy(elements,
                     {active: true})), Number);
                let timeStamp;
                let selIndex;
                console.log('Indexes: '+indexes);
                for (let i = 0; i < indexes.length; i++) {
                    selIndex = indexes[i];
                    console.log('active selIndex: '+selIndex);
                    console.log('active: '+ elements[selIndex].name);
                    timeStamp = elements[selIndex].time;
                    console.log('selected time: '+ timeStamp.secs);


                }

                if (timeStamp.secs == 0 && timeStamp.mins == 0
                    && timeStamp.hours == 0){

                } else {
                    console.log('selIndex: '+selIndex);
                    console.log(timeStamp.secs);
                    //  Init scoped timeStamp
                    //  hoping to address the problem binding to elements[i].timer
                    let tStamp = {
                        secs: 0,
                        mins: 0,
                        hours: 0,
                    };

                    tStamp.secs = timeStamp.secs;
                    tStamp.mins = timeStamp.mins;
                    tStamp.hours = timeStamp.hours;
                    console.log(tStamp);
                    elements[selIndex] = {...elements[selIndex],
                        active: COUNTDOWN_LABEL,
                        radius: rad, border: borderW, color: countdownColor, time: tStamp,
                        timer: tStamp,};
                    this.setState({ elements });
                    //  Start Timer logic it to the appropriate element index
                    //  elements.findIndex(el => el.active === true)


                }

            },
            onPanResponderMove: (evt,gestureState) => this.setActiveElement(gestureState),
        });
    }

    render() {
        var _state = this.state.elements;
        console.log(_state);
        if(_state[0].timer != null){
            console.log('src time: '+contextHelper.timeToTotalSeconds(_state[0].timer));
        }

        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={_state[0].active === COUNTDOWN_LABEL ? contextHelper.timeToPercent(_state[0].time, _state[0].timer) : this.polarToPercentage(_state[0].angle)}
                                radius={_state[0].radius}
                                borderWidth={_state[0].border}
                                color={_state[0].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{_state[0].active === COUNTDOWN_LABEL ? contextHelper.timeToString(_state[0].time) : contextHelper.timeToLabel(contextHelper.degreeToTime(_state[0].angle,
                                _state[0].incState,
                                _state[0].time),_state[0].incState)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={_state[1].active === COUNTDOWN_LABEL ? contextHelper.timeToPercent(_state[1].time, _state[1].timer) : this.polarToPercentage(_state[1].angle)}
                                radius={_state[1].radius}
                                borderWidth={_state[1].border}
                                color={_state[1].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{_state[1].active === COUNTDOWN_LABEL ? contextHelper.timeToString(_state[1].time) : contextHelper.timeToLabel(contextHelper.degreeToTime(_state[1].angle,
                                _state[1].incState,
                                _state[1].time),_state[1].incState)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={_state[2].active === COUNTDOWN_LABEL ? contextHelper.timeToPercent(_state[2].time, _state[2].timer) : this.polarToPercentage(_state[2].angle)}
                                radius={_state[2].radius}
                                borderWidth={_state[2].border}
                                color={_state[2].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{_state[2].active === COUNTDOWN_LABEL ? contextHelper.timeToString(_state[2].time) : contextHelper.timeToLabel(contextHelper.degreeToTime(_state[2].angle,
                                _state[2].incState,
                                _state[2].time),_state[2].incState)}</Text>
                    </ProgressCircle>
                </View>
                <View style={styles.elementWrapper}>
                    <ProgressCircle
                                percent={_state[3].active === COUNTDOWN_LABEL ? contextHelper.timeToPercent(_state[3].time, _state[3].timer) : this.polarToPercentage(_state[3].angle)}
                                radius={_state[3].radius}
                                borderWidth={_state[3].border}
                                color={_state[3].color}
                                shadowColor={this.shadowColor}
                                bgColor={this.backgroundColor}
                            >
                                <Text style={{ fontSize: 18 }}>{_state[3].active === COUNTDOWN_LABEL ? contextHelper.timeToString(_state[3].time) : contextHelper.timeToLabel(contextHelper.degreeToTime(_state[3].angle,
                                _state[3].incState,
                                _state[3].time),_state[3].incState)}</Text>
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
