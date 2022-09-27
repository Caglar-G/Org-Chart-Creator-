export class ColorMap {

    /** 
    * Creates an instance of ColorMap.
    * @param {any} numSteps 
    * @param {any} colors 
    * @memberof ColorMap
    */
    constructor(numSteps, colors) {
        if (colors.length <= 1) {
        throw 'Two colors minimum.';
        }
        this.map      = [];
        this.numSteps = numSteps;
        this.colors   = colors;
        this.init();
    }

    /**
    * Init method.
    */
    init() {
        let firstIndex, lastIndex, localRatio, deltaColor,
        colorDelta = 1 / (this.colors.length - 1),
        that       = this,
        compute    = (component) => {
            return parseInt(
            that.colors[firstIndex][component] + localRatio * deltaColor[component], 10
            );
        };
        for (let i = 0; i < this.numSteps; i++) {
        let globalRatio = i / (this.numSteps - 1);
        firstIndex  = Math.floor(globalRatio / colorDelta);
        lastIndex   = Math.min(this.colors.length - 1, firstIndex + 1);
        localRatio  = (globalRatio - firstIndex * colorDelta) / colorDelta;
        deltaColor  = this.colors[lastIndex].delta(this.colors[firstIndex]);

        this.map.push(new Color(compute('r'), compute('g'), compute('b'), compute('a')));
        }
    }

    /**
    * Return a color instance from a decimal number between 0 and 1.
    * 
    * @param {any} value Normalized decimal number in range [0,1].
    * @returns {Color}
    * @memberof ColorMap
    */
    getColor(value) {
        let delta = Math.max(0, Math.min(1, value));
        let index = Math.floor(delta * (this.map.length - 1));
        
        return this.map[index];
    }

    /**
    * Convert to JSON.
    *
    * @return {Object}
    * @memberof Color
    */
    toJSON() {
        return {
        _type     : 'ColorMap',
        numSteps  : this.numSteps,
        colors    : this.colors.map(function(i) { return i.toJSON(); })
        };
    }

    /**
    * Revive from JSON.
    *
    * @static
    * @param {Object} o
    * @return {Color}
    * @memberof Color
    */
    static revive(o) {
        return new ColorMap(
        o.numSteps,
        o.colors.map(function(i) { return Color.revive(i); })
        );
    }

    /**
    * Return a predefined palette.
    * 
    * @static
    * @param {any} name 
    * @returns 
    * @memberof ColorMap
    */
    static get(name) {
        return (steps) => {
        switch (name) {
        default:
        case 'whitetoblack':
            return new ColorMap(steps, [
            new Color(255, 255, 255, 255),
            new Color(  0,   0,   0, 255)
            ]);
        case 'rgb':
            return new ColorMap(steps, [
            new Color(255,   0,   0, 255),
            new Color(  0, 255,   0, 255),
            new Color(  0,   0, 255, 255)
            ]);
        case 'rainbow':
            return new ColorMap(steps, [
            new Color(255,   0,   0, 255),
            new Color(255, 128,   0, 255),
            new Color(255, 255,   0, 255),
            new Color(0  , 255,   0, 255),
            new Color(128,   0, 128, 255),
            new Color(128,   0, 255, 255),
            new Color(255,   0,   0, 255)
            ]);
        case 'night':
            return new ColorMap(steps, [
            new Color(0  ,   0, 102, 255),
            new Color(255, 255, 255, 255),
            new Color(255, 102,   0, 255),
            new Color(0  ,   0, 102, 255)
            ]);
        case 'blacknwhite':
            return new ColorMap(steps, [
            new Color(255, 255, 255, 255),
            new Color(0  ,   0,   0, 255),
            new Color(255, 255, 255, 255),
            new Color(0  ,   0,   0, 255)
            ]);
        case 'fire':
            return new ColorMap(steps, [
            new Color(0  ,   0,   0, 255),
            new Color(255,   0,   0, 255),
            new Color(255, 255,   0, 255),
            new Color(255,   0,   0, 255)
            ]);
        case 'sky':
            return new ColorMap(steps, [
            new Color(0  ,   0, 120, 255),
            new Color(200, 255, 255, 255),
            new Color(0  ,   0, 120, 255)
            ]);
        }
        };
    }
}
export class Color {
    /**
    * Creates an instance of Color.
    *
    * @param {any} r 
    * @param {any} g 
    * @param {any} b 
    * @param {any} a 
    * @memberof Color
    */
    constructor(r = 0, g = 0, b = 0, a = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
    * Substract from given Color.
    * 
    * @param {any} color 
    * @returns {Color}
    * @memberof Color
    */
    delta(color) {
        return new Color(
        this.r - color.r,
        this.g - color.g,
        this.b - color.b,
        this.a - color.a
        );
    }
    /**
    * Return the css rgb notation.
    * 
    * @returns {string}
    * @memberof Color
    */
    rgb() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }

    /**
    * Convert to JSON.
    *
    * @return {Object}
    * @memberof Color
    */
    toJSON() {
        return {
        _type : 'Color',
        r     : this.r,
        g     : this.g,
        b     : this.b,
        a     : this.a
        };
    }

    /**
    * Revive from JSON.
    *
    * @static
    * @param {Object} o
    * @return {Color}
    * @memberof Color
    */
    static revive(o) {
        return new Color(o.r, o.g, o.b, o.a);
    }

    /**
    * Return a predefined color.
    * 
    * @static
    * @param {any} name 
    * @returns 
    * @memberof Color
    */
    static get(name) {
        return (alpha) => {
        switch (name) {
        default:
        case 'white':
            return new Color(255, 255, 255, alpha);
        case 'black':
            return new Color(0  ,   0,   0, alpha);
        case 'red':
            return new Color(255,   0,   0, alpha);
        case 'green':
            return new Color(0  , 255,   0, alpha);
        case 'blue':
            return new Color(0  ,   0, 255, alpha);
        case 'yellow':
            return new Color(255, 255,   0, alpha);
        case 'cyan':
            return new Color(0  , 255, 255, alpha);
        case 'magenta':
            return new Color(255,   0, 255, alpha);
        case 'indigo':
            return new Color(128,   0, 255, alpha);
        case 'pink':
            return new Color(255,   0, 128, alpha);
        case 'orange':
            return new Color(255, 128,   0, alpha);
        case 'apple':
            return new Color(128, 255,   0, alpha);
        case 'manganese':
            return new Color(0  , 128, 255, alpha);
        case 'guppie':
            return new Color(0  , 255, 128, alpha);
        case 'purple':
            return new Color(128,   0, 128, alpha);
        case 'teal':
            return new Color(0  , 128, 128, alpha);
        case 'olive':
            return new Color(128, 128,   0, alpha);
        case 'coral':
            return new Color(255, 128, 128, alpha);
        }
        };
    }
}