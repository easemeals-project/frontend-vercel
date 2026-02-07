"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";

interface OnboardingState {
    hasCompletedOnboarding: boolean;
    hasMealPlan: boolean;
    hasSelectedPreferences: boolean;
}

export function useOnboarding() {
    const router = useRouter();
    const [state, setState] = useState<OnboardingState>({
        hasCompletedOnboarding: false,
        hasMealPlan: false,
        hasSelectedPreferences: false,
    });

    useEffect(() => {
        // Check localStorage for onboarding status
        const onboardingComplete = localStorage.getItem("onboarding_complete") === "true";
        const mealPlanExists = localStorage.getItem("currentTimetable") !== null;
        const preferencesSet = localStorage.getItem("selectedFoods") !== null;

        setState({
            hasCompletedOnboarding: onboardingComplete,
            hasMealPlan: mealPlanExists,
            hasSelectedPreferences: preferencesSet,
        });
    }, []);

    const markOnboardingComplete = () => {
        localStorage.setItem("onboarding_complete", "true");
        setState(prev => ({ ...prev, hasCompletedOnboarding: true }));
    };

    const markMealPlanCreated = () => {
        setState(prev => ({ ...prev, hasMealPlan: true }));
    };

    const markPreferencesSet = () => {
        setState(prev => ({ ...prev, hasSelectedPreferences: true }));
    };

    const getNextStep = (): string => {
        // Determine where user should go based on their progress
        if (!state.hasSelectedPreferences) {
            return conts.paths.foodPreferences;
        }
        if (!state.hasMealPlan) {
            return conts.paths.timetable;
        }
        return conts.paths.dashboard;
    };

    const navigateToNextStep = () => {
        const nextStep = getNextStep();
        router.push(nextStep);
    };

    const resetOnboarding = () => {
        localStorage.removeItem("onboarding_complete");
        localStorage.removeItem("currentTimetable");
        localStorage.removeItem("selectedFoods");
        setState({
            hasCompletedOnboarding: false,
            hasMealPlan: false,
            hasSelectedPreferences: false,
        });
    };

    return {
        ...state,
        markOnboardingComplete,
        markMealPlanCreated,
        markPreferencesSet,
        getNextStep,
        navigateToNextStep,
        resetOnboarding,
    };
}
