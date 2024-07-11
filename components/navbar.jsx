"use client";
import { useEffect } from "react";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
	Button,
} from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { deleteCookie } from "cookies-next";

import { ThemeSwitch } from "@/components/theme-switch";
import useAuthStore from "@/lib/zustand";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/upload", label: "Upload" },
];

export const Navbar = () => {
	const router = useRouter();
	const { user, loading, setUser, setLoading } = useAuthStore();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [setUser, setLoading]);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			deleteCookie("authToken");
			router.push("/login");
		} catch (error) {
			console.error("Error signing out", error);
		}
	};

	const renderUserMenu = () => (
		<Dropdown>
			<DropdownTrigger>
				<Avatar
					as="button"
					size="sm"
					src={
						user?.photoURL ||
						`https://api.dicebear.com/6.x/initials/svg?seed=${user?.email}`
					}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="User menu actions">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user?.email}</p>
				</DropdownItem>
				<DropdownItem
					key="logout"
					color="danger"
					onPress={handleSignOut}
				>
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);

	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarContent className="sm:hidden pr-3" justify="center">
				<NavbarBrand>
					<NextLink href="/" className="font-bold text-inherit">
						Infinity Classroom
					</NextLink>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarBrand>
					<NextLink href="/" className="font-bold text-inherit">
						Infinity Classroom
					</NextLink>
				</NavbarBrand>
				{navItems.map((item) => (
					<NavbarItem key={item.href}>
						<NextLink
							className={clsx(
								linkStyles({ color: "foreground" }),
								"data-[active=true]:text-primary data-[active=true]:font-medium"
							)}
							color="foreground"
							href={item.href}
						>
							{item.label}
						</NextLink>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<ThemeSwitch />
				</NavbarItem>
				{!loading && (
					<NavbarItem>
						{user ? (
							renderUserMenu()
						) : (
							<Button
								as={NextLink}
								color="primary"
								href="/login"
								variant="flat"
							>
								Login
							</Button>
						)}
					</NavbarItem>
				)}
			</NavbarContent>

			<NavbarMenu>
				{navItems.map((item) => (
					<NavbarMenuItem key={item.href}>
						<NextLink
							className={clsx(
								linkStyles({ color: "foreground" }),
								"w-full",
								"data-[active=true]:text-primary data-[active=true]:font-medium"
							)}
							color="foreground"
							href={item.href}
						>
							{item.label}
						</NextLink>
					</NavbarMenuItem>
				))}
				{!loading && (
					<NavbarMenuItem>
						{user ? (
							<div className="flex flex-col gap-2">
								<p className="font-semibold">
									Signed in as {user.email}
								</p>
								<Button color="danger" onPress={handleSignOut}>
									Log Out
								</Button>
							</div>
						) : (
							<Button
								as={NextLink}
								color="primary"
								href="/login"
								variant="flat"
							>
								Login
							</Button>
						)}
					</NavbarMenuItem>
				)}
			</NavbarMenu>
		</NextUINavbar>
	);
};
