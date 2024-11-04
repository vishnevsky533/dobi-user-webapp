// app/page.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@/components/Button';
import { FaCheckCircle, FaExclamationCircle, FaTelegramPlane } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [publicationId, setPublicationId] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOpenBotButton, setShowOpenBotButton] = useState(false);
    const [showReturnToGroupButton, setShowReturnToGroupButton] = useState(false);
    const [showRulesCheckbox, setShowRulesCheckbox] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const [botStartLink, setBotStartLink] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const initDataUnsafe = tg.initDataUnsafe;
            const startParam = initDataUnsafe?.start_param;

            const userId = initDataUnsafe?.user?.id;
            const nickname = initDataUnsafe?.user?.username || '';
            const firstName = initDataUnsafe?.user?.first_name || '';
            const lastName = initDataUnsafe?.user?.last_name || '';
            setNickname(nickname);
            setFirstName(firstName);
            setLastName(lastName);
            setUserId(userId);

            if (startParam) {
                setPublicationId(startParam);
            } else {
                setStatusMessage('Некорректный параметр запуска.');
                setIsLoading(false);
                return;
            }

            if (userId && startParam) {
                checkUserRegistration(userId, startParam);
            } else {
                setStatusMessage('Ошибка: не удалось получить данные пользователя или акции.');
                setIsLoading(false);
            }
        } else {
            setStatusMessage('Приложение должно быть запущено внутри Telegram.');
            setIsLoading(false);
        }
    }, []);

    const checkUserRegistration = async (userId, publicationId) => {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            if (response.status === 200) {
                await registerUserInPromotion(userId, publicationId);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShowRulesCheckbox(true);
                setIsLoading(false);
            } else {
                console.error('Ошибка при проверке пользователя:', error);
                setStatusMessage('Произошла ошибка при проверке пользователя.');
                setIsLoading(false);
            }
        }
    };

    const registerUserInPromotion = async (userId, publicationId) => {
        try {
            const response = await axios.post('/api/promotions/register', {
                userId,
                publicationId,
            });

            if (response.status === 200) {
                if (response.data.success) {
                    setStatusMessage('Успешно! Инструкции ищите в боте, он уже её отправил вам.');
                    setIsSuccess(true);
                    setShowOpenBotButton(true);
                    setBotStartLink(`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`);
                } else {
                    if (response.data.botNotStarted) {
                        setStatusMessage('Для регистрации в акции, пожалуйста, запустите бота.');
                        setShowOpenBotButton(true);
                        setBotStartLink(`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=participate_${response.data.publicationId}`);
                    } else {
                        setStatusMessage(response.data.message || 'Произошла ошибка при регистрации в акции.');
                        setShowReturnToGroupButton(true);
                    }
                }
            } else {
                console.error('Ошибка при регистрации в акции');
                setStatusMessage('Произошла ошибка при регистрации в акции.');
            }
        } catch (error) {
            console.error('Ошибка при регистрации в акции:', error);
            setStatusMessage('Произошла ошибка при регистрации в акции.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (e) => {
        setRulesAccepted(e.target.checked);
    };

    const registerUser = async () => {
        if (rulesAccepted && userId) {
            setShowRulesCheckbox(false);
            setIsLoading(true);
            try {
                const response = await axios.post('/api/users/register', {
                    userId,
                    nickname,
                    firstName,
                    lastName,
                    rulesAccepted
                });

                if (response.status === 200 && response.data.success) {
                    // Используем publicationId из состояния или startParam
                    await registerUserInPromotion(userId, publicationId);
                } else {
                    console.error('Ошибка при регистрации пользователя в боте');
                    setStatusMessage('Произошла ошибка при регистрации пользователя.');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Ошибка при регистрации пользователя в боте:', error);
                setIsLoading(false);
                setStatusMessage('Произошла ошибка при регистрации пользователя.');
            }
        }
    };

    const openBot = () => {
        setShowOpenBotButton(false);
        window.location.href = botStartLink || `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`;
    };

    const goToPromotionsGroup = () => {
        window.location.href = `https://t.me/${process.env.NEXT_PUBLIC_PROMOTIONS_GROUP_LINK}`;
    };

    return (
        <div className="flex items-center justify-center bg-theme flex-grow">
            {isLoading ? (
                <div role="status">
                    <svg aria-hidden="true"
                         className="w-8 h-8 text-gray-200 animate-spin loading-fill"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <div className="max-w-md mx-auto bg-section-bg-color border rounded-lg p-6">
                    {statusMessage && (
                        <div
                            className={`flex items-center p-4 mb-4 ${
                                isSuccess
                                    ? 'accent-text-color bg-section'
                                    : 'destructive-text-color bg-tg-theme-destructive-text-color'
                            } rounded-lg`}
                            role="alert"
                        >
                            {isSuccess ? (
                                <FaCheckCircle className="mr-3 flex-shrink-0 w-6 h-6"/>
                            ) : (
                                <FaExclamationCircle className="mr-3 flex-shrink-0 w-6 h-6"/>
                            )}
                            <span>{statusMessage}</span>
                        </div>
                    )}

                    {showOpenBotButton && (
                        <Button onClick={openBot} className="w-full button-text-color bg-button">
                            <div className="flex items-center justify-center">
                                <FaTelegramPlane className="mr-2"/>
                                Открыть бота
                            </div>
                        </Button>
                    )}

                    {showReturnToGroupButton && (
                        <Button onClick={goToPromotionsGroup} className="w-full button-text-color bg-button mt-4">
                            Перейти в группу с акциями
                        </Button>
                    )}

                    {showRulesCheckbox && (
                        <div className="space-y-4">
                            <p className="text-lg font-medium text-color">
                                Чтобы продолжить, примите наши{' '}
                                <Link href="/rules" rel="noopener noreferrer" className="link-color">правила</Link>
                            </p>
                            <label className="inline-flex items-center hint-color">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-tg-theme-hint-color"
                                    checked={rulesAccepted}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="ml-2">
                                    Я принимаю правила
                                </span>
                            </label>
                            <Button onClick={registerUser} disabled={!rulesAccepted}
                                    className="w-full bg-button-color button-text-color">
                                Зарегистрироваться
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
