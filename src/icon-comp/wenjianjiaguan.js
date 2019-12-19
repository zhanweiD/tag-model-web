'use strict';

let __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf
            || ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b })
            || function (d, b) { for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p] };
    return extendStatics(d, b)
    };
  return function (d, b) {
    extendStatics(d, b)
        function __() { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
    };
}());
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i]
            for (let p in s) {if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];}
    }
    return t
    };
  return __assign.apply(this, arguments)
};
let __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) for (let k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result.default = mod
    return result
};
Object.defineProperty(exports, '__esModule', { value: true })
/* eslint-disable */ var React = __importStar(require("react"));
var style = {
    display: 'block',
    flex: '0 0 auto',
    cursor: 'pointer'
};
var SvgWenjianjiaGuan = /** @class */ (function (_super) {
    __extends(SvgWenjianjiaGuan, _super);
    function SvgWenjianjiaGuan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgWenjianjiaGuan.prototype.render = function () {
        var props = this.props;
        var size = props.size, fill = props.fill;
        return (React.createElement("svg", __assign({}, props, { viewBox: "0 0 40 40", preserveAspectRatio: "xMidYMid meet", fontSize: size || 32, fill: fill || 'currentColor', style: style, width: "1em", height: "1em" }),
            React.createElement("path", { d: "M36.3 10H21.11a.67.67 0 0 1-.63-.7V6a1.91 1.91 0 0 0-1.8-2H3.9a1.91 1.91 0 0 0-1.8 2v28a1.91 1.91 0 0 0 1.8 2h32.4a1.91 1.91 0 0 0 1.8-2V12a1.91 1.91 0 0 0-1.8-2zM4.09 9.3V6.7a.66.66 0 0 1 .63-.7h13.14a.66.66 0 0 1 .63.7v2.6a.66.66 0 0 1-.63.7H4.72a.66.66 0 0 1-.63-.7z", "data-name": "\\u56FE\\u5C42 9" })));
    };
    return SvgWenjianjiaGuan;
}(React.PureComponent));
exports.default = SvgWenjianjiaGuan;
/* eslint-enable */
// # sourceMappingURL=WenjianjiaGuan.js.map
