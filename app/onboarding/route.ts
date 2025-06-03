import { getOnboarding } from "@/lib/auth-server";
import { redirect } from "next/navigation"

export const GET = async () => {
	if (!(await getOnboarding())) return redirect("/");
	return redirect("/onboarding/1");
}