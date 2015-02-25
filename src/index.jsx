'use strict';

var React     = require('react')
var assign    = require('object-assign')
var normalize = require('react-style-normalizer')

function emptyFn(){}

module.exports = React.createClass({

    displayName: 'ReactButton',

    propTypes: {
        fn: React.PropTypes.func,
        onClick: React.PropTypes.func,

        primary: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        pressed: React.PropTypes.bool,
        defaultPressed: React.PropTypes.bool,

        href: React.PropTypes.string,

        style: React.PropTypes.object,
        activeStyle: React.PropTypes.object,
        overStyle: React.PropTypes.object,
        focusedStyle: React.PropTypes.object,
        disabledStyle: React.PropTypes.object,

        className       : React.PropTypes.string,
        activeClassName : React.PropTypes.string,
        overClassName   : React.PropTypes.string,
        focusedClassName: React.PropTypes.string,
        disabledClassName: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {

            defaultStyle: {
                display   : 'inline-block',
                userSelect: 'none',
                boxSizing : 'border-box',
                textDecoration: 'none',
                cursor   : 'pointer',

                //theme properties
                padding  : 5,
                margin   : 2,
                border   : '1px solid rgb(218, 218, 218)',
                color: 'rgb(120, 120, 120)',
            },

            defaultPrimaryStyle: {
                //theme properties
                background: 'rgb(103, 175, 233)',
                color: 'white'
            },

            defaultOverStyle: {
                //theme properties
                background: 'rgb(131, 190, 237)',
                color: 'white'
            },

            defaultPressedStyle: {
                //theme properties
                background: 'rgb(90, 152, 202)',
                color: 'white'
            },

            defaultDisabledPrimaryStyle: {
                //theme properties
                background: 'rgb(116, 144, 166)',
                color: 'rgb(190, 190, 190)'
            },

            defaultDisabledStyle: {
                cursor: 'default',

                //theme properties
                background: 'rgb(221, 221, 221)',
                color: 'rgb(128, 128, 128)'
            },
            href: ''
        }
    },

    getInitialState: function() {
        return {
            mouseOver: false,
            active: false,
            defaultPressed: this.props.defaultPressed
        }
    },

    isFocused: function() {
        return this.state.focused
    },

    isActive: function() {
        return !!this.state.active
    },

    render: function(){
        var props = this.prepareProps(this.props, this.state)

        return (props.factory || React.DOM.a)(props)
    },

    prepareProps: function(thisProps, state) {

        var props = {}

        assign(props, thisProps)

        var pressed = props.pressed != null? props.pressed: state.defaultPressed

        if (pressed != null){
            props.pressed = pressed
        }

        props.active    = !!state.active
        props.mouseOver = props.overState == null? !!state.mouseOver: props.overState
        props.focused = !!state.focused

        props['data-active'] = props.active
        props['data-mouse-over'] = props.mouseOver
        props['data-focused'] = props.focused
        props['data-pressed'] = props.pressed
        props['data-primary'] = props.primary

        props.style     = this.prepareStyle(props, state)
        props.className = this.prepareClassName(props, state)

        var handleClick = this.handleClick.bind(this, props)

        props.onClick = typeof props.interceptClick == 'function'?
                            props.interceptClick.bind(this, handleClick):
                            handleClick

        props.onFocus      = this.handleFocus.bind(this, props)
        props.onBlur       = this.handleBlur.bind(this, props)
        props.onMouseEnter = this.handleMouseEnter.bind(this, props)
        props.onMouseLeave = this.handleMouseLeave.bind(this, props)
        props.onMouseDown  = this.handleMouseDown.bind(this, props)
        props.onMouseUp    = this.handleMouseUp.bind(this, props)

        return props
    },

    handleFocus: function(props, event) {
        if (props.disabled){
            return
        }

        this.setState({
            focused: true
        })
    },

    handleBlur: function(props, event) {
        if (props.disabled){
            return
        }

        this.setState({
            focused: false
        })
    },

    handleClick: function(props, event) {
        if (!props.href || props.disabled){
            event.preventDefault()
        }

        if (props.disabled){
            return
        }

        if (props.pressed != null){
            var newPressed = !props.pressed

            if (this.props.pressed == null){
                this.setState({
                    defaultPressed: newPressed
                })
            }

            ;(this.props.onToggle || emptyFn)(newPressed, event)
        }

        ;(this.props.onClick || emptyFn)(event)
        ;(this.props.fn || emptyFn)(props, event)
    },

    handleMouseEnter: function(props, event) {
        if (props.disabled){
            return
        }

        this.setState({
            mouseOver: true
        })

        ;(this.props.onMouseEnter || emptyFn)(event)
    },

    handleMouseLeave: function(props, event) {
        if (props.disabled){
            return
        }

        this.setState({
            mouseOver: false
        })

        ;(this.props.onMouseLeave || emptyFn)(event)
    },

    handleMouseUp: function(props, event) {
        if (props.disabled){
            return
        }

        this.setState({
            active: false
        })

        window.removeEventListener('mouseup', this.handleMouseUp)

        ;(this.props.onMouseUp || emptyFn)(event)
    },

    handleMouseDown: function(props, event) {

        if (props.disabled){
            return
        }

        this.setState({
            active: true
        })

        window.addEventListener('mouseup', this.handleMouseUp)

        ;(this.props.onMouseDown || emptyFn)(event)
    },

    prepareClassName: function(props) {

        var className = props.className || ''

        if (props.disabled){
            if (props.disabledClassName){
                className += ' ' + props.disabledClassName
            }
        } else {
            if (props.active && props.activeClassName){
                className += ' ' + props.activeClassName
            }

            if (props.pressed && props.pressedClassName){
                className += ' ' + props.pressedClassName
            }

            if (props.mouseOver && props.overClassName){
                className += ' ' + props.overClassName
            }

            if (props.focused && props.focusedClassName){
                className += ' ' + props.focusedClassName
            }
        }

        if (props.primary && props.primaryClassName){
            className += ' ' + props.primaryClassName
        }

        return className
    },

    prepareStyle: function(props) {
        var style = {}

        assign(style, props.defaultStyle, props.style)

        if (props.disabled){
            assign(style,
                props.defaultDisabledStyle,
                props.primary && props.defaultDisabledPrimaryStyle,

                props.disabledStyle,
                props.primary && props.disabledPrimaryStyle
            )

        } else {
            assign(style,
                //DEFAULTS
                props.focused   && props.defaultFocusedStyle,
                props.primary   && props.defaultPrimaryStyle,
                props.mouseOver && props.defaultOverStyle,
                props.pressed   && props.defaultPressedStyle,
                props.active    && props.defaultActiveStyle,
                //combinations
                props.mouseOver && props.primary && props.defaultOverPrimaryStyle,
                props.pressed   && props.primary && props.defaultPressedPrimaryStyle,
                props.mouseOver && props.pressed && props.defaultOverPressedStyle,

                //NON-DEFAULTS
                props.focused   && props.focusedStyle,
                props.primary   && props.primaryStyle,
                props.mouseOver && props.overStyle,
                props.pressed   && props.pressedStyle,
                props.active    && props.activeStyle,
                //combinations
                props.mouseOver && props.primary && props.overPrimaryStyle,
                props.pressed   && props.primary && props.pressedPrimaryStyle,
                props.mouseOver && props.pressed && props.overPressedStyle
            )
        }

        return normalize(style)
    }
})