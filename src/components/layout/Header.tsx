import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background text-foreground">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-xl text-primary">
            Cadastro Municipal de Residentes de São José do Vale do Rio Preto
          </div>
          <div className="text-sm text-muted-foreground">
            Prefeitura Municipal
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
