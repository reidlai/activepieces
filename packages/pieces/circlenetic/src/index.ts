
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import { scrollingListWebscrapper } from "./lib/actions/scrolling-list-webscrapper";

export const circlenetic = createPiece({
  displayName: "Circlenetic",
  description: "Circlenetic is a piece that allows you to scrape a scrolling list of items from a website.",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://cdn.activepieces.com/pieces/circlenetic.png",
  authors: [],
  actions: [scrollingListWebscrapper],
  triggers: [],
});
