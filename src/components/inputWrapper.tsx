import { type ReactNode } from "react";
import { Label } from "~/components/ui/label"

type Props = {
  label: string;
  required?: boolean;
  children: ReactNode;
  errorMessage?: string;
}

export function InputWrapper(props: Props) {
  const { label, errorMessage, required, children } = props
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="grid w-full max-w-sm items-center gap-1.5">
          {label && (<p>{label} {required && '*'}</p>)}
          {children}
        </Label>
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  )
}