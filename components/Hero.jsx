import React, { useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import useAuthStore from "@/lib/zustand";
import Link from "next/link";
import * as THREE from "three";

const InfinityAnimation = () => {
	const mountRef = useRef(null);

	useEffect(() => {
		let width = mountRef.current.clientWidth;
		let height = mountRef.current.clientHeight;
		let frameId;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		renderer.setSize(width, height);
		mountRef.current.appendChild(renderer.domElement);

		const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
		const material = new THREE.MeshPhongMaterial({ color: 0x3366ff });
		const infinity = new THREE.Mesh(geometry, material);

		scene.add(infinity);

		const light = new THREE.PointLight(0xffffff, 1, 100);
		light.position.set(0, 0, 10);
		scene.add(light);

		camera.position.z = 5;

		const animate = () => {
			frameId = requestAnimationFrame(animate);

			infinity.rotation.x += 0.01;
			infinity.rotation.y += 0.01;

			renderer.render(scene, camera);
		};

		animate();

		const handleResize = () => {
			width = mountRef.current.clientWidth;
			height = mountRef.current.clientHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(frameId);
			mountRef.current.removeChild(renderer.domElement);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return <div ref={mountRef} style={{ width: "100%", height: "300px" }} />;
};

export default function Hero() {
	const { user } = useAuthStore((state) => ({ user: state.user }));

	return (
		<section className="flex flex-col md:flex-row items-center justify-between mb-16">
			<div className="md:w-1/2 mb-8 md:mb-0">
				<h1 className={title({ class: "mb-4" })}>
					Free SSC Mock Tests by anish
				</h1>
				<p className={subtitle({ class: "mb-8" })}>
					Ace your SSC exams with our comprehensive Mock platform!
				</p>
				<Link href={user ? "/ssct" : "/login"}>
					<Button
						color="primary"
						size="lg"
						variant="shadow"
						className="font-semibold px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
					>
						{user ? "Start Mock Test" : "Sign Up Now"}
					</Button>
				</Link>
			</div>
			<div className="md:w-1/2">
				<InfinityAnimation />
			</div>
		</section>
	);
}
