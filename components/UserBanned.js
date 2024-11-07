import { FaExclamationCircle } from 'react-icons/fa';

export default function UserBanned() {
    return (
        <div className="flex flex-col items-center justify-center">
            <FaExclamationCircle className="destructive-text-color w-12 h-12 mb-4" />
            <p className="text-center destructive-text-color">
                Ваш аккаунт заблокирован и вы не можете участвовать в акциях.
            </p>
        </div>
    );
}
