// Where the Toolbox backend lives. For local testing the backend runs on port 3999
// (see Toolbox-Backend/scripts/elevate-demo/start.js).
export const environment = {
  apiBaseUrl: 'http://localhost:3999/tool-box/dev',

  // Shown on the login page as one-click email fillers. Turn off for real deployments.
  demoLogin: true,
  demoAccounts: [
    { label: 'Employee (Sam)', email: 'sam@elevate-demo.test' },
    { label: 'Sub-unit head (Hugo)', email: 'hugo@elevate-demo.test' },
    { label: 'Department head (Hana)', email: 'hana@elevate-demo.test' },
    { label: 'Finance head (Fiona)', email: 'fiona@elevate-demo.test' },
    { label: 'Finance employee (Faye)', email: 'faye@elevate-demo.test' },
    { label: 'Operations head (Omar)', email: 'omar@elevate-demo.test' },
    { label: 'Operations employee (Olu)', email: 'olu@elevate-demo.test' },
    { label: 'HR (Hector)', email: 'hector@elevate-demo.test' },
    { label: 'Executive (Eve)', email: 'eve@elevate-demo.test' },
    { label: 'Organisation head (Olivia)', email: 'olivia@elevate-demo.test' },
  ],
};
