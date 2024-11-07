import { FaExclamationCircle } from 'react-icons/fa';
import Button from './Button';

export default function NicknameInstruction({ goToInstruction }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <FaExclamationCircle className="accent-text-color w-12 h-12 mb-4" />
            <p className="text-center accent-text-color">
                Чтобы участвовать в наших акциях - на вашем аккаунте обязательно должен быть ник.
                <br />
                Вот инструкция как его установить:
                <Button onClick={goToInstruction} className="mt-4 bg-button-color button-text-color">
                    Инструкция
                </Button>
            </p>
        </div>
    );
}
