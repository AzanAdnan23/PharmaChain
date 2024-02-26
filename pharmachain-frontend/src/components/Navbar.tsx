import { Link } from "react-router-dom";
import { useSDK } from "@metamask/sdk-react";
import { useState } from "react";

export default function Navbar() {
    const [account, setAccount] = useState<string>();
    const { sdk, connected, connecting, provider, chainId } = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };

    return (
        <div className="z-10 sticky inset-0 bg-black text-white w-full h-12 flex flex-row justify-between items-center">
            <div className="flex flex-row">
                <Link className="m-2 font-bold font-mono" to={"/"}>PharmaChain</Link>
                <Link className="m-2 font-mono" to={"/dashboard"}>Dashboard</Link>
                <Link className="m-2 font-mono" to={"/scanner"}>Scanner</Link>
            </div>
            {
                connected 
                ? (<button onClick={connect} className="m-2 p-1 rounded-md font-mono">Connected 🦊</button>)
                : (<button onClick={connect} className="m-2 p-1 rounded-md font-mono">Connect to MetaMask 🦊</button>)
            }
        </div>
    );
}