import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { FiRepeat } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface CardHeaderProps {
	label: string;
	onFlip: () => void;
	onClose: () => void;
}

function CardHeader({ label, onFlip, onClose }: CardHeaderProps) {
	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			mb={2}
		>
			<IconButton
				colorPalette="teal"
				size="sm"
				onClick={onFlip}
				aria-label="Switch card side"
				variant="ghost"
				_hover={{
					transform: "scale(1.05)",
					bg: "bg.subtle",
				}}
			>
				<FiRepeat />
			</IconButton>

			<Text
				fontWeight="semibold"
				fontSize="sm"
				color="fg.muted"
				textTransform="uppercase"
				letterSpacing="wide"
			>
				{label}
			</Text>
			<HStack gap={2}>
				<IconButton
					colorPalette="teal"
					size="sm"
					aria-label="close"
					variant="ghost"
					onClick={onClose}
					_hover={{
						transform: "scale(1.05)",
						bg: "bg.subtle",
					}}
				>
					<IoClose />
				</IconButton>
			</HStack>
		</Box>
	);
}

export default CardHeader;
