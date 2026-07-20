export const APP_ROLES = [
  { slug: "superintendente", label: "Superintendente" },
  { slug: "administrador", label: "Administrador" },
  { slug: "diretor", label: "Diretor" },
  { slug: "lider", label: "Líder" },
] as const;

export type AppRoleSlug = (typeof APP_ROLES)[number]["slug"];

export const EXCLUSIVE_LITORAL_DIRECTORATE_LABEL = "Exclusive - Litoral";

/** Raízes dos departamentos Exclusive Litoral no Bitrix (inclui subdepartamentos). */
export const LITORAL_BITRIX_DEPARTMENT_IDS = [352, 402, 515] as const;

export const LITORAL_TEAM_IDS = ["guardioes_litoral", "aguia"] as const;
export type LitoralTeamId = (typeof LITORAL_TEAM_IDS)[number];

export const DASHBOARD_PAGES = [
  { key: "overview", label: "Visão Geral" },
  { key: "team:guardioes_litoral", label: "Guardiões do litoral" },
  { key: "team:aguia", label: "Águia" },
] as const;

export type DashboardPageKey = (typeof DASHBOARD_PAGES)[number]["key"];

const LITORAL_PAGE_KEYS = [
  "overview",
  "team:guardioes_litoral",
  "team:aguia",
] as const satisfies readonly DashboardPageKey[];

/** Páginas válidas para a esteira Comercial Geral (única esteira do Litoral). */
export function dashboardPageKeysForPipeline(
  _pipeline: UserPipelineAccessKey = DEFAULT_PIPELINE_KEY,
): readonly DashboardPageKey[] {
  return LITORAL_PAGE_KEYS;
}

export function filterPagesForPipelineAccess<
  T extends { key: DashboardPageKey; label: string },
>(pages: T[], _pipeline: UserPipelineAccessKey): T[] {
  const allowed = new Set(dashboardPageKeysForPipeline());
  return pages.filter((page) => allowed.has(page.key));
}

export function prunePageKeysForPipeline(
  pageKeys: Iterable<DashboardPageKey>,
  _pipeline: UserPipelineAccessKey,
): DashboardPageKey[] {
  const allowed = new Set(dashboardPageKeysForPipeline());
  return [...pageKeys].filter((key) => allowed.has(key));
}

export const DASHBOARD_PIPELINES = [
  { key: "comercial_geral", label: "Comercial Geral", bitrixCategoryId: 16 },
] as const;

export type DashboardPipelineKey = (typeof DASHBOARD_PIPELINES)[number]["key"];

export const PIPELINE_ACCESS_MODES = [
  { key: "comercial_geral", label: "Comercial Geral" },
] as const;

export type UserPipelineAccessKey = (typeof PIPELINE_ACCESS_MODES)[number]["key"];

export const DEFAULT_PIPELINE_KEY: DashboardPipelineKey = "comercial_geral";

export type DashboardPipeline = {
  key: UserPipelineAccessKey;
  label: string;
  bitrix_category_id: number;
  sort_order: number;
};

export type AppRole = {
  id: string;
  slug: AppRoleSlug;
  name: string;
  sort_order: number;
};

export type DashboardPage = {
  key: DashboardPageKey;
  label: string;
  sort_order: number;
};

export type RoleRelation = Pick<AppRole, "slug" | "name">;

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string;
  pipeline_key: UserPipelineAccessKey | null;
  app_roles: RoleRelation | RoleRelation[] | null;
};

export function normalizeRoleRelation(
  relation: UserProfile["app_roles"],
): RoleRelation | null {
  if (!relation) return null;
  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
}

export type ManagedUserAccess = UserProfile & {
  page_keys: DashboardPageKey[];
  pipeline_key: UserPipelineAccessKey;
};

export function teamIdToPageKey(teamId: string): DashboardPageKey | null {
  if (teamId === "overview") return "overview";
  const key = `team:${teamId}` as DashboardPageKey;
  return DASHBOARD_PAGES.some((page) => page.key === key) ? key : null;
}

export function pageKeyToTeamId(pageKey: DashboardPageKey): string {
  if (pageKey === "overview") return "overview";
  return pageKey.replace("team:", "");
}

