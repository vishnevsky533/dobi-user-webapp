'use client';

import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Button from '@/components/Button';

export default function PromotionPage({ params }) {
    const { publicationId } = params;
    const [telegramUserId, setTelegramUserId] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOpenBotButton, setShowOpenBotButton] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const [waitingForBotLaunch, setWaitingForBotLaunch] = useState(false);

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.expand();

        const initDataUnsafe = tg.initDataUnsafe;
        const userId = initDataUnsafe?.user?.id;
        setTelegramUserId(userId);

        if (userId && publicationId) {
            checkAndRegisterUser(userId, publicationId);
        } else {
            setStatusMessage('Ошибка: не удалось получить данные пользователя или акции.');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (waitingForBotLaunch) {
            const timeout = setTimeout(() => {
                setStatusMessage('Время ожидания истекло. Попробуйте снова.');
                setWaitingForBotLaunch(false);
                setShowOpenBotButton(false);
            }, 5 * 60 * 1000); // 5 минут

            return () => clearTimeout(timeout);
        }
    }, [waitingForBotLaunch]);

    const checkAndRegisterUser = async (userId, publicationId) => {
        try {
            // Проверяем существование пользователя
            const userResponse = await fetch(`/api/users/${userId}`);
            if (userResponse.ok) {
                const user = await userResponse.json();

                // Проверяем, не заблокировал ли пользователь бота
                const botBlockedResponse = await fetch(`/api/users/${userId}/is_bot_blocked`);
                const botBlockedData = await botBlockedResponse.json();
                const botBlocked = botBlockedData.blocked;

                if (botBlocked) {
                    setStatusMessage('Пожалуйста, разблокируйте бота, чтобы продолжить участие.');
                    setShowOpenBotButton(true);
                } else {
                    // Регистрируем пользователя в акции
                    const registrationResponse = await fetch(`/api/promotions/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, publicationId }),
                    });

                    if (registrationResponse.ok) {
                        setStatusMessage('Успешно! Инструкции ищите в боте, он уже ее отправил вам 👍');
                        setIsSuccess(true);
                        setShowOpenBotButton(true);
                    } else {
                        setStatusMessage('Ой! К сожалению в акции уже закончились места 😢');
                    }
                }
            } else {
                // Пользователь не найден, предлагаем принять правила
                setStatusMessage('Здравствуйте! Мы очень рады, что вы хотите стать нашим клиентом! Для начала давайте ознакомимся с нашими правилами.');
                setShowRules(true);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('Произошла ошибка при обработке вашего запроса.');
        } finally {
            setIsLoading(false);
        }
    };

    const openBot = () => {
        window.location.href = `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`;
    };

    const acceptRules = () => {
        setRulesAccepted(true);
    };

    const startWaitingForBotLaunch = () => {
        setWaitingForBotLaunch(true);
        setShowOpenBotButton(true);
        setStatusMessage('Отлично! Осталось совсем чуть-чуть. Чтобы вам было удобно пользоваться нашим сервисом и отслеживать акции, в которых вы принимаете участие - нужно запустить нашего бота.');
        // Здесь можно установить таймер на 5 минут
    };

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="space-y-4">
                    <p>{statusMessage}</p>

                    {showRules && !rulesAccepted && (
                        <div>
                            <Button onClick={acceptRules}>Открыть правила</Button>
                        </div>
                    )}

                    {rulesAccepted && !waitingForBotLaunch && (
                        <div>
                            <p>Наши правила:</p>
                            <ol className="list-decimal list-inside">
                                <li>Один человек может участвовать одновременно только в 3-х акциях!</li>
                                {/* Добавьте остальные правила */}
                            </ol>
                            <Button onClick={startWaitingForBotLaunch}>Принять правила</Button>
                        </div>
                    )}

                    {showOpenBotButton && (
                        <Button onClick={openBot}>Открыть бота</Button>
                    )}
                </div>
            )}
        </div>
    );
}
