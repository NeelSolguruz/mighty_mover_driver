type documentData = {
  aadhar: File | null;
  licence: File | null;
  pancard: File | null;
  vehicle: File | null;
};
interface Role {
  section: string;
  permission: { section: string; permission: string[] }[];
}
interface RootState {
  rolePermission: Role;
}
interface MenuItem {
  name: string;
  navigate: string;
  icon: JSX.Element;
  submenu: MenuItem[];
}
export type { documentData, RootState, MenuItem };
