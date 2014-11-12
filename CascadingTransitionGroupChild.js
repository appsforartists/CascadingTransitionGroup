/**
 * @jsx React.DOM
 */

var React     = require("react/addons");

var CSSTransitionGroupChild = require("react/lib/ReactCSSTransitionGroupChild");
var onlyChild               = require("react/lib/onlyChild");

/*  Using delays and CSS class names instead of the web-animations spec
 *  because:
 *
 *  a) The web-animations polyfill (which we'd need for iOS) is 200k, and
 *  b) It's more idiomorphically React to set a class name than to crack
 *     open your children and look for an Animation object.
 */

var CascadingTransitionGroupChild = React.createClass(
  {
    "propTypes":                  {
                                    "name":  React.PropTypes.string.isRequired,
                                    "delay": React.PropTypes.number.isRequired,

                                    "mount": React.PropTypes.bool,
                                    "enter": React.PropTypes.bool,
                                    "leave": React.PropTypes.bool
                                  },

    "getDefaultProps":            function () {
                                    return {
                                      "mount": true,
                                      "enter": true,
                                      "leave": true
                                    }
                                  },

    "componentWillEnterOnMount":  function (done) {
                                    var cssChild = this.refs["cssChild"];

                                    if (cssChild.componentWillEnterOnMount) {
                                      setTimeout(
                                        cssChild.componentWillEnterOnMount,
                                        this.props.delay * 1000,
                                        done
                                      )
                                    }
                                  },

    "componentWillEnter":         function (done) {
                                    var cssChild = this.refs["cssChild"];

                                    if (cssChild.componentWillEnter) {
                                      setTimeout(
                                        cssChild.componentWillEnter,
                                        this.props.delay * 1000,
                                        done
                                      )
                                    }
                                  },

    "componentWillLeave":         function (done) {
                                    var cssChild = this.refs["cssChild"];

                                    if (cssChild.componentWillLeave) {
                                      setTimeout(
                                        cssChild.componentWillLeave,
                                        this.props.delay * 1000,
                                        done
                                      )
                                    }
                                  },

    "render":                     function () {
                                    return this.transferPropsTo(
                                      <CSSTransitionGroupChild
                                        ref = "cssChild"
                                      >
                                        { this.props.children }
                                      </CSSTransitionGroupChild>
                                    );
                                  }
  }
);

module.exports = CascadingTransitionGroupChild;
