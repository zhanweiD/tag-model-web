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
var SvgXiazai = /** @class */ (function (_super) {
    __extends(SvgXiazai, _super);
    function SvgXiazai() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgXiazai.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M36.11 24.91a1.73 1.73 0 0 0-1.39 1.74v6.2a1.85 1.85 0 0 1-1.85 1.85H7.13a1.85 1.85 0 0 1-1.85-1.85v-6.2a1.73 1.73 0 0 0-1.4-1.74A1.64 1.64 0 0 0 2 26.53v6.35A5.09 5.09 0 0 0 7.1 38h25.8a5.09 5.09 0 0 0 5.1-5.12v-6.35a1.64 1.64 0 0 0-1.89-1.62z" }),
            React.createElement("path", { d: "M18.79 29.52a1.65 1.65 0 0 0 2.42 0l8-8.75a1.64 1.64 0 1 0-2.42-2.22l-5.1 5.65V3.64a1.64 1.64 0 0 0-3.28 0V24.2l-5.2-5.64a1.65 1.65 0 1 0-2.42 2.23z" })));
    };
    return SvgXiazai;
}(React.PureComponent));
exports.default = SvgXiazai;
/* eslint-enable */
//# sourceMappingURL=Xiazai.js.map