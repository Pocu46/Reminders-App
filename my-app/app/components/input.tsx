const Input = ({ type, placeholder, className }: { type: string; placeholder: string; className: string; }) => {
  return (
        <input
          type={type}
          placeholder={placeholder}
          className={className}
        />
  )
}

export default Input;