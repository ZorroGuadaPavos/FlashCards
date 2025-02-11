import Navbar from "@/components/commonUI/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Container } from "@chakra-ui/react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "../hooks/useAuth";

export const Route = createFileRoute("/_layout")({
	component: Layout,
	beforeLoad: async () => {
		if (!isLoggedIn()) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

function Layout() {
	const { isLoading } = useAuth();
	return (
		<>
			<Container pt={{ base: "4.5rem", md: "6rem" }}>
				<Navbar />
				<Outlet />
			</Container>
			<Toaster />
		</>
	);
}
