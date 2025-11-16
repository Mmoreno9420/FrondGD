/**
=========================================================
* GestiaSoft - useScreenSteps Hook
=========================================================
* Hook específico para manejar pasos de pantallas (wizard/stepper)
*/

import { useCallback, useMemo } from "react";
import { useAppActions } from "../context/AppActionsContext";

export const useScreenSteps = () => {
    const { state, setScreenSteps, nextStep, previousStep, goToStep, resetSteps, completeSteps } = useAppActions();

    const { screenSteps } = state;

    // Configurar pasos
    const setupSteps = useCallback((steps, initialStep = 0) => {
        setScreenSteps({
            steps: steps,
            totalSteps: steps.length,
            currentStep: initialStep,
            canGoNext: initialStep < steps.length - 1,
            canGoBack: initialStep > 0,
            isCompleted: false,
        });
    }, [setScreenSteps]);

    // Ir al siguiente paso
    const goNext = useCallback(() => {
        nextStep();
    }, [nextStep]);

    // Ir al paso anterior
    const goPrevious = useCallback(() => {
        previousStep();
    }, [previousStep]);

    // Ir a un paso específico
    const goTo = useCallback((stepIndex) => {
        goToStep(stepIndex);
    }, [goToStep]);

    // Reiniciar pasos
    const reset = useCallback(() => {
        resetSteps();
    }, [resetSteps]);

    // Completar pasos
    const complete = useCallback(() => {
        completeSteps();
    }, [completeSteps]);

    // Verificar si es el primer paso
    const isFirstStep = useMemo(() => {
        return screenSteps.currentStep === 0;
    }, [screenSteps.currentStep]);

    // Verificar si es el último paso
    const isLastStep = useMemo(() => {
        return screenSteps.currentStep === screenSteps.totalSteps - 1;
    }, [screenSteps.currentStep, screenSteps.totalSteps]);

    // Obtener el paso actual
    const currentStepData = useMemo(() => {
        return screenSteps.steps[screenSteps.currentStep] || null;
    }, [screenSteps.steps, screenSteps.currentStep]);

    // Obtener progreso (0-100)
    const progress = useMemo(() => {
        if (screenSteps.totalSteps === 0) return 0;
        return Math.round(((screenSteps.currentStep + 1) / screenSteps.totalSteps) * 100);
    }, [screenSteps.currentStep, screenSteps.totalSteps]);

    // Verificar si se puede ir al siguiente paso
    const canGoNext = screenSteps.canGoNext;

    // Verificar si se puede ir al paso anterior
    const canGoBack = screenSteps.canGoBack;

    // Verificar si está completado
    const isCompleted = screenSteps.isCompleted;

    return {
        // Estado
        currentStep: screenSteps.currentStep,
        totalSteps: screenSteps.totalSteps,
        steps: screenSteps.steps,
        currentStepData,
        progress,
        isFirstStep,
        isLastStep,
        canGoNext,
        canGoBack,
        isCompleted,

        // Acciones
        setupSteps,
        goNext,
        goPrevious,
        goTo,
        reset,
        complete,
    };
};
