
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";

export const circlenetic = createPiece({
  displayName: "Circlenetic",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://cdn.activepieces.com/pieces/circlenetic.png",
  authors: [],
  actions: [],
  triggers: [],
});
