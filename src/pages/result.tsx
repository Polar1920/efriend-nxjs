import React, { useEffect, useState } from 'react';

const ResultPage = () => {
    const [englishLevel1, setEnglishLevel1] = useState<string>('');
    const [englishLevel2, setEnglishLevel2] = useState<string>('');
    const [combinedLevel, setCombinedLevel] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const answerList: string[] = JSON.parse(localStorage.getItem('answerList') || '[]');
        const textInputs: string = answerList.join(' ');

        const sendToModel = async (data: any, modelEndpoint: string) => {
            try {
                const response = await fetch(modelEndpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: data })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                determineEnglishLevel(result, modelEndpoint);
            } catch (error) {
                console.error('Error sending data to model:', error);
                setError(true);
            }
        };

        sendToModel(textInputs, 'https://api-inference.huggingface.co/models/LordCoffee/cefr_test');
        sendToModel(textInputs, 'https://api-inference.huggingface.co/models/LordCoffee/bert-base-cased-cefr');

    }, []);

    const determineEnglishLevel = (result: any, modelEndpoint: string) => {
        if (modelEndpoint === 'https://api-inference.huggingface.co/models/LordCoffee/cefr_test') {
            if (Array.isArray(result) && result.length > 0) {
                const highestScore = result[0].reduce((max: any, current: any) => (current.score > max.score ? current : max));
                setEnglishLevel1(highestScore.label);
            } else {
                console.error('Resultado inesperado del modelo CEFR_test');
                setError(true);
            }
        } else if (modelEndpoint === 'https://api-inference.huggingface.co/models/LordCoffee/bert-base-cased-cefr') {
            if (Array.isArray(result) && result.length > 0) {
                const highestScore = result.reduce((max: any, current: any) => (current.score > max.score ? current : max));
                setEnglishLevel2(highestScore.entity_group);
            } else {
                console.error('Resultado inesperado del modelo bert-base-cased-cefr');
                setError(true);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!isLoading && !error && englishLevel1 && englishLevel2) {
            // Aquí puedes implementar la lógica para calcular el nivel combinado
            const combinedLevel = calculateCombinedLevel(englishLevel1, englishLevel2);
            setCombinedLevel(combinedLevel);
        }
    }, [isLoading, error, englishLevel1, englishLevel2]);

    const calculateCombinedLevel = (level1: string, level2: string): string => {
        // Definir mapeo de niveles CEFR a valores numéricos para facilitar la combinación
        const levelMapping: { [key: string]: number } = {
            A1: 1,
            A2: 2,
            B1: 3,
            B2: 4,
            C1: 5,
            C2: 6,
        };

        // Definir confianzas predefinidas para cada modelo
        const confidence1 = 0.9; // Alta confianza para bert-base-cased-cefr
        const confidence2 = 0.8; // Confianza un poco menor para cefr_test

        // Convertir los niveles a valores numéricos usando el mapeo
        const numericLevel1 = levelMapping[level1] || 0;
        const numericLevel2 = levelMapping[level2] || 0;

        // Calcular el nivel combinado ponderando por la confianza de cada modelo
        const combinedNumericLevel = (numericLevel1 * confidence1 + numericLevel2 * confidence2) / (confidence1 + confidence2);

        // Convertir el nivel combinado nuevamente a su representación textual
        let combinedLevel = '';

        // Asignar el nivel CEFR basado en el valor numérico combinado
        if (combinedNumericLevel >= 5.5) {
            combinedLevel = 'C2';
        } else if (combinedNumericLevel >= 4.5) {
            combinedLevel = 'C1';
        } else if (combinedNumericLevel >= 3.5) {
            combinedLevel = 'B2';
        } else if (combinedNumericLevel >= 2.5) {
            combinedLevel = 'B1';
        } else if (combinedNumericLevel >= 1.5) {
            combinedLevel = 'A2';
        } else {
            combinedLevel = 'A1';
        }

        return combinedLevel;
    };
    
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div>
            <h1>Su nivel está siendo calculado...</h1>
            {isLoading ? (
                <p>Cargando...</p>
            ) : error ? (
                <div>
                    <p>Ups! Nuestro sistema está un poco cargado.</p>
                    <button onClick={handleRetry}>Reintentar</button>
                </div>
            ) : (
                <div>
                    {englishLevel1 && <p>Nivel según modelo 1 (CEFR_test): {englishLevel1}</p>}
                    {englishLevel2 && <p>Nivel según modelo 2 (bert-base-cased-cefr): {englishLevel2}</p>}
                    {combinedLevel && <p>Su nivel es: {combinedLevel}</p>}
                </div>
            )}
        </div>
    );
};

export default ResultPage;
