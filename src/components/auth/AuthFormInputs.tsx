import { Input } from "@/components/ui/input";

interface AuthFormInputsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const AuthFormInputs = ({
  email,
  setEmail,
  password,
  setPassword,
}: AuthFormInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </>
  );
};