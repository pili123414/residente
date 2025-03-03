import MainLayout from "./layout/MainLayout";
import { useEffect, useState } from "react";

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    elderly: 0,
    pcd: 0,
    today: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const residents = JSON.parse(localStorage.getItem("residents") || "[]");
      const today = new Date().toLocaleDateString();

      setStats({
        total: residents.length,
        elderly: residents.filter((r) => r.elderly).length,
        pcd: residents.filter((r) => r.cid && r.cid.trim() !== "").length,
        today:
          residents.filter((r) => r.createdAt?.split("T")[0] === today)
            .length || 0,
      });
    };

    calculateStats();
    window.addEventListener("storage", calculateStats);
    return () => window.removeEventListener("storage", calculateStats);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo ao Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie os cadastros dos moradores do município de forma simples e
            organizada.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">
              Moradores Cadastrados
            </p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">{stats.elderly}</div>
            <p className="text-sm text-muted-foreground">Idosos</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">{stats.pcd}</div>
            <p className="text-sm text-muted-foreground">
              Pessoas com Deficiência
            </p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">{stats.today}</div>
            <p className="text-sm text-muted-foreground">Cadastros Hoje</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
