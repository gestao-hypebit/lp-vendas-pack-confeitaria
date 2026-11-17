"use client";

import { useRef, useState } from "react";
import { exportarBackup, importarBackup } from "@/lib/dados/repositorio";
import { dadosIniciais, removerExemplo, temExemplo } from "@/lib/dados/seed";
import type { Perfil } from "@/lib/dados/tipos";
import { useApp } from "./estado";
import { CampoArredondar, CamposFixos, CamposHora, CamposMargem, CamposTaxas } from "./perfil-campos";
import { Botao, BotaoConfirmar, CampoTexto, Card, Topo } from "./ui";

function Secao({ titulo, children, aberta = false }: { titulo: string; children: React.ReactNode; aberta?: boolean }) {
  return (
    <details open={aberta} className="group rounded-[22px] bg-white">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between px-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
        {titulo}
        <span aria-hidden="true" className="text-2xl text-morango transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

export function TelaAjustes() {
  const { dados, atualizar, substituir, avisar, ir } = useApp();
  const p = dados.perfil;
  const set = (np: Perfil) => atualizar((d) => ({ ...d, perfil: np }));
  const arquivo = useRef<HTMLInputElement>(null);
  const [erroImport, setErroImport] = useState<string | null>(null);

  const baixarBackup = () => {
    const blob = new Blob([exportarBackup(dados)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-precificacao-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    avisar("Backup baixado ✓ Guarde no Drive ou mande para você no WhatsApp.");
  };

  const importar = async (f: File | undefined) => {
    if (!f) return;
    try {
      const novo = importarBackup(await f.text());
      substituir({ ...novo, onboardingFeito: true });
      setErroImport(null);
      avisar("Backup restaurado ✓");
      ir("", true);
    } catch (e) {
      setErroImport(e instanceof Error ? e.message : "Não consegui ler esse arquivo.");
    } finally {
      if (arquivo.current) arquivo.current.value = "";
    }
  };

  return (
    <>
      <Topo titulo="Ajustes" />
      <div className="mx-auto grid max-w-[560px] gap-3 px-4 pt-5 pb-32">
        <p className="text-choco-2">As mudanças valem na hora para todas as receitas.</p>

        <Secao titulo="🏠 Sua confeitaria">
          <CampoTexto label="Nome da confeitaria" valor={p.nome} onChange={(nome) => set({ ...p, nome })} />
        </Secao>
        <Secao titulo="⏱️ Valor da sua hora">
          <CamposHora p={p} set={set} />
        </Secao>
        <Secao titulo="💡 Custos fixos">
          <CamposFixos p={p} set={set} />
        </Secao>
        <Secao titulo="💳 Taxas">
          <CamposTaxas p={p} set={set} />
        </Secao>
        <Secao titulo="📈 Margem de lucro">
          <div className="grid gap-4">
            <CamposMargem p={p} set={set} />
            <CampoArredondar p={p} set={set} />
          </div>
        </Secao>

        <Card className="mt-3 grid gap-3">
          <h2 className="font-sans text-lg font-bold tracking-normal">💾 Backup dos seus dados</h2>
          <p className="text-[15px] text-choco-2">
            Seus dados ficam guardados <strong>neste celular, neste navegador</strong>. Se limpar o navegador ou trocar de
            celular, eles somem. Baixe um backup de vez em quando e guarde no Drive, no e-mail ou no seu WhatsApp.
          </p>
          <Botao variante="escuro" onClick={baixarBackup}>
            ⬇️ Exportar backup
          </Botao>
          <label className="inline-flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border-2 border-choco/15 bg-white px-5 text-[17px] font-bold">
            ⬆️ Importar backup
            <input ref={arquivo} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => importar(e.target.files?.[0])} />
          </label>
          <p className="text-sm text-choco-2">Importar substitui tudo o que está aqui pelos dados do arquivo.</p>
          {erroImport && <p className="rounded-xl bg-rosa px-4 py-2 font-bold">{erroImport}</p>}
        </Card>

        {temExemplo(dados) && (
          <BotaoConfirmar
            confirmar="Toque de novo para apagar o exemplo"
            onConfirm={() => {
              atualizar(removerExemplo);
              avisar("Exemplo apagado ✓");
            }}
          >
            Apagar receita e preços de exemplo
          </BotaoConfirmar>
        )}
        <BotaoConfirmar
          confirmar="Tem certeza? Toque de novo para apagar TUDO"
          onConfirm={() => {
            substituir(dadosIniciais());
            ir("", true);
          }}
        >
          Apagar tudo e começar do zero
        </BotaoConfirmar>
      </div>
    </>
  );
}
