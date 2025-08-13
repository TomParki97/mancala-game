export const pressable = (action: () => void) => ({
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  },
  tabIndex: 0,
  role: 'button'
});
