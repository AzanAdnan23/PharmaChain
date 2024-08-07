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
      <div>{'cout << "Cant believe its all going to end soon.";'}</div>
      <div>{'cout << "3 years of wasting time and being happy, and then 1 year of still wasting time but being stressed.";'}</div>
      <div>{'cout << "All the memories made, all the things learned, and yet it feels like I could have done so much more."'}</div>
      <div>{'cout << "I guess life is like that. You can always think oh I could have done this better or oh I could have done that differently."'}</div>
      <div>{'cout << "But in the end it all comes down to being grateful for the opportunity to have had the experience at all."'}</div>
      <div>{'cout << "Of worrying about the final exam due in 3 hours and wishing you had studied."'}</div>
      <div>{'cout << "Of fucking around being bored with your friends while waiting for the next class."'}</div>
      <div>{'cout << "Of being scared to go through the door of the teachers office during viva month."'}</div>
      <div>{'cout << "Of uploading spaghetti code a minute before your robot enters a national tournament."'}</div>
      <div>{'cout << "Of playing games at 3am knowing you should go to sleep because you have to go to university at 8."'}</div>
      <div>{'cout << "Of dreaming about doing FYP since the start of 2020 but when it actually came then putting it off until the last 3 weeks."'}</div>
      <div>{'cout << "Of having an existential crisis thinking about what will happen after uni ends and practical life hits you in the face with a baseball bat."'}</div>
      <div>{'cout << "Of living."'}</div>
      <div>{'cout << "Im grateful to have had all of these experiences. Even the bad ones."'}</div>
      <div>{'cout << "Because you never know youre living through the good times until theyre gone."'}</div>
      <div>{'cout << "But you also never know about all the good times that are waiting for you in the future :D"'}</div>
      <div>{'cout << "Okay bohot Deep Thoughts With Shahwaiz ho gaye time to WORK (by work I mean sleep because there is only so much frontend development I can do before vomiting)."'}</div>
      <div>{"return 0;"}</div>
      <div>{"}"}</div>
      <Link className="font-bold" href={"/login"}>Go back</Link>
      </div>
    </div>
    )
};

export default Settings;