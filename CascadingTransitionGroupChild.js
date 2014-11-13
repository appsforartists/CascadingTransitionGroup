/**
 * @jsx React.DOM
 */

var React                 = require("react/addons");
var ReactTransitionEvents = require("react/lib/ReactTransitionEvents");

/*  Inspired by CSSTransitionGroup.
 *
 *  We set the class names on ourself instead of on the child because
 *  it's a more intuitive API (monkeypatching a class name on a child
 *  feels wrong), and to make it easier to hide until it's time to
 *  transition.
 *
 *  Using delays and CSS class names instead of the web-animations spec
 *  because:
 *
 *  a) The web-animations polyfill (which we'd need for iOS) is 200k, and
 *  b) It's more idiomorphically React to set a class name than to crack
 *     open your children and look for an Animation object.
 */

var CascadingTransitionGroupChild = React.createClass(
  {
    "propTypes":            {
                              "name":       React.PropTypes.string.isRequired,
                              "delay":      React.PropTypes.number.isRequired,
                              "component":  React.PropTypes.func.isRequired,

                              "appear":     React.PropTypes.bool,
                              "enter":      React.PropTypes.bool,
                              "leave":      React.PropTypes.bool,
                            },

    "getDefaultProps":      function () {
                              return {
                                "appear": true,
                                "enter":  true,
                                "leave":  true
                              }
                            },

    "queueTransition":      function (
                              {
                                state,
                                hideUntilStart,
                                completionCallback
                              }
                            ) {
                              // Need to fall back into JS here anyway to set the event listener
                              // so be like CSSTransitionGroup and manipulate the styles directly
                              // for optimum performance

                              var node = this.getDOMNode();

                              node.style.display = hideUntilStart
                                ? "none"
                                : "";

                              setTimeout(
                                () => {
                                  node.style.display = "";
                                  node.className = `${ this.props.name }-${ state }`;

                                  setTimeout(
                                    () => {
                                      node.className += ` ${ this.props.name }-${ state }-active`;

                                      ReactTransitionEvents.addEndEventListener(
                                        node,
                                        endListener
                                      );
                                    },

                                    17 // must wait at least 1 frame to force animations to trigger
                                       // requestAnimationFrame wasn't doing that consistently
                                  );
                                },
                                this.props.delay * 1000
                              );

                              var endListener = (event) => {
                                node.className = "";
                                ReactTransitionEvents.removeEndEventListener(node, endListener);

                                if (completionCallback)
                                  completionCallback();
                              };
                            },

    "componentWillAppear":  function (completionCallback) {
                              this.queueTransition(
                                {
                                  "state":              "appear",
                                  "hideUntilStart":     true,
                                  "completionCallback": completionCallback
                                }
                              );
                            },

    "componentWillEnter":   function (completionCallback) {
                              this.queueTransition(
                                {
                                  "state":              "enter",
                                  "hideUntilStart":     true,
                                  "completionCallback": completionCallback
                                }
                              );
                            },

    "componentWillLeave":   function (completionCallback) {
                              this.queueTransition(
                                {
                                  "state":              "leave",
                                  "hideUntilStart":     false,
                                  "completionCallback": completionCallback
                                }
                              );
                            },

    "render":               function () {
                              return this.props.component(
                                null,
                                this.props.children
                              );
                            }
  }
);

module.exports = CascadingTransitionGroupChild;
