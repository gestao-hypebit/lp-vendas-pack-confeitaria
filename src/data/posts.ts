export const POSTS = [
  [1,"vendas","Novidade no cardápio"],[2,"vendas","Promoção de brigadeiros"],[3,"cardapio","Cardápio de bolos"],
  [4,"relacionamento","Depoimento de cliente"],[5,"engajamento","A vida fica mais doce"],[6,"informativos","Como encomendar"],
  [7,"cardapio","Saiu do forno"],[8,"datas","Dia das Mães"],[9,"informativos","Como conservar seu bolo"],
  [10,"informativos","Horário de funcionamento"],[11,"relacionamento","Quem faz"],[12,"engajamento","Brigadeiro ou beijinho"],
  [13,"vendas","Encomende seu bolo"],[14,"vendas","Kit festa"],[15,"vendas","Sabor do mês"],
  [16,"relacionamento","Depoimento de casamento"],[17,"datas","Dia dos Namorados"],[18,"datas","Páscoa"],
  [19,"datas","Natal"],[20,"vendas","Bolo personalizado"],[21,"vendas","Frete grátis"],
  [22,"cardapio","Sabores de brigadeiro"],[23,"informativos","Você sabia?"],[24,"relacionamento","Bastidores"],
  [25,"engajamento","A dieta começa segunda"],[26,"engajamento","Chocolate ou morango"],[27,"vendas","Sextou"],
  [28,"vendas","Combo da tarde"],[29,"relacionamento","Obrigada"],[30,"vendas","Últimas vagas"],
] as const;

export type Categoria = (typeof POSTS)[number][1];

export const FILTROS: { id: Categoria | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "vendas", label: "Vendas" },
  { id: "cardapio", label: "Cardápio" },
  { id: "datas", label: "Datas" },
  { id: "engajamento", label: "Engajamento" },
  { id: "relacionamento", label: "Relacionamento" },
  { id: "informativos", label: "Informativos" },
];

export const postSrc = (n: number) => `/img/post-${String(n).padStart(2, "0")}.jpg`;
