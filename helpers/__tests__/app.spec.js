import renderer from 'react-test-renderer';
import React from 'react';
const helper = require('./../contextHelper.js');

const SECONDS_LABEL = 's';
const MINUTES_LABEL = 'm';
const HOURS_LABEL = 'h';
const COUNTDOWN_LABEL = 'countdown';


test('validates 0h0m10s to a total 10 seconds ', () => {
    let time  = {
        secs: 10,
        mins: 0,
        hours: 0,
    };
    expect(helper.timeToTotalSeconds( time )).toBe(10);
});


test('validates 0h1m0s to a total 60 seconds ', () => {
    let time  = {
        secs: 0,
        mins: 1,
        hours: 0,
    };
    expect(helper.timeToTotalSeconds( time )).toBe(60);
});

test('validates 1h0m0s to a total 3600 seconds ', () => {
    let time  = {
        secs: 0,
        mins: 0,
        hours: 1,
    };
    expect(helper.timeToTotalSeconds( time )).toBe(3600);
});

test('validates seconds decrementation', () => {
    let t0  = {
        secs: 10,
        mins: 0,
        hours: 0,
    };
    let t1  = {
        secs: 9,
        mins: 0,
        hours: 0,
    };
    expect(helper.getDecrementedTime( t0 ).secs).toBe(t1.secs);
});
test('validates minutes decrementation',() => {
    let t0  = {
        secs: 0,
        mins: 1,
        hours: 0,
    };
    let t1  = {
        secs: 59,
        mins: 0,
        hours: 0,
    };
    let temp = helper.getDecrementedTime( t0 );
    expect(temp.mins).toBe(0);
    expect(temp.secs).toBe(59);
});
test('validates hours decrementation', () => {
    let t0  = {
        secs: 0,
        mins: 0,
        hours: 1,
    };
    let t1  = {
        secs: 59,
        mins: 59,
        hours: 0,
    };
    let temp = helper.getDecrementedTime( t0 );
    expect(temp.hours).toBe(t1.hours);
    expect(temp.mins).toBe(t1.mins);
    expect(temp.secs).toBe(t1.secs);
});

test('determines the remaining time in percentage relative to currTime and srcTime',()=>{
    let curr = {
        secs: 0,
        mins: 0,
        hours: 1,
    };
    let src = {
        secs: 0,
        mins: 0,
        hours: 10,
    };
    expect(helper.timeToPercent(curr,src)).toBe(10);
    curr = {
        secs: 5,
        mins: 0,
        hours: 0,
    };
    src = {
        secs: 20,
        mins: 0,
        hours: 0,
    };
    expect(helper.timeToPercent(curr,src)).toBe(25);
});

test('validates timeToLabel()',()=>{
    let time = {
        secs: 10,
        mins: 0,
        hours: 0,
    };
    expect(helper.timeToLabel(time,SECONDS_LABEL)).toBe('10s');
    time = {
        secs: 0,
        mins: 10,
        hours: 0,
    };
    expect(helper.timeToLabel(time,MINUTES_LABEL)).toBe('10m');
    time = {
        secs: 0,
        mins: 10,
        hours: 1,
    };
    expect(helper.timeToLabel(time,HOURS_LABEL)).toBe('1h10m');
});
