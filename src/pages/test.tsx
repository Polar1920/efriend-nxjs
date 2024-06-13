import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import './test.css';

export default function Test() {
    // Elimina 'audioList' del localStorage al cargar la página
    useEffect(() => {
        localStorage.removeItem('audioList');
        localStorage.removeItem('answerList');
    }, []);

    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [isVisualizerVisible, setIsVisualizerVisible] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let interval: NodeJS.Timeout;

    // Estado para almacenar los valores de los inputs
    const [inputValues, setInputValues] = useState<string[]>(['', '', '', '', '', '', '', '']);

    // Estado para almacenar las respuestas de texto en localStorage
    const [answerList, setAnswerList] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            const storedAnswers = localStorage.getItem('answerList');
            if (storedAnswers) {
                setAnswerList(JSON.parse(storedAnswers));
            }
        }
    }, []);

    useEffect(() => {
        if (isRecording) {
            startRecording();
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
            setIsVisualizerVisible(true);
        } else {
            if (mediaRecorderRef.current) {
                clearInterval(interval);
                stopRecording();
            }
            setIsVisualizerVisible(false);
            clearCanvas();
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        if (canvasRef.current && isVisualizerVisible) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawCircle(ctx);
            }
        }
    }, [isVisualizerVisible]);

    const startRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;

                    mediaRecorder.ondataavailable = (e: BlobEvent) => {
                        chunksRef.current.push(e.data);
                    };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
                        setCurrentAudioBlob(blob); // Actualiza el audio actual

                        // Actualiza el valor del input correspondiente al paso actual
                        const newInputValues = [...inputValues];
                        newInputValues[step - 2] = URL.createObjectURL(blob);
                        setInputValues(newInputValues);

                        chunksRef.current = [];
                    };

                    mediaRecorder.start();
                })
                .catch(err => {
                    console.error('The following error occurred: ' + err);
                });
        } else {
            console.log("getUserMedia not supported on your browser!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setSeconds(0);
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
    };

    const drawCircle = (ctx: CanvasRenderingContext2D) => {
        const animate = () => {
            if (!isVisualizerVisible) return;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            const radius = Math.abs(Math.sin(Date.now() / 1000) * 50);
            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 123, 255, ${1 - radius / 100})`;
            ctx.fill();
            requestAnimationFrame(animate);
        };
        animate();
    };

    const handleNextStep = () => {
        setStep(step + 1);
        if (currentAudioBlob) {
            saveAudio(currentAudioBlob); // Guarda el audio actual en localStorage al avanzar al siguiente paso
        }
        setCurrentAudioBlob(null); // Limpia el audio actual después de guardarlo
    };

    const handleRecordingToggle = () => {
        setIsRecording(!isRecording);
    };

    // Función para manejar cambios en los campos de texto
    const handleInputChange = (index: number, value: string) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

        const newAnswerList = [...answerList];
        newAnswerList[index] = value;
        setAnswerList(newAnswerList);

        localStorage.setItem('answerList', JSON.stringify(newAnswerList));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Comprobación específica para cada paso
        switch (step) {
            case 2:
                const isEmptyStep2 = inputValues[0].trim() === '';
                if (isEmptyStep2) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 3:
                const isEmptyStep3 = inputValues[1].trim() === '';
                if (isEmptyStep3) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 4:
                const isEmptyStep4 = inputValues[2].trim() === '';
                if (isEmptyStep4) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 5:
                const isEmptyStep5 = inputValues[3].trim() === '';
                if (isEmptyStep5) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 6:
                const isEmptyStep6 = inputValues[4].trim() === '';
                if (isEmptyStep6) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 7:
                const isEmptyStep7 = inputValues[5].trim() === '';
                if (isEmptyStep7) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 8:
                const isEmptyStep8 = inputValues[6].trim() === '';
                if (isEmptyStep8) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 9:
                const isEmptyStep9 = inputValues[7].trim() === '';
                if (isEmptyStep9) {
                    alert('Por favor completa todos los campos antes de continuar.');
                } else {
                    handleNextStep();
                }
                break;
            case 10:
                window.location.href = '/result';
                break;
            default:
                handleNextStep();
                break;
        }
    };

    // Función para guardar un audio en localStorage
    const saveAudio = (blob: Blob) => {
        const audioURL = URL.createObjectURL(blob);
        let audioList = JSON.parse(localStorage.getItem('audioList') || '[]');

        // Eliminar el primer elemento null si existe
        if (audioList.length > 0 && audioList[0] === null) {
            audioList.shift();
        }

        // Guardar el audio en el índice correspondiente al paso actual
        audioList[step - 8] = audioURL;
        localStorage.setItem('audioList', JSON.stringify(audioList));

        // También podrías guardar el blob directamente en inputValues si lo prefieres
        const newInputValues = [...inputValues];
        newInputValues[step - 9] = audioURL;
        setInputValues(newInputValues);
    };

    return (
        <div className="registro-container">
            <form onSubmit={handleSubmit} className="formulario">
                {step === 1 && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Bienvenido! {user?.nombre}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            A continuación se te realizará un test, según tu nivel, para verificar tus conocimientos!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            *Cuando toques siguiente no podrás regresar, así que asegúrate de haber respondido lo mejor que puedas.
                        </Typography>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step >= 2 && step <= 7 && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            {step === 2 ? 'Escucha el siguiente audio y luego responde a la pregunta.' :
                                step === 3 ? 'Escucha el siguiente fragmento de una conversación y luego responde a la pregunta.' :
                                    step === 4 ? 'Lee el siguiente texto y luego responde a la pregunta.' :
                                        step === 5 ? 'Lee el siguiente párrafo y luego responde a la pregunta.' :
                                            step === 6 ? 'Escribe una carta a un amigo invitándolo a visitar tu ciudad. Incluye detalles sobre lugares que le gustaría visitar, actividades interesantes que pueden hacer juntos, etc.' :
                                                'Escribe una breve reseña de una película o libro que te haya gustado recientemente. Incluye detalles sobre la trama, los personajes principales y tu opinión sobre la obra.'}
                        </Typography>
                        <TextField
                            label={user?.nombre || `Input ${step - 1}`}
                            variant="outlined"
                            value={inputValues[step - 2]}
                            onChange={(e) => handleInputChange(step - 2, e.target.value)}
                            className="input-field"
                            disabled={(step === 8 || step === 9)} // Deshabilita el input para las dos últimas preguntas de grabar audio
                            aria-hidden="true" // Lo oculta de las ayudas de accesibilidad
                        />
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 8 && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Graba un audio de hasta 1 minuto describiendo tus planes para las próximas vacaciones de verano. Incluye destinos que te gustaría visitar, actividades que planeas hacer, etc.
                        </Typography>
                        <div className="circle-container">
                            {isVisualizerVisible && (
                                <canvas ref={canvasRef} className="visualizer" width="100" height="100"></canvas>
                            )}
                            <Button
                                onClick={handleRecordingToggle}
                                variant="contained"
                                color={isRecording ? 'secondary' : 'primary'}
                                size="large"
                                className="btn-hablar"
                            >
                                {isRecording ? 'Detener' : 'Hablar'}
                            </Button>
                        </div>
                        {currentAudioBlob && (
                            <audio controls src={URL.createObjectURL(currentAudioBlob)}></audio>
                        )}
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 9 && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Graba un audio de hasta 1 minuto explicando por qué crees que es importante aprender un segundo idioma. Incluye ejemplos personales o razones específicas que respalden tu opinión.
                        </Typography>
                        <div className="circle-container">
                            {isVisualizerVisible && (
                                <canvas ref={canvasRef} className="visualizer" width="100" height="100"></canvas>
                            )}
                            <Button
                                onClick={handleRecordingToggle}
                                variant="contained"
                                color={isRecording ? 'secondary' : 'primary'}
                                size="large"
                                className="btn-hablar"
                            >
                                {isRecording ? 'Detener' : 'Hablar'}
                            </Button>
                        </div>
                        {currentAudioBlob && (
                            <audio controls src={URL.createObjectURL(currentAudioBlob)}></audio>
                        )}
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 10 && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            ¡Felicitaciones {user.nombre}, has completado el test!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Gracias por participar en nuestro test. Tus respuestas serán evaluadas y recibirás un feedback pronto.
                        </Typography>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Finalizar
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}
