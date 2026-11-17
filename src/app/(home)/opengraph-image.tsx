import { ImageResponse } from "next/og";
import { EX_DIAG } from "@/lib/exemplo-landing";
import { moeda } from "@/lib/formato";

export const alt = "Calculadora de Precificação para Confeitaria: você está perdendo dinheiro em cada doce?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F9C3CF", padding: 64, alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: "#3B1F17" }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, color: "#E8364E" }}>CALCULADORA DE PRECIFICAÇÃO</div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>
            Você está perdendo dinheiro em cada doce que vende?
          </div>
          <div style={{ fontSize: 30, marginTop: 24, color: "#7A5048" }}>Descubra em 2 minutos, direto do celular.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 380, background: "#E8364E", color: "white", borderRadius: 36, padding: 36 }}>
          <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.85 }}>BOLO DE POTE NO IFOOD</div>
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>
            {`Você está perdendo ${moeda(EX_DIAG.valor).replace(" ", " ")} por unidade`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
