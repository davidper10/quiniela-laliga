"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Trophy,
    Settings,
    ClipboardPen,
    Users,
    Goal
} from "lucide-react";

const items = [

{
href:"/dashboard/results",
icon:Goal,
label:"Resultados"
},

{
href:"/dashboard/predictions",
icon:ClipboardPen,
label:"Pron."
},

{
href:"/dashboard/comparison",
icon:Users,
label:"Compar."
},

{
href:"/dashboard/rankings",
icon:Trophy,
label:"Clasif."
},

{
href:"/dashboard/settings",
icon:Settings,
label:"Config."
}

];


export default function BottomNav(){

const pathname = usePathname();


return(

<nav

className="
md:hidden

fixed

bottom-0

left-0

right-0

bg-white

border-t

z-50

"

>


<div

className="grid grid-cols-5"

>

{

items.map(item=>{


const Icon = item.icon;


const active = pathname===item.href;


return(

<Link

key={item.href}

href={item.href}


className="flex flex-col items-center py-2"


>


<Icon

size={20}

className={

active
?

"text-blue-600"

:

"text-gray-500"

}


/>



<span

className="text-xs"

>

{item.label}

</span>


</Link>


)



})

}


</div>


</nav>


)

}