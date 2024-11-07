import Button from './Button';
import Link from 'next/link';

export default function RulesCheckbox({ rulesAccepted, handleCheckboxChange, registerUser }) {
    return (
        <div className="space-y-4">
            <p className="text-lg font-medium text-color">
                Чтобы продолжить, примите наши{' '}
                <Link href="/rules" rel="noopener noreferrer" className="link-color">
                    правила
                </Link>
            </p>
            <label className="inline-flex items-center hint-color">
                <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-tg-theme-hint-color"
                    checked={rulesAccepted}
                    onChange={handleCheckboxChange}
                />
                <span className="ml-2">Я принимаю правила</span>
            </label>
            <Button onClick={registerUser} disabled={!rulesAccepted} className="w-full bg-button-color button-text-color">
                Зарегистрироваться
            </Button>
        </div>
    );
}
