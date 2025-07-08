export interface Set {
  id: string;
  name: string;
  code: string;
  released_at: string;
  icon_svg_uri: string;
  parent_set_code?: string;
  children: Set[];
}
