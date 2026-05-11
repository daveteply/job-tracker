module.exports = {
  displayName: 'ui-components',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/ui-components',
  transformIgnorePatterns: ['node_modules/(?!(next-intl|use-intl|@formatjs|next-auth|@auth)/)'],
};
