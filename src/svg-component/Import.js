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
var SvgDaoru = /** @class */ (function (_super) {
    __extends(SvgDaoru, _super);
    function SvgDaoru() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgDaoru.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M5.43 16a1.34 1.34 0 0 1 1.34 1.34v16a2.05 2.05 0 0 0 2.05 2.06h24.45a2.05 2.05 0 0 0 2-2.06V8.93a2.05 2.05 0 0 0-2-2h-6.66a1.34 1.34 0 0 1 0-2.68h6.66A4.73 4.73 0 0 1 38 8.93v24.44a4.73 4.73 0 0 1-4.73 4.73H8.82a4.73 4.73 0 0 1-4.72-4.73v-16A1.33 1.33 0 0 1 5.43 16z" }),
            React.createElement("path", { d: "M23.11 25.26a1.32 1.32 0 0 1-1 .46 1.35 1.35 0 0 1-1-.46l-7.51-7.5a1.31 1.31 0 0 1-.4-1 1.35 1.35 0 0 1 2.29-.95L20.64 21C19.86 9.4 14.81 4.77 3.34 4.78a1.34 1.34 0 0 1-1.16-2 1.35 1.35 0 0 1 1.16-.68c13.08 0 19.19 5.75 20 19.13l5.37-5.38a1.34 1.34 0 1 1 1.9 1.89z" })));
    };
    return SvgDaoru;
}(React.PureComponent));
exports.default = SvgDaoru;
/* eslint-enable */
//# sourceMappingURL=Daoru.js.map