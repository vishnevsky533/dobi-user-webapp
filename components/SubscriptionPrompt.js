import { FaExclamationCircle } from 'react-icons/fa';
import Button from './Button';

export default function SubscriptionPrompt({ goToPromotionsGroup }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <FaExclamationCircle className="w-12 h-12 mb-4 accent-text-color" />
            <p className="text-center accent-text-color">
                Чтобы участвовать в наших акциях, вы должны быть подписаны на наш канал.
            </p>
            <Button onClick={goToPromotionsGroup} className="mt-4 bg-button-color button-text-color">
                Перейти на канал
            </Button>
        </div>
    );
}
