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
var SvgTianjia = /** @class */ (function (_super) {
    __extends(SvgTianjia, _super);
    function SvgTianjia() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgTianjia.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", width: "1em", height: "1em", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style }),
            React.createElement("path", { d: "M32.08 2H7.93A5.94 5.94 0 002 7.93v24.14A5.94 5.94 0 007.93 38h24.14A5.94 5.94 0 0038 32.06V7.93A5.93 5.93 0 0032.08 2zm3.11 30.06a3.13 3.13 0 01-.91 2.21 3.18 3.18 0 01-2.21.92H7.93a3.12 3.12 0 01-3.12-3.13V7.93a3.11 3.11 0 013.12-3.12h24.14a3.11 3.11 0 013.12 3.12z" }),
            React.createElement("path", { d: "M27.58 18.6H21.4v-6.18a1.4 1.4 0 10-2.8 0v6.18h-6.18a1.4 1.4 0 000 2.8h6.18v6.18a1.4 1.4 0 002.8 0V21.4h6.18a1.4 1.4 0 100-2.8z" })));
    };
    return SvgTianjia;
}(React.PureComponent));
exports.default = SvgTianjia;
/* eslint-enable */
//# sourceMappingURL=Tianjia.js.map