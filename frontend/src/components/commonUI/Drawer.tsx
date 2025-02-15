import Logo from "@/assets/Logo.svg";
import { FlashcardsService } from "@/client";
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerCloseTrigger,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerRoot,
} from "@/components/ui/drawer";
import useAuth from "@/hooks/useAuth";
import { Button, Image, List, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FiLogOut } from "react-icons/fi";

function getCollectionsQueryOptions() {
	return {
		queryFn: () => FlashcardsService.readCollections(),
		queryKey: ["collections"],
	};
}

function Drawer({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const { logout } = useAuth();
	const queryClient = useQueryClient();
	const currentUser = queryClient.getQueryData<{ email: string }>([
		"currentUser",
	]);
	const { data, isLoading } = useQuery({
		...getCollectionsQueryOptions(),
		placeholderData: (prevData) => prevData,
	});
	const collections = data?.data ?? [];

	const handleNavigate = () => setIsOpen(false);

	const handleLogout = async () => {
		logout();
		setIsOpen(false);
	};

	return (
		<DrawerRoot
			open={isOpen}
			onOpenChange={(e) => setIsOpen(e.open)}
			placement="start"
		>
			<DrawerBackdrop />
			<DrawerContent rounded="none" maxW="280px">
				<DrawerHeader
					display="flex"
					justifyContent="center"
					padding=".5rem"
					borderBottomWidth="1px"
					bg="bg.subtle"
				>
					<Link to="/" onClick={handleNavigate}>
						<Image width="3rem" src={Logo} alt="logo" />
					</Link>
				</DrawerHeader>
				<DrawerBody py={2} px={2} bg="bg.muted">
					<VStack align="stretch">
						{isLoading ? (
							<VStack py={4}>
								<Spinner />
							</VStack>
						) : (
							<List.Root>
								{collections.map((collection) => (
									<List.Item
										key={collection.id}
										display="flex"
										alignItems="center"
										px={2}
										py={2}
										borderRadius="lg"
										transition="all 0.2s"
										_hover={{ bg: "bg.subtle" }}
										_active={{ bg: "bg.emphasized" }}
									>
										<Link
											to="/collections/$collectionId"
											params={{ collectionId: collection.id }}
											onClick={handleNavigate}
											style={{ width: "100%" }}
										>
											<Text
												fontSize="15px"
												fontWeight="500"
												color="fg.DEFAULT"
												truncate
											>
												{collection.name}
											</Text>
										</Link>
									</List.Item>
								))}
							</List.Root>
						)}
					</VStack>
				</DrawerBody>
				<DrawerFooter borderTopWidth="1px" bg="bg.subtle">
					<VStack width="100%" gap={2}>
						{currentUser?.email && (
							<Text fontSize="sm" color="fg.muted">
								Logged in as: {currentUser.email}
							</Text>
						)}
						<Button
							width="100%"
							// variant="ghost"
							// colorScheme="dark"
							bg="bg.secondary"
							onClick={handleLogout}
						>
							<FiLogOut />
							Log out
						</Button>
					</VStack>
				</DrawerFooter>
				<DrawerCloseTrigger />
			</DrawerContent>
		</DrawerRoot>
	);
}

export default Drawer;
