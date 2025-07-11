// Easing Formulas Collection
// t = current time
// b = start value
// v = change in value
// d = duration

var easing = {
    // simple linear tweening - no easing, no acceleration
    linearTween: function(t, b, c, d) {
        return c*t/d + b;
    },

    // quadratic easing in - accelerating from zero velocity
    easeInQuad: function(t, b, c, d) {
       t /= d;
       return c*t*t + b;
    },

    // quadratic easing out - decelerating to zero velocity
    easeOutQuad: function(t, b, c, d) {
       t /= d;
       return -c * t*(t-2) + b;
    },

    // quadratic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuad: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return c/2*t*t + b;
       t--;
       return -c/2 * (t*(t-2) - 1) + b;
    },

    // cubic easing in - accelerating from zero velocity
    easeInCubic: function(t, b, c, d) {
       t /= d;
       return c*t*t*t + b;
    },

    // cubic easing out - decelerating to zero velocity
    easeOutCubic: function(t, b, c, d) {
       t /= d;
       t--;
       return c*(t*t*t + 1) + b;
    },

    // cubic easing in/out - acceleration until halfway, then deceleration
    easeInOutCubic: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return c/2*t*t*t + b;
       t -= 2;
       return c/2*(t*t*t + 2) + b;
    },

    // quartic easing in - accelerating from zero velocity
    easeInQuart: function(t, b, c, d) {
       t /= d;
       return c*t*t*t*t + b;
    },

    // quartic easing out - decelerating to zero velocity
    easeOutQuart: function(t, b, c, d) {
       t /= d;
       t--;
       return -c * (t*t*t*t - 1) + b;
    },

    // quartic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuart: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return c/2*t*t*t*t + b;
       t -= 2;
       return -c/2 * (t*t*t*t - 2) + b;
    },

    // quintic easing in - accelerating from zero velocity
    easeInQuint: function(t, b, c, d) {
       t /= d;
       return c*t*t*t*t*t + b;
    },

    // quintic easing out - decelerating to zero velocity
    easeOutQuint: function(t, b, c, d) {
       t /= d;
       t--;
       return c*(t*t*t*t*t + 1) + b;
    },

    // quintic easing in/out - acceleration until halfway, then deceleration
    easeInOutQuint: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return c/2*t*t*t*t*t + b;
       t -= 2;
       return c/2*(t*t*t*t*t + 2) + b;
    },

    // sinusoidal easing in - accelerating from zero velocity
    easeInSine: function(t, b, c, d) {
       return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },

    // sinusoidal easing out - decelerating to zero velocity
    easeOutSine: function(t, b, c, d) {
       return c * Math.sin(t/d * (Math.PI/2)) + b;
    },

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    easeInOutSine: function(t, b, c, d) {
       return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },

    // exponential easing in - accelerating from zero velocity
    easeInExpo: function(t, b, c, d) {
       return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    },

    // exponential easing out - decelerating to zero velocity
    easeOutExpo: function(t, b, c, d) {
       return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    },

    // exponential easing in/out - accelerating until halfway, then decelerating
    easeInOutExpo: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
       t--;
       return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    },

    // circular easing in - accelerating from zero velocity
    easeInCirc: function(t, b, c, d) {
       t /= d;
       return -c * (Math.sqrt(1 - t*t) - 1) + b;
    },

    // circular easing out - decelerating to zero velocity
    easeOutCirc: function(t, b, c, d) {
       t /= d;
       t--;
       return c * Math.sqrt(1 - t*t) + b;
    },

    // circular easing in/out - acceleration until halfway, then deceleration
    easeInOutCirc: function(t, b, c, d) {
       t /= d/2;
       if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
       t -= 2;
       return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    }

};
