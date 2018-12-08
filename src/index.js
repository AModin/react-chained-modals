import React, { PureComponent, Fragment } from "react";
import classnames from "classnames";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class ChainedModalComponent extends PureComponent {
  constructor(props) {
    super();
    this.container = null;
    const { elements } = props
    this.state = {
      visible: props.visible || true,
      currentModal: 0,
      totalModals: elements.length || 0,
      animationNext: props.animationNext || "fadeInRight",
      animationPrev: props.animationPrev || "fadeInLeft",
      animation: props.animationNext || "fadeInRight"
    };
  }

  showNext() {
    if (this.state.currentModal < this.state.totalModals - 1) {
      this.setState({
        animation: this.props.animationNext || "fadeInRight",
        currentModal: this.state.currentModal + 1
      });
    }
  }

  showPrev() {
    if (this.state.currentModal > 0) {
      this.setState({
        animation: this.props.animationPrev || "fadeInLeft",
        currentModal: this.state.currentModal - 1
      });
    }
  }

  returnWrappedElement(El, props, index) {
    if (this.state.currentModal === index)
      return (
        <div
          key={index}
          className={classnames(
            "react-chained-modal-container animated",
            this.state.animation,
            this.props.animationSpeed
          )}
        >
          <El
            closeChainedModal={() => this.props.onRequestClose()}
            className="wrapped-element"
            currentModal={this.state.currentModal}
            totalModals={this.state.totalModals}
            showNext={() => this.showNext.bind(this)}
            showPrev={() => this.showPrev.bind(this)}
            {...props}
          />
        </div>
      );
  }

  render() {
    return (
      <Fragment>
        {(this.props.visible &&
          ReactDOM.createPortal(
            <div
              className="react-chained-modal-cover"
              id="react-chained-modal-portal"
              onClick={e => {
                if (
                  e.target.id === "react-chained-modal-portal" &&
                  this.props.closeOnBackground
                ) {
                  this.props.onRequestClose();
                }
              }}
            >
              {this.props.elements.length &&
                this.props.elements.map((item, index) => {
                  return this.returnWrappedElement(
                    item.component,
                    item.props,
                    index
                  );
                })}
            </div>,
            document.body
          )) ||
          null}
      </Fragment>
    );
  }
}

const ChainedModal = props => {
  if (props.visible) {
    return <ChainedModalComponent {...props} />;
  } else {
    return null;
  }
};

ChainedModalComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  elements: PropTypes.array.isRequired,
  animationNext: PropTypes.string,
  animationPrev: PropTypes.string,
  closeOnBackground: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired
};

export default ChainedModal;