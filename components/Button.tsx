import cslx from "clsx"

type ButtonProps = {
  type:"submit" | "reset" | "button" | undefined;
  label:string;
  className?: string;
};

export default function Button({type, label,className}:ButtonProps){

    return (<button type={type} className={cslx("bg-slate-400 rounded-sm p-2",className)}>
        {label}
    </button>)


}