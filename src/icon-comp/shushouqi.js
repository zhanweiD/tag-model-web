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
var SvgShushouqi = /** @class */ (function (_super) {
    __extends(SvgShushouqi, _super);
    function SvgShushouqi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgShushouqi.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M30.07 0H9.93A5.94 5.94 0 0 0 4 5.94v28.13A5.93 5.93 0 0 0 9.92 40h20.15A5.94 5.94 0 0 0 36 34.07V5.93A5.94 5.94 0 0 0 30.07 0zm3.12 34.07a3.11 3.11 0 0 1-3.12 3.12H9.93a3.11 3.11 0 0 1-3.12-3.12V5.94a3.13 3.13 0 0 1 .91-2.21 3.18 3.18 0 0 1 2.21-.92h20.14a3.12 3.12 0 0 1 3.12 3.13z" }),
            React.createElement("path", { d: "M13 19.83a1.39 1.39 0 0 0 1-.41l6-6.08 6.1 6.08a1.35 1.35 0 0 0 .92.35 1.39 1.39 0 0 0 1-.41 1.4 1.4 0 0 0-.02-1.91l-7-7a1.39 1.39 0 0 0-2 0l-7 7a1.4 1.4 0 0 0 1 2.38zM27.05 30a1.43 1.43 0 0 1-1-.41L20 23.5l-6.1 6.08a1.4 1.4 0 0 1-2.38-1 1.41 1.41 0 0 1 .41-1l7-7a1.39 1.39 0 0 1 2 0l7.05 7a1.41 1.41 0 0 1 .41 1 1.39 1.39 0 0 1-.41 1 1.43 1.43 0 0 1-.93.42z" })));
    };
    return SvgShushouqi;
}(React.PureComponent));
exports.default = SvgShushouqi;
/* eslint-enable */
//# sourceMappingURL=Shushouqi.js.map