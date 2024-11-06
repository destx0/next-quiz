import React from "react";
import { Input, Button, Link } from "@nextui-org/react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We provide comprehensive SSC exam preparation resources to help
              you succeed in your career goals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/exams">Exams</Link>
              </li>
              <li>
                <Link href="/study-material">Study Material</Link>
              </li>
              <li>
                <Link href="/mock-tests">Mock Tests</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Exams</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/exams/cgl">SSC CGL</Link>
              </li>
              <li>
                <Link href="/exams/chsl">SSC CHSL</Link>
              </li>
              <li>
                <Link href="/exams/cpo">SSC CPO</Link>
              </li>
              <li>
                <Link href="/exams/mts">SSC MTS</Link>
              </li>
              <li>
                <Link href="/exams/je">SSC JE</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Stay updated with our latest news and offers.
            </p>
            <div className="flex">
              <Input type="email" placeholder="Your email" className="mr-2" />
              <Button color="primary">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © 2024 SSC Mock Tests. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
