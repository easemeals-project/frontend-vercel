import { WeeklyMealPlan, RAGMealComposition } from "../types/graphql";

/**
 * Generates an iCal (.ics) string from a WeeklyMealPlan
 */
export function generateICal(plan: WeeklyMealPlan): string {
    const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    // Find the next/current occurrences of these days
    // We'll start from the "next" Monday if today is not Monday, 
    // or just use the current week's dates.
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
    const mondayOffset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);

    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + mondayOffset);

    let ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//EaseMeals//Meal Planner//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ];

    DAYS.forEach((day, index) => {
        const currentDate = new Date(mondayDate);
        currentDate.setDate(mondayDate.getDate() + index);

        const dailyPlan = (plan as any)[day];
        if (!dailyPlan) return;

        // Breakfast: 08:00 - 09:00
        ics.push(...generateEvent(currentDate, "080000", "090000", "Breakfast", dailyPlan.breakfast));
        // Lunch: 13:00 - 14:00
        ics.push(...generateEvent(currentDate, "130000", "140000", "Lunch", dailyPlan.lunch));
        // Dinner: 19:00 - 20:00
        ics.push(...generateEvent(currentDate, "190000", "200000", "Dinner", dailyPlan.dinner));
    });

    ics.push("END:VCALENDAR");

    return ics.join("\r\n");
}

function generateEvent(
    date: Date,
    startTime: string,
    endTime: string,
    mealType: string,
    composition: RAGMealComposition
): string[] {
    if (!composition) return [];

    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const items: string[] = [];
    if (composition.base) items.push(composition.base.name);
    if (composition.protein) items.push(composition.protein.name);
    if (composition.soup) items.push(composition.soup.name);
    if (composition.sides?.length) items.push(...composition.sides.filter(s => s !== null).map(s => s!.name));

    const mealName = items.join(", ") || "Planned Meal";
    const summary = `EaseMeals: ${mealType} - ${mealName}`;
    const description = `Your planned ${mealType} for today.\n\nItems:\n- ${items.join("\n- ")}`;
    const uid = `easemeals-${dateStr}-${mealType.toLowerCase()}@easemeals.com`;

    return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${dateStr}T${startTime}`,
        `DTEND:${dateStr}T${endTime}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
        "END:VEVENT"
    ];
}

/**
 * Triggers a download of the iCal file
 */
export function downloadICal(icsContent: string, filename: string = "EaseMeals-Timetable.ics") {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
