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
var SvgLajitong = /** @class */ (function (_super) {
    __extends(SvgLajitong, _super);
    function SvgLajitong() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgLajitong.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M37.58 9.39a1.42 1.42 0 0 0-1-.42h-7.31V6.92a4.76 4.76 0 0 0-1.44-3.48A4.76 4.76 0 0 0 24.34 2h-8.68a4.76 4.76 0 0 0-3.49 1.44 4.76 4.76 0 0 0-1.44 3.48V9H3.44a1.44 1.44 0 0 0-1 2.46 1.42 1.42 0 0 0 1 .42h2.05v21.19A4.93 4.93 0 0 0 10.42 38h19.16a4.93 4.93 0 0 0 4.93-4.93V11.85h2.05A1.45 1.45 0 0 0 38 10.41a1.4 1.4 0 0 0-.42-1.02zm-24-2.46a2 2 0 0 1 2.05-2h8.68a2 2 0 0 1 2.09 2V9H13.61zM31 34.52a2 2 0 0 1-1.45.6H10.42a2 2 0 0 1-2.05-2V11.85h23.26v21.22a2 2 0 0 1-.63 1.45z" }),
            React.createElement("path", { d: "M16.29 16.08a1.4 1.4 0 0 0-1.4 1.4v12a1.4 1.4 0 0 0 2.8 0v-12a1.4 1.4 0 0 0-1.4-1.4zm7.42 0a1.4 1.4 0 0 0-1.4 1.4v12a1.4 1.4 0 1 0 2.8 0v-12a1.4 1.4 0 0 0-1.4-1.4z" })));
    };
    return SvgLajitong;
}(React.PureComponent));
exports.default = SvgLajitong;
/* eslint-enable */
//# sourceMappingURL=Lajitong.js.map