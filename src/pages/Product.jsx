import { useState } from "react";

export default function ProductModal() {
    const [isOpen, setIsOpen] = useState(false);
    

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <button onClick={openModal}>Product Modal</button>
            {isOpen && (
                <div className="modal">
                    <div className="modal-product">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <p>Modal Content</p>
                    </div>
                </div>
            )}
        </div>
    );
}