export function isAdministratorRole(slug: string | undefined | null): boolean {
  return slug === "administrador";
}

export function isPipelineSwitcherRole(_slug: string | undefined | null): boolean {
  return false;
}

export function hasBothPipelinesAccess(
  _pipelineKey: UserPipelineAccessKey | null | undefined,
): boolean {
  return false;
}

export function canUserSwitchPipeline(
  _roleSlug: string | null | undefined,
  _pipelineKey: UserPipelineAccessKey | null | undefined,
): boolean {
  return false;
}

export function normalizeUserPipelineAccess(
  _value: string | null | undefined,
): UserPipelineAccessKey {
  return DEFAULT_PIPELINE_KEY;
}

export function pipelineAccessOptions(
  pipelines: Pick<DashboardPipeline, "key" | "label">[] = [],
): { key: UserPipelineAccessKey; label: string }[] {
  const labels = new Map(pipelines.map((pipeline) => [pipeline.key, pipeline.label]));
  return PIPELINE_ACCESS_MODES.map((mode) => ({
    key: mode.key,
    label: labels.get(mode.key) ?? mode.label,
  }));
}

export function resolveDashboardPipeline(
  _access: UserPipelineAccessKey,
): DashboardPipelineKey {
  return DEFAULT_PIPELINE_KEY;
}

export function getPipelineMeta(key: DashboardPipelineKey) {
  const pipeline = DASHBOARD_PIPELINES.find((item) => item.key === key);
  if (!pipeline) {
    throw new Error(`Pipeline desconhecido: ${key}`);
  }
  return pipeline;
}

export function getPipelineCategoryId(key: DashboardPipelineKey): number {
  return getPipelineMeta(key).bitrixCategoryId;
}

export type PipelineDepartmentTarget = {
  teamId: string;
  teamLabel: string;
  departmentName?: string;
  departmentId?: number;
};

const PIPELINE_DEPARTMENTS: Record<DashboardPipelineKey, PipelineDepartmentTarget[]> = {
  comercial_geral: [
    {
      teamId: "guardioes_litoral",
      teamLabel: "Guardiões do litoral",
      departmentName: "Guardiões do litoral",
      departmentId: 402,
    },
    {
      teamId: "aguia",
      teamLabel: "Águia",
      departmentName: "Águia",
      departmentId: 515,
    },
  ],
};

export function isLitoralTeamId(teamId: string): boolean {
  return (LITORAL_TEAM_IDS as readonly string[]).includes(teamId);
}

/** @deprecated use isLitoralTeamId */
export function isFocusMainTeamId(teamId: string): boolean {
  return isLitoralTeamId(teamId);
}

export function isPrimeiraChaveTeamId(_teamId: string): boolean {
  return false;
}

export type DiretoriaFilter = "all" | "exclusive_litoral";

export function filterTeamsByDiretoria<T extends { id: string }>(
  teams: T[],
  diretoria: DiretoriaFilter,
): T[] {
  if (diretoria === "all") return teams;
  return teams.filter((team) => isLitoralTeamId(team.id));
}

export function focusMainTeamTabLabel(name: string): string {
  return name;
}

export function slugifyTeamId(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 32);
}

export function getPipelineDepartments(pipeline: DashboardPipelineKey): PipelineDepartmentTarget[] {
  return PIPELINE_DEPARTMENTS[pipeline];
}

export function getPipelineDepartmentLabels(pipeline: DashboardPipelineKey): string {
  return getPipelineDepartments(pipeline)
    .map((target) => target.teamLabel)
    .join(", ");
}

const LITORAL_TEAM_ID_SET = new Set<string>(LITORAL_TEAM_IDS);

export function isTeamVisibleInPipeline(teamId: string, _pipeline: DashboardPipelineKey): boolean {
  if (teamId === "overview") return true;
  return LITORAL_TEAM_ID_SET.has(teamId);
}

export function getPipelineTeamIds(pipeline: DashboardPipelineKey): string[] {
  return getPipelineDepartments(pipeline).map((target) => target.teamId);
}
