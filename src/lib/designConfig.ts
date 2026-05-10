export type UserType = 'child' | 'parent';

export interface DesignConfig {
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  spacing: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  features: {
    treehole: boolean;
    weather: boolean;
    bottle: boolean;
    capsule: boolean;
    translate: boolean;
    records: boolean;
    invite: boolean;
  };
}

export const designConfigs: Record<UserType, DesignConfig> = {
  child: {
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      base: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      base: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    features: {
      treehole: true,
      weather: true,
      bottle: true,
      capsule: true,
      translate: true,
      records: true,
      invite: true,
    },
  },
  parent: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.75rem',
    },
    spacing: {
      xs: '0.375rem',
      sm: '0.75rem',
      base: '1.25rem',
      lg: '2rem',
      xl: '2.5rem',
    },
    borderRadius: {
      sm: '0.5rem',
      base: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
    },
    features: {
      treehole: false,
      weather: false,
      bottle: true,
      capsule: true,
      translate: true,
      records: true,
      invite: false,
    },
  },
};
