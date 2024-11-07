import { FaTelegramPlane } from 'react-icons/fa';
import Button from './Button';

export default function OpenBotButton({ openBot }) {
    return (
        <Button onClick={openBot} className="w-full button-text-color bg-button">
            <div className="flex items-center justify-center">
                <FaTelegramPlane className="mr-2" />
                Открыть бота
            </div>
        </Button>
    );
}
