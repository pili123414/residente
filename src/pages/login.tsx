import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Cadastro Municipal de Residentes de São José do Vale do Rio Preto
          </h1>
          <p className="text-muted-foreground mt-2">Prefeitura Municipal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
