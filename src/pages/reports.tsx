import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
interface Resident {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  phone: string;
  email: string;
  address: string;
  housing: "owned" | "rented";
  residents: number;
  cid?: string;
  disabilityDescription?: string;
  elderly: boolean;
  elderlyAge?: number;
  hasDisability: boolean;
  isForeigner: boolean;
  foreignDocNumber?: string;
  hasGovernmentAssistance: boolean;
  governmentAssistance: Array<{
    type: string;
    value: string;
  }>;
  dependents: Array<{
    ageRange: string;
    hasDisability: boolean;
    cid?: string;
    disabilityDescription?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE = 10;

export default function ReportsPage() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = () => {
    const data = JSON.parse(localStorage.getItem("residents") || "[]");
    setResidents(
      data.sort(
        (a: Resident, b: Resident) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  };

  const filteredResidents = residents.filter((resident) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();

    return (
      resident.name?.toLowerCase().includes(searchTermLower) ||
      resident.cpf?.toLowerCase().includes(searchTermLower) ||
      resident.rg?.toLowerCase().includes(searchTermLower) ||
      resident.phone?.toLowerCase().includes(searchTermLower) ||
      resident.email?.toLowerCase().includes(searchTermLower) ||
      resident.address?.toLowerCase().includes(searchTermLower) ||
      (resident.hasDisability &&
        resident.cid?.toLowerCase().includes(searchTermLower)) ||
      (resident.hasDisability &&
        resident.disabilityDescription
          ?.toLowerCase()
          .includes(searchTermLower)) ||
      (resident.elderly &&
        resident.elderlyAge?.toString().includes(searchTerm)) ||
      (resident.isForeigner &&
        resident.foreignDocNumber?.toLowerCase().includes(searchTermLower)) ||
      (resident.hasGovernmentAssistance &&
        resident.governmentAssistance.some(
          (assistance) =>
            assistance.type.toLowerCase().includes(searchTermLower) ||
            assistance.value.toLowerCase().includes(searchTermLower),
        )) ||
      resident.dependents.some(
        (dep) =>
          dep.ageRange.toLowerCase().includes(searchTermLower) ||
          (dep.hasDisability &&
            dep.cid?.toLowerCase().includes(searchTermLower)) ||
          (dep.hasDisability &&
            dep.disabilityDescription?.toLowerCase().includes(searchTermLower)),
      )
    );
  });

  const totalPages = Math.ceil(filteredResidents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResidents = filteredResidents.slice(startIndex, endIndex);

  const getFormattedData = () => {
    return residents.map((resident) => ({
      Nome: resident.name,
      CPF: resident.cpf,
      RG: resident.rg,
      Telefone: resident.phone,
      Email: resident.email,
      Endereço: resident.address,
      "Tipo de Moradia": resident.housing === "owned" ? "Própria" : "Alugada",
      "Número de Moradores": resident.residents,
      "É PCD": resident.hasDisability ? "Sim" : "Não",
      CID: resident.cid || "-",
      "Descrição da Deficiência": resident.disabilityDescription || "-",
      "É Idoso": resident.elderly ? "Sim" : "Não",
      "Idade (se idoso)": resident.elderly ? resident.elderlyAge : "-",
      "É Estrangeiro": resident.isForeigner ? "Sim" : "Não",
      "Documento Estrangeiro": resident.foreignDocNumber || "-",
      "Recebe Auxílio": resident.hasGovernmentAssistance ? "Sim" : "Não",
      Auxílios: resident.hasGovernmentAssistance
        ? resident.governmentAssistance
            .map((a) => `${a.type}: R$ ${a.value}`)
            .join("; ")
        : "-",
      Dependentes:
        resident.dependents.length > 0
          ? resident.dependents
              .map((d) => {
                let text = `Faixa: ${d.ageRange}`;
                if (d.hasDisability)
                  text += `, PCD (CID: ${d.cid || "-"} - ${d.disabilityDescription || "-"})`;
                return text;
              })
              .join("; ")
          : "-",
      "Data de Cadastro": new Date(resident.createdAt).toLocaleDateString(
        "pt-BR",
      ),
      "Última Atualização": resident.updatedAt
        ? new Date(resident.updatedAt).toLocaleDateString("pt-BR")
        : "-",
    }));
  };

  const exportToExcel = () => {
    const formattedData = getFormattedData();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Moradores");
    XLSX.writeFile(wb, "cadastro-moradores.xlsx");
  };

  const exportToPDF = () => {
    try {
      const formattedData = getFormattedData();
      const doc = new jsPDF("landscape", "pt", "a3");

      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text("Relatório de Cadastro de Moradores", 40, 40);

      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.text(
        `Data de geração: ${new Date().toLocaleDateString("pt-BR")}`,
        40,
        65,
      );
      doc.text(`Total de registros: ${formattedData.length}`, 40, 85);

      // Organize data for better display
      const essentialColumns = [
        "Nome",
        "CPF",
        "RG",
        "Telefone",
        "Email",
        "Endereço",
        "Tipo de Moradia",
        "Número de Moradores",
        "É PCD",
        "É Idoso",
        "É Estrangeiro",
        "Recebe Auxílio",
      ];

      const detailColumns = [
        "CID",
        "Idade (se idoso)",
        "Documento Estrangeiro",
        "Auxílios",
        "Dependentes",
        "Data de Cadastro",
        "Última Atualização",
      ];

      // Generate the PDF with auto table - essential info
      autoTable(doc, {
        head: [essentialColumns],
        body: formattedData.map((item) =>
          essentialColumns.map((col) => item[col]),
        ),
        startY: 110,
        styles: { fontSize: 9, cellPadding: 4, halign: "left" },
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 110 },
        didDrawPage: (data) => {
          // Header on each page
          doc.setFillColor(0, 51, 102);
          doc.rect(
            data.settings.margin.left,
            20,
            doc.internal.pageSize.width -
              (data.settings.margin.left + data.settings.margin.right),
            30,
            "F",
          );
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.text(
            "Cadastro Municipal de Residentes de São José do Vale do Rio Preto",
            data.settings.margin.left + 10,
            40,
          );

          // Footer with page numbers
          doc.setFontSize(10);
          doc.setTextColor(102, 102, 102);
          doc.text(
            `Página ${doc.internal.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 20,
          );
          doc.text(
            `Prefeitura Municipal - Documento Oficial`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 20,
            { align: "center" },
          );
        },
      });

      // Add detailed information for each resident
      let yPos = doc.lastAutoTable.finalY + 20;

      formattedData.forEach((resident, index) => {
        // Check if we need a new page
        if (yPos > doc.internal.pageSize.height - 100) {
          doc.addPage();
          yPos = 110;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text(`Detalhes do Morador: ${resident.Nome}`, 40, yPos);
        yPos += 20;

        // Add detailed table for this resident
        autoTable(doc, {
          head: [["Informação", "Valor"]],
          body: detailColumns.map((col) => [col, resident[col]]),
          startY: yPos,
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 150, fontStyle: "bold" },
            1: { cellWidth: 350 },
          },
          margin: { left: 40, right: 40 },
        });

        yPos = doc.lastAutoTable.finalY + 30;
      });

      // Save the PDF
      doc.save("cadastro-moradores.pdf");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Ocorreu um erro ao exportar o PDF. Por favor, tente novamente.");
    }
  };

  const handleEdit = (resident: Resident) => {
    localStorage.setItem("editingResident", JSON.stringify(resident));
    navigate("/residents");
  };

  const handleDelete = (id: string) => {
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    const updatedResidents = residents.filter(
      (resident: Resident) => resident.id !== id,
    );
    localStorage.setItem("residents", JSON.stringify(updatedResidents));
    fetchResidents();
    setDeleteDialog({ isOpen: false, id: "" });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize, edite e exporte os dados dos moradores cadastrados.
            </p>
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por nome, CPF, RG, telefone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-80"
            />
            <div className="flex gap-2">
              <Button onClick={exportToPDF} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button
                onClick={exportToExcel}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>RG</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Moradia</TableHead>
                <TableHead>Moradores</TableHead>
                <TableHead>CID/Deficiência</TableHead>
                <TableHead>Idoso</TableHead>
                <TableHead>Estrangeiro</TableHead>
                <TableHead>Auxílios</TableHead>
                <TableHead>Dependentes</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>{resident.name}</TableCell>
                  <TableCell>{resident.cpf}</TableCell>
                  <TableCell>{resident.rg}</TableCell>
                  <TableCell>{resident.phone}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.address}</TableCell>
                  <TableCell>
                    {resident.housing === "owned" ? "Própria" : "Alugada"}
                  </TableCell>
                  <TableCell>{resident.residents}</TableCell>
                  <TableCell>
                    {resident.hasDisability ? (
                      <>
                        {resident.cid || "-"}
                        {resident.disabilityDescription && (
                          <div className="text-xs text-muted-foreground">
                            {resident.disabilityDescription}
                          </div>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {resident.elderly
                      ? `Sim (${resident.elderlyAge} anos)`
                      : "Não"}
                  </TableCell>
                  <TableCell>
                    {resident.isForeigner
                      ? `Sim (${resident.foreignDocNumber})`
                      : "Não"}
                  </TableCell>
                  <TableCell>
                    {resident.hasGovernmentAssistance ? (
                      <div>
                        {resident.governmentAssistance.map((assistance, i) => (
                          <div key={i}>
                            {assistance.type}: R$ {assistance.value}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "Não"
                    )}
                  </TableCell>
                  <TableCell>
                    {resident.dependents?.map((dep, i) => (
                      <div key={i} className="mb-2">
                        <div>Faixa: {dep.ageRange}</div>
                        {dep.hasDisability && (
                          <>
                            <div>PCD - CID: {dep.cid || "-"}</div>
                            {dep.disabilityDescription && (
                              <div className="text-xs text-muted-foreground">
                                {dep.disabilityDescription}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(resident)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            id: resident.id,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={(isOpen) =>
            setDeleteDialog({ isOpen, id: deleteDialog.id })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este cadastro? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(deleteDialog.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
