import React from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import { MODAL_TITLE, WARNING_INFO, EXT_INFO } from "../utils/stringConstant";

export default ({ show, handleModalClose, text }) => (
  <Modal
    isOpen={show}
    closeTimeoutMS={200}
    ariaHideApp={false}
    className="modal"
  >
    <h3 className="modal__title">{MODAL_TITLE}</h3>
    <div className="modal__content">
      <div>
        <FontAwesome name="far fa-image" size="3x" style={{ color: "#abc" }} />
      </div>
      <div>
        <p className="modal__body">{ text }</p>
      </div>
    </div>
    <button onClick={handleModalClose} className="modal__button">
      OK
    </button>
  </Modal>
)
