import clsx from "clsx";
import { Press_Start_2P } from "next/font/google"

const press_font = Press_Start_2P({
    subsets:['latin'],
    weight:"400"
});
export default function NavBar(){


    return (
        <div className="bg-slate-400 h-[50px] flex items-center">
            <p className={clsx(press_font.className,"ml-5 text-white font-bold")}>
                Regressifier
            </p>
        </div>
    )
}