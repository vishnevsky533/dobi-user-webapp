// app/page.js
'use client';

import {useEffect, useState} from 'react';
import axios from 'axios';
import Button from '@/components/Button';
import {FaCheckCircle, FaExclamationCircle, FaTelegramPlane} from 'react-icons/fa';
import Link from 'next/link';
import Loading from "@/components/Loading";

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
    const [showNicknameInstruction, setShowNicknameInstruction] = useState(false);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
    const [showUserBanned, setShowUserBanned] = useState(false);

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
            if (response.status === 200 && response.data.success) {
                const {isBanned, hasNickname, isSubscribed, rulesAccepted} = response.data.user;

                if (isBanned) {
                    setShowUserBanned(true);
                    setIsLoading(false);
                    return;
                }

                if (!hasNickname) {
                    setShowNicknameInstruction(true);
                    setIsLoading(false);
                    return;
                }

                if (!isSubscribed) {
                    setShowSubscriptionPrompt(true);
                    // setStatusMessage('Чтобы участвовать в наших акциях, вы должны быть подписаны на наш канал.');
                    setIsLoading(false);
                    return;
                }

                if (!rulesAccepted) {
                    setShowRulesCheckbox(true);
                    setIsLoading(false);
                    return;
                }


                // Если все проверки пройдены, регистрируем пользователя в акции
                await registerUserInPromotion(userId, publicationId);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShowRulesCheckbox(true);
            } else if (error.response && error.response.status === 403) {
                setShowUserBanned(true);
            } else {
                console.error('Ошибка при проверке пользователя:', error);
                setStatusMessage('Произошла ошибка при проверке пользователя.');
            }
            setIsLoading(false);
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
                    // После регистрации пользователя в базе, регистрируем его в акции
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
        window.location.href = `https://t.me/${process.env.NEXT_PUBLIC_PUBLICATION_GROUP_NAME}`;
    };

    const goToInstruction = () => {
        window.open("https://telegra.ph/Instrukciya-Kak-ustanovit-sebe-nik-09-03", "_blank")
    }

    return (
        <div className="flex items-center justify-center bg-theme flex-grow">
            {isLoading ? <Loading/> : (
                <div className="max-w-md mx-auto bg-section-bg-color border border-color rounded-lg p-6">
                    {/* Сообщение о статусе */}
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

                    {/* Проверка на блокировку пользователя */}
                    {showUserBanned && (
                        <div className="flex flex-col items-center justify-center">
                            <FaExclamationCircle className="destructive-text-color w-12 h-12 mb-4"/>
                            <p className="text-center destructive-text-color">
                                Ваш аккаунт заблокирован и вы не можете участвовать в акциях.
                            </p>
                        </div>
                    )}

                    {/* Проверка наличия никнейма */}
                    {showNicknameInstruction && (
                        <div className="flex flex-col items-center justify-center">
                            <FaExclamationCircle className="accent-text-color w-12 h-12 mb-4"/>
                            <p className="text-center accent-text-color">
                                Чтобы участвовать в наших акциях - на вашем аккаунте обязательно должен быть ник.
                                <br/>
                                Вот инструкция как его установить:{' '}
                                <Button
                                    onClick={goToInstruction}
                                    className="mt-4 bg-button-color button-text-color"
                                >
                                    Инструкция
                                </Button>
                            </p>
                        </div>
                    )}

                    {/* Проверка подписки на канал */}
                    {showSubscriptionPrompt && (
                        <div className="flex flex-col items-center justify-center">
                            <FaExclamationCircle className="w-12 h-12 mb-4 accent-text-color"/>
                            <p className="text-center accent-text-color">
                                Чтобы участвовать в наших акциях, вы должны быть подписаны на наш канал.
                            </p>
                            <Button onClick={goToPromotionsGroup} className="mt-4 bg-button-color button-text-color">
                                Перейти на канал
                            </Button>
                        </div>
                    )}

                    {/* Кнопка открытия бота */}
                    {showOpenBotButton && (
                        <Button onClick={openBot} className="w-full button-text-color bg-button">
                            <div className="flex items-center justify-center">
                                <FaTelegramPlane className="mr-2"/>
                                Открыть бота
                            </div>
                        </Button>
                    )}

                    {/* Кнопка перехода в группу с акциями */}
                    {showReturnToGroupButton && (
                        <Button onClick={goToPromotionsGroup} className="w-full button-text-color bg-button mt-4">
                            Перейти в группу с акциями
                        </Button>
                    )}

                    {/* Чекбокс принятия правил */}
                    {showRulesCheckbox && (
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
