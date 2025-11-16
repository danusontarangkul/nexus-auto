import tw from './tw';

export const ui = {
  // Layout
  screen: tw`flex-1 bg-surface-50`,
  content: tw`px-5 py-4`,
  row: tw`flex-row items-center`,
  card: tw`bg-white rounded-2xl p-4 shadow`,

  // Typography
  h1: tw`text-2xl font-semibold text-ink-900`,
  h2: tw`text-xl font-semibold text-ink-900`,
  body: tw`text-base text-ink-600`,

  // Buttons
  btn: tw`px-4 py-3 rounded-2xl`,
  btnPrimary: tw`bg-primary-600`,
  btnPrimaryText: tw`text-white font-semibold`,
  btnGhost: tw`bg-transparent`,
  btnGhostText: tw`text-primary-600 font-semibold`,
};
