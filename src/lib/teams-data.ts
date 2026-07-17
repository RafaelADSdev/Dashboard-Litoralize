import {
  ACTIVE_PHASES,
  getActivePhases,
  getLostPhases,
  getPipelinePhases,
  PHASES,
  type Phase,
} from "@/lib/phases";
import type { DashboardPipelineKey } from "@/lib/access-control";

export type { Phase } from "@/lib/phases";
export {
  PHASES,
  ACTIVE_PHASES,
  ECONOMICO_ACTIVE_PHASES,
  LOST_PHASES,
  ECONOMICO_LOST_PHASES,
  PHASE_COLORS,
  PHASE_SHORT_LABELS,
  isLostPhase,
  ATTENDANCE_STATUS_PHASES,
  ATTENDANCE_STATUS_GROUP_LABEL,
  ACTIVE_FUNNEL_LEGEND_SECTIONS,
  ECONOMICO_FUNNEL_LEGEND_SECTIONS,
  getActivePhases,
  getLostPhases,
  getPipelinePhases,
  getFunnelLegendSections,
} from "@/lib/phases";

// Ano-calendário completo: o filtro do webhook limita os registros a 2026.
export const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;
export type MonthKey = (typeof MONTHS)[number];
export const MONTH_LABELS: Record<MonthKey, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
};

export type MonthFilter = "all" | MonthKey;

export function normalizeMemberName(value: string): string {
  try {
    return value
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
  }
}

/** Colaboradores atuais nos departamentos Litoral (Bitrix). Quem não está aqui = saiu da equipe. */
export const LITORAL_ACTIVE_BY_TEAM: Record<string, readonly string[]> = {
  guardioes_litoral: [],
  aguia: [],
};

const LITORAL_ACTIVE_LOOKUP = Object.fromEntries(
  Object.entries(LITORAL_ACTIVE_BY_TEAM).map(([teamId, names]) => [
    teamId,
    new Set(names.map(normalizeMemberName)),
  ]),
) as Record<string, Set<string>>;

export function isLitoralActiveMember(teamId: string, name: string): boolean {
  const roster = LITORAL_ACTIVE_LOOKUP[teamId];
  if (!roster || roster.size === 0) return true;
  return roster.has(normalizeMemberName(name));
}

/** @deprecated use isLitoralActiveMember */
export function isFocusActiveMember(teamId: string, name: string): boolean {
  return isLitoralActiveMember(teamId, name);
}

export type Member = {
  name: string;
  bitrixId?: string;
  photoUrl?: string;
  /** false = saiu da equipe; nome exibido em cinza no painel */
  active?: boolean;
  matrix: Partial<Record<Phase, Record<MonthKey, number>>>;
};

export type Team = {
  id: string;
  name: string;
  leader?: {
    name: string;
    bitrixId?: string;
    photoUrl?: string;
  };
  members: Member[];
};

export function memberPhaseValue(m: Member, p: Phase, month: MonthFilter): number {
  const byMonth = m.matrix[p];
  if (!byMonth) return 0;
  if (month === "all") return MONTHS.reduce((a, mo) => a + (byMonth[mo] ?? 0), 0);
  return byMonth[month] ?? 0;
}

export function memberTotal(
  m: Member,
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return getPipelinePhases(pipeline).reduce((a, p) => a + memberPhaseValue(m, p, month), 0);
}

export function memberActiveTotal(
  m: Member,
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return getActivePhases(pipeline).reduce((a, p) => a + memberPhaseValue(m, p, month), 0);
}

export function teamPhaseTotal(t: Team, p: Phase, month: MonthFilter): number {
  return t.members.reduce((a, m) => a + memberPhaseValue(m, p, month), 0);
}

export function teamTotal(
  t: Team,
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return t.members.reduce((a, m) => a + memberTotal(m, month, pipeline), 0);
}

export function teamActiveTotal(
  t: Team,
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return getActivePhases(pipeline).reduce((a, p) => a + teamPhaseTotal(t, p, month), 0);
}

export function grandTotal(
  teams: Team[],
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return teams.reduce((a, t) => a + teamTotal(t, month, pipeline), 0);
}

export function grandActiveTotal(
  teams: Team[],
  month: MonthFilter,
  pipeline: DashboardPipelineKey = "comercial_geral",
): number {
  return teams.reduce((a, t) => a + teamActiveTotal(t, month, pipeline), 0);
}

export function monthlyTrend(
  teams: Team[],
  pipeline: DashboardPipelineKey = "comercial_geral",
): { month: MonthKey; value: number }[] {
  return MONTHS.map((m) => ({ month: m, value: grandTotal(teams, m, pipeline) }));
}

/** Fallback local quando BITRIX_WEBHOOK_URL não está definida */
export const TEAM_LEADER_NAMES: Record<string, string> = {
  guardioes_litoral: "",
  aguia: "",
};

/** Variações de nome para localizar o líder no Bitrix */
export const TEAM_LEADER_ALIASES: Record<string, string[]> = {};

export function getTeamLeaderSearchNames(teamId: string): string[] {
  const primary = TEAM_LEADER_NAMES[teamId];
  const aliases = TEAM_LEADER_ALIASES[teamId] ?? [];
  return primary ? [primary, ...aliases] : aliases;
}

export function isTeamLeaderMember(team: Team, member: Member): boolean {
  if (!team.leader) return false;
  if (team.leader.bitrixId && member.bitrixId) {
    return team.leader.bitrixId === member.bitrixId;
  }
  if (team.leader.name && member.name) {
    return normalizeMemberName(team.leader.name) === normalizeMemberName(member.name);
  }
  return false;
}

/** Corretores ativos da equipe no Bitrix, sem o líder. */
export function teamBrokerMembers(team: Team): Member[] {
  return team.members.filter(
    (member) => member.active !== false && !isTeamLeaderMember(team, member),
  );
}

export function teamBrokerCount(team: Team): number {
  return teamBrokerMembers(team).length;
}

export const STATIC_TEAMS: Team[] = [
  {
    id: "guardioes_litoral",
    name: "Guardiões do litoral",
    members: [],
  },
  {
    id: "aguia",
    name: "Águia",
    members: [],
  },
];

/** @deprecated use dados do loader; mantido para compat */
export const TEAMS = STATIC_TEAMS;

export const TEAM_ACCENT: Record<string, string> = {
  guardioes_litoral: "from-blue-700 to-blue-400",
  aguia: "from-sky-600 to-teal-500",
};

/** Lavagem suave de fundo para cards compactos */
export const TEAM_ACCENT_SOFT: Record<string, string> = {
  guardioes_litoral: "from-blue-500/10 via-white to-white",
  aguia: "from-sky-500/10 via-white to-white",
};

/** Gradiente translúcido para o card do líder (glassmorphism por equipe) */
export const TEAM_HERO_GLASS: Record<string, string> = {
  guardioes_litoral: "from-blue-500/24 via-white/42 to-white/16",
  aguia: "from-sky-500/24 via-white/42 to-white/16",
};

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
