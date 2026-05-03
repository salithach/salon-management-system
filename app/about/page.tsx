export default function AboutPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-20">

            <h1 className="text-4xl font-bold mb-6">
                About Us
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-10">
                We are building modern, fast, and scalable digital products that help businesses
                simplify workflows and deliver better user experiences.
                Our focus is on clean design, performance, and real-world usability.
            </p>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="p-6 border rounded-xl">
                    <h2 className="font-semibold text-xl mb-2">🚀 Our Mission</h2>
                    <p className="text-gray-600 text-sm">
                        To build intuitive and high-performance applications that solve real problems.
                    </p>
                </div>

                <div className="p-6 border rounded-xl">
                    <h2 className="font-semibold text-xl mb-2">⚡ Our Vision</h2>
                    <p className="text-gray-600 text-sm">
                        A world where software feels simple, fast, and invisible in the best way.
                    </p>
                </div>

                <div className="p-6 border rounded-xl">
                    <h2 className="font-semibold text-xl mb-2">🧠 Our Approach</h2>
                    <p className="text-gray-600 text-sm">
                        Focus on clean architecture, scalable systems, and user-first design.
                    </p>
                </div>

            </div>
        </div>
    )
}