import React, { useRef, useState, useEffect } from 'react';
import './speech.css';

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioClips, setAudioClips] = useState<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
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
                        setAudioClips((prevClips) => [...prevClips, blob]);
                        chunksRef.current = [];
                    };

                    visualize(stream);
                })
                .catch(err => {
                    console.error('The following error occurred: ' + err);
                });
        } else {
            console.log("getUserMedia not supported on your browser!");
        }

        return () => {
            mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const startRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const visualize = (stream: MediaStream) => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        const draw = () => {
            if (!canvasRef.current) return;
            const canvasCtx = canvasRef.current.getContext('2d');
            if (!canvasCtx) return;

            const WIDTH = canvasRef.current.width;
            const HEIGHT = canvasRef.current.height;

            requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * HEIGHT / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
            canvasCtx.stroke();
        };

        draw();
    };

    return (
        <div className="wrapper">
            <header>
                <h1>Web Dictaphone</h1>
            </header>

            <section className="main-controls">
                <canvas ref={canvasRef} className="visualizer" height="60px"></canvas>
                <div id="buttons">
                    <button onClick={startRecording} disabled={isRecording}>Record</button>
                    <button onClick={stopRecording} disabled={!isRecording}>Stop</button>
                </div>
            </section>

            <section className="sound-clips">
                {audioClips.map((clip, index) => (
                    <article className="clip" key={index}>
                        <audio controls src={URL.createObjectURL(clip)}></audio>
                        <button className="delete" onClick={() => {
                            setAudioClips((prevClips) => prevClips.filter((_, i) => i !== index));
                        }}>Delete</button>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default AudioRecorder;
