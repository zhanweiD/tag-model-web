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
var SvgShuShangxiazhankai = /** @class */ (function (_super) {
    __extends(SvgShuShangxiazhankai, _super);
    function SvgShuShangxiazhankai() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgShuShangxiazhankai.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", width: "1em", height: "1em", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style }),
            React.createElement("path", { d: "M30.07 0H9.93A5.94 5.94 0 004 5.94v28.13A5.93 5.93 0 009.92 40h20.15A5.94 5.94 0 0036 34.07V5.93A5.94 5.94 0 0030.07 0zm3.12 34.07a3.11 3.11 0 01-3.12 3.12H9.93a3.11 3.11 0 01-3.12-3.12V5.94a3.13 3.13 0 01.91-2.21 3.18 3.18 0 012.21-.92h20.14a3.12 3.12 0 013.12 3.13z" }),
            React.createElement("path", { d: "M13 17a1.34 1.34 0 001-.41l6-6.08 6.1 6.09a1.39 1.39 0 00.9.4 1.34 1.34 0 001-.41 1.39 1.39 0 00.07-1.9l-7-7a1.41 1.41 0 00-2 0l-7 7a1.43 1.43 0 00-.41 1A1.4 1.4 0 0013 17zm14.05 6a1.38 1.38 0 00-1 .41l-6 6.08-6.1-6.08a1.39 1.39 0 00-2 0 1.38 1.38 0 000 2l7 7a1.39 1.39 0 002 0l7.05-7a1.38 1.38 0 000-2 1.38 1.38 0 00-.95-.41z" })));
    };
    return SvgShuShangxiazhankai;
}(React.PureComponent));
exports.default = SvgShuShangxiazhankai;
/* eslint-enable */
//# sourceMappingURL=ShuShangxiazhankai.js.map