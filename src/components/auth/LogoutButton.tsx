import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
