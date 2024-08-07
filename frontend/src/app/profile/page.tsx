import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Settings = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex flex-col font-mono rounded-sm p-4 bg-yellow-300 text-black">
      <div className='flex'>
      <div className="text-xl mr-2"> Under Construction</div>
      <Wrench className='text-3xl'/>
      </div>
      <div>{"#include<iostream>"}</div>
      <div>{"using namespace std;"}</div>
      <div>{"int main() {"}</div>
      <div>{'   cout << "Kam kar le bharwe"'}</div>
      <div>{"return 0;"}</div>
      <div>{"}"}</div>
      <Link className="font-bold" href={"/login"}>Go back</Link>
      </div>
    </div>
    )
};

export default Settings;