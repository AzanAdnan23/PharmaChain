import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="z-10 sticky inset-0 bg-black text-white w-full h-12 flex flex-row justify-between items-center">
            <div className="flex flex-row">
                <Link className="m-2 font-bold font-mono" to={"/"}>PharmaChain</Link>
                <Link className="m-2 font-mono" to={"/dashboard"}>Dashboard</Link>
                <Link className="m-2 font-mono" to={"/scanner"}>Scanner</Link>
            </div>
            <button className="m-2 p-1 rounded-md font-mono">Connect to Metamask 🦊</button>
        </div>
    );
}