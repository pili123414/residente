import MainLayout from "./layout/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Resident } from "@/lib/types";

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    elderly: 0,
    pcd: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("residents").select("*");

        if (error) throw error;

        const residents = data || [];
        const today = new Date().toISOString().split("T")[0];

        setStats({
          total: residents.length,
          elderly: residents.filter((r) => r.elderly).length,
          pcd: residents.filter((r) => r.cid && r.cid.trim() !== "").length,
          today:
            residents.filter((r) => r.createdAt?.split("T")[0] === today)
              .length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to localStorage
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
      } finally {
        setLoading(false);
      }
    };

    calculateStats();

    // Set up real-time subscription
    const subscription = supabase
      .channel("residents-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "residents" },
        calculateStats,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
            <div className="text-2xl font-semibold">
              {loading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.total
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Moradores Cadastrados
            </p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">
              {loading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.elderly
              )}
            </div>
            <p className="text-sm text-muted-foreground">Idosos</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">
              {loading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.pcd
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Pessoas com Deficiência
            </p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-2xl font-semibold">
              {loading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.today
              )}
            </div>
            <p className="text-sm text-muted-foreground">Cadastros Hoje</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
