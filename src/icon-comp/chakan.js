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
var SvgChakan = /** @class */ (function (_super) {
    __extends(SvgChakan, _super);
    function SvgChakan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgChakan.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M37.58 35.56l-8.15-8.12a15.05 15.05 0 0 0 2.38-3.89 15.54 15.54 0 0 0 0-12.07A15.49 15.49 0 0 0 17.52 2a15.5 15.5 0 0 0-11 26.48 15.49 15.49 0 0 0 20.86 1l8.15 8.13a1.42 1.42 0 0 0 1 .42 1.43 1.43 0 0 0 1-2.44zm-20.06-5.39a12.65 12.65 0 1 1 9-3.74l-.05.05a12.55 12.55 0 0 1-8.89 3.66zm0 0" })));
    };
    return SvgChakan;
}(React.PureComponent));
exports.default = SvgChakan;
/* eslint-enable */
//# sourceMappingURL=Chakan.js.map