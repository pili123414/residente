import MainLayout from "@/components/layout/MainLayout";
import ResidentForm from "@/components/residents/ResidentForm";

export default function ResidentsPage() {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Cadastro de Moradores</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo com os dados do morador. Os campos
            marcados com * são obrigatórios.
          </p>
        </div>
        <ResidentForm />
      </div>
    </MainLayout>
  );
}
