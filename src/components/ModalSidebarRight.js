import ReactModal from 'react-modal';
import React, { useState, useEffect } from 'react';
import { ButtonProvider } from './ButtonProvider';


const ModalSidebarRight = ({ onSubmit, onClose, modalId, className, content, headerContent }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    const handleClickSubmit = () => {
        onSubmit();
        setIsOpen(false);
    };

    const handleClickCancel = () => {
        onClose();
        setIsOpen(false);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            id={modalId}
            className={`modal modal-right ${modalId != null ? `modal__${modalId}` : ``}`}
            overlayClassName="modal-overlay">
            <div className={`modal__container ${modalId != null ? `modal__container__${modalId}` : ``}`}>
                {
                    headerContent == null ?
                        <div className='modal__header'>
                            <ButtonProvider width={'icon'}>
                                <button type="button" className={`button button__icon`} onClick={handleClickCancel}>
                                    <i data-button="icon" className={`icon icon__back__black`}></i>
                                    <span className={`blind`}>닫기</span>
                                </button>
                            </ButtonProvider>
                        </div> :
                        headerContent
                }

                <div className='modal__content'>

                    {content}
                </div>
            </div>
        </ReactModal>
    );
};

export default ModalSidebarRight;
