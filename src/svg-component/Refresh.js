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
var SvgShuaxinzhuangtai = /** @class */ (function (_super) {
    __extends(SvgShuaxinzhuangtai, _super);
    function SvgShuaxinzhuangtai() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgShuaxinzhuangtai.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", width: "1em", height: "1em", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style }),
            React.createElement("path", { d: "M20 38A18 18 0 1134.62 9.53l.56.77v-4a1.41 1.41 0 112.82 0v6.86a1.42 1.42 0 01-1.41 1.42h-7.44a1.42 1.42 0 010-2.83h3.58l-.34-.48A15.17 15.17 0 1035.18 20 1.41 1.41 0 1138 20a18 18 0 01-18 18z" })));
    };
    return SvgShuaxinzhuangtai;
}(React.PureComponent));
exports.default = SvgShuaxinzhuangtai;
/* eslint-enable */
//# sourceMappingURL=Shuaxinzhuangtai.js.map