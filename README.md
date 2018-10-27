# stovetop-timer
**Warning:** The current timer implementation provides no alarm notification (sound, vibration or otherwise) and only decrements if the app is in focus.

This albeit lightly functional build suits my needs but will be extended to provide the above mentioned services.

## Display division
Implemented a flexbox CSS layout to achieve a 2x2 grid. Since no padding is applied to the container the framing may be assumed to be constant across releases.

*Sol.* Define padding as `const` and consider in the `frame` configuration.   

    (0,0)
    ------- xDiv -------
    |                  |
    |   *          *   |
    |                  |
    yDiv               |        <= Only the elements portion is currently
    |                  |             implemented however matching the flexbox
    |   *          *   |             container via setting frame.y = frame.x
    |                  |             should suffice
    -------      -------
    |                  |
    | *     Oven     * |
    |                  |
    --------------------
```javascript
const frame =   {
                    x: Dimensions.get('window').width,
                    y: Dimensions.get('window').height
                };
/*    frame with oven container
const frame =   {
                    x: Dimensions.get('window').width,
                    y: Dimensions.get('window').width
                };
*/
const xDivider = frame.x / 2;
const yDivider = frame.y / 2;
const rad = frame.x / 8;
const borderW = 8;
```
The above denotes the framing layout which mirrors flexbox to separates elements for PanResponder
movements to be assigned within their respective quadrant.
This process is done programmatically via setting anchor points signifying an element's circle center and is derived from
`gestureState.moveX & gestureState.moveY` positions compared to `xDiv & yDiv`
axis.


##  Timer details
//  TODO
Utilize RN alarm libraries which act as bridges to native alarm scheduling APIs.

Options:
&nbsp;&nbsp;&nbsp;&nbsp;[react-native-alarm-notification](https://www.npmjs.com/package/react-native-alarm-notification)
&nbsp;&nbsp;&nbsp;&nbsp;[react-native-alarm](https://github.com/smartliang/react-native-alarm)
