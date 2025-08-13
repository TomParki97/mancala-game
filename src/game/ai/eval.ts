import { GameState, sidePitsIndices, storeIndex, Player, legalMoves } from '../rules';

export const evaluate = (state: GameState, player: Player): number => {
  const myStore = state.board[storeIndex(player)];
  const oppStore = state.board[storeIndex((player ^ 1) as Player)];
  const myPits = sidePitsIndices(player).reduce((s, i) => s + state.board[i], 0);
  const oppPits = sidePitsIndices((player ^ 1) as Player).reduce(
    (s, i) => s + state.board[i],
    0
  );
  const extraTurn = legalMoves(state, player).some((p) =>
    wouldExtraTurn(state, player, p)
  );
  return (
    (myStore - oppStore) * 2 +
    (myPits - oppPits) +
    (extraTurn ? 1 : 0)
  );
};

export const wouldExtraTurn = (
  state: GameState,
  player: Player,
  pit: number
): boolean => {
  const stones = state.board[pit];
  const target = (pit + stones) % 14;
  return target === storeIndex(player);
};
