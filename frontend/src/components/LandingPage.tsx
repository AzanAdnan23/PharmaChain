import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Navbar from "./Navbar"
export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Streamline Your Medicine Supply Chain</h1>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-400">
            PharmaChain is a comprehensive software solution designed to improve efficiency, transparency, and traceability
            in your medicine supply chain.
          </p>
          <Button className="mt-8">Get Started</Button>
        </section>
        <section id="features" className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Key Features</h2>
          <div className="max-w-4xl mx-auto mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency</CardTitle>
              </CardHeader>
              <CardContent>Streamline your operations with automated workflows and real-time tracking.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>Gain full visibility into your supply chain with our intuitive dashboard.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traceability</CardTitle>
              </CardHeader>
              <CardContent>Ensure product safety and compliance with detailed traceability records.</CardContent>
            </Card>
          </div>
        </section>
        <section id="benefits" className="py-20 px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Key Benefits</h2>
          <div className="max-w-2xl mx-auto mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reduced Costs</CardTitle>
              </CardHeader>
              <CardContent>Lower operational costs by optimizing your supply chain processes.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Improved Quality</CardTitle>
              </CardHeader>
              <CardContent>
                Enhance product quality with better control and visibility of your supply chain.
              </CardContent>
            </Card>
          </div>
        </section>
        <section id="testimonials" className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">What Our Customers Say</h2>
          <div className="max-w-2xl mx-auto mt-10 space-y-10">
            <blockquote className="text-gray-600 dark:text-gray-400">
              "PharmaChain has revolutionized our supply chain operations. The transparency and efficiency it provides is
              unparalleled."
              <footer className="mt-2 text-right text-gray-800 dark:text-gray-200">
                - John Doe, ABC Pharmaceuticals
              </footer>
            </blockquote>
            <blockquote className="text-gray-600 dark:text-gray-400">
              "The traceability feature of PharmaChain is a game-changer. It has significantly improved our product safety
              and compliance."
              <footer className="mt-2 text-right text-gray-800 dark:text-gray-200">- Jane Smith, XYZ Healthcare</footer>
            </blockquote>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 px-4 text-center border-t">
        <p className="text-gray-600 dark:text-gray-400">&copy; 2024 PharmaChain. All rights reserved.</p>
      </footer>
    </div>
  )
}
