export interface iProvider {
  id?: string;
  website?: string;
  robot_code?: string;
  icon?: string;
  entri_automation_enabled?: boolean;
  domain_connect_enabled?: boolean;
  forgot_password_url?: string;
  logo?: string;
  login_url?: string;
  name?: string;
  provider?: string;
  login_notice_email?: string;
  dashboard_ui?: boolean;
  color_hex?: string;
  username_placeholder_text?: {
    [key: string]: string;
  };
  [key: string]: any;
}
