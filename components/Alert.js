import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Alert({ isSuccess, message }) {
    return (
        <div
            className={`flex items-center p-4 mb-4 rounded-lg ${
                isSuccess ? 'accent-text-color bg-section' : 'destructive-text-color bg-tg-theme'
            }`}
            role="alert"
        >
            {isSuccess ? (
                <FaCheckCircle className="mr-3 flex-shrink-0 w-6 h-6" />
            ) : (
                <FaExclamationCircle className="mr-3 flex-shrink-0 w-6 h-6" />
            )}
            <span>{message}</span>
        </div>
    );
}
