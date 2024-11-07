import Button from './Button';

export default function ReturnToGroupButton({ goToPromotionsGroup }) {
    return (
        <Button onClick={goToPromotionsGroup} className="w-full button-text-color bg-button mt-4">
            Перейти в группу с акциями
        </Button>
    );
}
