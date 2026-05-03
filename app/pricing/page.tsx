export default function PricingPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-20">

            {/* Header */}
            <div className="text-center mb-14">
                <h1 className="text-4xl font-bold mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-gray-600">
                    Choose a plan that fits your needs. Upgrade or downgrade anytime.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8">

                {/* Basic */}
                <div className="border rounded-2xl p-8 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold mb-2">Basic</h2>
                    <p className="text-gray-500 mb-6">For personal use</p>

                    <p className="text-4xl font-bold mb-6">
                        $9<span className="text-base font-normal text-gray-500">/mo</span>
                    </p>

                    <ul className="space-y-3 text-gray-600 text-sm mb-8">
                        <li>✔ 1 Project</li>
                        <li>✔ Basic Analytics</li>
                        <li>✔ Email Support</li>
                    </ul>

                    <button className="w-full border border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition">
                        Get Started
                    </button>
                </div>

                {/* Pro (Highlighted) */}
                <div className="border-2 border-black rounded-2xl p-8 bg-black text-white relative scale-105 shadow-xl">

                    <div className="absolute top-4 right-4 text-xs bg-white text-black px-2 py-1 rounded-full">
                        Popular
                    </div>

                    <h2 className="text-xl font-semibold mb-2">Pro</h2>
                    <p className="text-white/70 mb-6">For professionals</p>

                    <p className="text-4xl font-bold mb-6">
                        $29<span className="text-base font-normal text-white/70">/mo</span>
                    </p>

                    <ul className="space-y-3 text-white/80 text-sm mb-8">
                        <li>✔ 10 Projects</li>
                        <li>✔ Advanced Analytics</li>
                        <li>✔ Priority Support</li>
                        <li>✔ API Access</li>
                    </ul>

                    <button className="w-full bg-white text-black py-2 rounded-lg hover:opacity-90 transition">
                        Get Started
                    </button>
                </div>

                {/* Enterprise */}
                <div className="border rounded-2xl p-8 hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold mb-2">Enterprise</h2>
                    <p className="text-gray-500 mb-6">For large teams</p>

                    <p className="text-4xl font-bold mb-6">
                        $99<span className="text-base font-normal text-gray-500">/mo</span>
                    </p>

                    <ul className="space-y-3 text-gray-600 text-sm mb-8">
                        <li>✔ Unlimited Projects</li>
                        <li>✔ Full Analytics Suite</li>
                        <li>✔ Dedicated Support</li>
                        <li>✔ Custom Integrations</li>
                    </ul>

                    <button className="w-full border border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition">
                        Contact Sales
                    </button>
                </div>

            </div>
        </div>
    )
}