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
var SvgDaochu = /** @class */ (function (_super) {
    __extends(SvgDaochu, _super);
    function SvgDaochu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgDaochu.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M34.44 22a1.34 1.34 0 0 1 1.34 1.33v10A4.72 4.72 0 0 1 31.07 38H6.71A4.71 4.71 0 0 1 2 33.29V8.93a4.72 4.72 0 0 1 4.71-4.71h13.51a1.34 1.34 0 1 1 0 2.67H6.71a2 2 0 0 0-2 2v24.4a2 2 0 0 0 2 2h24.36a2 2 0 0 0 2-2v-10A1.34 1.34 0 0 1 34.44 22z" }),
            React.createElement("path", { d: "M37.53 9.89a1.29 1.29 0 0 1 .47 1 1.33 1.33 0 0 1-.47 1l-7.48 7.48a1.33 1.33 0 0 1-1.88-1.89l5.14-5.15c-11.58.77-16.2 5.79-16.2 17.22a1.34 1.34 0 0 1-2 1.15 1.34 1.34 0 0 1-.67-1.15c0-13 5.76-19.12 19.09-19.91l-5.36-5.35A1.32 1.32 0 0 1 27.8 3a1.37 1.37 0 0 1 1-1 1.32 1.32 0 0 1 1.29.37z" })));
    };
    return SvgDaochu;
}(React.PureComponent));
exports.default = SvgDaochu;
/* eslint-enable */
//# sourceMappingURL=Daochu.js.map