import Navbar from "./Navbar";

export default function Dashboard() {
    return (
        <div className="flex flex-col">
            <Navbar></Navbar>
            {/* top bar */}
            <div className="px-1 h-12 flex flex-row justify-between items-center rounded-md m-3">
                <div className="mr-5 pl-2 py-2.5 flex flex-col justify-between w-10 h-9 rounded-sm">
                    <div className="bg-black w-6 h-0.5"></div>
                    <div className="bg-black w-6 h-0.5"></div>
                    <div className="bg-black w-6 h-0.5"></div>
                </div>
                {/* <div className="w-1/3 h-0.5 bg-black"></div> */}
                {/* <div className="p-2 mt-2 rounded-sm border-2 border-black font-mono text-lg">Welcome to your Dashboard</div> */}
                {/* <div className="w-1/3 h-0.5 bg-black"></div> */}
                <div className="flex flex-row items-center">
                    <div className="font-mono mx-2">User 2213</div>
                    {/* <div className="shadow-2xl bg-cover h-9 w-9 rounded-3xl bg-[url('dash-pfp.jpg')]"></div> */}
                    <div className="shadow-2xl bg-cover h-9 w-9 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500"></div>
                </div>
            </div>
            {/* dash container */}
            <div className="flex flex-row justify-between">
                {/* roles and wallet info */}
                <div className="flex flex-col justify between">
                    <div className="mb-10 rounded-md border mx-4 flex flex-col min-h-content bg-gray-100">
                        <div className="rounded-tr-md rounded-tl-md mb-2 bg-black text-white text-center font-mono border-2 border-black">Roles</div>
                        <div className="text-center mx-5 my-3 rounded-md text-white bg-black py-2 px-5 font-mono">Manufacturer</div>
                        <div className="hover:bg-black hover:text-white transition transition-200 border border-black text-center mx-5 my-3 rounded-md text-black bg-white py-2 px-5 font-mono">Distributor</div>
                        <div className="hover:bg-black hover:text-white transition transition-200 border border-black text-center mx-5 my-3 rounded-md text-black bg-white py-2 px-5 font-mono">Retailer</div>
                    </div>
                    <div className="mx-4 bg-gray-100 flex flex-col flex-grow">
                        <div className="rounded-tr-md rounded-tl-md mb-2 bg-black text-white text-center font-mono border-2 border-black">Wallet Info</div>
                    </div>
                </div>
                {/* current orders */}
                <div className="rounded-md mx-4 w-2/3 bg-gray-100 h-[85vh]">
                    <div className="rounded-tr-md rounded-tl-md bg-black text-white text-center font-mono border-2 border-black">Current Orders</div>
                    <div className="p-5 overflow-scroll h-[80vh]">
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 6ac3c336e4094835293a3</div>
                                    <div className="font-mono text-sm">Lahore, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x35</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 85fc17f7069acd39a5c63</div>
                                    <div className="font-mono text-sm">Karachi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x18</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-green-500 to-green-700 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 2062f80093066633876b5</div>
                                    <div className="font-mono text-sm">Rawalpindi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x7</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 6ac3c336e4094835293a3</div>
                                    <div className="font-mono text-sm">Lahore, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x35</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 85fc17f7069acd39a5c63</div>
                                    <div className="font-mono text-sm">Karachi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x18</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-green-500 to-green-700 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 2062f80093066633876b5</div>
                                    <div className="font-mono text-sm">Rawalpindi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x7</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 6ac3c336e4094835293a3</div>
                                    <div className="font-mono text-sm">Lahore, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x35</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 85fc17f7069acd39a5c63</div>
                                    <div className="font-mono text-sm">Karachi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x18</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-green-500 to-green-700 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 2062f80093066633876b5</div>
                                    <div className="font-mono text-sm">Rawalpindi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x7</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 6ac3c336e4094835293a3</div>
                                    <div className="font-mono text-sm">Lahore, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x35</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 85fc17f7069acd39a5c63</div>
                                    <div className="font-mono text-sm">Karachi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x18</div>
                        </div>
                        <div className="mb-5 rounded-md p-3 flex flex-row items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-row items-center">
                                <div className="mr-3 rounded-3xl bg-gradient-to-r from-green-500 to-green-700 w-10 h-10"></div>
                                <div className="flex flex-col">
                                    <div className="font-mono">Batch Id: 2062f80093066633876b5</div>
                                    <div className="font-mono text-sm">Rawalpindi, Pakistan</div>
                                </div>
                            </div>
                            <div className="font-sans font-semibold">x7</div>
                        </div>
                    </div>
                </div>
                {/* batch section */}
                <div className="flex flex-col mx-4 w-1/4">
                    <div className="rounded-md bg-gray-100 min-h-min mb-5">
                        <div className="rounded-tr-md rounded-tl-md mb-2 bg-black text-white text-center font-mono border-2 border-black">Create Batch</div>
                        <div className="flex flex-col p-5">
                            <input placeholder="Batch ID" className="font-mono rounded-sm mb-4 p-2 bg-white border-black border" type="text" name="" id="" />
                            <input placeholder="Location" className="font-mono rounded-sm mb-4 p-2 bg-white border-black border" type="text" name="" id="" />
                            <input placeholder="Quantity" className="font-mono rounded-sm mb-4 p-2 bg-white border-black border" type="text" name="" id="" />
                            <button className="transition transition-200 rounded-md bg-black shadow-lg text-white border border-black py-1 mt-3">Submit</button>
                        </div>
                    </div>
                    <div className="rounded-md bg-gray-100 flex-grow">
                        <div className="rounded-tr-md rounded-tl-md bg-black text-white text-center font-mono border-2 border-black">Current Batches</div>
                        <div className="flex flex-col p-2">
                            <div className="rounded-sm p-2 mb-2 bg-white shadow-sm flex flex-row">
                                <div className="mr-3 bg-white border border-black text-black px-2">5</div>
                                <div className="font-mono">Batch Id: 2062f80</div>
                            </div>
                            <div className="rounded-sm p-2 mb-2 bg-white shadow-sm flex flex-row">
                                <div className="mr-3 bg-white border border-black text-black px-2">9</div>
                                <div className="font-mono">Batch Id: 2062f80</div>
                            </div>
                            <div className="rounded-sm p-2 mb-2 bg-white shadow-sm flex flex-row">
                                <div className="mr-3 bg-white border border-black text-black px-2">8</div>
                                <div className="font-mono">Batch Id: 2062f80</div>
                            </div>
                            <div className="rounded-sm p-2 mb-2 bg-white shadow-sm flex flex-row">
                                <div className="mr-3 bg-white border border-black text-black px-2">3</div>
                                <div className="font-mono">Batch Id: 2062f80</div>
                            </div>
                            <div className="rounded-sm p-2 mb-2 bg-white shadow-sm flex flex-row">
                                <div className="mr-3 bg-white border border-black text-black px-2">3</div>
                                <div className="font-mono">Batch Id: 2062f80</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}