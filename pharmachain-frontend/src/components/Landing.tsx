import Navbar from "./Navbar";

export default function Landing() {
    return (
        <>
        {/* cta [Call To Action] */}
        <div className="h-screen bg-[url('body-bg.jpg')] bg-fixed">
            <Navbar></Navbar>
            <div className="flex text-black flex-col my-20 items-center">
            <div className="text-5xl flex flex-row">
                <div className="font-mono">Meet PharmaChain.</div>
            </div>
            <div className="text-white my-6 w-3/4 text-center font-mono text-lg [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">Experience the future of pharmaceutical supply chain management with Pharmachain. Powered by the Ethereum blockchain, Pharmachain revolutionizes transparency, security, and efficiency in the industry. Say goodbye to traditional supply chain challenges and embrace the decentralized solution that ensures trust, integrity, and seamless operations.</div>
            <div className="flex flex-row my-8">
                <div className="relative flex justify-center items-center">
                    <div className="blur-sm bg-black w-80 h-80 mx-12"></div>
                    <div className="mt-10 font-mono text-lg absolute inset-0 flex justify-center items-top text-white">Fast</div>
                    <div className="hover:text-lg transition-all duration-300 text-center px-16 font-mono text-sm font-md absolute inset-0 flex justify-center items-center text-white">
                        Streamline your operations with Pharmachain's lightning-fast transactions, ensuring swift movement of pharmaceuticals from production to distribution.
                    </div>
                </div>
                <div className="relative flex justify-center items-center">
                    <div className="blur-sm bg-black w-80 h-80 mx-12"></div>
                    <div className="mt-10 font-mono text-lg absolute inset-0 flex justify-center items-top text-white">Scalable</div>
                    <div className="hover:text-lg transition-all duration-300 text-center px-16 font-mono text-sm font-md absolute inset-0 flex justify-center items-center text-white">
                        From small-scale operations to enterprise-level logistics, Pharmachain scales effortlessly to meet your evolving needs, ensuring uninterrupted growth.
                    </div>
                </div>
                <div className="relative flex justify-center items-center">
                    <div className="blur-sm bg-black w-80 h-80 mx-12"></div>
                    <div className="mt-10 font-mono text-lg absolute inset-0 flex justify-center items-top text-white">Secure</div>
                    <div className="hover:text-lg transition-all duration-300 text-center px-16 font-mono text-sm font-md absolute inset-0 flex justify-center items-center text-white">
                        Protect the integrity of your pharmaceutical supply chain with Pharmachain's immutable blockchain technology, ensuring transparency and trust at every step.
                    </div>
                </div>
            </div>
        </div>
        </div>
        {/* section2 */}
        <div className="h-screen bg-black text-white flex flex-row justify-center items-center">
            <div className="flex flex-col max-w-md mx-12">
                <div className="font-mono text-5xl">Sustainability & Compliance</div>
                <div className="font-mono text-2xl my-4">Helping everyone to trust in what they buy</div>
                <div className="font-mono">By working with PharmaChain, producers, buyers and manufacturers, and retailers can further evidence the origin, ownership, and characteristics of their products.</div>
            </div>
            <div className="mx-12">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/XJJPaL1sOIk?si=aZmKnpp5ajNiQOPj" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        {/* footer */}
        <div className="font-mono px-2 w-full h-12 bg-[#2d3142] text-white flex flex-row justify-between items-center">
            <div>© ASS Software, Inc. All rights reserved.</div>
            {/* <img className="w-20" src="brand-kit\Logo Files\For Web\png\Color logo - no background.png" alt="pharmachain-logo" /> */}
        </div>
        </>
    );
}