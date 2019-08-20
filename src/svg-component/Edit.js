"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */ var React = __importStar(require("react"));
var style = {
    display: 'block',
    flex: '0 0 auto',
    cursor: 'pointer'
};
var SvgBianji = /** @class */ (function (_super) {
    __extends(SvgBianji, _super);
    function SvgBianji() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgBianji.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M36.6 16.29a1.4 1.4 0 0 0-1.35 1V32.4a2.77 2.77 0 0 1-2.77 2.77H7.6a2.77 2.77 0 0 1-2.77-2.77V7.61A2.78 2.78 0 0 1 7.6 4.83H22a1.41 1.41 0 0 0 .36-2.76H7.3A5.25 5.25 0 0 0 2 7.26v25.49A5.25 5.25 0 0 0 7.25 38h25.5A5.26 5.26 0 0 0 38 32.75V17.64a1.41 1.41 0 0 0-1.4-1.35z" }),
            React.createElement("path", { d: "M16.93 18.22l-.6 5.48v.19a1.39 1.39 0 0 0 1.4 1.38H18l5.54-.79a1.27 1.27 0 0 0 .73-.36l12.66-13.68a3.62 3.62 0 0 0 .17-4.87l-2-2.13a3.58 3.58 0 0 0-5.07-.13L17.34 17.37a1.27 1.27 0 0 0-.41.85zm2.72.83L32 5.25a.79.79 0 0 1 1.14.09l1.89 2a.74.74 0 0 1 .21.56.84.84 0 0 1-.27.59L22.64 21.85l-3.38.45z" })));
    };
    return SvgBianji;
}(React.PureComponent));
exports.default = SvgBianji;
/* eslint-enable */
//# sourceMappingURL=Bianji.js.map