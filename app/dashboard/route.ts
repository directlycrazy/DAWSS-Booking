import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: request.headers
	})

	if (!session) return redirect("/");

	if (session.user.email.endsWith("@ddsbstudent.ca")) {
		return redirect("/dashboard/student");
	} else if (session.user.email.endsWith("@ddsb.ca")) {
		return redirect("/dashboard/admin");
	}

	return Response.json({ error: "How did you get here?" });
}