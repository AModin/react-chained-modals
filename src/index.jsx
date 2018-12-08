import React, { Component, Fragment } from "react";
import "./modal.css";
import classnames from "classnames";
import ReactDOM from "react-dom";

class ChainedModalComponent extends Component {
  constructor(props) {
    super();
    this.container = null;
    this.state = {
      visible: props.visible,
      currentModal: 0,
      totalModals: props.elements.length,
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
            closeChainedModal={this.closeModal}
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
              ref={node => (this.container = node)}
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

export default ChainedModal;