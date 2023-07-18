import React, {FC, ReactNode} from 'react';
import cl from './Modal.module.css'
import classNames from 'classnames';


export type ModalProps = {
    isActive: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode
}

const Modal: FC<ModalProps> = React.memo(({isActive, onClose, title, children}) => {


        return (
                    <div className={classNames(`${cl.modal} ${isActive && cl.active}`)}
                         onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                             onClose()
                         }}>
                        <div className='py-6 px-4 bg-white rounded-md w-[500px] relative flex items-center justify-center flex-col'
                             onClick={(e) => e.stopPropagation()}>
                            <button className='absolute right-[10px] top-[10px] text-[12px]'
                                    onClick={() => {
                                        onClose();
                                    }}>Закрыть
                            </button>
                            <h1 className='text-[#123094] text-[24px]'>{title}</h1>
                            {children}
                        </div>
                    </div>
        );
    })
;

export default Modal;