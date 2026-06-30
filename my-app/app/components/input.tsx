const Input = ({ email, placeholder, className }: { email: string; placeholder: string; className: string; }) => {
  return (
        <input
          type={email}
          placeholder={placeholder}
          className={className}
        />
  )
}

export default Input;