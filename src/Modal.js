import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.options.title
    };
    this.closeModal = this.closeModal.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }

  componentWillMount() {
    //  when modal mounts, the background page should not scroll as it causes unnecessary scrolling when modal content scrolls
    if (this.props.options.backgroundNoScroll) {
      document.documentElement.classList.add('no-scroll');
    }
  }

  handleOnOutsideClick(e) {
    if (this.props.options.closeOnOutsideClick && !this.isChildOf(e.target, this.refs.modalContent) || false) {
      this.props.removeModal(this.props.id);
    }
  }

  isChildOf(child, parent) {
    if (child.parentNode === parent) {
      return true;
    } else if (child.parentNode === null) {
      return false;
    } else {
      return this.isChildOf(child.parentNode, parent);
    }
  }

  closeModal() {
    this.props.removeModal(this.props.id);
    //allowing the background page to scroll as usual when modal closes
    document.documentElement.classList.remove('no-scroll');
    this.props.options.onCloseModal && this.props.options.onCloseModal();
  }

  updateTitle(title) {
    this.setState({
      title
    });
  }

  render() {
    return (
      <div className="rrm-holder" style={{zIndex: `999${this.props.index}`}}>
        <div className="scroll" onClick={this.handleOnOutsideClick.bind(this)}>

          <div ref="modalContent" className={classnames('rrm-content', `m-${this.props.options.size}` || 'm-medium')}>
            {this.props.options.hideTitleBar ? null :
                <div className="rrm-title">
                  <h2>{this.state.title}</h2>
                  <div className="rr-title-actions">
                    {this.props.options.hideCloseButton ? null :
                        <button
                            type="button"
                            className="rr-close rrm-icon-cancel"
                            onClick={this.closeModal}>X</button>
                    }
                  </div>
                </div>
            }

            <div className="rrm-body">
              <this.props.component key={this.state.title} {...this.props.options} {...this.props.data} removeModal={this.closeModal} updateModalTitle={this.updateTitle}/>
            </div>
          </div>

        </div>

        <div className="rrm-shadow" />
      </div>
    );
  }
}

Modal.displayName = 'rrModal';

Modal.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  removeModal: PropTypes.func.isRequired,
  options: PropTypes.shape({
    size: PropTypes.string,
    title: PropTypes.string,
    hideCloseButton: PropTypes.bool,
    hideTitleBar: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool
  }).isRequired
};

export default Modal;
