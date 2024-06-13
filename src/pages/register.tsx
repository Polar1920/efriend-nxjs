import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, TextField, Typography, MenuItem } from '@mui/material';
import './register.css';

interface FormData {
    nombre: string;
    apellido: string;
    edad: string;
    nivelIngles: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const nivelesIngles = ['No estoy seguro', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Registro() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        edad: '',
        nivelIngles: 'No estoy seguro',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value as string });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 6) {
            if (formData.password !== formData.confirmPassword) {
                alert('La contraseña y la confirmación de la contraseña no coinciden.');
                return;
            }
            // Guardar los datos en localStorage
            localStorage.setItem('user', JSON.stringify(formData));
            // Redirigir a la página "test.tsx"
            window.location.href = '/test';
        } else {
            console.log(formData);
            handleNextStep();
        }
    };

    return (
        <div className="registro-container">
            <Typography variant="h4" gutterBottom>
                Registro
            </Typography>
            <form onSubmit={handleSubmit} className="formulario">
                {step === 1 && (
                    <>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <TextField
                            label="Apellido"
                            variant="outlined"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <Button onClick={handlePreviousStep} variant="outlined" color="primary" size="large" className="btn-anterior">
                            Anterior
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <TextField
                            label="Edad"
                            variant="outlined"
                            type="number"
                            name="edad"
                            value={formData.edad}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <Button onClick={handlePreviousStep} variant="outlined" color="primary" size="large" className="btn-anterior">
                            Anterior
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}

                {step === 4 && (
                    <>
                        <TextField
                            select
                            label="Nivel de inglés"
                            variant="outlined"
                            name="nivelIngles"
                            value={formData.nivelIngles}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            {nivelesIngles.map((nivel) => (
                                <MenuItem key={nivel} value={nivel}>
                                    {nivel}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button onClick={handlePreviousStep} variant="outlined" color="primary" size="large" className="btn-anterior">
                            Anterior
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}

                {step === 5 && (
                    <>
                        <TextField
                            label="Correo electrónico"
                            variant="outlined"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <Button onClick={handlePreviousStep} variant="outlined" color="primary" size="large" className="btn-anterior">
                            Anterior
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Siguiente
                        </Button>
                    </>
                )}
                {step === 6 && (
                    <>
                        <TextField
                            label="Contraseña"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <TextField
                            label="Confirmar contraseña"
                            variant="outlined"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <Button onClick={handlePreviousStep} variant="outlined" color="primary" size="large" className="btn-anterior">
                            Anterior
                        </Button>
                        <Button type="submit" variant="contained" color="primary" size="large" className="btn-siguiente">
                            Completar Registro
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}
