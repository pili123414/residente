import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div
      className={cn(
        "pb-12 min-h-screen w-64 border-r bg-background text-foreground",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/")}
            >
              <LayoutDashboard className="h-5 w-5" />
              Página Inicial
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/residents")}
            >
              <Users className="h-5 w-5" />
              Cadastro de Moradores
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/reports")}
            >
              <FileText className="h-5 w-5" />
              Relatórios
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-5 w-5" />
                  Modo Escuro
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  Modo Claro
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
