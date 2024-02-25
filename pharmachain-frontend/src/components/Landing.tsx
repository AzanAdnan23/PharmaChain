import Navbar from "./Navbar";

export default function Landing() {
    return (
        <>
        {/* cta [Call To Action] */}
        {/* bg-[url('body-bg.jpg')] */}
        <div className="h-screen bg-gray-200 bg-fixed">
        {/* <div className="h-screen bg-gray-200 bg-fixed"> */}
            <Navbar></Navbar>
            <div className="flex text-black flex-col my-20 items-center">
            <div className="text-5xl flex flex-row">
                <div className="font-mono">Meet PharmaChain.</div>
            </div>
            {/* [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] */}
            <div className="text-black my-6 w-3/4 text-center font-sans text-lg">Experience the future of pharmaceutical supply chain management with Pharmachain. Powered by the Ethereum blockchain, Pharmachain revolutionizes transparency, security, and efficiency in the industry. Say goodbye to traditional supply chain challenges and embrace the decentralized solution that ensures trust, integrity, and seamless operations.</div>
            <div className="flex flex-row my-8">
                <div className="hover:bg-black hover:text-white transition transition-100 border-2 border-black rounded-xl bg-transparent w-80 h-80 mx-12">
                    <div className="py-10 text-center font-mono text-xl font-semibold">Fast</div>
                    <div className="px-5 text-center font-sans text-md font-md">
                        Streamline your operations with Pharmachain's lightning-fast transactions, ensuring swift movement of pharmaceuticals from production to distribution.
                    </div>
                </div>
                <div className="hover:bg-black hover:text-white transition transition-100 rounded-xl bg-transparent border-2 border-black w-80 h-80 mx-12">
                    <div className="py-10 text-center font-mono text-xl font-semibold">Scalable</div>
                    <div className="px-5 text-center font-sans text-md font-md">
                    From small-scale operations to enterprise-level logistics, Pharmachain scales effortlessly to meet your evolving needs, ensuring uninterrupted growth.
                    </div>
                </div>
                <div className="hover:bg-black hover:text-white transition transition-100 rounded-xl bg-tranparent border-2 border-black w-80 h-80 mx-12">
                    <div className="py-10 text-center font-mono text-xl font-semibold">Secure</div>
                    <div className="px-5 text-center font-sans text-md font-md">
                    Protect the integrity of your pharmaceutical supply chain with Pharmachain's immutable blockchain technology, ensuring transparency and trust at every step.
                    </div>
                </div>
            </div>
        </div>
        </div>
        {/* section2 */}
        {/* <div className="h-screen bg-black text-white flex flex-row justify-center items-center">
            <div className="h-80 flex flex-col max-w-md mx-12 border border-white p-5 rounded-bl-2xl rounded-tr-2xl">
                <div className="font-mono text-3xl">Sustainability & Compliance</div>
                <div className="font-mono text-xl my-4">Helping everyone to trust in what they buy</div>
                <div className="font-mono">By working with PharmaChain, producers, buyers and manufacturers, and retailers can further evidence the origin, ownership, and characteristics of their products.</div>
            </div>
            <div className="h-80 flex flex-col justify-between max-w-md mx-12 border border-white p-5 rounded-bl-2xl rounded-tr-2xl">
                <div className="font-mono text-3xl">RFID Integration with UHF Technology</div>
                <div className="font-mono text-xl my-4">Ensuring trust in purchased goods</div>
                <div className="font-mono">Partnering with PharmaChain, stakeholders including producers, buyers, manufacturers, and retailers can enhance proof of product origin, ownership, and attributes through RFID technology.</div>
            </div>
            {/* <div className="mx-12">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/XJJPaL1sOIk?si=aZmKnpp5ajNiQOPj" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
        </div> */}
        {/* section 3 */}
        <div className="h-screen bg-black text-white flex flex-row justify-center items-center">
            <div className="flex flex-col max-w-md mx-12 text-white">
                <div className="font-mono text-5xl">Blockchain Integration</div>
                <div className="font-mono text-xl my-5">Fortifying trust in consumer purchases</div>
                <div className="font-sans">Collaborating with PharmaChain, stakeholders such as producers, buyers, manufacturers, and retailers can bolster evidence of product origin, ownership, and characteristics through blockchain technology.</div>
            </div>
            <div className="mx-12">
            <iframe className="rounded-2xl" width="560" height="315" src="https://www.youtube.com/embed/XJJPaL1sOIk?si=aZmKnpp5ajNiQOPj" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
        </div>
        {/* footer */}
        {/* bg-[#2d3142] */}
        <div className="font-mono px-2 w-full h-12 bg-[#2d3142] text-white flex flex-row justify-between items-center">
            <div>© SSA Software, Inc. All rights reserved.</div>
            {/* <img className="w-20" src="brand-kit\Logo Files\For Web\png\Color logo - no background.png" alt="pharmachain-logo" /> */}
        </div>
        </>
    );
}