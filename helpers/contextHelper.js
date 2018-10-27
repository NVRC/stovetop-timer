//  Duplicate labels
// TODO: refactor to use global constant var across varied scopes
const SECONDS_LABEL = 's';
const MINUTES_LABEL = 'm';
const HOURS_LABEL = 'h';
const COUNTDOWN_LABEL = 'countdown';

module.exports = {


    timeToPercent: function( currTime , srcTime){
        let srcT = this.timeToTotalSeconds(srcTime);
        let currT = this.timeToTotalSeconds(currTime);
        return (currT / srcT) * 100;

    },

    secondsToTime: function( secs ){
        let h = Math.floor(secs / 3600);
        let m = Math.floor((secs - (h * 3600)) / 60);
        let s = secs - (h * 3600) - (m * 60);
        s = Math.round(s * 100) / 100

        time = {
            secs: s,
            mins: m,
            hours: h,
        };
        return time;
    },

    timeToTotalSeconds: function( time ){
        return (time.secs + (time.mins*60) + (time.hours*60*60));
    },


    getDecrementedTime: function( time  ){
        return this.secondsToTime(this.timeToTotalSeconds( time ) - 1);
    },

    timeToString: function( time ){
        let timeStr = '';
        if (time.hours > 0){
            timeStr += time.hours + 'h';
        }
        if(time.mins > 0){
            timeStr += time.mins + 'm';
        }
        if(time.secs >= 0){
            timeStr += time.secs + 's';
        }

        return timeStr;
    },
    getCSSMods: function( label ){
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
    },
    selectNextState: function( state, dirForward ){
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
    },
    timeToLabel: function ( time, label ){
        let string;
        switch (label) {
            case SECONDS_LABEL:
                string = Math.round(time.secs) + SECONDS_LABEL;
                break;
            case MINUTES_LABEL:
                string = Math.round(time.mins) + MINUTES_LABEL;
                break;
            case HOURS_LABEL:
                string = time.hours + HOURS_LABEL
                    + Math.round(time.mins) + MINUTES_LABEL;
                break;
            default:
                string = 0 + SECONDS_LABEL;
                break;
        }
        return string;
    },
    degreeToTime: function ( degree, label, currTime ){
        let time = currTime;
        let string = '';
        switch (label) {
            case SECONDS_LABEL:
                time.secs = Math.round((degree * 60)/360);
                break;
            case MINUTES_LABEL:
                time.mins = Math.round((degree * 60)/360);
                break;
            case HOURS_LABEL:
                time.hours = Math.round((degree * 60)/360);
                break;
            default:
                break;
        }
        return time;
    },
    tagToDisplayString: function ( tag ){
        let str = '';
        console.log('display tag: '+tag);
        if (tag.includes('top')){
            str += 'Top ';
        } else if (tag.includes('bottom')){
            str += 'Bottom ';
        }
        if (tag.includes('left')){
            str += 'Left ';
        } else if (tag.includes('right')){
            str += 'Right ';
        }

        str += 'element timer has fired!';
        return str;
    },
}
