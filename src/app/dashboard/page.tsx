import { redirect } from "next/navigation";
import conts from "@/lib/conts";

export default function DashboardPage() {
  redirect(conts.paths.timetable);
}
