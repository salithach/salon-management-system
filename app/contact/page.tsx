export default function ContactPage() {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-20">

            <h1 className="text-4xl font-bold mb-6">
                Contact Us
            </h1>

            <p className="text-gray-600 mb-10">
                Have a question, idea, or want to collaborate?
                We’d love to hear from you.
            </p>

            <form className="space-y-5">

                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <textarea
                    placeholder="Your Message"
                    rows={5}
                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                    Send Message
                </button>
            </form>

            <div className="mt-12 text-sm text-gray-500">
                Or email us directly at <span className="text-black">support@myapp.com</span>
            </div>

        </div>
    )
}