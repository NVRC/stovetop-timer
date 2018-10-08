#stovetop-timer

##Display division
Implemented flexbox CSS layouts to achieve a 2x2 grid

(0,0)
    ------ xDiv -------
    |                 |
    |                 |
    |   *         *   |
    |                 |
    |                 |
   yDiv               |
    |                 |
    |                 |
    |   *         *   |
    |                 |
    |                 |
    -------     -------
```javascript
const frame =   {
                    x: Dimensions.get('window').width,
                    y: Dimensions.get('window').height
                };

const xDivider = frame.x / 2;
const yDivider = frame.y / 2;
const rad = frame.x / 8;
const borderW = 8;
```
denotes the framing layout that separates elements in order for PanResponder
movements to be assigned within their respective quadrante dependent on
`gestureState.moveX & gestureState.moveY` positions compared to `xDiv & yDiv`
axis.

##  
