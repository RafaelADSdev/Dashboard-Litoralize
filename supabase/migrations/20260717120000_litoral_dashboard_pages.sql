-- Páginas das equipes Litoral (Superintendência Jordão · Exclusive - Litoral)

insert into public.dashboard_pages (key, label, sort_order) values
  ('team:guardioes_litoral', 'Guardiões do litoral', 2),
  ('team:aguia', 'Águia', 3)
on conflict (key) do update
  set label = excluded.label,
      sort_order = excluded.sort_order;
