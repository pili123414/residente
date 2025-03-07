import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Resident } from "@/lib/types";
import { createResident, updateResident } from "@/lib/residents";

type FormData = Omit<Resident, "id" | "createdAt" | "updatedAt">;

export default function ResidentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cpf: "",
    rg: "",
    phone: "",
    email: "",
    address: "",
    housing: "owned",
    residents: 1,
    cid: "",
    elderly: false,
    elderlyAge: undefined,
    hasDisability: false,
    isForeigner: false,
    foreignDocNumber: "",
    hasGovernmentAssistance: false,
    governmentAssistance: [],
    dependents: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const editingResident = localStorage.getItem("editingResident");
    if (editingResident) {
      const { id, ...data } = JSON.parse(editingResident);
      setFormData(data);
      setEditingId(id);
      localStorage.removeItem("editingResident");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        residents: Number(formData.residents),
        elderlyAge: formData.elderly ? Number(formData.elderlyAge) : undefined,
      };

      if (editingId) {
        await updateResident(editingId, data);
      } else {
        await createResident(data);
      }

      navigate("/reports");
    } catch (error) {
      console.error("Error saving resident:", error);
      alert("Ocorreu um erro ao salvar os dados. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDependentChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const newDependents = [...prev.dependents];
      newDependents[index] = { ...newDependents[index], [field]: value };
      return { ...prev, dependents: newDependents };
    });
  };

  const addDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [
        ...prev.dependents,
        {
          ageRange: "",
          hasDisability: false,
          cid: "",
          disabilityDescription: "",
        },
      ],
    }));
  };

  const removeDependent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="Digite o nome completo"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            placeholder="00.000.000-0"
            value={formData.rg}
            onChange={(e) => handleChange("rg", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            placeholder="exemplo@email.com"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Input
            id="address"
            placeholder="Rua, número, bairro"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="housing">Tipo de Moradia</Label>
          <Select
            value={formData.housing}
            onValueChange={(value) => handleChange("housing", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Própria</SelectItem>
              <SelectItem value="rented">Alugada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="residents">Número de Moradores</Label>
          <Input
            id="residents"
            type="number"
            min="1"
            value={formData.residents}
            onChange={(e) =>
              handleChange("residents", parseInt(e.target.value))
            }
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="hasDisability"
            checked={formData.hasDisability}
            onCheckedChange={(checked) =>
              handleChange("hasDisability", checked === true)
            }
          />
          <Label htmlFor="hasDisability">Titular é PCD</Label>
        </div>

        {formData.hasDisability && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cid">CID</Label>
              <Input
                id="cid"
                placeholder="Digite o CID"
                value={formData.cid}
                onChange={(e) => handleChange("cid", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabilityDescription">
                Descrição da Deficiência
              </Label>
              <Input
                id="disabilityDescription"
                placeholder="Descreva a deficiência"
                value={formData.disabilityDescription}
                onChange={(e) =>
                  handleChange("disabilityDescription", e.target.value)
                }
                required
              />
            </div>
          </>
        )}

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="elderly"
            checked={formData.elderly}
            onCheckedChange={(checked) =>
              handleChange("elderly", checked === true)
            }
          />
          <Label htmlFor="elderly">Idoso (60 anos ou mais)</Label>
        </div>

        {formData.elderly && (
          <div className="space-y-2">
            <Label htmlFor="elderlyAge">Idade</Label>
            <Input
              id="elderlyAge"
              type="number"
              min="60"
              value={formData.elderlyAge}
              onChange={(e) =>
                handleChange("elderlyAge", parseInt(e.target.value))
              }
              placeholder="Digite a idade"
              required
            />
          </div>
        )}

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="isForeigner"
            checked={formData.isForeigner}
            onCheckedChange={(checked) =>
              handleChange("isForeigner", checked === true)
            }
          />
          <Label htmlFor="isForeigner">Estrangeiro</Label>
        </div>

        {formData.isForeigner && (
          <div className="space-y-2">
            <Label htmlFor="foreignDocNumber">Número do Documento</Label>
            <Input
              id="foreignDocNumber"
              value={formData.foreignDocNumber}
              onChange={(e) => handleChange("foreignDocNumber", e.target.value)}
              placeholder="Digite o número do documento"
              required
            />
          </div>
        )}

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="hasGovernmentAssistance"
            checked={formData.hasGovernmentAssistance}
            onCheckedChange={(checked) =>
              handleChange("hasGovernmentAssistance", checked === true)
            }
          />
          <Label htmlFor="hasGovernmentAssistance">
            Recebe Auxílio do Governo
          </Label>
        </div>

        {formData.hasGovernmentAssistance && (
          <div className="space-y-4">
            {formData.governmentAssistance.map((assistance, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <Label>Tipo de Auxílio</Label>
                  <Input
                    value={assistance.type}
                    onChange={(e) => {
                      const newAssistance = [...formData.governmentAssistance];
                      newAssistance[index].type = e.target.value;
                      handleChange("governmentAssistance", newAssistance);
                    }}
                    placeholder="Ex: Bolsa Família"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label>Valor</Label>
                  <Input
                    value={assistance.value}
                    onChange={(e) => {
                      const newAssistance = [...formData.governmentAssistance];
                      newAssistance[index].value = e.target.value;
                      handleChange("governmentAssistance", newAssistance);
                    }}
                    placeholder="R$ 0,00"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="mt-6"
                  onClick={() => {
                    const newAssistance = formData.governmentAssistance.filter(
                      (_, i) => i !== index,
                    );
                    handleChange("governmentAssistance", newAssistance);
                  }}
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newAssistance = [
                  ...formData.governmentAssistance,
                  { type: "", value: "" },
                ];
                handleChange("governmentAssistance", newAssistance);
              }}
            >
              Adicionar Auxílio
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Dependentes</h3>
          <Button type="button" variant="outline" onClick={addDependent}>
            Adicionar Dependente
          </Button>
        </div>

        {formData.dependents.map((dependent, index) => (
          <div
            key={index}
            className="grid gap-4 md:grid-cols-3 border p-4 rounded-lg bg-card text-card-foreground"
          >
            <div className="space-y-2">
              <Label>Faixa Etária</Label>
              <Select
                value={dependent.ageRange}
                onValueChange={(value) =>
                  handleDependentChange(index, "ageRange", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-12">0-12 anos</SelectItem>
                  <SelectItem value="13-17">13-17 anos</SelectItem>
                  <SelectItem value="18-29">18-29 anos</SelectItem>
                  <SelectItem value="30-59">30-59 anos</SelectItem>
                  <SelectItem value="60+">60+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`dependent-disability-${index}`}
                checked={dependent.hasDisability}
                onCheckedChange={(checked) =>
                  handleDependentChange(
                    index,
                    "hasDisability",
                    checked === true,
                  )
                }
              />
              <Label htmlFor={`dependent-disability-${index}`}>PCD</Label>
            </div>

            {dependent.hasDisability && (
              <>
                <div className="space-y-2">
                  <Label>CID</Label>
                  <Input
                    placeholder="Digite o CID"
                    value={dependent.cid}
                    onChange={(e) =>
                      handleDependentChange(index, "cid", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição da Deficiência</Label>
                  <Input
                    placeholder="Descreva a deficiência"
                    value={dependent.disabilityDescription}
                    onChange={(e) =>
                      handleDependentChange(
                        index,
                        "disabilityDescription",
                        e.target.value,
                      )
                    }
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="button"
              variant="destructive"
              onClick={() => removeDependent(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {editingId ? "Salvar Alterações" : "Cadastrar Morador"}
      </Button>
    </form>
  );
}
