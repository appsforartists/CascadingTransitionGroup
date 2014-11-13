/**
 * @jsx React.DOM
 */

var React           = require("react/addons");
var TransitionGroup = React.addons.TransitionGroup;

var CascadingTransitionGroupChild = require("./CascadingTransitionGroupChild.js");

var CascadingTransitionGroup = React.createClass(
  {
    "propTypes":          {
                            "component":      React.PropTypes.func,
                            "innerComponent": React.PropTypes.func,
                            "delay":          React.PropTypes.number
                          },

    "getDefaultProps":    function () {
                            return {
                              "component":      React.DOM.span,
                              "innerComponent": React.DOM.span,
                              "delay":          .05
                            }
                          },

    "_wrapChild":         function (child) {
                            var children = this.props.children;

                            /*  What we want to do is:
                             *
                             *    var i = Array.isArray(children)
                             *      ? children.indexOf(child)
                             *      : 0;
                             *
                             *  but since children could be a nest of arrays, we have
                             *  to roll own indexOf with React.Children.  It's gross
                             *  and probably slow.  TODO: find a faster implementation.
                             */

                            var indexForKey = {};

                            React.Children.map(
                              children,
                              (child, i) => indexForKey[child.props.key] = i
                            );

                            var i = indexForKey[child.props.key];

                            return  <CascadingTransitionGroupChild
                                      name  = { this.props.transitionName }
                                      delay = { this.props.delay * i }

                                      appear = { this.props.transitionAppear }
                                      enter  = { this.props.transitionEnter }
                                      leave  = { this.props.transitionLeave }

                                      component = { this.props.innerComponent }
                                    >
                                      { child }
                                    </CascadingTransitionGroupChild>;
                          },

    "render":             function () {
                            return this.transferPropsTo(
                              <TransitionGroup
                                childFactory = { this._wrapChild }
                              >
                                { this.props.children }
                              </TransitionGroup>
                            );
                          }
  }
);

module.exports = CascadingTransitionGroup;
