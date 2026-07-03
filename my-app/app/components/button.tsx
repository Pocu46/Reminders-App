const Button = ({ text, className, type, onClick }: { text: string; className: string; type: "submit" | "reset" | "button" | undefined; onClick?: () => void }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn-primary mt-5 rounded-3xl bg-[#87b0c8] m-auto transition ease-in-out hover:-translate-y-1 hover:scale-110 delay-300 max-sm:w-[96px] max-sm:h-[26px] ${className}`}
        >
            {text}
        </ button>
    )
}

export default Button;