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
var SvgTianjiaduixiang = /** @class */ (function (_super) {
    __extends(SvgTianjiaduixiang, _super);
    function SvgTianjiaduixiang() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgTianjiaduixiang.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { id: "tianjiaduixiang_svg__tianjiaduixiang_svg__\\u56FE\\u5C42_1", "data-name": "\\u56FE\\u5C42 1", viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("defs", null,
                React.createElement("style", null)),
            React.createElement("path", { d: "M10.09 11.5v25a1.5 1.5 0 0 0 1.49 1.5h24.93A1.5 1.5 0 0 0 38 36.5v-25a1.5 1.5 0 0 0-1.49-1.5H11.58a1.5 1.5 0 0 0-1.49 1.5zm24.55 23.75H13.45a.65.65 0 0 1-.65-.66V13.41a.65.65 0 0 1 .65-.66h21.19a.66.66 0 0 1 .66.66v21.18a.66.66 0 0 1-.66.66z" }),
            React.createElement("path", { d: "M29.26 22.79h-4v-4a1.22 1.22 0 0 0-2.43 0v4h-4a1.21 1.21 0 1 0 0 2.42h4v4a1.22 1.22 0 0 0 2.43 0v-4h4a1.21 1.21 0 0 0 0-2.42zM27 3.44a1.35 1.35 0 0 0-1.35-1.35H3.5A1.5 1.5 0 0 0 2 3.59v22.15a1.34 1.34 0 0 0 1.35 1.35 1.34 1.34 0 0 0 1.35-1.35V5.49a.7.7 0 0 1 .7-.7h20.25A1.34 1.34 0 0 0 27 3.44z" })));
    };
    return SvgTianjiaduixiang;
}(React.PureComponent));
exports.default = SvgTianjiaduixiang;
/* eslint-enable */
//# sourceMappingURL=Tianjiaduixiang.js.map